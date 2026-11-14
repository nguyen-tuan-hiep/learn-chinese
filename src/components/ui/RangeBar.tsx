import { motion } from 'framer-motion'
import { spring } from './motion'

/** Capsule progress bar: a dim track with an ink fill. `value` is 0–1. */
export function RangeBar({ value, className = '', fill = 'var(--color-label)' }: { value: number; className?: string; fill?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className={`h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/15 ${className}`}>
    <motion.div className="h-full rounded-full" style={{ background: fill }}
      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={spring.smooth} />
  </div>
}
