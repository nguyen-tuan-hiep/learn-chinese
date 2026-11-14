import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ChevronLeft } from 'lucide-react'
import type { CourseLesson } from '@/data/types'
import type { LessonPart } from '@/lib/db'
import { partsFor } from '@/lib/lessonState'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { Segmented } from '@/components/ui/Segmented'
import { spring } from '@/components/ui/motion'
import { levelSoft } from '@/lib/palette'

/** The HSK 3.0 book lesson fields the header needs. */
export interface BookLessonHead { id: string; band: number; number: number; title: string }

/**
 * Back button and title of a lesson, shared by HSK 2.0 and 3.0 pages and the loading placeholder.
 * Pass `lesson` (2.0) or `book` (3.0). The Chinese title carries `layoutId="lesson-title-<id>"` for the list-to-lesson morph.
 */
export function LessonHeader({ lesson, book }: { lesson?: CourseLesson; book?: BookLessonHead }) {
  const id = lesson?.id ?? book?.id ?? ''
  const level = lesson?.level ?? book?.band ?? 1
  const number = lesson?.number ?? book?.number ?? 0
  const title = lesson?.title ?? book?.title ?? ''
  const volume = lesson?.textbookVolume && !lesson.textbookVolume.startsWith('HSK') ? ` · ${lesson.textbookVolume}` : ''
  return <header className="flex flex-col items-start gap-3">
    <Link to={book ? `/lesson?level=${book.band}` : '/lesson'} aria-label={`Về danh sách bài học HSK ${level}`}
      className="glass grid size-11 shrink-0 place-items-center rounded-full! text-label transition-transform duration-200 active:scale-[0.92]">
      <ChevronLeft aria-hidden="true" className="size-6" />
    </Link>
    <div style={{ background: levelSoft(level) }} className="relative w-full min-w-0 overflow-hidden rounded-[2rem] p-5 shadow-card sm:rounded-[2.5rem] sm:p-8">
      <span aria-hidden="true" lang="zh-CN" className="font-han pointer-events-none absolute -top-10 -right-4 text-[11rem] leading-none opacity-[0.07] sm:text-[15rem]">{[...title].at(-1)}</span>
      <p className="relative flex max-w-full items-center gap-2 text-footnote font-semibold"><span className="shrink-0 rounded-full bg-white px-3 py-1 text-[#15120f] dark:bg-white/15 dark:text-label">HSK {level}</span><span className="truncate">Bài {number} · {book ? '3.0' : '2.0'}{volume}</span></p>
      <motion.h1 layoutId={`lesson-title-${id}`} transition={spring.smooth} lang="zh-CN" className="relative mt-3 font-han text-4xl font-bold leading-tight text-balance break-words sm:text-6xl">{title}</motion.h1>
      {lesson && (lesson.titlePinyin || lesson.titleVi) && <p className="relative mt-1.5 text-callout opacity-75 sm:text-title3 sm:font-medium">{lesson.titlePinyin && <><Pinyin text={lesson.titlePinyin} />{lesson.titleVi && ' · '}</>}{lesson.titleVi}</p>}
    </div>
  </header>
}

/** The lesson's part picker, with a check on every finished part. `done` is null while progress is loading. */
export function LessonPartPicker({ lesson, part, done, onChange }: {
  lesson: CourseLesson; part: LessonPart | null; done: Partial<Record<LessonPart, unknown>> | null; onChange?: (part: LessonPart) => void
}) {
  const parts = partsFor(lesson)
  const doneCount = done ? parts.filter((p) => done[p.id]).length : 0
  return <div className="mt-6">
    <div className="mb-2 flex items-baseline justify-between gap-2 px-1 text-footnote text-secondary-label">
      <span>Các phần của bài</span>
      <span className={`tabular-nums transition-opacity ${done ? '' : 'opacity-0'}`}>{doneCount}/{parts.length} phần đã xong</span>
    </div>
    <Segmented<LessonPart> label="Các phần của bài" className="w-full"
      value={part ?? ('' as LessonPart)}
      onChange={(id) => onChange?.(id)}
      options={parts.map((p, i) => ({
        value: p.id,
        label: <span className="inline-flex items-center gap-1.5">
          {done?.[p.id]
            ? <span role="img" aria-label="Đã hoàn thành" className={`grid size-5 shrink-0 place-items-center rounded-full ${part === p.id ? 'bg-white text-[#15120f] dark:bg-[#15120f] dark:text-white' : 'bg-label text-[var(--color-paper)]'}`}><Check aria-hidden="true" className="size-3" strokeWidth={3} /></span>
            : <span aria-hidden="true" className={`grid size-5 shrink-0 place-items-center rounded-full border text-[0.65rem] tabular-nums ${part === p.id ? 'border-current' : 'border-separator'}`}>{i + 1}</span>}
          <span>{p.label}</span>
        </span>,
      }))} />
  </div>
}
