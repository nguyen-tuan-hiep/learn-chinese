import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'good'
type Size = 'sm' | 'md' | 'lg'

const styles: Record<Variant, string> = {
  primary: 'bg-jade text-white dark:text-paper shadow-sm hover:brightness-110 active:brightness-95',
  good: 'bg-jade text-white dark:text-paper hover:brightness-110',
  danger: 'bg-cinnabar text-white dark:text-paper hover:brightness-110',
  secondary: 'bg-surface text-ink border border-line hover:bg-sunken',
  ghost: 'text-muted hover:text-ink hover:bg-sunken',
}
const sizes: Record<Size, string> = {
  sm: 'min-h-9 px-3 text-sm rounded-lg',
  md: 'min-h-11 px-4 text-sm rounded-xl',
  lg: 'min-h-12 px-5 text-base rounded-xl',
}
const base = 'inline-flex items-center justify-center gap-2 font-semibold transition active:scale-[0.97] disabled:active:scale-100 disabled:opacity-50 disabled:saturate-50 disabled:cursor-not-allowed cursor-pointer select-none'

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className = '') => `${base} ${sizes[size]} ${styles[variant]} ${className}`

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button {...props} className={buttonClass(variant, size, className)} />
}

/** A router link styled as a button, for navigation actions. */
export function ButtonLink({ variant = 'primary', size = 'md', className = '', ...props }: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link {...props} className={buttonClass(variant, size, className)} />
}

/** Content surface. `raised` lifts the one element that should lead the eye; the rest stay flat. */
export function Card({ className = '', raised = false, ...props }: HTMLAttributes<HTMLDivElement> & { raised?: boolean }) {
  return <div {...props} className={`rounded-2xl bg-surface ${raised ? 'shadow-card' : 'border border-line'} ${className}`} />
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-line bg-sunken px-1.5 py-0.5 text-[11px] font-mono text-muted">{children}</kbd>
}
