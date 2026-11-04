import type { CSSProperties, ReactNode } from 'react'

/**
 * One line of placeholder text. Put the real text classes on it (text-sm, text-2xl, mt-1…):
 * the wrapper then keeps the real line height, so nothing moves when the text arrives.
 */
export function Line({ className = '', w = '8rem', light = false }: { className?: string; w?: CSSProperties['width']; light?: boolean }) {
  return <span aria-hidden="true" className={`block ${className}`}>
    <span className={`${light ? 'skeleton-light' : 'skeleton'} inline-block h-[0.7em] max-w-full rounded-full align-middle`} style={{ width: w }} />
  </span>
}

/** A placeholder block (button, card, image). Size it with the same classes as the real element. */
export function Block({ className = '', light = false, style }: { className?: string; light?: boolean; style?: CSSProperties }) {
  return <span aria-hidden="true" style={style} className={`${light ? 'skeleton-light' : 'skeleton'} block ${className}`} />
}

/** Wrapper for a whole page placeholder: announced once to screen readers, fades in after a short delay. */
export function SkeletonPage({ label, className = '', children }: { label: string; className?: string; children: ReactNode }) {
  return <div role="status" aria-busy="true" className={`skeleton-page ${className}`}>
    <span className="sr-only">{label}</span>
    {children}
  </div>
}

/**
 * Placeholder drawn over sample text: the text is invisible, so the bar wraps onto the same
 * number of lines as the real text would. Use it inside an element with the real text classes.
 */
export function Text({ children, light = false }: { children: string; light?: boolean }) {
  return <span aria-hidden="true" className={`${light ? 'skeleton-light' : 'skeleton'} rounded-md text-transparent [box-decoration-break:clone] [-webkit-box-decoration-break:clone]`}>{children}</span>
}
