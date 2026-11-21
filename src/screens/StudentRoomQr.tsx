import { useEffect,useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Html5Qrcode } from 'html5-qrcode'
import { compressToEncodedURIComponent,decompressFromEncodedURIComponent } from 'lz-string'
import { Camera,Radio,Upload } from 'lucide-react'
import { execute,queryRows } from '../db/database'
import { getActiveRoom,joinClassroomRoom,subscribeRoom } from '../sync/roomSync'
import { UI_STRINGS } from '../data/uiStrings'
import type { ProfileRow } from '../types'

export function StudentRoomQr({profile,lang}:{profile:ProfileRow;lang:'ceb'|'tl'|'en'}) {
 const s=UI_STRINGS[lang]
 const [detected,setDetected]=useState(getActiveRoom()?.roomCode??'')
 const [code,setCode]=useState(getActiveRoom()?.roomCode??'')
 const [tab,setTab]=useState<'send'|'receive'>('send')
 const [lessonText,setLessonText]=useState('')
 const [scanning,setScanning]=useState(false)
 useEffect(()=>subscribeRoom(m=>{if(m.type==='heartbeat')setDetected(m.room.roomCode)}),[])
 const room=getActiveRoom()
 const pending=queryRows<{count:number}>('SELECT COUNT(*) AS count FROM sync_queue WHERE status=?',['pending'])[0]?.count??0
 const payload={profileId:profile.id,progress:queryRows('SELECT * FROM progress WHERE profile_id=?',[profile.id]),attempts:queryRows('SELECT * FROM quiz_attempts WHERE profile_id=?',[profile.id]),createdAt:Date.now()}
 const qr=compressToEncodedURIComponent(JSON.stringify(payload))
 const join=(value:string)=>{if(!value.trim())return;const clean=value.trim().toUpperCase();joinClassroomRoom(clean,profile.id,profile.name);setCode(clean)}
 const scan=async()=>{setScanning(true);const scanner=new Html5Qrcode('lesson-qr-scanner');try{await scanner.start({facingMode:'environment'},{fps:10,qrbox:240},text=>{setLessonText(text);void scanner.stop();setScanning(false)},()=>undefined)}catch{setScanning(false)}}
 const importLesson=()=>{try{const text=decompressFromEncodedURIComponent(lessonText)??lessonText;const pack=JSON.parse(text) as {lessonId?:string};if(pack.lessonId)execute('UPDATE lessons SET is_downloaded=1 WHERE id=?',[pack.lessonId])}catch{/* Ignore invalid QR */}}
 return (
  <div className="animate-page-enter mx-auto max-w-6xl p-5 pb-24 sm:p-6">
   <h1 className="mb-6 text-2xl font-semibold tracking-tight">{s.room}</h1>
   <div className="grid items-start gap-6 lg:grid-cols-2">
    <section className="surface h-fit rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6">
     <div className="mb-4 flex items-center gap-2"><Radio className="text-teal-700"/><h2 className="text-lg font-semibold">{lang==='ceb'?'Lokal nga Classroom Room':'Local Classroom Room'}</h2></div>
     {detected&&<button onClick={()=>join(detected)} className="mb-4 min-h-12 w-full rounded-lg bg-emerald-600 px-4 font-bold text-white active:scale-[0.98]">{s.joinActive} {detected}</button>}
     <label className="text-sm font-bold">{s.roomCode}</label><div className="mt-2 flex gap-2"><input value={code} onChange={e=>setCode(e.target.value)} placeholder="ARAL-4A" className="min-h-12 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 uppercase"/><button onClick={()=>join(code)} className="min-h-12 rounded-lg bg-teal-700 px-4 font-bold text-white">{s.joinRoom}</button></div>
     <p className={`mt-4 rounded-lg p-3 text-sm font-bold ${room?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-800'}`}>{room?`${s.connected} • ${room.roomCode}`:`${s.offline} • ${pending} ${s.pending}`}</p>
    </section>
    <section className="surface h-fit rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6">
     <h2 className="mb-4 text-lg font-semibold">{s.offlineTransfer}</h2>
     <div className="mb-4 grid grid-cols-2 rounded-lg border border-slate-200 p-1"><button onClick={()=>setTab('send')} className={`min-h-11 rounded-md text-sm font-bold ${tab==='send'?'bg-teal-700 text-white':''}`}>{s.myProgressQr}</button><button onClick={()=>setTab('receive')} className={`min-h-11 rounded-md text-sm font-bold ${tab==='receive'?'bg-teal-700 text-white':''}`}>{s.importLesson}</button></div>
     {tab==='send'?<div><p className="mb-3 text-sm text-slate-500">{pending} {s.pending}</p><div className="flex min-h-64 items-center justify-center rounded-lg bg-slate-50"><QRCodeSVG value={qr} size={220}/></div></div>:<div><div id="lesson-qr-scanner" className={scanning?'mb-3':''}/><button onClick={scan} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 font-bold text-white"><Camera size={18}/>{s.scanLesson}</button><textarea value={lessonText} onChange={e=>setLessonText(e.target.value)} placeholder={s.pasteLesson} className="mt-3 min-h-24 w-full rounded-lg border border-slate-300 p-3"/><button onClick={importLesson} className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 font-bold"><Upload size={18}/>{s.importLesson}</button></div>}
    </section>
   </div>
  </div>
 )
}
