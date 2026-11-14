import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpenCheck, Flame, Languages, Settings as SettingsIcon, Target } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Glass } from '@/components/ui/Glass'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { LargeTitle } from '@/components/ui/PageHeader'
import { Segmented } from '@/components/ui/Segmented'
import { Stagger } from '@/components/ui/motion'
import { ScrubChart, type ChartRange } from '@/components/stats/ScrubChart'
import { StatTile } from '@/components/stats/StatTile'
import { Heatmap } from '@/components/stats/Heatmap'
import { LevelProgress } from '@/components/stats/LevelProgress'
import { StatsSkeleton } from '@/components/stats/StatsSkeleton'
import { featureColor } from '@/lib/palette'
import { useCourse } from '@/lib/courseModel'
import { dateKey } from '@/lib/progress'
import { useStudyData } from '@/lib/useStudyData'
import { useSettings } from '@/store/settings'

const RANGES = [
  { value: '7', label: '7 ngày' },
  { value: '30', label: '30 ngày' },
  { value: '90', label: '90 ngày' },
] as const

const vn = (n: number, digits = 0) => n.toLocaleString('vi-VN', { maximumFractionDigits: digits })

/** Stats for both HSK versions: total time hero with a draggable chart, metric tiles, level progress, 20-week heatmap. */
export function StatsPage() {
  const course = useCourse()
  const { days } = useStudyData()
  const goal = useSettings((s) => s.dailyMinutes)
  const [range, setRange] = useState<'7' | '30' | '90'>('30')

  const { totalMinutes, weekDelta } = useMemo(() => {
    const total = Math.round(days.reduce((a, d) => a + d.seconds, 0) / 60)
    const map = new Map(days.map((d) => [d.date, d.seconds]))
    const sumWeek = (offset: number) => {
      const c = new Date()
      c.setDate(c.getDate() - offset)
      let s = 0
      for (let i = 0; i < 7; i++) { s += map.get(dateKey(c)) ?? 0; c.setDate(c.getDate() - 1) }
      return Math.round(s / 60)
    }
    const cur = sumWeek(0), prev = sumWeek(7)
    return { totalMinutes: total, weekDelta: prev > 0 ? cur - prev : null }
  }, [days])

  if (!course.loaded) return <StatsSkeleton />
  const { summary, levels, streak, minutesToday } = course
  const hours = totalMinutes >= 60
  const showRadicals = summary.radicalsTotal !== undefined

  return <div className="w-full min-w-0 space-y-6 pt-6 pb-10 sm:pt-8">
    <LargeTitle eyebrow="Tiến độ của bạn" title="Thống kê"
      aside={<ButtonLink to="/settings" variant="secondary"><SettingsIcon size={16} aria-hidden="true" />Mục tiêu & cài đặt</ButtonLink>} />

    <Glass material="thick" as="section" aria-label="Thời gian học" className="p-5 sm:p-6">
      <p className="text-footnote font-medium text-secondary-label">Tổng thời gian học</p>
      <p className="mt-1 text-[2.75rem] font-bold leading-none tracking-tight">
        <AnimatedNumber value={hours ? totalMinutes / 60 : totalMinutes} format={(n) => hours ? vn(n, 1) : vn(Math.round(n))} />
        <span className="text-title3 font-semibold text-secondary-label"> {hours ? 'giờ' : 'phút'}</span>
      </p>
      <p className="mt-1 min-h-5 text-footnote font-medium">
        {weekDelta !== null && <span className={weekDelta >= 0 ? 'text-success-text' : 'text-danger-text'}>
          <span aria-hidden="true">{weekDelta >= 0 ? '▲' : '▼'}</span> {weekDelta >= 0 ? '+' : '−'}{vn(Math.abs(weekDelta))} phút so với tuần trước
        </span>}
      </p>
      <Segmented label="Khoảng thời gian" fill className="mt-4" options={RANGES} value={range} onChange={setRange} />
      <div className="mt-4"><ScrubChart days={days} range={Number(range) as ChartRange} goal={goal} /></div>
    </Glass>

    <Stagger aria-label="Tổng quan" role="region" className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <StatTile color={featureColor('lesson')} icon={<BookOpenCheck size={18} />} label="Bài đã hoàn thành" value={summary.lessonsDone} total={summary.lessonsTotal} ring={summary.lessonsTotal ? summary.lessonsDone / summary.lessonsTotal : 0} />
      <StatTile color="var(--color-tint)" icon={<Target size={18} />} label="Hôm nay" value={minutesToday} total={goal} unit="phút" ring={goal ? minutesToday / goal : 0} />
      <StatTile color="var(--color-tint)" icon={<Flame size={18} />} label="Chuỗi ngày" value={streak} unit="ngày" caption="Tính ngày học từ 1 phút" />
      <StatTile color="var(--color-tint)" icon={<Languages size={18} />} label="Từ đã học" value={summary.wordsLearned} total={summary.wordsTotal} ring={summary.wordsTotal ? summary.wordsLearned / summary.wordsTotal : 0}
        caption={showRadicals ? `${summary.radicalsLearned ?? 0}/${summary.radicalsTotal} bộ thủ` : undefined} />
    </Stagger>

    <LevelProgress levels={levels} />
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.3 }}><Heatmap days={days} /></motion.div>

    <p className="px-1 text-footnote text-secondary-label">Muốn đổi mục tiêu mỗi ngày hoặc sao lưu tiến độ? Mở <Link to="/settings" className="text-tint-text underline">Cài đặt</Link>.</p>
  </div>
}
