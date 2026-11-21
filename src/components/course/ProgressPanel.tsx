import { Link } from 'react-router-dom'
import { ArrowRight, PartyPopper } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { CourseModel } from '@/lib/courseModel'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { ProgressRing } from '@/components/ui/Progress'
import { levelColor } from '@/lib/palette'

/**
 * Course summary in the same glass-tile language as Home: the current level's colour glows from the right edge.
 * Left: a ring with the course percentage and the counts. Right: the lesson to continue and one black "Continue" pill.
 * Phones stack the two halves.
 */
export function ProgressPanel({ course, skipped, partLabel, error, className = '' }: {
  course: Pick<CourseModel, 'version' | 'summary' | 'current'>
  skipped: number
  /** Name of the part to continue, e.g. "Vocabulary". */
  partLabel?: string
  error?: string
  className?: string
}) {
  const { summary, current } = course
  const pct = summary.lessonsTotal ? summary.lessonsDone / summary.lessonsTotal : 0
  const extra = skipped > 0 ? `${skipped} skipped` : ''
  const part = `HSK ${current?.level} · Lesson ${current?.number}${partLabel ? ` · ${partLabel}` : ''}`
  const subtitle = current?.subtitle?.replace(/ · \d+ new words?$/, '')
  return <section aria-label="Course progress" style={{ '--tint': levelColor(current?.level ?? 1), '--sun': '55% 160% at 100% 120%' } as CSSProperties}
    className={`on-light glass-card glow-tiles relative flex flex-col gap-5 overflow-hidden rounded-[2rem] p-5 sm:rounded-[2.25rem] sm:p-7 lg:flex-row lg:items-center lg:gap-8 ${className}`}>
    <div className="flex items-center gap-4 lg:shrink-0">
      <ProgressRing from="var(--tint)" to="var(--deep)" value={pct} size={80} stroke={8} label="Course progress">
        <span className="font-display text-title3 leading-none font-extrabold"><AnimatedNumber countUp value={Math.round(pct * 100)} /><span className="text-footnote opacity-60">%</span></span>
      </ProgressRing>
      <div className="min-w-0">
        <h2 className="text-title3 leading-tight font-bold tabular-nums">{summary.lessonsDone}/{summary.lessonsTotal} <span className="font-medium text-secondary-label">lessons</span></h2>
        <p className="mt-1 text-footnote text-secondary-label tabular-nums">{summary.wordsLearned.toLocaleString('en-US')}/{summary.wordsTotal.toLocaleString('en-US')} words{extra ? ` · ${extra}` : ''}</p>
      </div>
    </div>
    <span aria-hidden="true" className="hidden h-14 w-px bg-separator lg:block" />
    {current ? <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate text-footnote font-semibold text-secondary-label"><span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-(--deep)" />Up next · {part}</p>
        <span lang="zh-CN" className="font-han mt-1 block truncate text-title1 leading-tight">{current.title}</span>
        {subtitle && <p className="mt-0.5 truncate text-subhead text-secondary-label">{subtitle}</p>}
      </div>
      <Link to={current.to} className="ink-pill inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 self-start rounded-full pr-5 pl-6 text-callout font-bold shadow-(--cta-shadow) transition-transform active:scale-[0.97] sm:self-auto">
        Continue<ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.4} />
      </Link>
    </div> : <div className="flex min-w-0 flex-1 items-start gap-3">
      <PartyPopper aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0">
        <p className="text-subhead font-semibold">You have finished every lesson available</p>
        <p className="mt-0.5 text-footnote text-secondary-label"><Link to="/review" className="underline">Review</Link> your cards and revisit any lessons you skipped.</p>
      </div>
    </div>}
    {error && <p role="alert" className="text-footnote text-danger-text">{error}</p>}
  </section>
}
