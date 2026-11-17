import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { CourseModel } from '@/lib/courseModel'
import { RangeBar } from '@/components/ui/RangeBar'
import { NowBadge } from '@/components/ui/NowBadge'
import { riseIn } from '@/components/ui/motion'
import { levelBar, levelColor } from '@/lib/palette'
import type { CSSProperties } from 'react'

/** HSK levels as glass tiles: the level's colour glows up from the bottom under a grid of small glass squares; name, lessons done and a bar. */
export function JourneyList({ levels, version, done, total }: Pick<CourseModel, 'levels' | 'version'> & { done: number; total: number }) {
  return <section aria-label="HSK journey">
    <div className="mb-3.5 flex items-baseline justify-between gap-2">
      <h2 className="font-display text-title3 font-extrabold">HSK journey</h2>
      <span className="text-footnote tabular-nums text-secondary-label">{done}/{total} lessons</span>
    </div>
    <motion.ul className="grid grid-cols-2 gap-3.5 min-[560px]:grid-cols-3 lg:grid-cols-6" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}>
      {levels.map((level) => {
        const count = level.total
        const now = level.lessons.some((l) => l.status === 'current')
        return <motion.li key={level.id} variants={riseIn}>
          <Link to={`/lesson?level=${level.level}`} style={{ '--tint': levelColor(level.level) } as CSSProperties}
            className={`on-light glass-card glow-tiles relative grid min-h-[5.5rem] gap-2.5 rounded-[1.75rem] p-4 ${now ? 'ring-2 ring-[#15120f]' : ''} transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-0.5 active:scale-[0.96] sm:px-5`}>
            {now && <NowBadge className="absolute -top-2.5 right-3 px-2.5 py-0.5" />}
            <span className="flex items-baseline justify-between gap-2">
              <span className="font-display text-callout font-extrabold">{level.shortTitle}</span>
              <span className="text-caption font-semibold tabular-nums opacity-70">{level.done}/{count}</span>
            </span>
            <RangeBar value={count ? level.done / count : 0} className="h-1.5 bg-[color-mix(in_srgb,var(--tint)_55%,white)]!" fill={levelBar(level.level)} />
            <span className="-mt-1 text-caption tabular-nums opacity-70">{level.wordsLearned}/{level.words.toLocaleString('en-US')} words</span>
          </Link>
        </motion.li>
      })}
    </motion.ul>
  </section>
}
