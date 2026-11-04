import { motion } from 'framer-motion'
import { EASE } from './motion'

/** Thin horizontal progress track. `value` is 0–1. It fills from empty when it first appears. */
export function ProgressBar({ value, className = '', tone = 'jade' }: { value: number; className?: string; tone?: 'jade' | 'white' }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className={`h-2 overflow-hidden rounded-full ${tone === 'white' ? 'bg-white/25' : 'bg-sunken'} ${className}`}>
    <motion.div className={`h-full rounded-full ${tone === 'white' ? 'bg-white' : 'bg-jade'}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: EASE }} />
  </div>
}

/** Circular progress with a label in the middle. `value` is 0–1. */
export function ProgressRing({ value, size = 64, stroke = 6, label, tone = 'jade', className = '' }: {
  value: number; size?: number; stroke?: number; label?: string; tone?: 'jade' | 'white'; className?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.min(1, Math.max(0, value))
  return <span className={`relative inline-grid shrink-0 place-items-center ${className}`} style={{ width: size, height: size }} role="img" aria-label={label ? `${label}, ${Math.round(v * 100)}%` : `${Math.round(v * 100)}%`}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={tone === 'white' ? 'stroke-white/25' : 'stroke-sunken'} />
      {/* Hidden at 0 so the round cap does not leave a dot. */}
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c}
        initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - v), opacity: v > 0 ? 1 : 0 }} transition={{ duration: 0.9, ease: EASE }}
        className={tone === 'white' ? 'stroke-white' : 'stroke-jade'} />
    </svg>
    {label && <span aria-hidden="true" className="absolute text-xs font-bold tabular-nums">{label}</span>}
  </span>
}
