import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { spring } from './motion'

export interface SegmentOption<T extends string> { value: T; label: ReactNode }

/**
 * The one horizontal section picker used across pages (Pronunciation tabs, Review order, Radicals filters).
 * `fill` stretches options to equal widths; otherwise the bar scrolls sideways and keeps the chosen one in view.
 * The pill is measured and animated with x/width (no shared `layoutId`): a layoutId pill inside a closing
 * Sheet kept AnimatePresence from ever finishing its exit, leaving an invisible overlay over the page.
 */
export function Segmented<T extends string>({ options, value, onChange, label, fill = false, className = '' }: {
  options: readonly SegmentOption<T>[]; value: T; onChange: (value: T) => void; label: string; fill?: boolean; className?: string
}) {
  const bar = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState<{ x: number; width: number } | null>(null)
  const first = useRef(true)

  useLayoutEffect(() => {
    const el = bar.current
    if (!el) return
    const measure = () => {
      const on = el.querySelector<HTMLElement>('[aria-pressed="true"]')
      setPill(on ? { x: on.offsetLeft, width: on.offsetWidth } : null)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, options.length])
  useEffect(() => { if (pill) first.current = false }, [pill])

  useEffect(() => {
    if (fill) return
    // Scroll only the bar itself: scrollIntoView would also move the page (sideways or down).
    const el = bar.current
    const on = el?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!el || !on || el.scrollWidth <= el.clientWidth) return
    el.scrollTo({ left: on.offsetLeft - (el.clientWidth - on.offsetWidth) / 2, behavior: 'smooth' })
  }, [value, fill])

  return <div ref={bar} role="group" aria-label={label}
    className={`scrollbar-none relative flex gap-1 rounded-full bg-fill p-1 shadow-[inset_0_0_0_1px_var(--color-edge)] ${fill ? '' : 'overflow-x-auto'} ${className}`}>
    {pill && <motion.span aria-hidden="true" initial={false} animate={{ x: pill.x, width: pill.width }}
      transition={first.current ? { duration: 0 } : spring.snappy}
      className="pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-[#15120f] dark:bg-[#f3eee4]" />}
    {options.map((option) => {
      const on = option.value === value
      return <button key={option.value} type="button" aria-pressed={on} onClick={() => onChange(option.value)}
        className={`relative min-h-10 cursor-pointer whitespace-nowrap rounded-full px-4 text-subhead font-semibold transition-colors ${fill ? 'flex-1' : 'shrink-0'} ${on ? 'text-white dark:text-[#15120f]' : 'text-secondary-label hover:text-label'}`}>
        <span className="relative">{option.label}</span>
      </button>
    })}
  </div>
}
