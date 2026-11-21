import { useEffect, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { EASE } from './motion'

type Tone = 'jade' | 'white' | 'gradient'

/** Thin horizontal progress track. `value` is 0–1. It fills from empty when it first appears. */
export function ProgressBar({ value, className = '', tone = 'jade', color }: { value: number; className?: string; tone?: Tone; color?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  const fill = color ? '' : tone === 'white' ? 'bg-white' : tone === 'gradient' ? '' : 'bg-tint'
  return <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className={`h-2 overflow-hidden rounded-full ${tone === 'white' ? 'bg-white/25' : 'bg-fill'} ${className}`}>
    <motion.div className={`h-full rounded-full ${fill}`} style={color ? { background: color } : tone === 'gradient' ? { background: 'var(--bar-gradient)' } : undefined} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7, ease: EASE }} />
  </div>
}

/** Circular progress with a label (or `children`) in the middle. `value` is 0–1.
 *  Like the bars, the fill is a gradient that runs along the arc: `from` at the start, `to` at the tip. */
export function ProgressRing({ value, size = 64, stroke = 6, label, from = 'var(--bar-from)', to = 'var(--bar-to)', className = '', children }: {
  value: number; size?: number; stroke?: number; label?: string; from?: string; to?: string; className?: string
  /** Shown in the middle instead of `label` (decorative; the ring's own label carries the value). */ children?: ReactNode
}) {
  const v = Math.min(1, Math.max(0, value))
  const p = useMotionValue(0)
  useEffect(() => { const a = animate(p, v, { duration: 0.9, ease: EASE }); return a.stop }, [p, v])
  // Gradient spans only the filled arc, so the tip is always the deep colour (as a bar's right end is).
  const fill = useTransform(p, (x) => `conic-gradient(${from} 0turn, ${to} ${x}turn, transparent ${x}turn)`)
  const tip = useTransform(p, (x) => `rotate(${x}turn)`)
  const ring = `radial-gradient(farthest-side, transparent calc(100% - ${stroke}px), #000 calc(100% - ${stroke}px + 0.5px))`
  const cap = { width: stroke, height: stroke, left: `calc(50% - ${stroke / 2}px)` }
  return <span className={`relative inline-grid shrink-0 place-items-center ${className}`} style={{ width: size, height: size }} role="img" aria-label={label ? `${label}, ${Math.round(v * 100)}%` : `${Math.round(v * 100)}%`}>
    <span aria-hidden="true" className="absolute inset-0 rounded-full bg-(--seg-track)" style={{ mask: ring, WebkitMask: ring }} />
    {/* Hidden at 0 so the round caps do not leave a dot. */}
    <motion.span aria-hidden="true" className="absolute inset-0" animate={{ opacity: v > 0 ? 1 : 0 }}>
      <motion.span className="absolute inset-0 rounded-full" style={{ background: fill, mask: ring, WebkitMask: ring }} />
      <span className="absolute top-0 rounded-full" style={{ ...cap, background: from }} />
      <motion.span className="absolute inset-0" style={{ transform: tip }}><span className="absolute top-0 rounded-full" style={{ ...cap, background: to }} /></motion.span>
    </motion.span>
    {children ? <span aria-hidden="true" className="absolute tabular-nums">{children}</span>
      : label && <span aria-hidden="true" className="absolute text-caption font-bold tabular-nums">{label}</span>}
  </span>
}
