import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary'|'secondary'|'outline'|'ghost'|'danger'
  icon?: ReactNode
  primaryTouch?: boolean
}

export function Button({ variant='primary', icon, primaryTouch=false, className='', children, ...props }: Props) {
  const variants = {
    primary: 'border border-teal-700 bg-teal-700 text-white hover:bg-teal-800',
    secondary: 'border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100',
    outline: 'surface border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50',
    ghost: 'border border-transparent bg-transparent text-slate-700 hover:bg-slate-100',
    danger: 'border border-rose-600 bg-rose-600 text-white hover:border-rose-700 hover:bg-rose-700'
  }
  return (
    <button {...props} className={`inline-flex ${primaryTouch?'min-h-12':'min-h-11'} items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold leading-none shadow-[0_1px_2px_rgba(15,23,42,.04)] active:scale-[0.98] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}>
      {icon}<span>{children}</span>
    </button>
  )
}
