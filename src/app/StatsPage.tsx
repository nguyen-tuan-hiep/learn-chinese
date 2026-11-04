import { StatsSkeleton } from './skeletons'
import { Link } from 'react-router-dom'
import { LESSONS, LEVELS } from '@/data/course'
import { ButtonLink, Card } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { riseIn } from '@/components/ui/motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar, ProgressRing } from '@/components/ui/Progress'
import { dateKey } from '@/lib/progress'
import { useStudyData } from '@/lib/useStudyData'
import { completedLessonWords, isLessonComplete } from '@/lib/lessonState'
import { useSettings } from '@/store/settings'

const WEEKDAYS = ['T2', '', 'T4', '', 'T6', '', 'CN']
const SHADES = ['bg-sunken', 'bg-jade/25', 'bg-jade/45', 'bg-jade/70', 'bg-jade']
const shade = (m: number) => SHADES[m === 0 ? 0 : m < 15 ? 1 : m < 30 ? 2 : m < 60 ? 3 : 4]

/** Last 20 weeks of study time, Monday-first columns like a calendar. */
function Heatmap({ days }: { days: { date: string; seconds: number }[] }) {
  const map = new Map(days.map((d) => [d.date, d.seconds]))
  const weeks = 20
  const end = new Date()
  const start = new Date(end)
  start.setDate(end.getDate() - (weeks - 1) * 7 - ((end.getDay() + 6) % 7))
  const cells: { date: string; mins: number; future: boolean }[] = []
  for (let d = new Date(start); cells.length < weeks * 7; d.setDate(d.getDate() + 1)) {
    const k = dateKey(d)
    cells.push({ date: k, mins: Math.round((map.get(k) ?? 0) / 60), future: d > end })
  }
  const active = cells.filter((c) => c.mins > 0).length
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <div aria-hidden="true" className="grid grid-rows-7 gap-1 pt-px text-[10px] leading-4 text-muted">{WEEKDAYS.map((d, i) => <span key={i} className="h-4">{d}</span>)}</div>
        <div className="grid w-fit grid-flow-col grid-rows-7 gap-1" role="img" aria-label={`${active} ngày có học trong ${weeks} tuần gần nhất`}>
          {cells.map((c) => <div key={c.date} title={`${c.date}: ${c.mins} phút`} className={`size-4 rounded-[4px] ${c.future ? 'opacity-0' : shade(c.mins)}`} />)}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span><b className="text-ink tabular-nums">{active}</b> ngày có học trong {weeks} tuần</span>
        <span className="flex items-center gap-1.5">Ít {SHADES.map((c) => <span key={c} className={`size-3 rounded-[3px] ${c}`} />)} Nhiều (≥ 60 phút)</span>
      </div>
    </div>
  )
}

function Metric({ label, value, hint, ring }: { label: string; value: string; hint?: string; ring?: number }) {
  return <motion.div variants={riseIn}><Card raised className="flex h-full items-center gap-4 p-5">
    {ring !== undefined && <ProgressRing value={ring} size={52} stroke={5} />}
    <div className="min-w-0">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-sm text-muted">{label}</div>
      {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
    </div>
  </Card></motion.div>
}

export function StatsPage() {
  const { loaded, days, streak, lessonState, minutesToday } = useStudyData()
  const goal = useSettings((s) => s.dailyMinutes)

  if (!loaded) return <StatsSkeleton />
  const flashcards = completedLessonWords(lessonState)
  const completedLessons = LESSONS.filter((lesson) => isLessonComplete(lessonState, lesson))
  const startedLessons = LESSONS.filter((lesson) => Object.values(lessonState.get(lesson.id)?.done ?? {}).some(Boolean))
  const totalMinutes = Math.round(days.reduce((a, d) => a + d.seconds, 0) / 60)

  return (
    <div className="w-full min-w-0 space-y-8 pt-6 pb-10 sm:pt-8">
      <PageHeader eyebrow="Tiến độ của bạn" title="Thống kê" aside={<ButtonLink to="/settings" variant="secondary">Mục tiêu & cài đặt</ButtonLink>}>
        Bài đã học, thời gian học và số từ đã có thẻ ôn.
      </PageHeader>

      <motion.section aria-label="Tổng quan" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
        <Metric label="Bài đã hoàn thành" value={`${completedLessons.length}/${LESSONS.length}`} hint={`${startedLessons.length} bài đã bắt đầu`} ring={completedLessons.length / LESSONS.length} />
        <Metric label="Hôm nay" value={`${minutesToday}/${goal} phút`} ring={minutesToday / goal} />
        <Metric label="Chuỗi ngày học" value={`${streak} ngày`} hint="Tính ngày học từ 1 phút" />
        <Metric label="Tổng thời gian" value={totalMinutes >= 60 ? `${(totalMinutes / 60).toFixed(1)} giờ` : `${totalMinutes} phút`} hint={`${flashcards.length} từ có thẻ ôn`} />
      </motion.section>

      <Card raised className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Thời gian học</h2>
        <div className="mt-4"><Heatmap days={days} /></div>
      </Card>

      <Card raised className="p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">Từ mới theo cấp</h2>
          <span className="text-sm text-muted">Tính từ đã mở thẻ ôn</span>
        </div>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {LEVELS.map((lv) => {
            const n = flashcards.filter(({ lesson }) => lesson.level === lv.level).length
            const total = LESSONS.filter((lesson) => lesson.level === lv.level).reduce((sum, lesson) => sum + lesson.words.length, 0)
            return <li key={lv.level} className="rounded-xl bg-sunken/70 p-4">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{lv.title}</span>
                <span className="text-muted tabular-nums">{n}/{total} từ</span>
              </div>
              <ProgressBar value={total ? n / total : 0} className="mt-2" />
            </li>
          })}
        </ul>
      </Card>

      <p className="text-sm text-muted">Muốn đổi mục tiêu mỗi ngày hoặc sao lưu tiến độ? Mở <Link to="/settings" className="text-jade underline">Cài đặt</Link>.</p>
    </div>
  )
}
