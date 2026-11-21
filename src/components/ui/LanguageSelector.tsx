import { ChevronDown, Languages } from 'lucide-react'
import type { UiLang } from '../../types'

export function LanguageSelector({ lang, onChange, compact=false }: { lang:UiLang; onChange:(lang:UiLang)=>void; compact?:boolean }) {
  return (
    <label className="language-selector surface relative flex h-11 items-center rounded-lg border border-slate-200 bg-white px-2.5 text-slate-700">
      <Languages size={18} className="shrink-0"/>
      <span className="sr-only">Language</span>
      <select
        value={lang}
        aria-label="Language"
        onChange={(event)=>onChange(event.target.value as UiLang)}
        className={`${compact?'w-11 sm:w-[112px]':'w-[112px]'} h-11 appearance-none bg-transparent pl-1 pr-1 text-sm font-semibold text-inherit outline-none sm:pl-2 sm:pr-6`}
      >
        <option value="en">English</option>
        <option value="ceb">Cebuano</option>
        <option value="tl">Tagalog</option>
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2 hidden sm:block"/>
      {compact && <span className="absolute inset-0 sm:hidden" aria-hidden="true"/>}
    </label>
  )
}
