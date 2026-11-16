import { Link } from 'react-router-dom'
import { PartyPopper } from 'lucide-react'
import type { CourseModel } from '@/lib/courseModel'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { ButtonLink } from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/Progress'

/** Dark summary: progress ring, counts, the lesson to continue and the primary "Continue" pill (one row on desktop). */
export function ProgressPanel({ course, skipped, partLabel, error, className = '' }: {
  course: Pick<CourseModel, 'version' | 'summary' | 'current'>
  skipped: number
  /** Name of the part to continue, e.g. "Vocabulary". */
  partLabel?: string
  error?: string
  className?: string
}) {
  const { summary, current, version } = course
  const pct = summary.lessonsTotal ? summary.lessonsDone / summary.lessonsTotal : 0
  const ring = '#ffffff'
  const extra = [
    version === '2.0' && summary.radicalsTotal ? `Radicals ${summary.radicalsLearned}/${summary.radicalsTotal}` : null,
    skipped > 0 ? `${skipped} skipped` : null,
  ].filter(Boolean).join(' · ')
  const ringLabel = (size: string) => <span className={`font-display font-extrabold leading-none ${size}`}><AnimatedNumber countUp value={Math.round(pct * 100)} /><span className="text-callout opacity-60">%</span></span>
  const part = `HSK ${current?.level} · Lesson ${current?.number}${partLabel ? ` · ${partLabel}` : ''}`
  const subtitle = current?.subtitle?.replace(/ · \d+ new words?$/, '')
  // Phones: ring and counts on top, then a white card for the next lesson and a full-width "Continue".
  // Desktop (lg): one dark row — ring and counts, a divider, the next lesson as text, and a "Continue" pill on the right.
  return <section aria-label="Course progress" className={`rounded-[2rem] bg-[#15120f] p-5 text-white shadow-card sm:rounded-[2.25rem] sm:p-7 lg:flex lg:items-center lg:gap-6 lg:py-6 dark:bg-black dark:ring-1 dark:ring-white/10 ${className}`}>
    <div className="flex items-center gap-5 lg:shrink-0 lg:gap-4 lg:border-r lg:border-white/15 lg:pr-6">
      <div className="lg:hidden"><ProgressRing tone="white" color={ring} to={ring} value={pct} size={104} stroke={10} label="Course progress">{ringLabel('text-title1')}</ProgressRing></div>
      <div className="hidden lg:block"><ProgressRing tone="white" color={ring} to={ring} value={pct} size={76} stroke={8} label="Course progress">{ringLabel('text-title3')}</ProgressRing></div>
      <div className="min-w-0 flex-1">
        <h2 className="text-title3 font-bold tabular-nums leading-tight lg:whitespace-nowrap">{summary.lessonsDone}/{summary.lessonsTotal} <span className="font-medium opacity-70">lessons done</span></h2>
        <p className="mt-1 text-footnote font-semibold opacity-70">{Math.round(pct * 100)}% of the whole course</p>
        {extra && <p className="mt-1 text-footnote opacity-70">{extra}</p>}
      </div>
    </div>
    {current ? <>
      <div className="mt-5 lg:hidden">
        <div className="rounded-[1.75rem] bg-white p-4 text-[#15120f] dark:bg-white/10 dark:text-[#f5f1e8]">
          <span lang="zh-CN" className="font-han block break-words text-title1 leading-tight">{current.title}</span>
          {subtitle && <p className="mt-1 truncate text-subhead text-secondary-label">{subtitle}</p>}
          <p className="mt-2.5 inline-block rounded-full bg-black/8 dark:bg-white/10 px-2.5 py-0.5 text-caption font-semibold">{part}</p>
        </div>
        <ButtonLink to={current.to} size="lg" className="mt-4 w-full bg-white! text-[#15120f]! dark:bg-[#f3eee4]!">Continue <span aria-hidden="true">→</span></ButtonLink>
      </div>
      <div className="hidden min-w-0 flex-1 items-center gap-6 lg:flex">
        <div className="min-w-0 flex-1">
          <p className="truncate text-footnote font-semibold text-white/70">Up next · {part}</p>
          <span lang="zh-CN" className="font-han mt-1 block truncate text-title1 leading-tight">{current.title}</span>
          {subtitle && <p className="mt-0.5 truncate text-subhead text-white/70">{subtitle}</p>}
        </div>
        <ButtonLink to={current.to} size="lg" className="shrink-0 bg-white! px-7 text-[#15120f]! dark:bg-[#f3eee4]!">Continue <span aria-hidden="true">→</span></ButtonLink>
      </div>
    </> : <div className="mt-5 flex items-start gap-3 rounded-card bg-success-soft p-4 text-success-text lg:mt-0 lg:flex-1">
      <PartyPopper aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0">
        <p className="text-subhead font-semibold">You have finished every lesson available</p>
        <p className="mt-0.5 text-footnote"><Link to="/review" className="underline">Review</Link> your cards and revisit any lessons you skipped.</p>
      </div>
    </div>}
    {error && <p role="alert" className="mt-3 text-footnote text-[#ff9b94]">{error}</p>}
  </section>
}
