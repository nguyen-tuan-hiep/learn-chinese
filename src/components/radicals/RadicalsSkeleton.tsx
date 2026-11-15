import { useParams } from 'react-router-dom'
import { Glass } from '@/components/ui/Glass'
import { LargeTitle } from '@/components/ui/PageHeader'
import { Block, Line, SkeletonPage } from '@/components/ui/Skeleton'
import { RADICAL_LESSONS } from '@/data/radicals'
import { RadicalLessonHeader } from './RadicalLessonHeader'

/** Loading placeholder shaped like the dictionary: title with ring card, search and filter, tile grid, side panel, practice row. */
export function RadicalsSkeleton() {
  return <SkeletonPage label="Loading radical dictionary" className="w-full min-w-0 space-y-8 pt-6 pb-12 sm:pt-8">
    <LargeTitle eyebrow="Look up · 214 radicals" title="Radical dictionary"
      aside={<div className="flex w-full items-center gap-4 rounded-[1.75rem] bg-[#15120f] p-4 pr-6 sm:w-auto dark:bg-black">
        <Block className="size-14 rounded-full" />
        <div><Line className="text-headline" w="8rem" /><Line className="text-subhead" w="6rem" /></div>
      </div>} />
    <Block className="h-14 w-full max-w-md rounded-full" />
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Block className="h-11 min-w-60 flex-1 rounded-full" />
          <Block className="h-[50px] w-full rounded-full sm:w-auto sm:min-w-[22rem]" />
        </div>
        <Line className="text-footnote" w="14rem" />
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5">
          {Array.from({ length: 30 }, (_, i) => <Block key={i} className="h-[7.25rem] rounded-[1.75rem]" />)}
        </div>
      </div>
      <Block className="hidden min-h-[17rem] rounded-panel xl:block" />
    </div>
    <Glass className="px-5">
      <div className="flex min-h-11 items-center gap-3"><span className="block min-w-0 flex-1 py-3"><span className="block text-headline">Extra radical writing practice</span><span className="block text-subhead">43 sessions of 5 radicals · optional, not part of the path</span></span><span className="size-5" /></div>
    </Glass>
  </SkeletonPage>
}

/** Loading placeholder for a radical practice session: real header when the session is known, then progress and two panels. */
export function RadicalLessonSkeleton({ id }: { id?: string }) {
  const params = useParams()
  const lesson = RADICAL_LESSONS.find((item) => item.id === (id ?? params.id))
  return <SkeletonPage label="Loading radical practice" className="mx-auto w-full max-w-3xl min-w-0 pt-5 pb-12 sm:pt-7">
    {lesson ? <RadicalLessonHeader lesson={lesson} status={<Line className="text-subhead" w="3.5rem" />} />
      : <div className="flex flex-col items-start gap-3"><Block className="size-11 rounded-full" /><Line className="text-title1" w="9rem" /></div>}
    <div className="mt-5 h-1.5 overflow-hidden rounded-full"><Block className="h-full rounded-full" /></div>
    <div className="mt-4 flex h-11 items-center gap-2">{[0, 1, 2, 3, 4].map((i) => <Block key={i} className="size-8 rounded-full" />)}</div>
    <Block className="mt-4 h-52 rounded-panel" />
    <Block className="mt-4 h-80 rounded-panel" />
  </SkeletonPage>
}
