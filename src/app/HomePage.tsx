import { useCourse } from '@/lib/courseModel'
import { greeting } from '@/lib/home'
import { Rise, Stagger } from '@/components/ui/motion'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { JourneyList } from '@/components/home/JourneyList'
import { LessonHero } from '@/components/home/LessonHero'
import { HomeSkeleton } from './skeletons'
import { WeekStreak } from '@/components/home/WeekStreak'
import { WordOfDay } from '@/components/home/WordOfDay'

/** Home: greeting, the lesson to continue, shortcuts, today's progress and the HSK journey, for both curricula. */
export function HomePage() {
  const course = useCourse()
  if (!course.loaded) return <HomeSkeleton />
  const { minutesToday, streak, summary, levels, current, next, version } = course
  const now = new Date()
  const date = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })

  return <Stagger className="w-full min-w-0 space-y-6 pt-8 pb-6 sm:space-y-8 sm:pt-10">
    {/* Greeting on the left; on wide screens the backdrop's sun or moon fills the right (phones show the character of the day there). */}
    <Rise className="flex items-start justify-between gap-3">
      <header className="min-w-0">
        <p className="text-subhead font-medium capitalize text-secondary-label">{date}</p>
        <h1 className="mt-1.5 text-[1.75rem] leading-[1.15] font-display font-black tracking-tight text-balance sm:text-[3.5rem] sm:leading-[1.1]">{greeting(now.getHours())}</h1>
        <p aria-label={`${minutesToday} minutes today`} className="mt-2 text-callout text-secondary-label sm:text-title3 sm:font-medium tabular-nums">
          <span className="max-sm:hidden"><AnimatedNumber countUp value={streak} />-day streak · </span><AnimatedNumber countUp value={summary.wordsLearned} />{` word${summary.wordsLearned === 1 ? '' : 's'} learned.`}
        </p>
      </header>
      {/* Phones: the character of the day sits in the top right corner. */}
      <WordOfDay compact current={current} version={version} day={now} className="mt-1 sm:hidden" />
    </Rise>
    {/* The lesson to continue; beside it on wide screens (below it on phones) this week's streak and the character of the day. */}
    <div className="grid items-stretch gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      {/* Phones: a slim streak row above the lesson card instead of the big streak card. */}
      <Rise className="min-w-0 sm:hidden"><WeekStreak compact /></Rise>
      {/* The card fills its grid cell, so its bottom lines up with the streak and word cards beside it. */}
      <Rise className="min-w-0 [&>section]:h-full"><LessonHero current={current} next={next} /></Rise>
      <Rise className="grid min-w-0 max-sm:hidden! gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1 lg:grid-rows-2 lg:gap-4">
        <WeekStreak className="flex flex-col justify-center" />
        <WordOfDay current={current} version={version} day={now} />
      </Rise>
    </div>
    <Rise><JourneyList levels={levels} version={version} done={summary.lessonsDone} total={summary.lessonsTotal} /></Rise>
  </Stagger>
}
