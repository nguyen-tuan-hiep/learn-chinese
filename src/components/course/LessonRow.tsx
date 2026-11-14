import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Ellipsis } from 'lucide-react'
import type { CourseLessonItem } from '@/lib/courseModel'
import type { PathItem } from '@/lib/learningPath'
import { partsFor } from '@/lib/lessonState'
import { Badge } from '@/components/ui/Badge'
import { NowBadge } from '@/components/ui/NowBadge'
import { ListRow } from '@/components/ui/ListGroup'
import { ProgressRing } from '@/components/ui/Progress'
import { riseIn } from '@/components/ui/motion'
import { levelColor, levelInk, levelSoft } from '@/lib/palette'

const plainTitle = (vi: string) => vi.replace(/ · \d+ từ mới$/, '')
const label = (lesson: CourseLessonItem) => `HSK ${lesson.level} · Bài ${lesson.number}`

/** "⋯" button with the rarely used row actions (HSK 2.0 only). */
function RowMenu({ lesson, onSkip }: { lesson: CourseLessonItem; onSkip: (ids: string[], skipped: boolean) => void }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !box.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close) }
  }, [open])
  if (lesson.status === 'done') return <span className="size-11 shrink-0" />
  const skipped = lesson.status === 'skipped'
  const name = label(lesson)
  return <div ref={box} className="relative shrink-0 pr-2">
    <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={`Tùy chọn cho ${name}`} onClick={() => setOpen(!open)}
      className="grid size-11 cursor-pointer place-items-center rounded-full text-secondary-label transition-colors hover:bg-fill hover:text-label"><Ellipsis aria-hidden="true" className="size-5" /></button>
    {open && <div role="menu" className="glass-thick absolute right-2 top-full z-10 mt-1 w-52 rounded-2xl p-1 shadow-lift">
      <button type="button" role="menuitem" aria-label={`${skipped ? 'Hoàn tác bỏ qua' : 'Bỏ qua'} ${name}`} onClick={() => { setOpen(false); onSkip([lesson.id], !skipped) }}
        className="min-h-11 w-full cursor-pointer rounded-xl px-3 text-left text-subhead hover:bg-fill">{skipped ? 'Hoàn tác bỏ qua' : 'Bỏ qua bài này'}</button>
    </div>}
  </div>
}

/**
 * One lesson in a level: status circle, Chinese title, secondary line, trailing progress or badge.
 * `path` (HSK 2.0 only) carries part counts and the "needs practice" flag; `onSkip` enables the "⋯" menu.
 */
export function LessonRow({ lesson, path, onSkip }: { lesson: CourseLessonItem; path?: PathItem; onSkip?: (ids: string[], skipped: boolean) => void }) {
  const reduce = useReducedMotion()
  const current = lesson.status === 'current'
  const skipped = lesson.status === 'skipped'
  const parts = path ? partsFor(path.lesson).length : 0
  const subtitle = lesson.subtitle ? plainTitle(lesson.subtitle) : `${lesson.wordCount} từ`
  const circle = <span aria-hidden="true" style={lesson.status === 'done' ? { background: levelColor(lesson.level) } : current ? { background: levelSoft(lesson.level), '--tw-ring-color': levelColor(lesson.level) } as CSSProperties : undefined} className={`grid size-8 shrink-0 place-items-center rounded-full text-footnote font-semibold tabular-nums ${lesson.status === 'done' ? levelInk(lesson.level) : current ? 'text-label ring-2' : 'bg-fill text-secondary-label'}`}>
    {lesson.status === 'done' ? <Check className="size-4" strokeWidth={3} /> : lesson.number}
  </span>
  const trailing = <span className="flex shrink-0 items-center gap-2">
    {current && <NowBadge className="max-sm:hidden" />}
    {path?.needsPractice && <Badge tone="cinnabar">Cần ôn</Badge>}
    {skipped ? <Badge>Đã bỏ qua</Badge>
      : lesson.status !== 'done' && lesson.progress > 0 ? <ProgressRing value={lesson.progress} size={30} stroke={3.5} label={current && parts ? `${path!.partsDone}/${parts}` : undefined} className={current && parts ? '[&>span]:text-[9px]' : ''} />
      : null}
  </span>
  return <motion.div variants={reduce ? undefined : riseIn} style={current ? { '--row-soft': levelSoft(lesson.level) } as CSSProperties : undefined} className={`flex items-center ${current ? 'bg-[color-mix(in_srgb,var(--row-soft)_45%,var(--glass-regular))]' : 'bg-[var(--glass-regular)]'}`}>
    <ListRow to={lesson.to} aria-current={current ? 'step' : undefined} className={`flex-1 ${skipped ? 'opacity-55' : ''}`}
      title_attr={`${lesson.title}${lesson.subtitle ? ` · ${plainTitle(lesson.subtitle)}` : ''}`}
      leading={circle}
      title={<motion.span layoutId={`lesson-title-${lesson.id}`} lang="zh-CN" className="font-han block truncate text-title3">{lesson.title}</motion.span>}
      subtitle={subtitle} trailing={trailing} />
    {onSkip && lesson.version === '2.0' && <RowMenu lesson={lesson} onSkip={onSkip} />}
  </motion.div>
}
