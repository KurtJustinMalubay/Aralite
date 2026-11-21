import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export function Modal({ open, title, onClose, children, footer }: { open:boolean; title:string; onClose:()=>void; children:ReactNode; footer?:ReactNode }) {
  if (!open) return null
  return <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/30 p-4" role="presentation" onMouseDown={(event)=>{if(event.target===event.currentTarget)onClose()}}><section role="dialog" aria-modal="true" aria-label={title} className="surface animate-pop-in max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-lg"><header className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold tracking-tight">{title}</h2><button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-slate-100" aria-label="Close dialog"><X size={18}/></button></header>{children}{footer && <footer className="mt-5">{footer}</footer>}</section></div>
}
