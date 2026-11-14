import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { CourseModel } from '@/lib/courseModel'
import { RangeBar } from '@/components/ui/RangeBar'
import { NowBadge } from '@/components/ui/NowBadge'
import { levelSoft } from '@/lib/palette'
import { riseIn } from '@/components/ui/motion'

/** HSK levels as pastel tiles: name, lessons done and a bar. */
export function JourneyList({ levels, version, done, total }: Pick<CourseModel, 'levels' | 'version'> & { done: number; total: number }) {
  return <section aria-label="Hành trình HSK">
    <div className="mb-3.5 flex items-baseline justify-between gap-2">
      <h2 className="font-display text-title3 font-extrabold">Hành trình HSK</h2>
      <span className="text-footnote tabular-nums text-secondary-label">{done}/{total} bài</span>
    </div>
    <motion.ul className="grid grid-cols-2 gap-3.5 min-[560px]:grid-cols-3 lg:grid-cols-6" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}>
      {levels.map((level) => {
        const count = level.total + level.pending
        const now = level.lessons.some((l) => l.status === 'current')
        return <motion.li key={level.id} variants={riseIn}>
          <Link to={version === '3.0' ? `/lesson?level=${level.level}` : `/lesson?stage=${level.id}`} style={{ background: levelSoft(level.level) }}
            className={`relative grid min-h-[5.5rem] gap-2.5 rounded-3xl p-4 text-label ${now ? 'ring-2 ring-[#15120f] dark:ring-[#f3eee4]' : ''} transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-0.5 active:scale-[0.96] sm:px-5`}>
            {now && <NowBadge className="absolute -top-2.5 right-3 px-2.5 py-0.5" />}
            <span className="flex items-baseline justify-between gap-2">
              <span className="font-display text-callout font-extrabold">{level.shortTitle}</span>
              <span className="text-caption font-semibold tabular-nums opacity-70">{level.done}/{count}</span>
            </span>
            <RangeBar value={count ? level.done / count : 0} className="h-1.5 bg-white! dark:bg-white/15!" />
          </Link>
        </motion.li>
      })}
    </motion.ul>
  </section>
}
