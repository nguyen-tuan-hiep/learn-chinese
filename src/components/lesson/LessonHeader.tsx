import { Link } from 'react-router-dom'
import { levelName } from '@/data/course'
import type { CourseLesson } from '@/data/types'
import type { LessonPart } from '@/lib/db'
import { partsFor } from '@/lib/lessonState'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { Segmented } from '@/components/ui/Segmented'

/** Back link and title of a lesson. Shared by the lesson page and its loading placeholder. */
export function LessonHeader({ lesson }: { lesson: CourseLesson }) {
  return <header className="flex items-center gap-3">
    <Link to="/lesson" aria-label={`Về danh sách bài học ${levelName(lesson.level)}`} className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors hover:text-ink">←</Link>
    <div className="min-w-0">
      <p className="truncate text-xs font-semibold uppercase tracking-widest text-jade">{levelName(lesson.level)} · Bài {lesson.number}{lesson.textbookVolume && !lesson.textbookVolume.startsWith('HSK') ? ` · ${lesson.textbookVolume}` : ''}</p>
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3">
        <h1 lang="zh-CN" className="font-han text-3xl leading-tight sm:text-4xl">{lesson.title}</h1>
        <p className="min-w-0 truncate text-sm text-muted">{lesson.titlePinyin && <><Pinyin text={lesson.titlePinyin} /> · </>}{lesson.titleVi}</p>
      </div>
    </div>
  </header>
}

/** The lesson's part picker, with a ✓ on every finished part. `done` is null while progress is loading. */
export function LessonPartPicker({ lesson, part, done, onChange }: {
  lesson: CourseLesson; part: LessonPart | null; done: Partial<Record<LessonPart, unknown>> | null; onChange?: (part: LessonPart) => void
}) {
  const parts = partsFor(lesson)
  const doneCount = done ? parts.filter((p) => done[p.id]).length : 0
  return <div className="mt-5">
    <div className="mb-2 flex items-baseline justify-between gap-2 text-xs text-muted">
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
            ? <span aria-label="Đã hoàn thành" className="grid size-5 shrink-0 place-items-center rounded-full bg-jade text-[0.65rem] text-white">✓</span>
            : <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-full border border-line text-[0.65rem] tabular-nums">{i + 1}</span>}
          <span className={done?.[p.id] && part !== p.id ? 'text-jade' : ''}>{p.label}</span>
        </span>,
      }))} />
  </div>
}
