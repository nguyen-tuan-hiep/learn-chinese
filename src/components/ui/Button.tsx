import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'tinted' | 'fill' | 'ghost' | 'danger' | 'good'
type Size = 'sm' | 'md' | 'lg'

const styles: Record<Variant, string> = {
  primary: 'ink-pill shadow-[0_8px_20px_rgb(21_18_15/0.22)] hover:brightness-125',
  good: 'bg-success text-[#04260f] hover:brightness-110',
  danger: 'bg-danger text-white hover:brightness-110',
  secondary: 'glass text-label hover:brightness-[1.03]',
  tinted: 'bg-tint-soft text-jade hover:brightness-[0.97]',
  /* Quiet grey well, like the select and segmented controls inside settings rows. */
  fill: 'bg-fill text-label hover:brightness-[0.97]',
  ghost: 'text-secondary-label hover:text-label hover:bg-fill',
}
const sizes: Record<Size, string> = {
  sm: 'min-h-9 px-3.5 text-subhead rounded-full',
  md: 'min-h-11 px-5 text-subhead rounded-full',
  lg: 'min-h-12 px-6 text-callout rounded-full',
}
const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-[transform,background-color,opacity,filter] duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] active:scale-[0.96] disabled:active:scale-100 disabled:opacity-50 disabled:saturate-50 disabled:cursor-not-allowed cursor-pointer select-none'

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className = '') => `${base} ${sizes[size]} ${styles[variant]} ${className}`

/** Pill button. `primary` is the solid ink pill; use one per screen. */
export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button {...props} className={buttonClass(variant, size, className)} />
}

/** A router link styled as a button, for navigation actions. */
export function ButtonLink({ variant = 'primary', size = 'md', className = '', ...props }: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link {...props} className={buttonClass(variant, size, className)} />
}

/** Content surface: regular glass. `raised` uses the thicker material to lead the eye. */
export function Card({ className = '', raised = false, ...props }: HTMLAttributes<HTMLDivElement> & { raised?: boolean }) {
  return <div {...props} className={`rounded-card ${raised ? 'glass-thick shadow-lift' : 'glass'} ${className}`} />
}

/** Round glass icon button with a label underneath (like "Daily Cash / Savings / Card Details"). Links when `to` is set. */
export function IconAction({ icon, label, to, onClick, badge, color, soft, className = '' }: { icon: ReactNode; label: string; to?: string; onClick?: () => void; badge?: ReactNode; /** CSS colour of the glyph; `soft` is the circle's wash. Both default to the neutral glass look. */ color?: string; soft?: string; className?: string }) {
  const body = <>
    <span style={{ color, backgroundImage: soft ? `linear-gradient(${soft}, ${soft})` : undefined }} className={`glass relative grid size-14 place-items-center rounded-full transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] group-active:scale-[0.92] [&>svg]:size-6 ${color ? '' : 'text-label'}`}>
      {icon}
      {badge !== undefined && badge !== null && <span className="absolute -top-2 left-1/2 -translate-x-1/2">{typeof badge === 'string' || typeof badge === 'number' ? <span className="inline-flex min-w-5 items-center justify-center whitespace-nowrap rounded-full bg-danger-text px-1.5 py-0.5 text-caption font-bold tabular-nums text-white">{badge}</span> : badge}</span>}
    </span>
    <span className="text-footnote font-medium text-secondary-label">{label}</span>
  </>
  const cls = `group flex min-w-14 cursor-pointer select-none flex-col items-center gap-1.5 ${className}`
  return to ? <Link to={to} className={cls}>{body}</Link> : <button type="button" onClick={onClick} className={cls}>{body}</button>
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border border-separator bg-fill px-1.5 py-0.5 text-[11px] font-mono text-secondary-label">{children}</kbd>
}
