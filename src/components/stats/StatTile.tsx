import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Glass } from '@/components/ui/Glass'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { ProgressRing } from '@/components/ui/Progress'
import { riseIn } from '@/components/ui/motion'

/** One glass metric tile: icon in a tinted circle, big number, caption; optional progress ring. */
export function StatTile({ icon, label, value, total, unit, caption, ring, color = 'var(--color-tint)' }: {
  icon: ReactNode; /** Hue of the icon square and the ring. */ color?: string; label: string; value: number; total?: number; unit?: string; caption?: string; ring?: number
}) {
  return <motion.div variants={riseIn} className="min-w-0">
    <Glass className="flex h-full min-h-[148px] flex-col p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span aria-hidden="true" style={{ color, background: `color-mix(in srgb, ${color} 16%, transparent)` }} className="grid size-9 place-items-center rounded-[10px]">{icon}</span>
        {ring !== undefined && <ProgressRing value={ring} size={36} stroke={4} color={color} to={`color-mix(in srgb, ${color} 60%, white)`} label="" />}
      </div>
      <p className="mt-auto pt-4 text-title1 leading-none">
        <AnimatedNumber value={value} format={(n) => Math.round(n).toLocaleString('vi-VN')} />
        {total !== undefined && <span className="text-title3 text-secondary-label">/{total.toLocaleString('vi-VN')}</span>}
        {unit && <span className="text-subhead text-secondary-label"> {unit}</span>}
      </p>
      <p className="mt-1.5 truncate text-footnote text-secondary-label">{label}</p>
      {caption && <p className="truncate text-caption text-tertiary-label">{caption}</p>}
    </Glass>
  </motion.div>
}
