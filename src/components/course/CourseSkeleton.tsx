import { buildCourse } from '@/lib/courseModel'
import { useSettings } from '@/store/settings'
import { Block, Line, SkeletonPage } from '@/components/ui/Skeleton'

/** Placeholder with the real page's shape: header, progress panel, and one bar per level for the chosen HSK version (first level open). */
export function CourseSkeleton() {
  const version = useSettings((s) => s.hskVersion)
  const { levels } = buildCourse(version, new Map())
  return <SkeletonPage label="Loading lessons" className="mx-auto w-full min-w-0 max-w-[72rem] space-y-6 pt-6 pb-12 sm:pt-8 lg:space-y-8">
    <header>
      <Line className="text-footnote" w="11rem" />
      <Line className="mt-1 text-[2rem] leading-[1.15] sm:text-[3.25rem] sm:leading-[1.1]" w="9rem" />
      <Line className="mt-2 text-callout" w="16rem" />
    </header>
    <Block className="h-14 w-full max-w-md rounded-full" />
    <Block className="h-12 w-56 rounded-full" />
    <div className="space-y-6 lg:space-y-8">
      <section className="liquid-glass liquid-glass-ink relative rounded-[2rem] p-5 sm:rounded-[2.25rem] sm:p-7 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-center lg:gap-8">
        <div className="flex items-center gap-5">
          <Block className="size-22 rounded-full" />
          <div className="min-w-0 flex-1"><Line className="text-large-title" w="5rem" /><Line className="mt-1.5 text-subhead" w="8rem" /><Line className="text-footnote" w="6rem" /></div>
        </div>
        <div className="mt-5 lg:mt-0"><div className="rounded-[1.75rem] bg-white/10 p-4"><Line className="text-title1" w="5rem" /><Line className="mt-1 text-subhead" w="9rem" /><Line className="mt-2 text-caption" w="7rem" /></div>
        <Block className="mt-4 h-12 w-full rounded-full" /></div>
      </section>
      <div className="space-y-3">
        {levels.map((level, i) => <section key={level.id} className="glass rounded-[2rem]">
          <div className="flex min-h-18 items-center gap-4 px-4 py-3 sm:px-5">
            <Block className="size-10 rounded-full" />
            <div className="min-w-0 flex-1"><Line className="text-headline" w="9rem" /><Line className="mt-1.5 text-footnote" w="10rem" /></div>
          </div>
          {i === 0 && <div className="px-2 pb-2 sm:px-3 sm:pb-3"><div className="glass rounded-card divide-y divide-separator">
            {level.lessons.slice(0, 6).map((lesson) => <div key={lesson.id} className="flex min-h-[4.25rem] items-center gap-3 px-4 py-3">
              <Block className="size-8 rounded-full" />
              <div className="min-w-0 flex-1"><Line className="text-title3" w="6rem" /><Line className="text-footnote" w="9rem" /></div>
            </div>)}
          </div></div>}
        </section>)}
      </div>
    </div>
  </SkeletonPage>
}
