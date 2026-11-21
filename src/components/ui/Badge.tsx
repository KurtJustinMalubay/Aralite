import type { ReactNode } from 'react'

export function Badge({ tone='neutral', children }: { tone?:'neutral'|'teal'|'emerald'|'amber'; children:ReactNode }) {
  const styles = {
    neutral:'bg-slate-100 text-slate-700',
    teal:'border border-teal-200 bg-teal-50 text-teal-800',
    emerald:'border border-emerald-200 bg-emerald-50 text-emerald-800',
    amber:'border border-amber-200 bg-amber-50 text-amber-800'
  }
  return <span className={`inline-flex min-h-7 items-center rounded-full px-3 py-1 text-xs font-bold ${styles[tone]}`}>{children}</span>
}
