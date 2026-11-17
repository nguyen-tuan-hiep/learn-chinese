import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { RangeBar } from '@/components/ui/RangeBar'
import { spring } from '@/components/ui/motion'
import { levelColor } from '@/lib/palette'
import type { CourseLevel } from '@/lib/courseModel'

/** One glass tile per HSK level (same look as Home's journey): the level's share done as a big number, a bar, and the counts. */
export function LevelProgress({ levels, className = '' }: { levels: CourseLevel[]; className?: string }) {
  return <section aria-labelledby="level-progress" className={className}>
    <h2 id="level-progress" className="mb-3.5 font-display text-title3 font-extrabold">Progress by level</h2>
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]">
      {levels.map((lv, i) => {
        const ratio = lv.total ? lv.done / lv.total : 0
        return <motion.div key={lv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring.smooth, delay: 0.15 + i * 0.05 }}>
          <Link to={`/lesson?level=${lv.level}`} aria-label={`${lv.shortTitle}: ${lv.done} of ${lv.total} lessons, ${lv.wordsLearned} of ${lv.words} words`}
            style={{ '--tint': levelColor(lv.level) } as CSSProperties}
            className="on-light glass-card glow-tiles relative grid gap-3 rounded-[1.75rem] p-4 transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97] sm:p-5">
            <span className="flex items-baseline justify-between gap-2">
              <span className="font-display text-callout font-extrabold">{lv.shortTitle}</span>
              <span className="font-display text-title2 leading-none font-black tabular-nums">{Math.round(ratio * 100)}<span className="text-footnote font-bold opacity-60">%</span></span>
            </span>
            <RangeBar value={ratio} className="h-1.5 bg-[color-mix(in_srgb,var(--tint)_55%,white)]!" fill="var(--deep)" />
            <span className="text-caption tabular-nums text-secondary-label">{lv.done}/{lv.total} lessons · {lv.wordsLearned.toLocaleString('en-US')}/{lv.words.toLocaleString('en-US')} words</span>
          </Link>
        </motion.div>
      })}
    </div>
  </section>
}
