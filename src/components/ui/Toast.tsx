import { CheckCircle2, X } from 'lucide-react'
export interface ToastItem { id:number; message:string }
export function Toast({ item, onClose }: { item:ToastItem; onClose:(id:number)=>void }) {
  return <div role="status" className="surface animate-pop-in fixed bottom-20 right-4 z-[100] flex min-h-14 max-w-[calc(100%-2rem)] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg md:bottom-5"><CheckCircle2 className="shrink-0 text-emerald-600" size={20}/><span className="flex-1 text-sm font-bold">{item.message}</span><button onClick={()=>onClose(item.id)} className="flex h-10 w-10 items-center justify-center" aria-label="Close notification"><X size={16}/></button></div>
}
