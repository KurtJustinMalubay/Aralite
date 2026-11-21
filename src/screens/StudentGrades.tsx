import { CheckCircle2, Clock3, Trophy } from 'lucide-react'
import { queryRows } from '../db/database'
import { UI_STRINGS } from '../data/uiStrings'
import type { LessonRow, ProfileRow } from '../types'

export function StudentGrades({profile,lang}:{profile:ProfileRow;lang:'ceb'|'tl'|'en'}) {
 const s=UI_STRINGS[lang]
 const lessons=queryRows<LessonRow>('SELECT * FROM lessons WHERE grade_level=? ORDER BY order_index',['Grade 4'])
 const progress=queryRows<{lesson_id:string;status:string}>('SELECT lesson_id,status FROM progress WHERE profile_id=?',[profile.id])
 const attempts=queryRows<{lesson_id:string;score:number;total_questions:number}>('SELECT lesson_id,score,total_questions FROM quiz_attempts WHERE profile_id=?',[profile.id])
 const completed=progress.filter(p=>p.status==='completed').length
 const avg=attempts.length?Math.round(attempts.reduce((sum,a)=>sum+a.score/a.total_questions*100,0)/attempts.length):0
 const pending=queryRows<{count:number}>('SELECT COUNT(*) AS count FROM sync_queue WHERE status=?',['pending'])[0]?.count??0
 return (
  <div className="animate-page-enter mx-auto max-w-6xl p-5 pb-24 sm:p-6">
   <h1 className="mb-6 text-2xl font-semibold tracking-tight">{s.grades}</h1>
   <div className="mb-6 grid gap-4 sm:grid-cols-3">
    {[{icon:<CheckCircle2/>,label:s.lessonsDone,value:`${completed}/4`},{icon:<Trophy/>,label:s.averageScore,value:`${avg}%`},{icon:<Clock3/>,label:s.syncStatus,value:`${pending} ${s.pending}`}].map(k=>
     <div key={k.label} className="surface h-fit rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs"><div className="mb-3 text-teal-700">{k.icon}</div><p className="text-sm text-slate-500">{k.label}</p><b className="text-2xl tabular-nums">{k.value}</b></div>
    )}
   </div>
   <div className="surface overflow-x-auto rounded-xl border border-slate-200/90 bg-white">
    <table className="w-full min-w-[680px] text-left">
     <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="p-4">{s.module}</th><th>DepEd Code</th><th>SLM Reference</th><th>{lang==='ceb'?'Himtang':'Status'}</th><th>{lang==='ceb'?'Quiz':'Quiz Score'}</th></tr></thead>
     <tbody>{lessons.map(l=>{
      const p=progress.find(x=>x.lesson_id===l.id),a=attempts.find(x=>x.lesson_id===l.id)
      return <tr key={l.id} className="border-b border-slate-100 last:border-0">      <td className="p-4 font-semibold">{lang==='ceb'?l.title_ceb:lang==='tl'?l.title_tl??l.title_en:l.title_en}</td><td className="text-xs text-slate-500">{l.deped_code}</td><td className="text-xs text-slate-500">{l.slm_reference}</td><td><span className={`rounded-full px-3 py-1 text-xs font-bold ${p?.status==='completed'?'bg-emerald-50 text-emerald-700':p?.status==='in_progress'?'bg-teal-50 text-teal-700':'bg-slate-100 text-slate-600'}`}>{p?.status==='completed'?s.statusCompleted:p?.status==='in_progress'?s.statusInProgress:s.notStarted}</span></td><td className="font-bold tabular-nums">{a?`${a.score}/${a.total_questions}`:'—'}</td></tr>
     })}</tbody>
    </table>
   </div>
  </div>
 )
}
