import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { CourseLevel } from '@/lib/courseModel'
import type { PathItem } from '@/lib/learningPath'
import { Chevron, CollapsiblePanel } from '@/components/ui/Disclosure'
import { ListGroup } from '@/components/ui/ListGroup'
import { ProgressBar } from '@/components/ui/Progress'
import { levelColor, levelInk, levelSoft } from '@/lib/palette'
import { LessonRow } from './LessonRow'
import { NowBadge } from '@/components/ui/NowBadge'

/**
 * One level (HSK 2.0 stage or HSK 3.0 book) as a collapsible glass panel.
 * `focus` (from ?stage= / ?level=) opens only the matching level and scrolls to it; otherwise the level holding the current lesson is open.
 */
export function LevelPanel({ level, index, focus, paths, onSkip }: {
  level: CourseLevel; index: number; focus: string | null
  paths?: Map<string, PathItem>; onSkip?: (ids: string[], skipped: boolean) => void
}) {
  const reduce = useReducedMotion()
  const count = level.total + level.pending
  const finished = level.total > 0 && level.lessons.every((l) => l.status === 'done' || l.status === 'skipped')
  const open = level.lessons.some((l) => l.status === 'current')
  const focused = !!focus && (focus === level.id || focus === String(level.level))
  const [expanded, setExpanded] = useState(focus ? focused : open)
  const [ring, setRing] = useState(false)
  useEffect(() => { if (open && !focus) setExpanded(true) }, [open, focus])
  const box = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!focused) return
    setExpanded(true)
    setRing(true)
    // Wait for the panels to finish rising in, so the scroll lands on the final position.
    const scroll = setTimeout(() => box.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }), 350)
    const fade = setTimeout(() => setRing(false), 2200)
    return () => { clearTimeout(scroll); clearTimeout(fade) }
  }, [focused, reduce])
  const headingId = `level-heading-${level.id}`
  const panelId = `level-panel-${level.id}`
  const title = level.id.startsWith('hsk3-') ? level.shortTitle : `Chặng ${index} · ${level.shortTitle}`
  return <section ref={box} aria-labelledby={headingId} className={`rounded-[2rem] shadow-card scroll-mt-20 transition-shadow duration-700 lg:scroll-mt-6 ${ring ? 'ring-2' : open ? 'ring-2 ring-[#15120f] dark:ring-[#f3eee4]' : ''}`} style={{ background: levelSoft(level.level), ...(ring ? { '--tw-ring-color': levelColor(level.level) } : {}) } as CSSProperties}>
    <h2><button type="button" id={headingId} aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded((v) => !v)}
      className="flex min-h-18 w-full cursor-pointer items-center gap-4 rounded-[2rem] px-4 py-3 text-left sm:px-5">
      <span aria-hidden="true" style={{ background: levelColor(level.level) }} className={`grid size-10 shrink-0 place-items-center rounded-full text-headline tabular-nums ${levelInk(level.level)}`}>{finished ? <Check className="size-5" strokeWidth={3} /> : index}</span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2"><span className="block min-w-0 truncate font-display text-title3 font-extrabold">{title}</span>{open && <NowBadge />}</span>
        <span className="mt-1.5 flex items-center gap-3">
          <ProgressBar color={levelColor(level.level)} value={count ? level.done / count : 0} className="h-2 max-w-40 flex-1 bg-white/70! dark:bg-white/15!" />
          <span className="text-footnote text-secondary-label tabular-nums">{level.done}/{count} bài</span>
        </span>
      </span>
      <Chevron open={expanded} />
    </button></h2>
    <CollapsiblePanel id={panelId} labelledBy={headingId} expanded={expanded}>
      <div className="px-2 pb-2 sm:px-3 sm:pb-3">
        <ListGroup clip={false} className="rounded-3xl! border-0! bg-transparent! shadow-none!">
          <motion.div className="divide-y divide-separator [&>:first-child]:rounded-t-3xl [&>:last-child]:rounded-b-3xl [&>:first-child>a]:rounded-t-3xl [&>:last-child>a]:rounded-b-3xl" initial="hidden" animate={expanded ? 'show' : 'hidden'}
            variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.03, delayChildren: 0.05 } } }}>
            {level.lessons.map((lesson) => <LessonRow key={lesson.id} lesson={lesson} path={paths?.get(lesson.id)} onSkip={onSkip} />)}
          </motion.div>
        </ListGroup>
        {level.pending > 0 && <p className="px-3 pt-3 text-footnote text-secondary-label">Còn {level.pending} bài đang soạn nội dung.</p>}
      </div>
    </CollapsiblePanel>
  </section>
}
