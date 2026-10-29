import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'good'

const styles: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:opacity-90',
  good: 'bg-jade text-white hover:opacity-90',
  danger: 'bg-cinnabar text-white hover:opacity-90',
  secondary: 'bg-surface text-ink border border-line hover:bg-sunken',
  ghost: 'text-muted hover:text-ink hover:bg-sunken',
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none ${styles[variant]} ${className}`}
    />
  )
}

export function Card({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`rounded-2xl border border-line bg-surface ${className}`} />
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded border border-line bg-sunken px-1.5 py-0.5 text-[11px] font-mono text-muted">{children}</kbd>
}
