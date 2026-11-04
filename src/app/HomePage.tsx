import { Link } from 'react-router-dom'
import { useStudyData } from '@/lib/useStudyData'
import { greeting, homeAction } from '@/lib/home'
import { nextCourseStep, pathSections } from '@/lib/learningPath'
import { completedLessonWords } from '@/lib/lessonState'
import { pronunciationProgress } from '@/data/pronunciationLearning'
import { useSettings } from '@/store/settings'
import { ButtonLink, Card } from '@/components/ui/Button'
import { ProgressBar, ProgressRing } from '@/components/ui/Progress'
import { HomeSkeleton } from './skeletons'
import { motion } from 'framer-motion'
import { popIn, Rise, riseIn, Stagger } from '@/components/ui/motion'


function ActionCard({ to, glyph, title, detail, cta }: { to: string; glyph: string; title: string; detail: string; cta: string }) {
  return <Link to={to} className="group flex min-w-0 items-center gap-4 rounded-2xl bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0 sm:p-5">
    <span aria-hidden="true" className="font-han grid size-12 shrink-0 place-items-center rounded-xl bg-jade-soft text-3xl text-jade">{glyph}</span>
    <span className="min-w-0 flex-1">
      <span className="block font-semibold leading-snug">{title}</span>
      <span className="mt-0.5 block text-sm text-muted">{detail}</span>
    </span>
    <span className="hidden shrink-0 text-sm font-semibold text-jade transition-transform group-hover:translate-x-0.5 sm:inline">{cta} →</span>
    <span aria-hidden="true" className="shrink-0 text-xl text-jade transition-transform group-hover:translate-x-0.5 sm:hidden">›</span>
  </Link>
}

export function HomePage() {
  const { loaded, lessonState, minutesToday, streak } = useStudyData()
  const goal = useSettings((s) => s.dailyMinutes)
  if (!loaded) return <HomeSkeleton />

  const action = homeAction(lessonState)
  const next = nextCourseStep(lessonState)
  const flashcards = completedLessonWords(lessonState).length
  const pronunciation = pronunciationProgress(lessonState)
  const sections = pathSections(lessonState)
  const done = sections.reduce((n, s) => n + s.items.filter((i) => i.status === 'done').length, 0)
  const total = sections.reduce((n, s) => n + s.items.length + s.pending, 0)
  const remaining = Math.max(0, goal - minutesToday)
  const now = new Date()
  const date = now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })
  // Show the Chinese title only when the home action really is the next course lesson.
  const showLesson = next && action.to === next.to

  return <Stagger className="w-full min-w-0 space-y-6 pt-4 pb-10 sm:space-y-8 sm:pt-8">
    <motion.section variants={riseIn} aria-labelledby="home-title" className="overflow-hidden rounded-[var(--radius-card)] p-5 text-white shadow-lift sm:p-8" style={{ background: 'var(--hero)' }}>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-sm capitalize text-white/75">{date}</p>
          <h1 id="home-title" className="mt-1 text-[1.75rem] leading-tight font-semibold tracking-tight text-balance sm:text-4xl">{greeting(now.getHours())}</h1>
          <p className="mt-2 text-sm text-white/80 sm:text-base">{remaining > 0 ? `Còn ${remaining} phút nữa là đủ mục tiêu ${goal} phút hôm nay.` : `Bạn đã đủ mục tiêu ${goal} phút hôm nay.`}</p>
        </div>
        <div className="flex w-full items-center gap-5 sm:w-auto sm:gap-6">
          <ProgressRing value={minutesToday / goal} size={64} stroke={6} tone="white" label={`${minutesToday}′`} />
          <div className="min-w-0"><b className="block text-xl tabular-nums sm:text-2xl">{streak} ngày</b><span className="text-sm text-white/75">chuỗi học</span></div>
          <div className="min-w-0 border-l border-white/20 pl-5 sm:pl-6"><b className="block text-xl tabular-nums sm:text-2xl">{flashcards}</b><span className="text-sm text-white/75">từ đã học</span></div>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-white/12 p-4 backdrop-blur-sm sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{showLesson ? 'Bài đang học' : 'Bước tiếp theo'}</p>
          {showLesson && <p lang="zh-CN" className={`font-han mt-1.5 leading-tight break-words ${[...next.lesson.title].length > 4 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'}`}>{next.lesson.title}</p>}
          <p className="mt-1 font-medium break-words">{showLesson ? action.detail.replace(` · ${next.lesson.title}`, '') : action.detail}</p>
        </div>
        <Link to={action.to} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-base font-semibold text-jade shadow-sm transition hover:bg-white/90 dark:text-[#10493d]">{action.label}<span aria-hidden="true">→</span></Link>
      </div>
    </motion.section>

    <motion.section variants={riseIn} aria-label="Việc nên làm" className="grid gap-3 sm:gap-4 md:grid-cols-2">
      <ActionCard to="/review" glyph="复" title={flashcards ? `${flashcards} thẻ để ôn` : 'Ôn tập flashcard'} detail={flashcards ? 'Từ mới trong các bài đã hoàn thành' : 'Hoàn thành một bài để có thẻ ôn đầu tiên'} cta="Ôn tập" />
      <ActionCard to="/pronunciation?tab=intro" glyph="音" title="Phát âm và thanh điệu" detail={`${pronunciation.completed}/${pronunciation.total} mục nền tảng`} cta="Luyện" />
    </motion.section>

    <Rise><Card raised className="p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Hành trình HSK</h2>
        <span className="text-sm text-muted tabular-nums">{done}/{total} bài · <Link to="/stats" className="text-jade underline">Thống kê</Link></span>
      </div>
      <motion.ol variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } } }} className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        {sections.map((s) => {
          const lessonsDone = s.items.filter((i) => i.status === 'done').length
          const count = s.items.length + s.pending
          const current = s.items.some((i) => i.status === 'current')
          return <motion.li variants={popIn} key={s.id}><Link to={`/lesson?stage=${s.id}`} className={`block rounded-xl border p-3 transition-colors ${current ? 'border-jade/40 bg-jade-soft' : 'border-line hover:bg-sunken'}`}>
            <span className="block font-semibold">{s.title.replace(/ · .*$/, '')}</span>
            <ProgressBar value={count ? lessonsDone / count : 0} className="mt-2 h-1.5" />
            <span className="mt-1.5 block text-xs text-muted tabular-nums">{lessonsDone}/{count} bài{current ? ' · đang học' : ''}</span>
          </Link></motion.li>
        })}
      </motion.ol>
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:flex sm:gap-3">
        <ButtonLink to="/lesson" variant="secondary">Tất cả bài học</ButtonLink>
        <ButtonLink to="/radicals" variant="secondary">Từ điển bộ thủ</ButtonLink>
      </div>
    </Card></Rise>
  </Stagger>
}
