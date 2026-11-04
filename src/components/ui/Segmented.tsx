import { useEffect, useId, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface SegmentOption<T extends string> { value: T; label: ReactNode }

/**
 * The one horizontal section picker used across pages (Phát âm tabs, Ôn tập order, Bộ thủ filters).
 * `fill` stretches options to equal widths; otherwise the bar scrolls sideways and keeps the chosen one in view.
 */
export function Segmented<T extends string>({ options, value, onChange, label, fill = false, className = '' }: {
  options: readonly SegmentOption<T>[]; value: T; onChange: (value: T) => void; label: string; fill?: boolean; className?: string
}) {
  const pill = useId()
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (fill) return
    // Scroll only the bar itself: scrollIntoView would also move the page (sideways or down).
    const el = bar.current
    const on = el?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!el || !on || el.scrollWidth <= el.clientWidth) return
    el.scrollTo({ left: on.offsetLeft - (el.clientWidth - on.offsetWidth) / 2, behavior: 'smooth' })
  }, [value, fill])
  return <div ref={bar} role="group" aria-label={label}
    className={`scrollbar-none relative flex gap-1 rounded-xl bg-sunken p-1 ${fill ? '' : 'overflow-x-auto'} ${className}`}>
    {options.map((option) => {
      const on = option.value === value
      return <button key={option.value} type="button" aria-pressed={on} onClick={() => onChange(option.value)}
        className={`relative min-h-10 cursor-pointer whitespace-nowrap rounded-lg px-3.5 text-sm font-semibold transition-colors ${fill ? 'flex-1' : 'shrink-0'} ${on ? 'text-ink' : 'text-muted hover:text-ink'}`}>
        {on && <motion.span layoutId={pill} transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }} className="absolute inset-0 rounded-lg bg-surface shadow-card" />}
        <span className="relative">{option.label}</span>
      </button>
    })}
  </div>
}
