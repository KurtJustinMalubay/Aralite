import initSqlJs, { type Database, type SqlJsStatic, type SqlValue } from 'sql.js'

const DB_STORE = 'aralite_sqlite_db'
let db: Database | null = null
let initializationPromise: Promise<Database> | null = null

function openDatabaseStore(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_STORE, 1)
    request.onupgradeneeded = () => request.result.createObjectStore('data')
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function readStoredDb(): Promise<Uint8Array | null> {
  const store = await openDatabaseStore()
  return new Promise((resolve, reject) => {
    const tx = store.transaction('data', 'readonly')
    const request = tx.objectStore('data').get('sqlite')
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  })
}

export async function persistDatabase(): Promise<void> {
  if (!db) return
  const bytes = db.export()
  const store = await openDatabaseStore()
  await new Promise<void>((resolve, reject) => {
    const tx = store.transaction('data', 'readwrite')
    tx.objectStore('data').put(bytes, 'sqlite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function initializeDatabase(): Promise<Database> {
  if (db) return db
  if (initializationPromise) return initializationPromise
  initializationPromise = (async () => {
    try {
      const SQL: SqlJsStatic = await initSqlJs({ locateFile: () => '/sql-wasm.wasm', useOldExtensionFunctions: false })
      let stored: Uint8Array | null = null
      try { stored = await readStoredDb() } catch { stored = null }
      try {
        db = stored ? new SQL.Database(stored) : new SQL.Database()
        createSchema()
        if (!queryRows<{ count: number }>('SELECT COUNT(*) AS count FROM profiles')[0]?.count) {
          const { seedGrade4Math } = await import('../data/seedGrade4Math')
          seedGrade4Math(db)
        }
        await persistDatabase()
        return db
      } catch {
        if (db) db.close()
        db = null
        const SQLFallback: SqlJsStatic = await initSqlJs({ locateFile: () => '/sql-wasm.wasm', useOldExtensionFunctions: false })
        db = new SQLFallback.Database()
        createSchema()
        const { seedGrade4Math } = await import('../data/seedGrade4Math')
        seedGrade4Math(db)
        await persistDatabase()
        return db
      }
    } finally {
      initializationPromise = null
    }
  })()
  return initializationPromise
}

function createSchema(): void {
  if (!db) throw new Error('Database not initialized')
  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY, name TEXT, role TEXT, grade_level TEXT,
      avatar_bg TEXT, avatar_emoji TEXT, preferred_lang TEXT
    );
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY, subject TEXT, grade_level TEXT, deped_code TEXT,
      slm_reference TEXT, title_en TEXT, title_ceb TEXT, summary_en TEXT,
      summary_ceb TEXT, size_kb INTEGER, is_downloaded INTEGER, order_index INTEGER
    );
    CREATE TABLE IF NOT EXISTS lesson_blocks (
      id TEXT PRIMARY KEY, lesson_id TEXT, step_order INTEGER,
      heading_en TEXT, heading_ceb TEXT, body_en TEXT, body_ceb TEXT, svg_type TEXT
    );
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY, lesson_id TEXT, question_order INTEGER,
      question_en TEXT, question_ceb TEXT, options_en_json TEXT,
      options_ceb_json TEXT, correct_index INTEGER,
      explanation_en TEXT, explanation_ceb TEXT
    );
    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY, profile_id TEXT, lesson_id TEXT, status TEXT,
      last_step INTEGER, updated_at TEXT
    );
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY, profile_id TEXT, lesson_id TEXT, score INTEGER,
      total_questions INTEGER, completed_at TEXT
    );
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY, profile_id TEXT, entity_type TEXT,
      payload_json TEXT, status TEXT, created_at TEXT
    );
  `)
  const profileColumns = db.exec("PRAGMA table_info(profiles)")
  const columns = profileColumns[0]?.values.map((row) => String(row[1])) ?? []
  for (const column of ['username', 'password', 'school_name', 'section_name']) {
    if (!columns.includes(column)) {
      db.run(`ALTER TABLE profiles ADD COLUMN ${column} TEXT`)
    }
    const lessonColumns = db.exec("PRAGMA table_info(lessons)")
    const lessonNames = lessonColumns[0]?.values.map((row) => String(row[1])) ?? []
    for (const column of ['title_tl','summary_tl']) {
      if (!lessonNames.includes(column)) db.run(`ALTER TABLE lessons ADD COLUMN ${column} TEXT`)
    }
    const blockColumns = db.exec("PRAGMA table_info(lesson_blocks)")
    const blockNames = blockColumns[0]?.values.map((row) => String(row[1])) ?? []
    for (const column of ['heading_tl','body_tl']) {
      if (!blockNames.includes(column)) db.run(`ALTER TABLE lesson_blocks ADD COLUMN ${column} TEXT`)
    }
    const quizColumns = db.exec("PRAGMA table_info(quizzes)")
    const quizNames = quizColumns[0]?.values.map((row) => String(row[1])) ?? []
    for (const column of ['question_tl','options_tl_json','explanation_tl']) {
      if (!quizNames.includes(column)) db.run(`ALTER TABLE quizzes ADD COLUMN ${column} TEXT`)
    }
  }
  const teacher = queryRows<{id:string}>("SELECT id FROM profiles WHERE username = 'elena'")[0]
  if (!teacher) {
    db.run('UPDATE profiles SET username=?, password=?, school_name=?, section_name=? WHERE id=?',
      ['elena', 'teacher123', 'Osao Elementary School', 'Grade 4 - Rizal', 'teacher-elena'])
  }
}

export function getDatabase(): Database {
  if (!db) throw new Error('Database not initialized')
  return db
}

export function queryRows<T>(sql: string, params: unknown[] = []): T[] {
  if (!db) return []
  const result = db.exec(sql, params as SqlValue[])
  if (!result.length) return []
  const columns = result[0].columns
  return result[0].values.map((values) => Object.fromEntries(columns.map((column, index) => [column, values[index]])) as T)
}

export function execute(sql: string, params: unknown[] = []): void {
  if (!db) throw new Error('Database not initialized')
  db.run(sql, params as SqlValue[])
  void persistDatabase()
}

export async function resetDatabase(): Promise<void> {
  if (db) db.close()
  db = null
  const store = await openDatabaseStore()
  await new Promise<void>((resolve, reject) => {
    const tx = store.transaction('data', 'readwrite')
    tx.objectStore('data').clear()
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  await initializeDatabase()
}

export function setActiveProfileId(profileId: string | null): void {
  if (profileId) localStorage.setItem('aralite_active_profile', profileId)
  else localStorage.removeItem('aralite_active_profile')
}

export function getActiveProfileId(): string | null {
  return localStorage.getItem('aralite_active_profile')
}
