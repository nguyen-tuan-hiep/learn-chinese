import { matchPath } from 'react-router-dom'
import { findCourseLesson } from '@/data/course'
import { greeting } from '@/lib/home'
import { buildCourse } from '@/lib/courseModel'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressRing } from '@/components/ui/Progress'
import { Block, Line, SkeletonPage, Text } from '@/components/ui/Skeleton'
import { useSettings } from '@/store/settings'
import { CourseSkeleton } from '@/components/course/CourseSkeleton'
import { LessonSkeleton } from '@/components/lesson/LessonSkeleton'
import { ReviewSkeleton } from '@/components/review/ReviewSkeleton'
import { StatsSkeleton } from '@/components/stats/StatsSkeleton'
import { SettingsSkeleton } from '@/components/settings/SettingsSkeleton'

/*
 * Loading placeholders, one per page. Each one reuses the page's own wrappers, spacing and fixed text,
 * and only replaces what depends on saved progress, so the real page lands in the same place.
 */

/** Card with a progress ring and two lines, as on the Pronunciation header. */
function AsideCard() {
  return <div className="glass flex w-full items-center gap-4 rounded-[1.75rem] p-4 pr-6 sm:w-auto">
    <ProgressRing value={0} size={48} stroke={5} />
    <div><Line className="font-semibold" w="9rem" /><Line className="text-sm" w="7rem" /></div>
  </div>
}

const BLANK_STATE = new Map()

export function HomeSkeleton() {
  const now = new Date()
  const date = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
  const version = useSettings((s) => s.hskVersion)
  const levels = buildCourse(version, BLANK_STATE).levels
  return <SkeletonPage label="Loading home" className="w-full min-w-0 space-y-6 pt-8 pb-6 sm:space-y-8 sm:pt-10">
    <header>
      <p className="text-subhead font-medium capitalize">{date}</p>
      <p className="mt-1.5 text-[2rem] leading-[1.15] font-display font-black tracking-tight text-balance sm:text-[3.5rem] sm:leading-[1.1]">{greeting(now.getHours())}</p>
      <p className="mt-2 text-callout sm:text-title3"><Text>{`0-day streak · 0 words learned.`}</Text></p>
    </header>
    <Block className="h-14 w-full max-w-md rounded-full" />
    <Block className="min-h-[18rem] rounded-[2.25rem] sm:rounded-[2.75rem]" />
    <section>
      <div className="mb-3.5 flex items-baseline justify-between gap-2">
        <h2 className="font-display text-title3 font-extrabold">HSK journey</h2>
        <Line className="text-footnote" w="3.5rem" />
      </div>
      <ul className="grid grid-cols-2 gap-3.5 min-[560px]:grid-cols-3 lg:grid-cols-6">
        {levels.map((level) => <li key={level.id}><Block className="min-h-[5.5rem] rounded-[1.75rem]" /></li>)}
      </ul>
    </section>
  </SkeletonPage>
}

export function PronunciationSkeleton() {
  return <SkeletonPage label="Loading pronunciation" className="w-full min-w-0 pt-6 pb-10 sm:pt-8">
    <PageHeader eyebrow="Pinyin · tones" title="Pronunciation" aside={<AsideCard />} />
    <Block className="mt-5 h-11 rounded-xl" />
    <div className="mt-6 py-2 md:p-0"><Block className="h-12 rounded-xl" /></div>
    <div className="mt-6 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => <Block key={i} className="h-28 rounded-[1.75rem] min-[480px]:h-48" />)}
    </div>
  </SkeletonPage>
}

/** Generic placeholder for pages without their own. */
export function PageSkeleton() {
  return <SkeletonPage label="Loading" className="w-full min-w-0 space-y-6 pt-6 pb-10 sm:pt-8">
    <div><Line className="text-xs" w="6rem" /><Line className="mt-2 text-3xl sm:text-4xl" w="12rem" /><Line className="mt-2" w="min(100%, 24rem)" /></div>
    <Block className="h-40 rounded-[var(--radius-card)]" />
    <Block className="h-64 rounded-[var(--radius-card)]" />
  </SkeletonPage>
}

/** The placeholder for whichever page is loading, used while a page's code is still downloading. */
export function RouteSkeleton({ pathname }: { pathname: string }) {
  if (pathname === '/') return <HomeSkeleton />
  if (pathname === '/lesson') return <CourseSkeleton />
  const lesson = matchPath('/lesson/:id', pathname)
  if (lesson) {
    return <LessonSkeleton lesson={findCourseLesson(lesson.params.id ?? '')} />
  }
  if (pathname === '/review') return <ReviewSkeleton />
  if (pathname === '/stats') return <StatsSkeleton />
  if (pathname === '/pronunciation') return <PronunciationSkeleton />
  if (pathname === '/settings') return <SettingsSkeleton />
  return <PageSkeleton />
}
