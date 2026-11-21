import type { ReactNode } from 'react'

interface Props {
  title?: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
  as?: 'section'|'article'|'div'
}

export function Card({ title, subtitle, action, children, className='', as='section' }: Props) {
  const Component = as
  return (
    <Component className={`surface rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(15,23,42,.04),0_1px_2px_rgba(15,23,42,.02)] ${className}`}>
      {(title || subtitle || action) && <header className="mb-5 flex items-start justify-between gap-4"><div>{title && <h2 className="font-semibold tracking-tight">{title}</h2>} {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>{action && <div className="shrink-0">{action}</div>}</header>}
      {children}
    </Component>
  )
}
