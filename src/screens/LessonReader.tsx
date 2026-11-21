import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react'
import { execute, queryRows } from '../db/database'
import { MathDiagram } from '../components/MathDiagram'
import { AudioButton } from '../components/ui/AudioButton'
import { UI_STRINGS } from '../data/uiStrings'
import type { BlockRow, LessonRow, ProfileRow, UiLang } from '../types'

export function LessonReader({lesson,profile,lang,onBack,onQuiz}:{lesson:LessonRow;profile:ProfileRow;lang:UiLang;onBack:()=>void;onQuiz:()=>void}) {
 const s=UI_STRINGS[lang]
 const blocks=queryRows<BlockRow>('SELECT * FROM lesson_blocks WHERE lesson_id=? ORDER BY step_order',[lesson.id])
 const saved=queryRows<{last_step:number}>('SELECT last_step FROM progress WHERE profile_id=? AND lesson_id=?',[profile.id,lesson.id])[0]
 const [step,setStep]=useState(Math.min(saved?.last_step??0,Math.max(blocks.length-1,0)))
 const block=blocks[step]
 const move=(next:number)=>{setStep(next);execute('INSERT OR REPLACE INTO progress (id,profile_id,lesson_id,status,last_step,updated_at) VALUES (?,?,?,?,?,?)',[`progress-${profile.id}-${lesson.id}`,profile.id,lesson.id,'in_progress',next,new Date().toISOString()])}
 if(!block)return null
 const title=lang==='ceb'?lesson.title_ceb:lang==='tl'?lesson.title_tl??lesson.title_en:lesson.title_en
 const heading=lang==='ceb'?block.heading_ceb:lang==='tl'?block.heading_tl??block.heading_en:block.heading_en
 const body=lang==='ceb'?block.body_ceb:lang==='tl'?block.body_tl??block.body_en:block.body_en
 return (
  <div className="animate-page-enter mx-auto max-w-6xl p-5 pb-24 sm:p-6">
   <button onClick={onBack} className="surface mb-6 flex min-h-12 items-center gap-2 rounded-lg border border-slate-300 px-4 font-bold"><ArrowLeft size={18}/>{lang==='ceb'?'Balik':lang==='tl'?'Balik':'Back'}</button>
   <div className="grid gap-8 lg:grid-cols-12">
    <aside className="lg:col-span-3"><nav className="surface sticky top-20 rounded-xl border border-slate-200 bg-white p-3" aria-label="Lesson outline">{blocks.map((item,index)=>{const itemHeading=lang==='ceb'?item.heading_ceb:lang==='tl'?item.heading_tl??item.heading_en:item.heading_en;return <button key={item.id} onClick={()=>move(index)} className={`flex min-h-12 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-bold ${step===index?'bg-teal-50 text-teal-800':'text-slate-600'}`}>{index<step?<CheckCircle2 className="text-emerald-600" size={18}/>:<Circle size={18}/>}<span>{itemHeading}</span></button>})}</nav></aside>
    <article className="lg:col-span-9">
     <div className="surface rounded-xl border border-slate-200/90 bg-white p-6 md:p-10">
      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>{lesson.deped_code}</span><span>• {lesson.slm_reference}</span><span className="ml-auto tabular-nums">{lang==='ceb'?'Bahin':lang==='tl'?'Hakbang':'Step'} {step+1} / {blocks.length}</span></div>
      <div className="mb-6 h-2 rounded-full bg-slate-100"><div className="progress-fill h-2 rounded-full bg-teal-600" style={{width:`${(step+1)/blocks.length*100}%`}}/></div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      <div className="mx-auto max-w-3xl"><h2 className="mb-4 text-xl font-semibold">{heading}</h2>{block.svg_type!=='none'&&<div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-3"><MathDiagram type={block.svg_type}/></div>}<p className="text-base leading-relaxed text-slate-700 md:text-[17px]">{body}</p><div className="mt-6"><AudioButton text={body} lang={lang}/></div></div>
     </div>
     <footer className="mt-4 flex gap-3"><button disabled={step===0} onClick={()=>move(step-1)} className="surface flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 font-bold disabled:opacity-40"><ArrowLeft size={18}/>{s.previous}</button>{step<blocks.length-1?<button onClick={()=>move(step+1)} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 font-bold text-white">{s.next}<ArrowRight size={18}/></button>:<button onClick={onQuiz} className="flex min-h-12 flex-1 items-center justify-center rounded-lg bg-teal-700 px-4 font-bold text-white">{s.takeQuiz}</button>}</footer>
    </article>
   </div>
  </div>
 )
}
