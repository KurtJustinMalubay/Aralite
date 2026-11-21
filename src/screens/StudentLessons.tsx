import { useState } from 'react'
import { ChevronDown,Play } from 'lucide-react'
import { queryRows } from '../db/database'
import type { LessonRow,ProfileRow } from '../types'
import { UI_STRINGS } from '../data/uiStrings'

export function StudentLessons({profile,lang,onLesson,onGetRoom}:{profile:ProfileRow;lang:'ceb'|'tl'|'en';onLesson:(l:LessonRow)=>void;onGetRoom:()=>void}) {
 const s=UI_STRINGS[lang]
 const [filter,setFilter]=useState<'all'|'downloaded'|'completed'>('all')
 const [open,setOpen]=useState<Record<string,boolean>>({q1:true,q2:true,q3:true})
 let lessons=queryRows<LessonRow>('SELECT * FROM lessons WHERE grade_level=? ORDER BY order_index',['Grade 4'])
 if(filter==='downloaded')lessons=lessons.filter(l=>l.is_downloaded===1)
 if(filter==='completed')lessons=lessons.filter(l=>queryRows<{count:number}>('SELECT COUNT(*) AS count FROM progress WHERE profile_id=? AND lesson_id=? AND status=?',[profile.id,l.id,'completed'])[0].count>0)
 const quarter=(l:LessonRow)=>l.order_index<2?'q1':l.order_index===2?'q2':'q3'
 return (
  <div className="animate-page-enter mx-auto max-w-6xl p-5 pb-24 sm:p-6">
   <h1 className="mb-6 text-2xl font-semibold tracking-tight">{s.lessons}</h1>
   <div className="mb-6 flex gap-2 overflow-x-auto">{(['all','downloaded','completed'] as const).map(f=><button key={f} onClick={()=>setFilter(f)} className={`min-h-11 shrink-0 rounded-lg border px-3 text-sm font-bold ${filter===f?'border-teal-700 bg-teal-700 text-white':'surface border-slate-200 bg-white text-slate-700'}`}>{f==='all'?s.all:f==='downloaded'?s.downloaded:s.completed}</button>)}</div>
   {(['q1','q2','q3'] as const).map(key=>{
    const items=lessons.filter(l=>quarter(l)===key)
    if(!items.length)return null
    return <section key={key} className="surface mb-4 overflow-hidden rounded-xl border border-slate-200/90 bg-white">
     <button onClick={()=>setOpen(v=>({...v,[key]:!v[key]}))} className="flex min-h-14 w-full items-center px-5 text-left font-semibold">{key==='q1'?s.quarter1:key==='q2'?s.quarter2:s.quarter3}<ChevronDown className={`accordion-chevron ml-auto ${open[key]?'rotate-180':''}`}/></button>
     {open[key]&&<div className="border-t border-slate-200">{items.map(l=>{
      const progress=queryRows<{status:string}>('SELECT status FROM progress WHERE profile_id=? AND lesson_id=?',[profile.id,l.id])[0]
      const downloaded=Boolean(l.is_downloaded)
      return <div key={l.id} className="grid gap-4 p-5 sm:p-6 md:grid-cols-[1fr_auto] md:items-center">
       <div><h3 className="font-semibold">{lang==='ceb'?l.title_ceb:lang==='tl'?l.title_tl??l.title_en:l.title_en}</h3><p className="mt-2 text-xs text-slate-500 tabular-nums">{l.deped_code} • {l.slm_reference} • {l.size_kb} KB</p></div>
       {downloaded?<button onClick={()=>onLesson(l)} className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 font-bold text-white active:scale-[0.98]"><Play size={18}/>{progress?.status==='completed'?s.review:progress?.status==='in_progress'?s.resume:s.start}</button>:<button onClick={onGetRoom} className="flex min-h-12 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 px-4 font-bold text-amber-800 active:scale-[0.98]">{s.getInRoom}</button>}
      </div>
     })}</div>}
    </section>
   })}
  </div>
 )
}
