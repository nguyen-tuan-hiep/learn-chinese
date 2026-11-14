import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

interface HeaderProps { eyebrow?: string; title: string; children?: ReactNode; aside?: ReactNode }

/** Page title block shared by every top-level page: eyebrow, large title, one line of context, optional side content. */
export function PageHeader({ eyebrow, title, children, aside }: HeaderProps) {
  return <header className="flex flex-wrap items-end justify-between gap-4">
    <div className="min-w-0 max-w-2xl">
      {eyebrow && <p className="text-subhead font-medium text-secondary-label">{eyebrow}</p>}
      <h1 className="mt-1 text-[2rem] leading-[1.15] font-display font-black tracking-tight text-balance sm:text-[3.25rem] sm:leading-[1.1]">{title}</h1>
      {children && <div className="mt-2 text-callout text-secondary-label sm:text-body">{children}</div>}
    </div>
    {aside}
  </header>
}

/**
 * PageHeader whose title shrinks and fades as it scrolls under the sticky header.
 * Only transform and opacity change, so the layout does not move.
 */
export function LargeTitle({ eyebrow, title, children, aside }: HeaderProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 56px', 'end 56px'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82])
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.6, 0])
  return <header className="flex flex-wrap items-end justify-between gap-4">
    <motion.div ref={ref} style={reduce ? undefined : { scale, opacity, transformOrigin: 'left top' }} className="min-w-0 max-w-2xl">
      {eyebrow && <p className="text-subhead font-medium text-secondary-label">{eyebrow}</p>}
      <h1 className="mt-1 text-[2rem] leading-[1.15] font-display font-black tracking-tight text-balance sm:text-[3.25rem] sm:leading-[1.1]">{title}</h1>
      {children && <div className="mt-2 text-callout text-secondary-label sm:text-body">{children}</div>}
    </motion.div>
    {aside}
  </header>
}
