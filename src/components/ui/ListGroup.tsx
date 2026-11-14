import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/**
 * iOS "inset grouped" container: a rounded glass block whose direct children are rows separated by hairlines.
 * `clip` (default) hides anything poking out of the rounded corners; turn it off when rows contain popover menus.
 */
export function ListGroup({ className = '', clip = true, children }: { className?: string; clip?: boolean; children: ReactNode }) {
  return <div className={`glass rounded-card divide-y divide-separator ${clip ? 'overflow-hidden' : '[&>:first-child]:rounded-t-[inherit] [&>:last-child]:rounded-b-[inherit]'} ${className}`}>{children}</div>
}

interface RowProps {
  /** Router path: the row renders as a link. */
  to?: string
  /** Click handler: the row renders as a button (ignored when `to` is set). */
  onClick?: () => void
  /** Content before the text, e.g. a status circle or icon. */
  leading?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  /** Content after the text, e.g. a value, badge or chevron. */
  trailing?: ReactNode
  className?: string
  'aria-current'?: 'step' | 'page' | boolean
  'aria-label'?: string
  title_attr?: string
}

/** One row of a ListGroup: at least 44px high, press highlight, link / button / plain div depending on props. */
export function ListRow({ to, onClick, leading, title, subtitle, trailing, className = '', title_attr, ...aria }: RowProps) {
  const interactive = !!(to || onClick)
  const cls = `flex min-h-11 w-full min-w-0 items-center gap-3 px-4 py-3 text-left ${interactive ? 'cursor-pointer transition-colors active:bg-fill' : ''} ${className}`
  const body = <>
    {leading}
    <span className="min-w-0 flex-1">
      <span className="block min-w-0 text-body">{title}</span>
      {subtitle && <span className="block min-w-0 truncate text-footnote text-secondary-label">{subtitle}</span>}
    </span>
    {trailing}
  </>
  if (to) return <Link to={to} title={title_attr} {...aria} className={cls}>{body}</Link>
  if (onClick) return <button type="button" onClick={onClick} title={title_attr} {...aria} className={cls}>{body}</button>
  return <div title={title_attr} {...aria} className={cls}>{body}</div>
}
