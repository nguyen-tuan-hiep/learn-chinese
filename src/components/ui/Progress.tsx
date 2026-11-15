import { useId, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EASE } from './motion'

type Tone = 'jade' | 'white' | 'gradient'

/** Thin horizontal progress track. `value` is 0–1. It fills from empty when it first appears. */
export function ProgressBar({ value, className = '', tone = 'jade', color }: { value: number; className?: string; tone?: Tone; color?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  const fill = color ? '' : tone === 'white' ? 'bg-white' : tone === 'gradient' ? '' : 'bg-tint'
  return <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className={`h-2 overflow-hidden rounded-full ${tone === 'white' ? 'bg-white/25' : 'bg-fill'} ${className}`}>
    <motion.div className={`h-full rounded-full ${fill}`} style={color ? { background: color } : tone === 'gradient' ? { background: 'var(--accent-gradient)' } : undefined} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: EASE }} />
  </div>
}

/** Circular progress with a label (or `children`) in the middle. `value` is 0–1. */
export function ProgressRing({ value, size = 64, stroke = 6, label, tone = 'jade', color, to, className = '', children }: {
  value: number; size?: number; stroke?: number; label?: string; tone?: Tone; color?: string; /** With `color`, the ring fades from `color` to `to`. */ to?: string; className?: string
  /** Shown in the middle instead of `label` (decorative; the ring's own label carries the value). */ children?: ReactNode
}) {
  const gradientId = useId()
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.min(1, Math.max(0, value))
  return <span className={`relative inline-grid shrink-0 place-items-center ${className}`} style={{ width: size, height: size }} role="img" aria-label={label ? `${label}, ${Math.round(v * 100)}%` : `${Math.round(v * 100)}%`}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
      {to && color && <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" style={{ stopColor: color }} /><stop offset="100%" style={{ stopColor: to }} /></linearGradient>
      </defs>}
      {tone === 'gradient' && !color && <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-tint-text)" /><stop offset="100%" stopColor="var(--color-tint)" />
        </linearGradient>
      </defs>}
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={tone === 'white' ? 'stroke-white/25' : 'stroke-fill'} />
      {/* Hidden at 0 so the round cap does not leave a dot. */}
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c}
        stroke={color ? (to ? `url(#${gradientId})` : color) : (tone === 'gradient' ? `url(#${gradientId})` : undefined)}
        initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - v), opacity: v > 0 ? 1 : 0 }} transition={{ duration: 0.9, ease: EASE }}
        className={color ? '' : tone === 'white' ? 'stroke-white' : tone === 'jade' ? 'stroke-tint' : ''} />
    </svg>
    {children ? <span aria-hidden="true" className="absolute tabular-nums">{children}</span>
      : label && <span aria-hidden="true" className="absolute text-caption font-bold tabular-nums">{label}</span>}
  </span>
}
