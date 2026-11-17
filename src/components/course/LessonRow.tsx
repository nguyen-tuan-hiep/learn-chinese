import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Ellipsis } from 'lucide-react'
import type { CourseLessonItem } from '@/lib/courseModel'
import { Badge } from '@/components/ui/Badge'
import { ListRow } from '@/components/ui/ListGroup'
import { riseIn } from '@/components/ui/motion'
import { levelInk } from '@/lib/palette'

const plainTitle = (vi: string) => vi.replace(/ · \d+ new words?$/, '')
const label = (lesson: CourseLessonItem) => `HSK ${lesson.level} · Lesson ${lesson.number}`

/** "⋯" button with the rarely used row actions. */
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
    <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={`Options for ${name}`} onClick={() => setOpen(!open)}
      className="grid size-11 cursor-pointer place-items-center rounded-full text-tertiary-label transition-colors hover:bg-fill hover:text-label"><Ellipsis aria-hidden="true" className="size-5" /></button>
    {open && <div role="menu" className="glass-thick absolute right-2 top-full z-10 mt-1 w-52 rounded-2xl p-1 shadow-lift">
      <button type="button" role="menuitem" aria-label={`${skipped ? 'Undo skip' : 'Skip'} ${name}`} onClick={() => { setOpen(false); onSkip([lesson.id], !skipped) }}
        className="min-h-11 w-full cursor-pointer rounded-xl px-3 text-left text-subhead hover:bg-fill">{skipped ? 'Undo skip' : 'Skip this lesson'}</button>
    </div>}
  </div>
}

/**
 * One lesson in a level, as a stop on the level's path: a node on a vertical rail, the Chinese title, a secondary line.
 * Done stops fill with the level colour and colour the rail; the current one is a black node with a soft tinted card
 * and a "Continue" pill; later ones are hollow. `--tint` / `--deep` come from LevelPanel. `onSkip` enables the "⋯" menu.
 */
export function LessonRow({ lesson, onSkip }: { lesson: CourseLessonItem; onSkip?: (ids: string[], skipped: boolean) => void }) {
  const reduce = useReducedMotion()
  const done = lesson.status === 'done'
  const current = lesson.status === 'current'
  const skipped = lesson.status === 'skipped'
  const pct = !done && lesson.progress > 0 ? Math.round(lesson.progress * 100) : 0
  const subtitle = [lesson.subtitle && plainTitle(lesson.subtitle), `${lesson.wordCount} words`].filter(Boolean).join(' · ')
  const node = <span aria-hidden="true" className={`relative z-10 grid size-9 shrink-0 place-items-center rounded-full text-footnote font-bold tabular-nums ${done ? `bg-(--tint) ${levelInk(lesson.level)}`
    : current ? 'ink-pill shadow-[0_0_0_5px_color-mix(in_srgb,var(--tint)_55%,transparent)]'
    : 'bg-surface text-secondary-label ring-[1.5px] ring-separator ring-inset'}`}>
    {done ? <Check className="size-4" strokeWidth={3} /> : lesson.number}
  </span>
  const trailing = <span className="flex shrink-0 items-center gap-2">
    {skipped ? <Badge>Skipped</Badge>
      : current ? <span className="ink-pill inline-flex min-h-9 items-center gap-1.5 rounded-full pr-3.5 pl-4 text-footnote font-bold max-sm:hidden">{pct ? `${pct}% · ` : ''}Continue<ArrowRight className="size-3.5" strokeWidth={2.6} /></span>
      : pct ? <span className="text-footnote font-semibold text-(--deep) tabular-nums">{pct}%</span>
      : null}
  </span>
  return <motion.div variants={reduce ? undefined : riseIn} className={`relative flex items-center rounded-2xl transition-colors ${current ? 'bg-[color-mix(in_srgb,var(--tint)_26%,transparent)]' : 'hover:bg-fill'}`}>
    <span aria-hidden="true" className={`rail-top absolute top-0 left-[2.125rem] h-1/2 w-0.5 -translate-x-1/2 ${done || current ? 'bg-(--tint)' : 'bg-separator'}`} />
    <span aria-hidden="true" className={`rail-bot absolute top-1/2 bottom-0 left-[2.125rem] w-0.5 -translate-x-1/2 ${done ? 'bg-(--tint)' : 'bg-separator'}`} />
    <ListRow to={lesson.to} aria-current={current ? 'step' : undefined} className={`flex-1 rounded-2xl py-3.5 active:bg-transparent! ${skipped ? 'opacity-55' : ''}`}
      title_attr={`${lesson.title}${lesson.subtitle ? ` · ${plainTitle(lesson.subtitle)}` : ''}`}
      leading={node}
      title={<motion.span layoutId={`lesson-title-${lesson.id}`} lang="zh-CN" className={`font-han block truncate text-title3 ${current ? 'font-medium' : ''}`}>{lesson.title}</motion.span>}
      subtitle={subtitle} trailing={trailing} />
    {onSkip && <RowMenu lesson={lesson} onSkip={onSkip} />}
  </motion.div>
}
