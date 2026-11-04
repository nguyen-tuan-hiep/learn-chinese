import { matchPath } from 'react-router-dom'
import { findCourseLesson, LEVELS } from '@/data/course'
import type { CourseLesson } from '@/data/types'
import { greeting } from '@/lib/home'
import { pathSections } from '@/lib/learningPath'
import { Card } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressRing } from '@/components/ui/Progress'
import { Block, Line, SkeletonPage, Text } from '@/components/ui/Skeleton'
import { useSettings } from '@/store/settings'
import { LessonHeader, LessonPartPicker } from '@/components/lesson/LessonHeader'

/*
 * Loading placeholders, one per page. Each one reuses the page's own wrappers, spacing and fixed text,
 * and only replaces what depends on saved progress, so the real page lands in the same place.
 */

/** Card with a progress ring and two lines, as on the Bộ thủ and Phát âm headers. */
function AsideCard() {
  return <Card raised className="flex w-full items-center gap-4 p-4 pr-5 sm:w-auto">
    <ProgressRing value={0} size={48} stroke={5} />
    <div><Line className="font-semibold" w="9rem" /><Line className="text-sm" w="7rem" /></div>
  </Card>
}

const BLANK_STATE = new Map()

export function HomeSkeleton() {
  const now = new Date()
  const date = now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })
  const sections = pathSections(BLANK_STATE)
  const goal = useSettings((s) => s.dailyMinutes)
  return <SkeletonPage label="Đang tải trang chủ" className="w-full min-w-0 space-y-6 pt-4 pb-10 sm:space-y-8 sm:pt-8">
    <section className="overflow-hidden rounded-[var(--radius-card)] p-5 text-white shadow-lift sm:p-8" style={{ background: 'var(--hero)' }}>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-sm capitalize text-white/75">{date}</p>
          <p className="mt-1 text-[1.75rem] leading-tight font-semibold tracking-tight text-balance sm:text-4xl">{greeting(now.getHours())}</p>
          <p className="mt-2 text-sm sm:text-base"><Text light>{`Còn ${goal} phút nữa là đủ mục tiêu ${goal} phút hôm nay.`}</Text></p>
        </div>
        <div className="flex w-full items-center gap-5 sm:w-auto sm:gap-6">
          <ProgressRing value={0} size={64} stroke={6} tone="white" />
          <div className="min-w-0"><Line light className="text-xl sm:text-2xl" w="4.5rem" /><span className="text-sm text-white/75">chuỗi học</span></div>
          <div className="min-w-0 border-l border-white/20 pl-5 sm:pl-6"><Line light className="text-xl sm:text-2xl" w="2.5rem" /><span className="text-sm text-white/75">từ đã học</span></div>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-white/12 p-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0 flex-1">
          <Line light className="text-xs" w="7rem" />
          <p className="mt-1 font-medium"><Text light>Làm quen tiếng Trung và pinyin, rồi bắt đầu HSK 1.</Text></p>
        </div>
        <Block light className="min-h-12 shrink-0 rounded-xl sm:w-40" />
      </div>
    </section>

    <section className="grid gap-3 sm:gap-4 md:grid-cols-2">
      {[['Ôn tập flashcard', 'Học xong phần Từ mới của một bài để có thẻ ôn'], ['Phát âm và thanh điệu', '0/7 mục nền tảng']].map(([title, detail]) => <div key={title} className="flex min-w-0 items-center gap-4 rounded-2xl bg-surface p-4 shadow-card sm:p-5">
        <Block className="size-12 shrink-0 rounded-xl" />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-snug"><Text>{title}</Text></span>
          <span className="mt-0.5 block text-sm"><Text>{detail}</Text></span>
        </span>
        <span aria-hidden="true" className="shrink-0 text-xl text-line sm:hidden">›</span>
      </div>)}
    </section>

    <Card raised className="p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Hành trình HSK</h2>
        <Line className="text-sm" w="7rem" />
      </div>
      <ol className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
        {sections.map((s) => <li key={s.id} className="rounded-xl border border-line p-3">
          <span className="block font-semibold">{s.title.replace(/ · .*$/, '')}</span>
          <Block className="mt-2 h-1.5 rounded-full" />
          <Line className="mt-1.5 text-xs" w="4rem" />
        </li>)}
      </ol>
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:flex sm:gap-3">
        <Block className="min-h-11 rounded-xl sm:w-36" /><Block className="min-h-11 rounded-xl sm:w-36" />
      </div>
    </Card>
  </SkeletonPage>
}

export function CourseSkeleton() {
  const sections = pathSections(BLANK_STATE)
  return <SkeletonPage label="Đang tải bài học" className="w-full min-w-0 space-y-8 pt-6 pb-12 sm:pt-8">
    <header>
      <p className="text-xs font-semibold uppercase tracking-widest text-jade">HSK Standard Course · 1–6</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Bài học của bạn</h1>
      <p className="mt-2 max-w-2xl text-muted">Học lần lượt từng bài, mỗi bài chia thành vài phần ngắn. Mới bắt đầu? <span className="text-jade underline">Làm quen phát âm và pinyin</span> trước.</p>
    </header>

    <Card raised className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-5">
        <ProgressRing value={0} size={76} stroke={7} />
        <div className="min-w-48 flex-1"><Line className="text-lg font-semibold" w="10rem" /><Line className="mt-0.5 text-sm" w="7rem" /></div>
        <Block className="min-h-12 w-full rounded-xl sm:w-40" />
      </div>
      <div className="mt-5 flex min-w-0 items-center gap-4 rounded-xl bg-sunken p-4">
        <Line className="font-han text-3xl leading-none" w="4rem" />
        <div className="min-w-0"><Line className="text-xs" w="8rem" /><Line className="mt-0.5 text-sm" w="10rem" /></div>
      </div>
    </Card>

    <section className="space-y-3">
      {sections.map((section, i) => {
        const open = i === 0
        return <section key={section.id} className={`rounded-2xl bg-surface ${open ? 'shadow-card' : 'border border-line'}`}>
          <div className="flex min-h-18 w-full items-center gap-4 px-4 py-3 sm:px-6">
            <Block className="size-10 shrink-0 rounded-xl" />
            <span className="min-w-0 flex-1">
              <span className="block text-base font-semibold sm:text-lg">Chặng {i + 1} · {section.title}</span>
              <span className="mt-1.5 flex items-center gap-3"><Block className="h-1.5 max-w-40 flex-1 rounded-full" /><Line className="text-sm" w="3.5rem" /></span>
            </span>
          </div>
          {open && <ul className="divide-y divide-line border-t border-line">
            {section.items.slice(0, 6).map((item) => <li key={item.id} className="flex items-center gap-3 px-3 py-3.5 sm:gap-4 sm:px-5">
              <Block className="size-8 shrink-0 rounded-full" />
              <span className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:gap-3">
                <Line className="font-han text-xl leading-snug" w="4rem" /><Line className="text-sm" w="8rem" />
              </span>
              <span className="size-11 shrink-0" />
            </li>)}
          </ul>}
        </section>
      })}
    </section>
  </SkeletonPage>
}

/** Placeholder for the body of a lesson part, shaped like the Từ mới part that most lessons open on. */
function LessonPartSkeleton() {
  return <div className="mt-7 space-y-5 pb-6">
    <div className="flex items-center justify-between gap-2"><Line className="text-xl font-semibold" w="8rem" /><Line className="text-sm" w="5rem" /></div>
    <Block className="h-12 rounded-xl" />
    <div className="flex gap-2 py-1">{[0, 1, 2, 3].map((i) => <Block key={i} className="h-12 w-16 shrink-0 rounded-xl" />)}</div>
    <Card raised className="p-5 sm:p-8">
      <div className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
        <Block className="h-44 w-44 justify-self-center rounded-2xl sm:justify-self-start" />
        <div className="min-w-0"><Line className="text-3xl" w="6rem" /><Line className="mt-2 text-xl" w="min(100%, 16rem)" /><Line className="mt-3 text-sm" w="9rem" /></div>
      </div>
    </Card>
  </div>
}

export function LessonSkeleton({ lesson }: { lesson?: CourseLesson }) {
  return <SkeletonPage label="Đang tải bài học" className="mx-auto w-full max-w-4xl min-w-0 pt-5 sm:pt-7">
    {lesson ? <>
      <LessonHeader lesson={lesson} />
      <LessonPartPicker lesson={lesson} part={null} done={null} />
    </> : <>
      <div className="flex items-center gap-3"><Block className="size-11 shrink-0 rounded-xl" /><div><Line className="text-xs" w="7rem" /><Line className="text-3xl leading-tight sm:text-4xl" w="6rem" /></div></div>
      <div className="mt-5"><Line className="mb-2 text-xs" w="7rem" /><Block className="h-12 rounded-xl" /></div>
    </>}
    <LessonPartSkeleton />
  </SkeletonPage>
}

// Whether the deck had cards last time, so the placeholder can take the matching shape.
const DECK_KEY = 'hanyu:review-has-deck'
export function rememberReviewDeck(hasCards: boolean) {
  try { localStorage.setItem(DECK_KEY, hasCards ? '1' : '0') } catch { /* storage unavailable */ }
}
function hadReviewDeck() {
  try { return localStorage.getItem(DECK_KEY) === '1' } catch { return false }
}

export function ReviewSkeleton() {
  const deck = hadReviewDeck()
  return <SkeletonPage label="Đang tải thẻ ôn tập" className="mx-auto w-full max-w-2xl space-y-6 pt-6 pb-10 sm:pt-8">
    <PageHeader eyebrow="Flashcard" title="Ôn tập" aside={deck && <Block className="h-12 w-72 max-w-full rounded-xl" />}>Từ mới của các bài bạn đã học. Nhớ cách đọc và nghĩa trước, rồi mới lật thẻ.</PageHeader>
    {deck ? <>
      <div className="flex items-center gap-3"><Block className="h-1.5 flex-1 rounded-full" /><Line className="text-sm" w="2.5rem" /></div>
      <Card raised className="flex h-[340px] flex-col items-center justify-center gap-5 sm:h-[380px]">
        <Line className="font-han text-6xl leading-tight sm:text-7xl" w="8rem" />
        <Line className="text-sm" w="7rem" />
      </Card>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <Block className="min-h-12 w-12 rounded-xl" /><Block className="min-h-12 rounded-xl" /><Block className="min-h-12 w-12 rounded-xl" />
      </div>
    </> : <Card raised className="p-8 text-center sm:p-10">
      <Block className="mx-auto size-20 rounded-full" />
      <h2 className="mt-4 text-xl font-semibold">Chưa có flashcard</h2>
      <p className="mx-auto mt-2 max-w-md leading-relaxed text-muted">Học xong phần Từ mới (hoặc phần Bài tập) của một bài, từ mới của bài đó sẽ thành thẻ ôn ở đây.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3"><Block className="min-h-12 w-40 rounded-xl" /><Block className="min-h-12 w-44 rounded-xl" /></div>
    </Card>}
  </SkeletonPage>
}

export function StatsSkeleton() {
  return <SkeletonPage label="Đang tải thống kê" className="w-full min-w-0 space-y-8 pt-6 pb-10 sm:pt-8">
    <PageHeader eyebrow="Tiến độ của bạn" title="Thống kê" aside={<Block className="min-h-11 w-44 rounded-xl" />}>
      Bài đã học, thời gian học và số từ đã có thẻ ôn.
    </PageHeader>
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {['Bài đã hoàn thành', 'Hôm nay', 'Chuỗi ngày học', 'Tổng thời gian'].map((label, i) => <Card raised key={label} className="flex items-center gap-4 p-5">
        {i < 2 && <ProgressRing value={0} size={52} stroke={5} />}
        <div className="min-w-0">
          <Line className="text-2xl font-semibold" w="5rem" />
          <div className="text-sm text-muted">{label}</div>
          {i !== 1 && <Line className="mt-0.5 text-xs" w="7rem" />}
        </div>
      </Card>)}
    </section>
    <Card raised className="p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Thời gian học</h2>
      <div className="mt-4">
        <div className="flex gap-2 overflow-x-auto pb-1"><Block className="h-[137px] w-[440px] shrink-0 rounded-lg" /></div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span><Text>0 ngày có học trong 20 tuần</Text></span>
          <span className="flex items-center gap-1.5">Ít {[0, 1, 2, 3, 4].map((i) => <Block key={i} className="size-3 rounded-[3px]" />)} Nhiều (≥ 60 phút)</span>
        </div>
      </div>
    </Card>
    <Card raised className="p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Từ mới theo cấp</h2>
        <span className="text-sm text-muted">Tính từ đã mở thẻ ôn</span>
      </div>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {LEVELS.map((lv) => <li key={lv.level} className="rounded-xl bg-sunken/70 p-4">
          <div className="flex justify-between text-sm"><span className="font-semibold">{lv.title}</span><Line w="4rem" /></div>
          <Block className="mt-2 h-2 rounded-full bg-surface" />
        </li>)}
      </ul>
    </Card>
  </SkeletonPage>
}

export function RadicalsSkeleton() {
  return <SkeletonPage label="Đang tải từ điển bộ thủ" className="w-full min-w-0 space-y-8 pt-6 pb-12 sm:pt-8">
    <PageHeader eyebrow="Tra cứu · 214 bộ" title="Từ điển bộ thủ" aside={<AsideCard />}>
      Bộ thủ được dạy ngay trong phần <b className="text-ink">Bộ thủ</b> của mỗi bài. Ở đây bạn tra một bộ, xem nó ghép ra những chữ nào và luyện viết thêm.
    </PageHeader>
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <section className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Block className="min-h-12 min-w-60 flex-1 rounded-xl" />
          <Block className="h-12 w-full rounded-xl sm:w-72" />
        </div>
        <Line className="text-sm" w="14rem" />
        <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5">
          {Array.from({ length: 18 }, (_, i) => <li key={i} className="flex flex-col items-center rounded-2xl bg-surface p-3 shadow-card">
            <Line className="font-han mt-2 text-4xl leading-tight" w="2.5rem" />
            <Line className="mt-1 text-sm" w="70%" />
            <Line className="text-[11px]" w="50%" />
          </li>)}
        </ul>
      </section>
      <Block className="hidden h-56 rounded-2xl xl:block" />
    </div>
  </SkeletonPage>
}

export function PronunciationSkeleton() {
  return <SkeletonPage label="Đang tải phần phát âm" className="w-full min-w-0 pt-6 pb-10 sm:pt-8">
    <PageHeader eyebrow="Pinyin · thanh điệu" title="Phát âm" aside={<AsideCard />}>
      Chạm vào ô bất kỳ để nghe và đọc to theo. Thanh điệu sai thì nghĩa sai, nên đây là phần cần luyện đều mỗi ngày.
    </PageHeader>
    <Block className="mt-5 h-11 rounded-xl" />
    <div className="mt-6 py-2 md:p-0"><Block className="h-12 rounded-xl" /></div>
    <div className="mt-6 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => <Block key={i} className="h-28 rounded-2xl min-[480px]:h-48" />)}
    </div>
  </SkeletonPage>
}

export function SettingsSkeleton() {
  return <SkeletonPage label="Đang tải cài đặt" className="mx-auto w-full max-w-3xl min-w-0 pt-6 pb-10 sm:pt-8">
    <PageHeader eyebrow="Tùy chỉnh" title="Cài đặt">Mục tiêu học, giọng đọc, giao diện và sao lưu tiến độ. Xem số liệu học tập ở <span className="text-jade underline">Thống kê</span>.</PageHeader>
    <Card raised className="mt-6 px-5">
      {([['Mục tiêu thời gian mỗi ngày', false, 'h-12 w-full sm:w-80'], ['Tốc độ giọng đọc', true, 'h-4 w-44'], ['Giọng đọc', true, 'h-11 w-60'], ['Giao diện', false, 'h-12 w-60']] as const).map(([title, desc, size]) => <div key={title} className="flex flex-col justify-between gap-3 border-b border-line py-4 last:border-none sm:flex-row sm:items-center">
        <div><div className="font-semibold">{title}</div>{desc && <Line className="text-sm" w="8rem" />}</div>
        <Block className={`max-w-full rounded-xl ${size}`} />
      </div>)}
    </Card>
    <Block className="mt-8 h-80 rounded-2xl" />
  </SkeletonPage>
}

/** Generic placeholder for pages without their own. */
export function PageSkeleton() {
  return <SkeletonPage label="Đang tải" className="w-full min-w-0 space-y-6 pt-6 pb-10 sm:pt-8">
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
  if (lesson) return <LessonSkeleton lesson={findCourseLesson(lesson.params.id ?? '')} />
  if (pathname === '/review') return <ReviewSkeleton />
  if (pathname === '/stats') return <StatsSkeleton />
  if (pathname === '/radicals') return <RadicalsSkeleton />
  if (pathname === '/pronunciation') return <PronunciationSkeleton />
  if (pathname === '/settings') return <SettingsSkeleton />
  return <PageSkeleton />
}
