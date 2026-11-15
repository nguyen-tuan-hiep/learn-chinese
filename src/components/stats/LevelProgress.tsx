import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Glass } from '@/components/ui/Glass'
import { RangeBar } from '@/components/ui/RangeBar'
import { spring } from '@/components/ui/motion'
import { levelBar, levelSoft } from '@/lib/palette'
import type { CourseLevel } from '@/lib/courseModel'

/** One list block, a row per HSK level: pastel level badge, lessons and words done, and a bar in the level's own gradient. */
export function LevelProgress({ levels, className = '' }: { levels: CourseLevel[]; className?: string }) {
  return <section aria-labelledby="level-progress" className={`flex flex-col ${className}`}>
    <h2 id="level-progress" className="mb-3.5 font-display text-title3 font-extrabold">Progress by level</h2>
    <Glass className="flex flex-1 flex-col justify-center gap-1 p-2 sm:p-3">
      {levels.map((lv, i) => {
        const ratio = lv.total ? lv.done / lv.total : 0
        return <motion.div key={lv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring.smooth, delay: 0.15 + i * 0.05 }}>
          <Link to={`/lesson?level=${lv.level}`} aria-label={`${lv.shortTitle}: ${lv.done} of ${lv.total} lessons, ${lv.wordsLearned} of ${lv.words} words`}
            className="flex items-center gap-3.5 rounded-[1.5rem] px-3 py-3 transition-colors hover:bg-fill active:bg-fill sm:gap-4">
            <span aria-hidden="true" style={{ background: levelSoft(lv.level) }}
              className="on-pastel grid size-12 shrink-0 place-items-center rounded-full font-display text-callout font-black text-[#15120f]">{lv.level}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-display text-callout font-extrabold">{lv.shortTitle}</span>
                <span className="text-subhead tabular-nums"><b className="font-bold">{lv.done}</b><span className="text-secondary-label">/{lv.total} lessons</span></span>
              </span>
              <RangeBar value={ratio} className="mt-2 h-2" fill={levelBar(lv.level)} />
              <span className="mt-1.5 block text-caption tabular-nums text-secondary-label">{lv.wordsLearned.toLocaleString('en-US')}/{lv.words.toLocaleString('en-US')} words · {Math.round(ratio * 100)}%</span>
            </span>
          </Link>
        </motion.div>
      })}
    </Glass>
  </section>
}
