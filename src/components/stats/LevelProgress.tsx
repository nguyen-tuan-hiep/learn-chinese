import { motion } from 'framer-motion'
import { ListGroup, ListRow } from '@/components/ui/ListGroup'
import { ProgressBar } from '@/components/ui/Progress'
import { spring } from '@/components/ui/motion'
import { levelColor } from '@/lib/palette'
import type { CourseLevel } from '@/lib/courseModel'

/** Inset-grouped list: one row per level with lessons done and a thin gradient bar. */
export function LevelProgress({ levels }: { levels: CourseLevel[] }) {
  return <section aria-labelledby="level-progress">
    <h2 id="level-progress" className="mb-2 px-4 text-footnote font-medium text-secondary-label">Tiến độ theo cấp</h2>
    <ListGroup>
      {levels.map((lv, i) => <motion.div key={lv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring.smooth, delay: 0.15 + i * 0.05 }}>
        <ListRow title={<><span className="flex items-baseline justify-between gap-3"><span className="flex min-w-0 items-center gap-2 font-semibold"><span aria-hidden="true" style={{ background: levelColor(lv.level) }} className="size-2.5 shrink-0 rounded-full" /><span className="truncate">{lv.title}</span></span><span className="text-subhead tabular-nums text-secondary-label">{lv.done}/{lv.total} bài</span></span>
          <ProgressBar color={levelColor(lv.level)} value={lv.total ? lv.done / lv.total : 0} className="mt-2 h-1.5" /></>} />
      </motion.div>)}
    </ListGroup>
  </section>
}
