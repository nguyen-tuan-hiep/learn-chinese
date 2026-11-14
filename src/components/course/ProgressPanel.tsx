import { Link } from 'react-router-dom'
import { PartyPopper } from 'lucide-react'
import type { CourseModel } from '@/lib/courseModel'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { ButtonLink } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/Progress'

/** Raised glass summary: progress ring, counts, the lesson to continue and the primary "Tiếp tục học" pill. */
export function ProgressPanel({ course, skipped, partLabel, error, className = '' }: {
  course: Pick<CourseModel, 'version' | 'summary' | 'current'>
  skipped: number
  /** Name of the part to continue, e.g. "Từ vựng". */
  partLabel?: string
  error?: string
  className?: string
}) {
  const { summary, current, version } = course
  const pct = summary.lessonsTotal ? summary.lessonsDone / summary.lessonsTotal : 0
  const ring = '#ffffff'
  const extra = [
    version === '2.0' && summary.radicalsTotal ? `Bộ thủ ${summary.radicalsLearned}/${summary.radicalsTotal}` : null,
    skipped > 0 ? `${skipped} bài bỏ qua` : null,
  ].filter(Boolean).join(' · ')
  return <section aria-label="Tiến độ học tập" className={`rounded-[2rem] bg-[#15120f] p-5 text-white shadow-card sm:rounded-[2.25rem] sm:p-7 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-center lg:gap-8 dark:bg-black dark:ring-1 dark:ring-white/10 ${className}`}>
    <div className="flex items-center gap-5">
      <ProgressRing tone="white" color={ring} to={ring} value={pct} size={88} stroke={9} />
      <div className="min-w-0 flex-1">
        <p className="text-large-title leading-none"><AnimatedNumber value={Math.round(pct * 100)} /><span className="text-title2 opacity-60">%</span></p>
        <h2 className="mt-1.5 text-subhead font-medium tabular-nums">{summary.lessonsDone}/{summary.lessonsTotal} bài đã học</h2>
        {extra && <p className="text-footnote opacity-70">{extra}</p>}
      </div>
    </div>
    {current ? <div className="mt-5 lg:mt-0">
      <div className="rounded-3xl bg-white p-4 text-[#15120f] dark:bg-white/10 dark:text-[#f5f1e8]">
        <span lang="zh-CN" className="font-han block break-words text-title1 leading-tight">{current.title}</span>
        {current.subtitle && <p className="mt-1 truncate text-subhead text-secondary-label">{current.subtitle.replace(/ · \d+ từ mới$/, '')}</p>}
        <p className="mt-2.5 inline-block rounded-full bg-black/8 dark:bg-white/10 px-2.5 py-0.5 text-caption font-semibold">HSK {current.level} · Bài {current.number}{partLabel ? ` · ${partLabel}` : ''}</p>
      </div>
      <ButtonLink to={current.to} size="lg" className="mt-4 w-full bg-white! text-[#15120f]! dark:bg-[#f3eee4]!">Tiếp tục học <span aria-hidden="true">→</span></ButtonLink>
    </div> : <div className="mt-5 flex items-start gap-3 rounded-card bg-success-soft p-4 text-success-text">
      <PartyPopper aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0">
        <p className="text-subhead font-semibold">Bạn đã đi hết lộ trình hiện có</p>
        <p className="mt-0.5 text-footnote">Hãy <Link to="/review" className="underline">ôn tập</Link> và xem lại các bài đã bỏ qua.</p>
      </div>
    </div>}
    {error && <p role="alert" className="mt-3 text-footnote text-[#ff9b94]">{error}</p>}
  </section>
}
