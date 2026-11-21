import type { Database } from 'sql.js'

export interface LessonSeed {
  id: string
  deped_code: string
  slm_reference: string
  title_en: string
  title_ceb: string
  title_tl: string
  summary_en: string
  summary_ceb: string
  summary_tl: string
  size_kb: number
  downloaded: boolean
  blocks: Array<{ id: string; heading_en: string; heading_ceb: string; heading_tl?: string; body_en: string; body_ceb: string; body_tl?: string; svg: string }>
  quizzes: Array<{ id: string; q_en: string; q_ceb: string; q_tl?: string; o_en: string[]; o_ceb: string[]; o_tl?: string[]; correct: number; e_en: string; e_ceb: string; e_tl?: string }>
}

export const grade4Lessons: LessonSeed[] = [
  {
    id: 'place-value', deped_code: 'M4NS-Ia-10.4', slm_reference: 'Q1 • Module 1 • pp. 2–6',
    title_en: 'Place Value and Value of Digits up to 100,000', title_ceb: 'Place Value ug Kantidad sa Digito hangtod 100,000',
    title_tl: 'Halaga ng Lugar at Halaga ng mga Digit hanggang 100,000',
    summary_en: 'Read and write large numbers by identifying each digit’s place value.',
    summary_ceb: 'Basaha ug isulat ang dagkong numero pinaagi sa pagsusi sa place value sa matag digito.',
    summary_tl: 'Basahin at isulat ang malalaking bilang sa pamamagitan ng pagtukoy sa place value ng bawat digit.',
    size_kb: 380, downloaded: true,
    blocks: [
      { id: 'pv-1', heading_en: 'A House for Every Digit', heading_ceb: 'Balay sa Matag Digito', body_en: 'In 52,438, 5 is in the ten thousands place, 2 is in the thousands place, 4 is in the hundreds place, 3 is in the tens place, and 8 is in the ones place.', body_ceb: 'Sa 52,438, ang 5 anaa sa ten thousands, ang 2 sa thousands, ang 4 sa hundreds, ang 3 sa tens, ug ang 8 sa ones.', svg: 'place_value' },
      { id: 'pv-2', heading_en: 'Place Value', heading_ceb: 'Place Value', body_en: 'Place value tells the position of a digit. The place values from right to left are ones, tens, hundreds, thousands, and ten thousands.', body_ceb: 'Ang place value nag-isulti sa posisyon sa usa ka digito. Gikan sa tuo paingon sa wala: ones, tens, hundreds, thousands, ug ten thousands.', svg: 'none' },
      { id: 'pv-3', heading_en: 'Value of a Digit', heading_ceb: 'Kantidad sa Digito', body_en: 'The value of 5 in 52,438 is 50,000 because it means 5 ten thousands.', body_ceb: 'Ang kantidad sa 5 sa 52,438 mao ang 50,000 tungod kay nagpasabot kini ug 5 ten thousands.', svg: 'none' },
      { id: 'pv-4', heading_en: 'Try It', heading_ceb: 'Sulayi', body_en: 'In 86,201, the digit 6 is in the thousands place, so its value is 6,000.', body_ceb: 'Sa 86,201, ang digito 6 anaa sa thousands place, mao nga ang kantidad niini 6,000.', svg: 'none' }
    ],
    quizzes: [
      { id: 'pv-q1', q_en: 'What is the place value of 7 in 47,215?', q_ceb: 'Unsa ang place value sa 7 sa 47,215?', o_en: ['Thousands','Hundreds','Tens','Ten thousands'], o_ceb: ['Thousands','Hundreds','Tens','Ten thousands'], correct: 0, e_en: 'The 7 is in the thousands place.', e_ceb: 'Ang 7 anaa sa thousands place.' },
      { id: 'pv-q2', q_en: 'What is the value of 4 in 84,603?', q_ceb: 'Unsa ang kantidad sa 4 sa 84,603?', o_en: ['4','400','4,000','40,000'], o_ceb: ['4','400','4,000','40,000'], correct: 2, e_en: '4 is in the thousands place, so it equals 4,000.', e_ceb: 'Ang 4 anaa sa thousands place, busa 4,000 ang kantidad niini.' },
      { id: 'pv-q3', q_en: 'Which number has 6 in the hundreds place?', q_ceb: 'Unsang numero ang adunay 6 sa hundreds place?', o_en: ['16,302','62,104','35,641','9,060'], o_ceb: ['16,302','62,104','35,641','9,060'], correct: 2, e_en: 'In 35,641, the digit 6 is in the hundreds place.', e_ceb: 'Sa 35,641, ang digito 6 anaa sa hundreds place.' },
      { id: 'pv-q4', q_en: 'What is 3 ten thousands plus 2 thousands?', q_ceb: 'Unsa ang 3 ten thousands dugang 2 thousands?', o_en: ['32','320','32,000','300,200'], o_ceb: ['32','320','32,000','300,200'], correct: 2, e_en: '3 ten thousands is 30,000 and 2 thousands is 2,000.', e_ceb: 'Ang 3 ten thousands kay 30,000 ug ang 2 thousands kay 2,000.' }
    ]
  },
  {
    id: 'multiplication', deped_code: 'M4NS-Ic-43.7', slm_reference: 'Q1 • Module 4 • pp. 10–15',
    title_en: 'Multiplying 2- to 3-Digit Numbers by 1- to 2-Digit Numbers', title_ceb: 'Pagpadaghan sa 2–3 Digit nga Numero sa 1–2 Digit',
    title_tl: 'Pagpaparami ng 2 hanggang 3 Digit na Bilang sa 1 hanggang 2 Digit',
    summary_en: 'Use place-value multiplication and partial products to solve multi-digit problems.',
    summary_ceb: 'Gamita ang place-value multiplication ug partial products aron masulbad ang dagkong problema.',
    summary_tl: 'Gamitin ang place-value multiplication at partial products upang lutasin ang maraming-digit na problema.',
    size_kb: 450, downloaded: true,
    blocks: [
      { id: 'mult-1', heading_en: 'Break Apart the Numbers', heading_ceb: 'Bulaha ang mga Numero', body_en: 'To multiply 24 × 12, break 12 into 10 and 2. Find 24 × 10 and 24 × 2, then add.', body_ceb: 'Sa 24 × 12, bulaha ang 12 ngadto sa 10 ug 2. Kuhaa ang 24 × 10 ug 24 × 2, unya idugang.', svg: 'multiplication' },
      { id: 'mult-2', heading_en: 'Partial Products', heading_ceb: 'Partial Products', body_en: '24 × 10 = 240. 24 × 2 = 48. Adding gives 240 + 48 = 288.', body_ceb: '24 × 10 = 240. 24 × 2 = 48. Kung idugang: 240 + 48 = 288.', svg: 'none' },
      { id: 'mult-3', heading_en: 'Three-Digit Example', heading_ceb: 'Pananglitan sa Tulo ka Digito', body_en: 'For 125 × 6, multiply 100 × 6, 20 × 6, and 5 × 6: 600 + 120 + 30 = 750.', body_ceb: 'Para sa 125 × 6, i-multiply ang 100 × 6, 20 × 6, ug 5 × 6: 600 + 120 + 30 = 750.', svg: 'none' },
      { id: 'mult-4', heading_en: 'Check Your Work', heading_ceb: 'Tan-awa ang Tubag', body_en: 'Estimate before multiplying. 125 × 6 is close to 100 × 6 = 600, so 750 is reasonable.', body_ceb: 'Magbanabana una sa pagpadaghan. Ang 125 × 6 duol sa 100 × 6 = 600, busa ang 750 makatarunganon.', svg: 'none' }
    ],
    quizzes: [
      { id: 'mult-q1', q_en: 'What is 24 × 12?', q_ceb: 'Unsa ang 24 × 12?', o_en: ['288','268','298','248'], o_ceb: ['288','268','298','248'], correct: 0, e_en: '24 × 10 = 240 and 24 × 2 = 48; 240 + 48 = 288.', e_ceb: '24 × 10 = 240 ug 24 × 2 = 48; 240 + 48 = 288.' },
      { id: 'mult-q2', q_en: 'What is 125 × 6?', q_ceb: 'Unsa ang 125 × 6?', o_en: ['650','700','750','7500'], o_ceb: ['650','700','750','7500'], correct: 2, e_en: '600 + 120 + 30 = 750.', e_ceb: '600 + 120 + 30 = 750.' },
      { id: 'mult-q3', q_en: 'Which equation uses partial products for 32 × 14?', q_ceb: 'Unsang equation ang partial products para sa 32 × 14?', o_en: ['32×10 + 32×4','32×4 + 10','30×14 + 2','32×14 + 14'], o_ceb: ['32×10 + 32×4','32×4 + 10','30×14 + 2','32×14 + 14'], correct: 0, e_en: 'Break 14 into 10 and 4, then add 32 × 10 and 32 × 4.', e_ceb: 'Bulaha ang 14 ngadto sa 10 ug 4, ug idugang ang 32 × 10 ug 32 × 4.' },
      { id: 'mult-q4', q_en: 'Estimate 213 × 5.', q_ceb: 'Banabanaa ang 213 × 5.', o_en: ['About 500','About 800','About 1,000','About 1,500'], o_ceb: ['Mao ang 500','Mao ang 800','Mao ang 1,000','Mao ang 1,500'], correct: 2, e_en: '200 × 5 = 1,000, so 213 × 5 is about 1,000.', e_ceb: '200 × 5 = 1,000, busa ang 213 × 5 duol sa 1,000.' }
    ]
  },
  {
    id: 'fractions', deped_code: 'M4NS-IIe-79.2', slm_reference: 'Q2 • Module 3 • pp. 5–9',
    title_en: 'Visualizing and Identifying Proper, Improper, and Mixed Fractions', title_ceb: 'Paglaraw ug Pagila sa Proper, Improper, ug Mixed Fractions',
    title_tl: 'Pagpapakita at Pagkilala sa Tamang, Di-tamang, at Mixed na Fraction',
    summary_en: 'Identify fraction types and represent them with fraction bars.',
    summary_ceb: 'Ilha ang matang sa fraction ug ipakita kini gamit ang fraction bars.',
    summary_tl: 'Kilalanin ang uri ng fraction at ipakita ito gamit ang fraction bars.',
    size_kb: 520, downloaded: false,
    blocks: [
      { id: 'frac-1', heading_en: 'Proper Fractions', heading_ceb: 'Proper Fractions', body_en: 'A proper fraction has a numerator smaller than its denominator, such as 3/4.', body_ceb: 'Ang proper fraction adunay numerator nga mas gamay kaysa denominator, sama sa 3/4.', svg: 'fractions' },
      { id: 'frac-2', heading_en: 'Improper Fractions', heading_ceb: 'Improper Fractions', body_en: 'An improper fraction has a numerator equal to or greater than its denominator, such as 7/4.', body_ceb: 'Ang improper fraction adunay numerator nga patas o mas dako kaysa denominator, sama sa 7/4.', svg: 'fractions' },
      { id: 'frac-3', heading_en: 'Mixed Fractions', heading_ceb: 'Mixed Fractions', body_en: 'A mixed fraction has a whole number and a proper fraction together, such as 1 3/4.', body_ceb: 'Ang mixed fraction adunay tibuok nga numero ug proper fraction, sama sa 1 3/4.', svg: 'fractions' },
      { id: 'frac-4', heading_en: 'Equivalent Models', heading_ceb: 'Parehong Modelo', body_en: 'The improper fraction 7/4 and the mixed fraction 1 3/4 name the same amount.', body_ceb: 'Ang improper fraction nga 7/4 ug mixed fraction nga 1 3/4 pareho ug kantidad.', svg: 'fractions' }
    ],
    quizzes: [
      { id: 'frac-q1', q_en: 'Which is a proper fraction?', q_ceb: 'Unsang fraction ang proper?', o_en: ['5/3','7/7','3/8','9/4'], o_ceb: ['5/3','7/7','3/8','9/4'], correct: 2, e_en: 'In 3/8, the numerator is smaller than the denominator.', e_ceb: 'Sa 3/8, ang numerator mas gamay kaysa denominator.' },
      { id: 'frac-q2', q_en: 'Which fraction is improper?', q_ceb: 'Unsang fraction ang improper?', o_en: ['2/5','4/9','8/6','1/3'], o_ceb: ['2/5','4/9','8/6','1/3'], correct: 2, e_en: 'In 8/6, the numerator is greater than the denominator.', e_ceb: 'Sa 8/6, ang numerator mas dako kaysa denominator.' },
      { id: 'frac-q3', q_en: 'How is 1 3/4 described?', q_ceb: 'Giunsa paghulagway ang 1 3/4?', o_en: ['Proper fraction','Mixed fraction','Whole number','Decimal'], o_ceb: ['Proper fraction','Mixed fraction','Whole number','Decimal'], correct: 1, e_en: 'It combines a whole number and a proper fraction.', e_ceb: 'Naghiusa kini sa tibuok nga numero ug proper fraction.' },
      { id: 'frac-q4', q_en: 'What mixed fraction equals 7/4?', q_ceb: 'Unsang mixed fraction ang pareho sa 7/4?', o_en: ['1 1/4','1 3/4','2 1/4','3 1/4'], o_ceb: ['1 1/4','1 3/4','2 1/4','3 1/4'], correct: 1, e_en: 'Seven fourths equal 1 whole and 3 fourths.', e_ceb: 'Ang pito ka fourths pareho sa 1 tibuok ug 3 fourths.' }
    ]
  },
  {
    id: 'angles', deped_code: 'M4GE-IIIb-14', slm_reference: 'Q3 • Module 1 • pp. 3–8',
    title_en: 'Measuring and Classifying Angles: Right, Acute, Obtuse', title_ceb: 'Pag sukod ug Pagklasipikar sa Angulo: Right, Acute, Obtuse',
    title_tl: 'Pag-sukat at Pag-uuri ng Anggulo: Right, Acute, at Obtuse',
    summary_en: 'Measure turns and classify angles as right, acute, or obtuse.',
    summary_ceb: 'Sukda ang pagliko ug klasipika ang angulo isip right, acute, o obtuse.',
    summary_tl: 'Sukatin ang liko at uriin ang anggulo bilang right, acute, o obtuse.',
    size_kb: 610, downloaded: false,
    blocks: [
      { id: 'angle-1', heading_en: 'Right Angle', heading_ceb: 'Right Angle', body_en: 'A right angle measures exactly 90 degrees and forms a square corner.', body_ceb: 'Ang right angle eksaktong 90 degrees ug naghulma sa square corner.', svg: 'angles' },
      { id: 'angle-2', heading_en: 'Acute Angle', heading_ceb: 'Acute Angle', body_en: 'An acute angle measures less than 90 degrees.', body_ceb: 'Ang acute angle mas gamay sa 90 degrees.', svg: 'angles' },
      { id: 'angle-3', heading_en: 'Obtuse Angle', heading_ceb: 'Obtuse Angle', body_en: 'An obtuse angle measures more than 90 degrees but less than 180 degrees.', body_ceb: 'Ang obtuse angle mas dako sa 90 degrees apan mas gamay sa 180 degrees.', svg: 'angles' },
      { id: 'angle-4', heading_en: 'Use a Protractor', heading_ceb: 'Gamita ang Protractor', body_en: 'Place the center mark on the vertex and align one ray with zero degrees.', body_ceb: 'Ibutang ang sentro sa vertex ug itugma ang usa ka ray sa zero degrees.', svg: 'angles' }
    ],
    quizzes: [
      { id: 'angle-q1', q_en: 'How many degrees is a right angle?', q_ceb: 'Pila ka degree ang right angle?', o_en: ['45','90','180','360'], o_ceb: ['45','90','180','360'], correct: 1, e_en: 'A right angle measures exactly 90 degrees.', e_ceb: 'Ang right angle eksaktong 90 degrees.' },
      { id: 'angle-q2', q_en: 'A 40-degree angle is:', q_ceb: 'Ang 40-degree nga angulo kay:', o_en: ['Right','Acute','Obtuse','Straight'], o_ceb: ['Right','Acute','Obtuse','Straight'], correct: 1, e_en: '40 degrees is less than 90 degrees, so it is acute.', e_ceb: 'Ang 40 degrees mas gamay sa 90 degrees, busa acute kini.' },
      { id: 'angle-q3', q_en: 'A 120-degree angle is:', q_ceb: 'Ang 120-degree nga angulo kay:', o_en: ['Acute','Right','Obtuse','Straight'], o_ceb: ['Acute','Right','Obtuse','Straight'], correct: 2, e_en: '120 degrees is greater than 90 and less than 180, so it is obtuse.', e_ceb: 'Ang 120 degrees mas dako sa 90 ug mas gamay sa 180, busa obtuse kini.' },
      { id: 'angle-q4', q_en: 'Which tool measures angles?', q_ceb: 'Unsang gamit ang magsukod sa angulo?', o_en: ['Ruler','Compass','Protractor','Scale'], o_ceb: ['Ruler','Compass','Protractor','Scale'], correct: 2, e_en: 'A protractor is used to measure angles.', e_ceb: 'Ang protractor gigamit sa pagsukod sa angulo.' }
    ]
  }
]

export function seedGrade4Math(db: Database): void {
  const profiles = [
    ['mateo', 'Mateo', 'student', 'Grade 4', '#2563eb', 'M', 'en', null, null, null, null],
    ['carla', 'Carla', 'student', 'Grade 4', '#db2777', 'C', 'ceb', null, null, null, null],
    ['junjun', 'Junjun', 'student', 'Grade 5', '#059669', 'J', 'ceb', null, null, null, null],
    ['teacher-elena', 'Teacher Elena', 'teacher', 'Grade 4', '#7c3aed', 'E', 'en', 'elena', 'teacher123', 'Osao Elementary School', 'Grade 4 - Rizal']
  ]
  profiles.forEach((row) => db.run(
    'INSERT INTO profiles (id,name,role,grade_level,avatar_bg,avatar_emoji,preferred_lang,username,password,school_name,section_name) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    row
  ))
  grade4Lessons.forEach((lesson, index) => {
    db.run('INSERT INTO lessons (id,subject,grade_level,deped_code,slm_reference,title_en,title_ceb,title_tl,summary_en,summary_ceb,summary_tl,size_kb,is_downloaded,order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [lesson.id, 'Mathematics', 'Grade 4', lesson.deped_code, lesson.slm_reference,
        lesson.title_en, lesson.title_ceb, lesson.title_tl, lesson.summary_en, lesson.summary_ceb, lesson.summary_tl,
        lesson.size_kb, lesson.downloaded ? 1 : 0, index])
    lesson.blocks.forEach((block, blockIndex) => db.run(
      'INSERT INTO lesson_blocks (id,lesson_id,step_order,heading_en,heading_ceb,heading_tl,body_en,body_ceb,body_tl,svg_type) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [block.id, lesson.id, blockIndex, block.heading_en, block.heading_ceb, block.heading_tl ?? block.heading_en,
        block.body_en, block.body_ceb, block.body_tl ?? block.body_en, block.svg]))
    lesson.quizzes.forEach((quiz, quizIndex) => db.run(
      'INSERT INTO quizzes (id,lesson_id,question_order,question_en,question_ceb,question_tl,options_en_json,options_ceb_json,options_tl_json,correct_index,explanation_en,explanation_ceb,explanation_tl) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [quiz.id, lesson.id, quizIndex, quiz.q_en, quiz.q_ceb, quiz.q_tl ?? quiz.q_en,
        JSON.stringify(quiz.o_en), JSON.stringify(quiz.o_ceb), JSON.stringify(quiz.o_tl ?? quiz.o_en),
        quiz.correct, quiz.e_en, quiz.e_ceb, quiz.e_tl ?? quiz.e_en]))
  })
  for (const profileId of ['mateo', 'carla']) {
    db.run('INSERT INTO progress VALUES (?, ?, ?, ?, ?, ?)',
      [`progress-${profileId}-place`, profileId, 'place-value', 'in_progress', 1, new Date().toISOString()])
  }
}
