import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { partColor } from '@/lib/palette'
import { spring } from '@/components/ui/motion'

/** Opening row of a lesson part: icon in a rounded square of the part's hue, title and a one-line summary. */
export function PartTitle({ part, icon: Icon, title, summary, id }: {
  part: string; icon: LucideIcon; title: string; summary?: ReactNode; id?: string
}) {
  return <div className="flex items-center gap-3.5">
    <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--glass-regular)] text-label shadow-card ring-1 ring-separator">
      <Icon className="size-6" />
    </span>
    <div className="min-w-0">
      <h2 id={id} className="font-display text-title2 font-extrabold text-label">{title}</h2>
      {summary && <p className="text-subhead text-secondary-label tabular-nums">{summary}</p>}
    </div>
  </div>
}

/** Slim progress bar in a part's hue. `value` is 0–1. */
export function PartBar({ part, value, label, className = '' }: { part: string; value: number; label: string; className?: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className={`h-1.5 overflow-hidden rounded-full bg-fill ${className}`}>
    <motion.div className="h-full rounded-full" style={{ background: partColor(part) }} initial={false} animate={{ width: `${pct}%` }} transition={spring.smooth} />
  </div>
}

/** Small caps-free section label inside a panel. */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-footnote font-semibold text-secondary-label ${className}`}>{children}</p>
}
