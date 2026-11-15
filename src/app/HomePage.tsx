import { useMemo } from 'react'
import { useCourse } from '@/lib/courseModel'
import { useStudyData } from '@/lib/useStudyData'
import { buildQueue } from '@/lib/reviewQueue'
import { greeting } from '@/lib/home'
import { useSettings } from '@/store/settings'
import { Rise, Stagger } from '@/components/ui/motion'
import { JourneyList } from '@/components/home/JourneyList'
import { MascotTalk, type MascotTip } from '@/components/home/MascotTalk'
import { LessonHero } from '@/components/home/LessonHero'
import { HomeSkeleton } from './skeletons'
import { WeekStreak } from '@/components/home/WeekStreak'
import { WordOfDay } from '@/components/home/WordOfDay'

/** Home: greeting, the lesson to continue, shortcuts, today's progress and the HSK journey, for both curricula. */
export function HomePage() {
  const course = useCourse()
  const goal = useSettings((s) => s.dailyMinutes)
  const { cards, reviews, now: dataNow } = useStudyData()
  // Cards due now (the same queue the Review page shows), not every card in the deck.
  const due = useMemo(() => buildQueue(course.reviewDeck, cards, reviews, dataNow).items.length, [course.reviewDeck, cards, reviews, dataNow])
  if (!course.loaded) return <HomeSkeleton />
  const { minutesToday, streak, summary, levels, current, next, version } = course
  const remaining = Math.max(0, goal - minutesToday)
  const now = new Date()
  const date = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
  const cardsDue = `${due} card${due === 1 ? '' : 's'}`
  const tip: MascotTip = due > 0
    ? { text: <><b>{cardsDue}</b> due for review. A few minutes is all it takes!</>, plain: `${cardsDue} due for review. A few minutes is all it takes!`, action: { label: 'Review now', to: '/review' } }
    : remaining > 0
      ? { text: 'Try one more short part to reach today\'s goal!', plain: 'Try one more short part to reach today\'s goal!' }
      : { text: 'Great job! You have reached today\'s goal.', plain: 'Great job! You have reached today\'s goal.' }

  return <Stagger className="w-full min-w-0 space-y-6 pt-8 pb-6 sm:space-y-8 sm:pt-10">
    {/* Greeting on the left; the bánh bao chats on the right (phones show the character of the day in the corner instead). */}
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-end">
      <Rise className="flex items-start justify-between gap-3">
        <header className="min-w-0">
          <p className="text-subhead font-medium capitalize text-secondary-label">{date}</p>
          <h1 className="mt-1.5 text-[2rem] leading-[1.15] font-display font-black tracking-tight text-balance sm:text-[3.5rem] sm:leading-[1.1]">{greeting(now.getHours())}</h1>
          <p aria-label={`${minutesToday} minutes today`} className="mt-2 text-callout text-secondary-label sm:text-title3 sm:font-medium tabular-nums">
            <span className="max-sm:hidden">{`${streak}-day streak · `}</span>{`${summary.wordsLearned} word${summary.wordsLearned === 1 ? '' : 's'} learned.`}
          </p>
        </header>
        {/* Phones: the character of the day sits in the top right corner. */}
        <WordOfDay compact current={current} version={version} day={now} className="mt-1 sm:hidden" />
      </Rise>
      {/* Phones skip the chat (it pushed the HSK journey off the first screen). */}
      <Rise className="min-w-0 max-sm:hidden"><MascotTalk tip={tip} /></Rise>
    </div>
    {/* The lesson to continue; beside it on wide screens (below it on phones) this week's streak and the character of the day. */}
    <div className="grid items-stretch gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      {/* Phones: a slim streak row above the lesson card instead of the big streak card. */}
      <Rise className="min-w-0 sm:hidden"><WeekStreak compact /></Rise>
      <Rise className="min-w-0"><LessonHero current={current} next={next} /></Rise>
      <Rise className="grid min-w-0 max-sm:hidden! gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1 lg:grid-rows-2 lg:gap-6">
        <WeekStreak className="flex flex-col justify-center" />
        <WordOfDay current={current} version={version} day={now} />
      </Rise>
    </div>
    <Rise><JourneyList levels={levels} version={version} done={summary.lessonsDone} total={summary.lessonsTotal} /></Rise>
  </Stagger>
}
