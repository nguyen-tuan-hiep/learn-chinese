import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { type RADICAL_LESSONS } from '@/data/radicals'

type RadicalLesson = (typeof RADICAL_LESSONS)[number]

/** Back button and title of a radical practice session; `status` sits at the right of the title row. Shared with the loading placeholder. */
export function RadicalLessonHeader({ lesson, status }: { lesson: RadicalLesson; status: ReactNode }) {
  return <header className="flex flex-col items-start gap-3">
    <Link to="/radicals" aria-label="Back to the radical dictionary"
      className="glass grid size-11 shrink-0 place-items-center rounded-full text-label transition-transform duration-200 active:scale-[0.92]">
      <ChevronLeft aria-hidden="true" className="size-6" />
    </Link>
    <div className="flex w-full min-w-0 items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="text-caption font-medium text-secondary-label">Extra radical practice</p>
        <h1 className="mt-1 text-title1 tracking-tight">Session {lesson.number} <span lang="zh-CN" className="font-han font-normal tracking-widest text-secondary-label">{lesson.radicals.map((r) => r.writingGlyph).join(' ')}</span></h1>
      </div>
      <div className="shrink-0 pb-1.5 text-subhead tabular-nums text-secondary-label">{status}</div>
    </div>
  </header>
}
