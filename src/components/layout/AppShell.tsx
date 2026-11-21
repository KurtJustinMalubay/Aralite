import { useEffect, useState, type ReactNode } from 'react'
import { Menu, Moon, Sun, ChevronDown, Database, LogOut, CheckCircle2, Circle, Wifi, WifiOff, LayoutDashboard, BookOpen, ChartNoAxesColumnIncreasing, Radio } from 'lucide-react'
import { queryRows } from '../../db/database'
import { getActiveRoom } from '../../sync/roomSync'
import type { LessonRow,ProfileRow,UiLang } from '../../types'
import { UI_STRINGS } from '../../data/uiStrings'
import { LanguageSelector } from '../ui/LanguageSelector'

export type StudentTab='overview'|'lessons'|'grades'|'room'
interface Props { profile:ProfileRow; lang:UiLang; lowPower:boolean; tab:StudentTab; teacher:boolean; children:ReactNode; onTab:(tab:StudentTab)=>void; onLang:(lang:UiLang)=>void; onTheme:()=>void; onSwitch:()=>void; onStorage:()=>void; onLesson:(lesson:LessonRow)=>void; onQuiz:(lesson:LessonRow)=>void }

export function AppShell(p:Props) {
  const [drawer,setDrawer]=useState(false),[account,setAccount]=useState(false)
  const [isOnline,setIsOnline]=useState(navigator.onLine)
  useEffect(()=>{
    const online=()=>setIsOnline(true)
    const offline=()=>setIsOnline(false)
    window.addEventListener('online',online)
    window.addEventListener('offline',offline)
    return ()=>{window.removeEventListener('online',online);window.removeEventListener('offline',offline)}
  },[])
  const lessons=queryRows<LessonRow>('SELECT * FROM lessons WHERE grade_level=? ORDER BY order_index',['Grade 4'])
  const pending=queryRows<{count:number}>('SELECT COUNT(*) AS count FROM sync_queue WHERE status=?',['pending'])[0]?.count??0
  const room=getActiveRoom()
  const completed=queryRows<{count:number}>('SELECT COUNT(*) AS count FROM progress WHERE profile_id=? AND status=?',[p.profile.id,'completed'])[0]?.count??0
  const s=UI_STRINGS[p.lang]
  const tabs:Array<{id:StudentTab;label:string;icon:ReactNode}>=[
    {id:'overview',label:s.overview,icon:<LayoutDashboard size={19}/>},
    {id:'lessons',label:s.lessons,icon:<BookOpen size={19}/>},
    {id:'grades',label:s.grades,icon:<ChartNoAxesColumnIncreasing size={19}/>},
    {id:'room',label:s.room,icon:<Radio size={19}/>}
  ]
  return <div className={p.lowPower?'dark-ui min-h-screen':'min-h-screen bg-slate-50'}>
    <header className="surface sticky top-0 z-40 h-14 border-b border-slate-200 bg-white md:h-16">
      <div className="flex h-full w-full items-center px-2 sm:px-4">
        <button onClick={()=>setDrawer(v=>!v)} className="mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg lg:hidden" aria-label="Toggle module drawer"><Menu size={20}/></button>
        <div className="flex min-w-0 items-center gap-2 md:mr-6">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-sm font-black text-white md:h-10 md:w-10">A</span>
          <span className="hidden min-w-0 md:block"><b className="block whitespace-nowrap">Aralite</b><span className="block truncate text-xs text-slate-500 muted">Grade 4 Mathematics • Section Rizal</span></span>
        </div>
        <nav className="hidden h-full min-w-0 flex-1 items-center gap-0 lg:flex" aria-label="Course navigation">
          {tabs.map(t=><button key={t.id} onClick={()=>p.onTab(t.id)} className={`h-full whitespace-nowrap px-3 text-sm font-semibold xl:px-5 ${p.tab===t.id?'border-b-2 border-teal-700 text-teal-700':'text-slate-600'}`}>{t.label}</button>)}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          {room ? (
            <>
              <span className="hidden min-h-10 items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-3 text-xs font-bold text-emerald-700 md:flex"><Wifi size={15}/>{s.roomStatus} {room.roomCode}</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 md:hidden" title={`${s.roomStatus} ${room.roomCode}`}><Wifi size={18}/></span>
            </>
          ) : (
            <>
              <span className={`hidden min-h-10 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-bold md:flex ${isOnline?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-800'}`}>
                {isOnline?<Wifi size={15}/>:<WifiOff size={15}/>}
                {isOnline?`Online • ${pending ? `${pending} ${s.pending}` : s.synced}`:`${s.offline} • ${pending} ${s.pending}`}
              </span>
              <span className={`flex h-10 w-10 items-center justify-center rounded-full md:hidden ${isOnline?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-800'}`} title={isOnline?'Online':'Offline'}>{isOnline?<Wifi size={18}/>:<WifiOff size={18}/>}</span>
            </>
          )}
          <LanguageSelector lang={p.lang} onChange={p.onLang} compact/>
          <button onClick={p.onTheme} className="surface flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 sm:w-auto sm:px-3" aria-label={s.darkMode}>{p.lowPower?<Sun size={19}/>:<Moon size={19}/>}<span className="hidden text-sm font-bold lg:inline sm:ml-2">{p.lowPower?s.light:s.dark}</span></button>
          <div className="relative">
            <button onClick={()=>setAccount(v=>!v)} className="flex h-11 items-center gap-1 rounded-full" aria-label="Account switcher"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 font-black text-teal-800 md:h-10 md:w-10">{p.profile.name.slice(0,1).toUpperCase()}</span><ChevronDown size={16} className="hidden sm:block"/></button>
            {account&&<div className="surface animate-pop-in absolute right-0 top-12 w-[240px] rounded-xl border border-slate-200 bg-white p-2 text-left shadow-lg"><div className="border-b border-slate-100 px-3 py-3 text-left"><b className="block">{p.profile.name}</b><span className="block text-xs text-slate-500">{p.profile.role==='teacher'?'Teacher':p.profile.grade_level}</span></div><button onClick={()=>{p.onStorage();setAccount(false)}} className="flex min-h-12 w-full items-center justify-start gap-2 rounded-lg px-3 text-left font-bold"><Database size={18}/>{s.storage}</button><button onClick={()=>{p.onSwitch();setAccount(false)}} className="flex min-h-12 w-full items-center justify-start gap-2 rounded-lg px-3 text-left font-bold"><LogOut size={18}/>{s.logout}</button></div>}
          </div>
        </div>
      </div>
    </header>
    <div className="lg:flex"><button onClick={()=>setDrawer(false)} className={`fixed inset-0 z-40 bg-slate-950/20 lg:hidden ${drawer?'block':'hidden'}`} aria-label="Close drawer"/><aside className={`drawer-panel surface fixed bottom-0 left-0 top-16 z-50 w-68 border-r border-slate-200 bg-white lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${drawer?'translate-x-0':'-translate-x-full'}`}><div className="h-full overflow-y-auto p-5"><div className="mb-6"><p className="mb-2 text-sm font-semibold">{s.courseProgress}</p><div className="h-2 rounded-full bg-slate-100"><div className="progress-fill h-2 rounded-full bg-emerald-600" style={{width:`${completed/4*100}%`}}/></div><p className="mt-2 text-xs text-slate-500 tabular-nums">{completed} {s.modulesComplete}</p></div><nav>{lessons.map((lesson,index)=>{const status=queryRows<{status:string}>('SELECT status FROM progress WHERE profile_id=? AND lesson_id=?',[p.profile.id,lesson.id])[0]?.status;return <div key={lesson.id} className="mb-1"><button disabled={!lesson.is_downloaded} onClick={()=>{p.onLesson(lesson);setDrawer(false)}} className="flex min-h-12 w-full items-start gap-3 rounded-lg px-2 py-2 text-left disabled:opacity-50">{status==='completed'?<CheckCircle2 className="mt-0.5 text-emerald-600" size={18}/>:<Circle className="mt-0.5 text-slate-400" size={18}/>}<span><b className="block text-xs text-slate-500">{s.module} {index+1}</b>    <span className="block text-sm font-semibold leading-snug">{p.lang==='ceb'?lesson.title_ceb:p.lang==='tl'?lesson.title_tl??lesson.title_en:lesson.title_en}</span></span></button></div>})}</nav></div></aside><main className="min-w-0 flex-1">{p.children}</main></div>
    <nav className="surface fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-4 border-t border-slate-200 bg-white md:hidden" aria-label="Mobile course navigation">{tabs.map(t=><button key={t.id} onClick={()=>p.onTab(t.id)} className={`flex min-w-0 flex-col items-center justify-center gap-0.5 whitespace-nowrap text-[10px] font-bold leading-none ${p.tab===t.id?'text-teal-700':'text-slate-600'}`}>{t.icon}<span className="max-w-full truncate px-1">{t.label}</span></button>)}</nav>
  </div>
}
