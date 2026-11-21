import { useState } from 'react'
import { Eye, EyeOff, Moon, Sun, Database } from 'lucide-react'
import { execute, queryRows } from '../db/database'
import type { ProfileRow, UiLang } from '../types'
import { LanguageSelector } from '../components/ui/LanguageSelector'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { UI_STRINGS } from '../data/uiStrings'

interface Props {
  lang:UiLang; lowPower:boolean; onLang:(lang:UiLang)=>void; onTheme:()=>void;
  onStudent:(profile:ProfileRow)=>void; onTeacher:(profile:ProfileRow)=>void
}

export function AuthGatewayScreen(p:Props) {
  const s=UI_STRINGS[p.lang]
  const [role,setRole]=useState<'student'|'teacher'>('student')
  const [authTab,setAuthTab]=useState<'signin'|'register'>('signin')
  const [name,setName]=useState('')
  const [grade,setGrade]=useState('Grade 4')
  const [color,setColor]=useState('#0f766e')
  const [add,setAdd]=useState(false)
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [fullName,setFullName]=useState('')
  const [school,setSchool]=useState('')
  const [section,setSection]=useState('Grade 4 - Rizal')
  const [show,setShow]=useState(false)
  const [error,setError]=useState('')
  const students=queryRows<ProfileRow>("SELECT * FROM profiles WHERE role='student'")

  const addStudent=()=>{
    if(!name.trim()){setError(p.lang==='ceb'?'Ibutang ang pangalan':'Enter a name');return}
    const id=`learner-${Date.now()}`
    execute('INSERT INTO profiles (id,name,role,grade_level,avatar_bg,avatar_emoji,preferred_lang) VALUES (?,?,?,?,?,?,?)',[id,name.trim(),'student',grade,color,name.trim().slice(0,1).toUpperCase(),p.lang])
    setAdd(false);setName('');setError('')
  }
  const signIn=()=>{
    const teacher=queryRows<ProfileRow>("SELECT * FROM profiles WHERE role='teacher' AND username=? AND password=?",[username.trim(),password])[0]
    if(!teacher){setError('Invalid username or password');return}
    setError('');p.onTeacher(teacher)
  }
  const register=()=>{
    if(!fullName.trim()||!school.trim()||!username.trim()||!password.trim()){setError('Complete all teacher account fields');return}
    if(queryRows<{count:number}>('SELECT COUNT(*) AS count FROM profiles WHERE username=?',[username.trim()])[0].count){setError('That username is already in use');return}
    const id=`teacher-${Date.now()}`
    execute('INSERT INTO profiles (id,name,role,grade_level,avatar_bg,avatar_emoji,preferred_lang,username,password,school_name,section_name) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[id,fullName.trim(),'teacher','Teacher','#7c3aed',fullName.trim().slice(0,1).toUpperCase(),p.lang,username.trim(),password,school.trim(),section])
    p.onTeacher(queryRows<ProfileRow>('SELECT * FROM profiles WHERE id=?',[id])[0])
  }

  return (
    <main className={p.lowPower?'dark-ui min-h-screen grid lg:grid-cols-12':'min-h-screen grid bg-slate-50 lg:grid-cols-12'}>
      <section className="flex min-h-[320px] flex-col overflow-hidden bg-teal-800 p-6 text-white md:p-10 lg:col-span-5 lg:min-h-screen lg:p-12">
        <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white font-black text-teal-800">A</span><b className="text-xl">Aralite</b></div>
        <div className="my-auto py-8">
          <p className="mb-3 text-sm font-bold text-teal-100">{p.lang==='ceb'?'Para sa Philippine Public Schools':'For Philippine Public Schools'}</p>
          <h1 className="max-w-md text-3xl font-semibold tracking-tight md:text-4xl">{p.lang==='ceb'?'Offline nga Pagtuon, Lokal nga Koneksyon':'Offline-First Learning Platform'}</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-teal-100">{p.lang==='ceb'?'Magtuon bisan walay internet ug makig-uban sa imong klase sa lokal nga room.':'Learn without internet and stay connected to your class in a local room.'}</p>
          <div className="mt-6 grid max-w-sm gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-teal-600/60 bg-teal-700/40 p-3"><Database size={18}/><span className="text-sm font-bold">{p.lang==='ceb'?'Lokal ug luwas nga database':'Local and private database'}</span></div>
            <div className="flex items-center gap-3 rounded-xl border border-teal-600/60 bg-teal-700/40 p-3"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">4</span><span className="text-sm font-bold">{p.lang==='ceb'?'Grade 4–12 ug uban pang kurso':'Elementary to senior high learning'}</span></div>
            <div className="flex items-center gap-3 rounded-xl border border-teal-600/60 bg-teal-700/40 p-3"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">QR</span><span className="text-sm font-bold">{p.lang==='ceb'?'Room ug QR nga pag-sync':'Room and QR synchronization'}</span></div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2"><span className="min-h-10 rounded-full border border-teal-500 px-3 py-2 text-xs font-bold"><Database className="mr-1 inline" size={14}/>{p.lang==='ceb'?'Local database andam':p.lang==='tl'?'Handa ang local database':'Local database ready'}</span><LanguageSelector lang={p.lang} onChange={p.onLang}/><button onClick={p.onTheme} className="flex min-h-12 items-center gap-2 rounded-lg border border-teal-500 px-3 text-sm font-bold" aria-label={s.darkMode}>{p.lowPower?<Sun size={18}/>:<Moon size={18}/>} {s.dark}</button></div>
      </section>
      <section className="surface flex min-h-screen items-start justify-center p-4 md:p-8 lg:col-span-7 lg:items-center">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex border-b border-slate-200">
            {(['student','teacher'] as const).map((item)=><button key={item} onClick={()=>{setRole(item);setError('')}} className={`min-h-12 flex-1 border-b-2 text-sm font-bold ${role===item?'border-teal-700 text-teal-700':'border-transparent text-slate-500'}`}>{item==='student'?s.studentLearner:s.teacherPortal}</button>)}
          </div>
          {role==='student' ? (
            <div>
              <div className="mb-6"><p className="text-sm font-bold text-teal-700">Household learning</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">{p.lang==='ceb'?'Kinsa ang magtuon karon?':'Who is learning today?'}</h2></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {students.map((student)=>{
                  const done=queryRows<{count:number}>('SELECT COUNT(*) AS count FROM progress WHERE profile_id=? AND status=?',[student.id,'completed'])[0]?.count??0
                  return (
                    <button key={student.id} onClick={()=>p.onStudent(student)} className="surface flex min-h-32 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_1px_3px_rgba(15,23,42,.04)]">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-black text-white" style={{backgroundColor:student.avatar_bg}}>{student.name.slice(0,1).toUpperCase()}</span>
                      <span className="min-w-0 flex-1"><b className="block text-lg">{student.name}</b><span className="text-sm text-slate-500">{student.grade_level}</span><span className="mt-3 block h-1.5 rounded-full bg-slate-100"><span className="block h-1.5 rounded-full bg-emerald-600" style={{width:`${done/4*100}%`}}/></span><span className="mt-1 block text-xs text-slate-500 tabular-nums">{done}/4 modules</span></span>
                    </button>
                  )
                })}
              </div>
              <Button variant="outline" primaryTouch onClick={()=>setAdd(true)} className="mt-4 w-full border-dashed">+ Add Student Learner</Button>
              <Modal open={add} title={p.lang==='ceb'?'Dugang Estudyante':'Add Student Learner'} onClose={()=>setAdd(false)}><input value={name} onChange={e=>setName(e.target.value)} placeholder={s.learnerName} className="mb-3 min-h-12 w-full rounded-lg border border-slate-300 px-3"/><div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2"><select value={grade} onChange={e=>setGrade(e.target.value)} className="min-h-12 rounded-lg border border-slate-300 px-3"><option value="" disabled>{s.gradeLevel}</option>{Array.from({length:12},(_,i)=>`Grade ${i+1}`).map(g=><option key={g}>{g}</option>)}</select><div className="flex gap-2">{['#0f766e','#2563eb','#db2777','#d97706'].map(c=><button key={c} onClick={()=>setColor(c)} aria-label={`Avatar color ${c}`} className={`h-12 flex-1 rounded-lg ${color===c?'ring-2 ring-slate-900':''}`} style={{backgroundColor:c}}/>)}</div></div>{error&&<p className="mb-3 text-sm text-red-600">{error}</p>}<Button primaryTouch onClick={addStudent} className="w-full">{s.saveLearner}</Button></Modal>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex border-b border-slate-200">
                {(['signin','register'] as const).map((item)=><button key={item} onClick={()=>{setAuthTab(item);setError('')}} className={`min-h-12 flex-1 border-b-2 text-sm font-bold ${authTab===item?'border-teal-700 text-teal-700':'border-transparent text-slate-500'}`}>{item==='signin'?s.signIn:s.register}</button>)}
              </div>
              <h2 className="mb-6 text-2xl font-semibold tracking-tight">{authTab==='signin'? (p.lang==='ceb'?'Teacher nga Sulod':'Teacher Sign In') : s.createTeacher}</h2>
              {authTab==='signin' ? (
                <div className="space-y-4">
                  <div><label className="mb-2 block text-sm font-bold">Username / ID</label><input value={username} onChange={e=>setUsername(e.target.value)} className="min-h-12 w-full rounded-lg border border-slate-300 px-3"/></div>
                  <div><label className="mb-2 block text-sm font-bold">Password</label><div className="relative"><input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} className="min-h-12 w-full rounded-lg border border-slate-300 px-3 pr-12"/><button onClick={()=>setShow(v=>!v)} className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center" aria-label="Toggle password visibility">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></div>
                  {error&&<p className="text-sm font-bold text-red-600">{error}</p>}
                  <Button primaryTouch onClick={signIn} className="w-full">{s.signInTeacher}</Button>
                  <button onClick={()=>{setUsername('elena');setPassword('teacher123');setError('')}} className="text-sm font-bold text-teal-700">{s.demoFill}</button>
                </div>
              ) : (
                <div className="grid gap-4">
                  <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full Name" className="min-h-12 rounded-lg border border-slate-300 px-3"/>
                  <input value={school} onChange={e=>setSchool(e.target.value)} placeholder="School Name" className="min-h-12 rounded-lg border border-slate-300 px-3"/>
                  <input value={section} onChange={e=>setSection(e.target.value)} placeholder="Grade & Section" className="min-h-12 rounded-lg border border-slate-300 px-3"/>
                  <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="min-h-12 rounded-lg border border-slate-300 px-3"/>
                  <div className="relative"><input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="min-h-12 w-full rounded-lg border border-slate-300 px-3 pr-12"/><button onClick={()=>setShow(v=>!v)} className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center" aria-label="Toggle password visibility">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>
                  {error&&<p className="text-sm font-bold text-red-600">{error}</p>}
                  <Button primaryTouch onClick={register} className="w-full">{p.lang==='ceb'?'Himo ug Sulod sa Teacher Portal':p.lang==='tl'?'Gumawa at Pumasok sa Teacher Portal':'Create and Enter Teacher Portal'}</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
