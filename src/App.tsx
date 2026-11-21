import { useEffect,useState } from 'react'
import { Trash2 } from 'lucide-react'
import { execute,getActiveProfileId,initializeDatabase,setActiveProfileId,queryRows } from './db/database'
import { subscribeRoom } from './sync/roomSync'
import { AppShell,type StudentTab } from './components/layout/AppShell'
import { AuthGatewayScreen } from './screens/AuthGatewayScreen'
import { StudentOverview } from './screens/StudentOverview'
import { StudentLessons } from './screens/StudentLessons'
import { LessonReader } from './screens/LessonReader'
import { QuizWorkspace } from './screens/QuizWorkspace'
import { StudentGrades } from './screens/StudentGrades'
import { StudentRoomQr } from './screens/StudentRoomQr'
import { TeacherDashboard } from './screens/TeacherDashboard'
import { Toast,type ToastItem } from './components/ui/Toast'
import type { LessonRow,ProfileRow } from './types'
import { UI_STRINGS } from './data/uiStrings'
import type { UiLang } from './types'
import { Button } from './components/ui/Button'

function App() {
 const [ready,setReady]=useState(false),[profile,setProfile]=useState<ProfileRow|null>(null),[lang,setLang]=useState<UiLang>('en'),[dark,setDark]=useState(false),[tab,setTab]=useState<StudentTab>('overview'),[lesson,setLesson]=useState<LessonRow|null>(null),[mode,setMode]=useState<'reader'|'quiz'|null>(null),[storage,setStorage]=useState(false),[revision,setRevision]=useState(0),[teacherMode,setTeacherMode]=useState(false),[toasts,setToasts]=useState<ToastItem[]>([])
 const s=UI_STRINGS[lang]
 const toast=(message:string)=>{const id=Date.now();setToasts(v=>[...v,{id,message}]);window.setTimeout(()=>setToasts(v=>v.filter(t=>t.id!==id)),3200)}
 useEffect(()=>{void initializeDatabase().then(()=>{const id=getActiveProfileId();if(id){const p=queryRows<ProfileRow>('SELECT * FROM profiles WHERE id=?',[id])[0];if(p){setProfile(p);setLang(p.preferred_lang);setTeacherMode(p.role==='teacher')}}setReady(true)});return subscribeRoom(()=>setRevision(v=>v+1))},[])
 if(!ready)return <div className="flex min-h-screen items-center justify-center bg-slate-50"><b>Loading Aralite</b></div>
 const enter=(p:ProfileRow,teacher=false)=>{setProfile(p);setTeacherMode(teacher);setLang(p.preferred_lang);setActiveProfileId(p.id)}
 const logout=()=>{setActiveProfileId(null);setProfile(null);setTeacherMode(false);setMode(null);setLesson(null);setTab('overview')}
 if(!profile)return <AuthGatewayScreen lang={lang} lowPower={dark} onLang={setLang} onTheme={()=>setDark(v=>!v)} onStudent={p=>enter(p,false)} onTeacher={p=>enter(p,true)}/>
 if(teacherMode)return <TeacherDashboard teacher={profile} onExit={logout}/>
 const openLesson=(l:LessonRow)=>{setLesson(l);setMode('reader')},openQuiz=(l:LessonRow)=>{setLesson(l);setMode('quiz')}
 let content
 if(mode==='reader'&&lesson)content=<LessonReader lesson={lesson} profile={profile} lang={lang} onBack={()=>{setMode(null);setLesson(null)}} onQuiz={()=>setMode('quiz')}/>
 else if(mode==='quiz'&&lesson)content=<QuizWorkspace lesson={lesson} profile={profile} lang={lang} onDone={()=>{setMode(null);setLesson(null);setTab('lessons');toast('Quiz saved offline')}}/>
 else if(tab==='lessons')content=<StudentLessons profile={profile} lang={lang} onLesson={openLesson} onGetRoom={()=>setTab('room')}/>
 else if(tab==='grades')content=<StudentGrades profile={profile} lang={lang}/>
 else if(tab==='room')content=<StudentRoomQr profile={profile} lang={lang}/>
 else content=<StudentOverview profile={profile} lang={lang} onLesson={openLesson} onRoom={()=>setTab('room')}/>
 const downloaded=queryRows<{id:string;title_en:string;title_ceb:string;title_tl:string;size_kb:number}>('SELECT id,title_en,title_ceb,title_tl,size_kb FROM lessons WHERE is_downloaded=1')
 const used=downloaded.reduce((sum,l)=>sum+l.size_kb,0)
 return <><AppShell profile={profile} lang={lang} lowPower={dark} tab={tab} teacher={false} onTab={setTab} onLang={setLang} onTheme={()=>setDark(v=>!v)} onSwitch={logout} onStorage={()=>setStorage(true)} onLesson={openLesson} onQuiz={openQuiz}><div key={revision}>{content}</div></AppShell>
 {storage&&<div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/30 p-4"><section className="surface w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">{s.storage}</h2><Button variant="outline" onClick={()=>setStorage(false)}>{s.close}</Button></div><p className="mb-4 text-sm text-slate-500 tabular-nums">{used} KB {lang==='ceb'?'gigamit offline':lang==='tl'?'ginamit offline':'used offline'}</p>{downloaded.map(l=><div key={l.id} className="flex min-h-14 items-center gap-3 border-t border-slate-100 py-2"><span className="flex-1 text-sm font-bold">{lang==='ceb'?l.title_ceb:lang==='tl'?l.title_tl??l.title_en:l.title_en}</span><Button variant="danger" icon={<Trash2 size={17}/>} onClick={()=>{execute('UPDATE lessons SET is_downloaded=0 WHERE id=?',[l.id]);setRevision(v=>v+1);toast(lang==='ceb'?'Gikuha ang lesson sa offline storage':lang==='tl'?'Tinanggal ang aralin sa offline storage':'Lesson removed from offline storage')}}>{lang==='ceb'?'Kuhaa':lang==='tl'?'Tanggalin':'Remove'}</Button></div>)}</section></div>}
 {toasts.map(t=><Toast key={t.id} item={t} onClose={id=>setToasts(v=>v.filter(x=>x.id!==id))}/>)}</>
}
export default App
