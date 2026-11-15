import type { CourseLesson } from '@/data/types'
import { Block, Line, SkeletonPage } from '@/components/ui/Skeleton'
import { LessonHeader } from './LessonHeader'

function HeaderPlaceholder() {
  return <div className="flex flex-col items-start gap-3">
    <Block className="size-11 rounded-full" />
    <div><Line className="text-caption" w="8rem" /><Line className="mt-1 font-han text-4xl leading-tight sm:text-5xl" w="9rem" /></div>
  </div>
}

/** Loading placeholder shaped like the lesson page: header, progress panel, grid of word cards. Pass `lesson` to show the real header. */
export function LessonSkeleton({ lesson }: { lesson?: CourseLesson }) {
  return <SkeletonPage label="Loading lesson" className="mx-auto w-full max-w-3xl min-w-0 pt-5 sm:pt-7">
    {lesson ? <LessonHeader lesson={lesson} /> : <HeaderPlaceholder />}
    <div className="mt-6 space-y-5 pb-6">
      <Block className="glass h-[8.5rem] rounded-panel" />
      <div className="grid gap-3 sm:grid-cols-2">{Array.from({ length: 6 }, (_, i) => <Block key={i} className="h-[12.1rem] rounded-card" />)}</div>
    </div>
  </SkeletonPage>
}
