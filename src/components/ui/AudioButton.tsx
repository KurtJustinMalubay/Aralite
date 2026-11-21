import { useEffect, useState } from 'react'
import { Square, Volume2 } from 'lucide-react'
import { UI_STRINGS } from '../../data/uiStrings'

export function AudioButton({ text, lang, compact=false }: { text:string; lang:'ceb'|'tl'|'en'; compact?:boolean }) {
  const s=UI_STRINGS[lang]
  const [speaking,setSpeaking]=useState(false)
  useEffect(()=>()=>window.speechSynthesis.cancel(),[])
  const toggle=()=>{
    if(speaking){window.speechSynthesis.cancel();setSpeaking(false);return}
    window.speechSynthesis.cancel()
    const utterance=new SpeechSynthesisUtterance(text)
    utterance.lang=lang==='ceb'?'ceb-PH':lang==='tl'?'tl-PH':'en-PH'
    utterance.onend=()=>setSpeaking(false)
    utterance.onerror=()=>setSpeaking(false)
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }
  return <button type="button" onClick={toggle} className={`surface inline-flex ${compact?'min-h-11':'min-h-12'} items-center justify-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 font-bold text-teal-800 active:scale-[0.98] transition-all duration-150`}>
    {speaking?<><Square size={18}/><span className="audio-bars" aria-hidden="true"><span/><span/><span/></span><span>{s.stop}</span></>:<><Volume2 size={18}/><span>{s.listen}</span></>}
  </button>
}
