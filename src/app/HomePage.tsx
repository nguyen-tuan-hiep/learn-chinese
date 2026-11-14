import { useCourse } from '@/lib/courseModel'
import { greeting } from '@/lib/home'
import { useSettings } from '@/store/settings'
import { Rise, Stagger } from '@/components/ui/motion'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { ActionRow } from '@/components/home/ActionRow'
import { JourneyList } from '@/components/home/JourneyList'
import { TipBubble } from '@/components/ui/TipBubble'
import { LessonHero } from '@/components/home/LessonHero'
import { HomeSkeleton } from './skeletons'

/** Home: greeting, the lesson to continue, shortcuts, today's progress and the HSK journey, for both curricula. */
export function HomePage() {
  const course = useCourse()
  const goal = useSettings((s) => s.dailyMinutes)
  if (!course.loaded) return <HomeSkeleton />
  const { minutesToday, streak, summary, levels, current, next, version, reviewDeck } = course
  const remaining = Math.max(0, goal - minutesToday)
  const now = new Date()
  const date = now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })

  return <Stagger className="w-full min-w-0 space-y-6 pt-8 pb-6 sm:space-y-8 sm:pt-10">
    <Rise>
      <header>
        <p className="text-subhead font-medium capitalize text-secondary-label">{date}</p>
        <h1 className="mt-1.5 text-[2rem] leading-[1.15] font-display font-black tracking-tight text-balance sm:text-[3.5rem] sm:leading-[1.1]">{greeting(now.getHours())}</h1>
        <p aria-label={`${minutesToday} phút hôm nay`} className="mt-2 text-callout text-secondary-label sm:text-title3 sm:font-medium tabular-nums">
          {remaining > 0 ? <>Còn <AnimatedNumber value={remaining} /> phút nữa là đủ mục tiêu {goal} phút hôm nay.</> : 'Đã đủ mục tiêu hôm nay.'} Chuỗi {streak} ngày · {summary.wordsLearned} từ đã học.
        </p>
      </header>
    </Rise>
    <Rise>
      <TipBubble>{reviewDeck.length > 0 ? <>Có <b>{reviewDeck.length} thẻ</b> đang chờ bạn. Ôn nhanh vài phút nhé!</> : remaining > 0 ? <>Thử học thêm một phần nhỏ để đủ mục tiêu hôm nay nhé!</> : <>Giỏi quá! Bạn đã đủ mục tiêu hôm nay.</>}</TipBubble>
    </Rise>
    <div className="grid items-stretch gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <Rise className="min-w-0"><LessonHero current={current} next={next} /></Rise>
      <Rise className="min-w-0"><ActionRow reviewCount={reviewDeck.length} /></Rise>
    </div>
    <Rise><JourneyList levels={levels} version={version} done={summary.lessonsDone} total={summary.lessonsTotal} /></Rise>
  </Stagger>
}
