import { Capacitor } from '@capacitor/core'
import { HttpServer } from '@cantoo/capacitor-http-server'
import { execute, getDatabase, persistDatabase, queryRows } from '../db/database'

export interface RoomInfo {
  roomCode: string
  hostUrl: string
  teacherName: string
  timestamp: number
}

type RoomMessage =
  | { type: 'heartbeat'; room: RoomInfo }
  | { type: 'join'; roomCode: string; profileId: string; profileName: string }
  | { type: 'push-lessons'; roomCode: string; lessonIds: string[] }
  | { type: 'student-sync'; roomCode: string; payload: unknown }
  | { type: 'roster-update'; roomCode: string }

let channel: BroadcastChannel | null = null
let heartbeatTimer: number | null = null
let activeRoom: RoomInfo | null = null
let listeners: Array<(message: RoomMessage) => void> = []

export function subscribeRoom(listener: (message: RoomMessage) => void): () => void {
  listeners.push(listener)
  return () => { listeners = listeners.filter((item) => item !== listener) }
}

function ensureChannel(): BroadcastChannel {
  if (channel) return channel
  channel = new BroadcastChannel('aralite_classroom_room')
  channel.onmessage = (event: MessageEvent<RoomMessage>) => {
    if (event.data.type === 'push-lessons') {
      event.data.lessonIds.forEach((lessonId) => execute('UPDATE lessons SET is_downloaded = 1 WHERE id = ?', [lessonId]))
      void persistDatabase()
    }
    if (event.data.type === 'student-sync') mergeSyncPayload(event.data.payload)
    listeners.forEach((listener) => listener(event.data))
  }
  window.addEventListener('storage', (event) => {
    if (event.key !== 'aralite_room_heartbeat') return
    try {
      const room = JSON.parse(event.newValue ?? '{}') as RoomInfo
      if (room.roomCode) listeners.forEach((listener) => listener({ type: 'heartbeat', room }))
    } catch { /* Ignore malformed local storage data */ }
  })
  return channel
}

export function getActiveRoom(): RoomInfo | null {
  if (activeRoom) return activeRoom
  try {
    const stored = localStorage.getItem('aralite_active_room')
    return stored ? JSON.parse(stored) as RoomInfo : null
  } catch { return null }
}

export function generateRoomCode(): string {
  const words = ['4A', '5B', 'SUN', 'KID', 'ISK', 'TUB']
  const suffix = words[Math.floor(Math.random() * words.length)]
  return `ARAL-${suffix}`
}

export async function startClassroomRoom(teacherName = 'Teacher Elena'): Promise<RoomInfo> {
  const roomCode = generateRoomCode()
  const room: RoomInfo = {
    roomCode,
    hostUrl: window.location.origin,
    teacherName,
    timestamp: Date.now()
  }
  activeRoom = room
  localStorage.setItem('aralite_active_room', JSON.stringify(room))
  const bus = ensureChannel()
  bus.postMessage({ type: 'heartbeat', room })
  heartbeatTimer = window.setInterval(() => {
    localStorage.setItem('aralite_room_heartbeat', JSON.stringify(room))
  }, 2000)

  if (Capacitor.isNativePlatform()) {
    await HttpServer.start({
      port: 18765,
      android: {
        notificationTitle: 'Aralite Classroom Room',
        notificationText: 'Local classroom sync active'
      }
    })
    await HttpServer.addListener('request', async (event) => {
      if (event.method === 'GET' && event.path === '/api/room-manifest') {
        const lessons = queryRows('SELECT * FROM lessons WHERE is_downloaded = 1')
        await HttpServer.respond({ requestId: event.requestId, status: 200, headers: { 'Content-Type': 'application/json' }, bodyText: JSON.stringify({ room, lessons }) })
      } else if (event.method === 'POST' && event.path === '/api/room-sync') {
        if (event.bodyText) mergeSyncPayload(JSON.parse(event.bodyText))
        await HttpServer.respond({ requestId: event.requestId, status: 200, headers: { 'Content-Type': 'application/json' }, bodyText: JSON.stringify({ ok: true, room }) })
      } else {
        await HttpServer.respond({ requestId: event.requestId, status: 404, bodyText: 'Not found' })
      }
    })
  }
  return room
}

export async function stopClassroomRoom(): Promise<void> {
  activeRoom = null
  localStorage.removeItem('aralite_active_room')
  if (heartbeatTimer !== null) window.clearInterval(heartbeatTimer)
  heartbeatTimer = null
  if (channel) {
    channel.close()
    channel = null
  }
  if (Capacitor.isNativePlatform()) await HttpServer.stop()
}

export function joinClassroomRoom(roomCode: string, profileId: string, profileName: string): void {
  const room = getActiveRoom() ?? {
    roomCode,
    hostUrl: window.location.origin,
    teacherName: 'Teacher',
    timestamp: Date.now()
  }
  room.roomCode = roomCode
  activeRoom = room
  localStorage.setItem('aralite_active_room', JSON.stringify(room))
  const bus = ensureChannel()
  bus.postMessage({ type: 'join', roomCode, profileId, profileName })
  syncPendingToRoom(roomCode)
}

export function pushLessonsToRoom(lessonIds: string[]): void {
  const room = getActiveRoom()
  if (!room) return
  lessonIds.forEach((lessonId) => execute('UPDATE lessons SET is_downloaded = 1 WHERE id = ?', [lessonId]))
  ensureChannel().postMessage({ type: 'push-lessons', roomCode: room.roomCode, lessonIds })
}

export function syncPendingToRoom(roomCode: string): void {
  const payload = {
    progress: queryRows('SELECT * FROM progress'),
    quiz_attempts: queryRows('SELECT * FROM quiz_attempts'),
    queued: queryRows("SELECT * FROM sync_queue WHERE status = 'pending'")
  }
  ensureChannel().postMessage({ type: 'student-sync', roomCode, payload })
  listeners.forEach((listener) => listener({ type: 'student-sync', roomCode, payload }))
  void persistDatabase()
}

export function mergeSyncPayload(payload: unknown): void {
  if (!payload || typeof payload !== 'object') return
  const data = payload as { progress?: Array<Record<string, unknown>>; quiz_attempts?: Array<Record<string, unknown>> }
  const db = getDatabase()
  for (const row of data.progress ?? []) {
    const id = String(row.id)
    const profileId = String(row.profile_id)
    const lessonId = String(row.lesson_id)
    const status = String(row.status)
    const lastStep = Number(row.last_step)
    const updatedAt = String(row.updated_at)
    const existing = queryRows<{ updated_at: string }>('SELECT updated_at FROM progress WHERE id = ?', [id])[0]
    if (!existing || updatedAt >= existing.updated_at) {
      db.run('INSERT OR REPLACE INTO progress (id, profile_id, lesson_id, status, last_step, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [id, profileId, lessonId, status, lastStep, updatedAt])
    }
  }
  for (const row of data.quiz_attempts ?? []) {
    const id = String(row.id)
    const profileId = String(row.profile_id)
    const lessonId = String(row.lesson_id)
    const score = Number(row.score)
    const total = Number(row.total_questions)
    const completedAt = String(row.completed_at)
    const existing = queryRows<{ completed_at: string }>('SELECT completed_at FROM quiz_attempts WHERE id = ?', [id])[0]
    if (!existing || completedAt >= existing.completed_at) {
      db.run('INSERT OR REPLACE INTO quiz_attempts (id, profile_id, lesson_id, score, total_questions, completed_at) VALUES (?, ?, ?, ?, ?, ?)',
        [id, profileId, lessonId, score, total, completedAt])
    }
  }
  execute("UPDATE sync_queue SET status = 'synced'")
  void persistDatabase()
  ensureChannel().postMessage({ type: 'roster-update', roomCode: getActiveRoom()?.roomCode ?? '' })
}
