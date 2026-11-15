import { Glass } from '@/components/ui/Glass'
import { LargeTitle } from '@/components/ui/PageHeader'
import { Block, Line, SkeletonPage } from '@/components/ui/Skeleton'
import { useCourse } from '@/lib/courseModel'

/** Placeholder with the same blocks and heights as the Stats page. */
export function StatsSkeleton() {
  const rows = useCourse().levels.length || 4
  return <SkeletonPage label="Loading stats" className="w-full min-w-0 space-y-6 pt-6 pb-10 sm:pt-8">
    <LargeTitle eyebrow="Your progress" title="Stats" aside={<Block className="h-11 w-48 rounded-full" />} />
    <Glass material="thick" className="p-5 sm:p-6">
      <Line className="text-footnote" w="6rem" />
      <Line className="mt-2 text-large-title" w="9rem" />
      <Line className="mt-1 text-footnote" w="11rem" />
      <Block className="mt-4 h-12 w-full rounded-full" />
      <Block className="mt-4 h-[140px] w-full rounded-lg" />
      <div className="mt-2 h-4" />
    </Glass>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {[0, 1, 2, 3].map((i) => <Block key={i} className="min-h-[10.5rem] rounded-[2rem] sm:rounded-[2.25rem]" />)}
    </div>
    <div className="space-y-6">
      <div>
        <Line className="mb-3.5 text-title3" w="11rem" />
        <Glass className="space-y-1 p-2 sm:p-3">
          {Array.from({ length: rows }, (_, i) => <div key={i} className="flex items-center gap-3.5 px-3 py-3 sm:gap-4"><Block className="size-12 shrink-0 rounded-full" /><div className="min-w-0 flex-1"><Line className="text-callout" w="40%" /><Block className="mt-2 h-2 rounded-full" /><Line className="mt-1.5 text-caption" w="30%" /></div></div>)}
        </Glass>
      </div>
      <div className="flex flex-col">
        <Line className="mb-3.5 text-title3" w="9rem" />
        <Glass className="flex-1 p-5 sm:p-6"><Block className="h-[136px] w-[396px] max-w-full rounded-lg" /><Line className="mt-3 text-footnote" w="100%" /></Glass>
      </div>
    </div>
  </SkeletonPage>
}
