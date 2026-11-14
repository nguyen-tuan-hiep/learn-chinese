import type { CourseLesson } from '@/data/types'
import { Block, Line, SkeletonPage } from '@/components/ui/Skeleton'
import { LessonHeader, LessonPartPicker, type BookLessonHead } from './LessonHeader'

function HeaderPlaceholder() {
  return <div className="flex flex-col items-start gap-3">
    <Block className="size-11 rounded-full" />
    <div><Line className="text-caption" w="8rem" /><Line className="mt-1 font-han text-4xl leading-tight sm:text-5xl" w="9rem" /></div>
  </div>
}

/**
 * Loading placeholder shaped like the lesson pages: header, then the part picker with a word card (2.0)
 * or the progress panel with a grid of word cards (3.0). Pass `lesson` / `book` to show the real header.
 */
export function LessonSkeleton({ lesson, book, version }: { lesson?: CourseLesson; book?: BookLessonHead; version?: '2.0' | '3.0' }) {
  const v3 = version ? version === '3.0' : !!book
  return <SkeletonPage label="Đang tải bài học" className="mx-auto w-full max-w-3xl min-w-0 pt-5 sm:pt-7">
    {lesson ? <LessonHeader lesson={lesson} /> : book ? <LessonHeader book={book} /> : <HeaderPlaceholder />}
    {v3 ? <div className="mt-6 space-y-5 pb-6">
      <Block className="glass h-[8.5rem] rounded-panel" />
      <div className="grid gap-3 sm:grid-cols-2">{Array.from({ length: 6 }, (_, i) => <Block key={i} className="h-[12.1rem] rounded-card" />)}</div>
    </div> : <>
      {lesson ? <LessonPartPicker lesson={lesson} part={null} done={null} />
        : <div className="mt-6"><Line className="mb-2 text-footnote" w="7rem" /><Block className="h-12 rounded-full" /></div>}
      <div className="mt-7 space-y-5 pb-6">
        <div className="flex items-center justify-between gap-2"><Line className="text-xl font-semibold" w="8rem" /><Line className="text-sm" w="5rem" /></div>
        <Block className="h-12 rounded-card" />
        <div className="flex gap-2 py-1">{[0, 1, 2, 3].map((i) => <Block key={i} className="h-12 w-16 shrink-0 rounded-card" />)}</div>
        <Block className="h-[26rem] rounded-card sm:h-[17rem]" />
      </div>
    </>}
  </SkeletonPage>
}
