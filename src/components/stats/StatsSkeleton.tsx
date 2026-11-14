import { Glass } from '@/components/ui/Glass'
import { LargeTitle } from '@/components/ui/PageHeader'
import { ListGroup } from '@/components/ui/ListGroup'
import { Block, Line, SkeletonPage } from '@/components/ui/Skeleton'
import { useCourse } from '@/lib/courseModel'

/** Placeholder with the same blocks and heights as the Stats page. */
export function StatsSkeleton() {
  const rows = useCourse().levels.length || 4
  return <SkeletonPage label="Đang tải thống kê" className="w-full min-w-0 space-y-6 pt-6 pb-10 sm:pt-8">
    <LargeTitle eyebrow="Tiến độ của bạn" title="Thống kê" aside={<Block className="h-11 w-48 rounded-full" />} />
    <Glass material="thick" className="p-5 sm:p-6">
      <Line className="text-footnote" w="6rem" />
      <Line className="mt-2 text-large-title" w="9rem" />
      <Line className="mt-1 text-footnote" w="11rem" />
      <Block className="mt-4 h-12 w-full rounded-full" />
      <Block className="mt-4 h-[140px] w-full rounded-lg" />
      <div className="mt-2 h-4" />
    </Glass>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {[0, 1, 2, 3].map((i) => <Glass key={i} className="min-h-[148px] p-4 sm:p-5"><Block className="size-9 rounded-full" /><Line className="mt-8 text-title1" w="4rem" /><Line className="mt-1.5 text-footnote" w="6rem" /></Glass>)}
    </div>
    <ListGroup>{Array.from({ length: rows }, (_, i) => <div key={i} className="min-h-[70px] px-4 py-3"><Line className="text-body" w="40%" /><Block className="mt-2 h-1.5 rounded-full" /></div>)}</ListGroup>
    <Glass className="p-5 sm:p-6"><Line className="text-headline" w="10rem" /><Block className="mt-4 h-[136px] w-[396px] max-w-full rounded-lg" /><Line className="mt-3 text-footnote" w="100%" /></Glass>
  </SkeletonPage>
}
