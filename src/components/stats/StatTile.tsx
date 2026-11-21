import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { RangeBar } from '@/components/ui/RangeBar'
import { riseIn } from '@/components/ui/motion'

/**
 * One metric as a pastel card (like the HSK journey tiles): label and icon on top, a big number,
 * then a white bar with the percentage when it counts toward a total, or a caption.
 */
export function StatTile({ icon, label, value, total, unit, caption, ring }: {
  icon: ReactNode; label: string; value: number; total?: number; unit?: string; caption?: string
  /** 0..1 progress shown as the bar. */ ring?: number
}) {
  const pct = ring === undefined ? null : Math.round(Math.min(1, Math.max(0, ring)) * 100)
  return <motion.div variants={riseIn} className="min-w-0">
    <section aria-label={label}
      className="on-pastel glass-card flex h-full min-h-[10.5rem] flex-col rounded-[2rem] p-4 text-label sm:rounded-[2.25rem] sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 pt-1 text-footnote font-semibold leading-snug text-[var(--color-secondary-label)] sm:text-subhead">{label}</p>
        <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-fill text-label">{icon}</span>
      </div>
      <p className="mt-auto pt-3 font-display text-[2.25rem] leading-none font-black tracking-tight tabular-nums sm:text-[2.75rem]">
        <AnimatedNumber countUp value={value} format={(n) => Math.round(n).toLocaleString('en-US')} />
        {total !== undefined && <span className="text-title3 font-extrabold text-[var(--color-secondary-label)]">/{total.toLocaleString('en-US')}</span>}
        {unit && <span className="text-callout font-bold text-[var(--color-secondary-label)]"> {unit}</span>}
      </p>
      {pct !== null
        ? <div className="mt-3 flex items-center gap-2.5">
          <RangeBar value={ring ?? 0} className="h-2 flex-1" />
          <span className="shrink-0 text-caption font-bold tabular-nums">{pct}%</span>
        </div>
        : null}
      {caption && <p className={`${pct !== null ? 'mt-1.5' : 'mt-3'} text-caption font-medium text-pretty text-[var(--color-secondary-label)]`}>{caption}</p>}
    </section>
  </motion.div>
}
