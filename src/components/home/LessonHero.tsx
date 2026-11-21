import { BrandMark } from '@/components/layout/BrandMark'
import { Link } from 'react-router-dom'
import { ArrowRight, PartyPopper } from 'lucide-react'
import type { CourseModel } from '@/lib/courseModel'
import { motion, useReducedMotion } from 'framer-motion'
import { spring } from '@/components/ui/motion'
import { ButtonLink } from '@/components/ui/Button'
import type { CSSProperties } from 'react'

// Same glass-tile language as the HSK level tiles: the level colour rises as a soft sun from the bottom-right,
// where Baobao sits; text stays on the clean tinted part. Day ink in both themes.
// Sun yellow: a colour no HSK level uses, so "what to do now" never reads as one of the level tiles below.
const HERO_TINT = '#ffd27a'
const card = 'on-light glass-card glow-tiles relative overflow-hidden rounded-[2.25rem] p-6 sm:rounded-[2.75rem] sm:px-8 sm:py-5'

/** The lesson to continue: eyebrow, the lesson's hanzi and meaning, its progress, and one black "continue" pill. */
export function LessonHero({ current, next }: Pick<CourseModel, 'current' | 'next'>) {
  const reduce = useReducedMotion()
  if (!current || !next) {
    return <section className={card} style={{ '--tint': 'var(--pastel-yellow)' } as CSSProperties}>
      <PartyPopper aria-hidden="true" className="size-8" />
      <h2 className="mt-3 text-title1">You have finished the whole path</h2>
      <p className="mt-1 text-callout opacity-70">Keep reviewing your word cards so they stay fresh.</p>
      <ButtonLink to="/review" size="lg" className="mt-5">Review<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>
    </section>
  }
  const onLesson = next.to === current.to
  const pct = Math.round(current.progress * 100)
  // Fit the title on one line: its width in ems (Latin letters and digits are about half a Han character),
  // and the font shrinks with the text column (container units) down to a floor, below which it may wrap.
  const ems = [...current.title].reduce((w, ch) => w + (/[\x00-\x7f]/.test(ch) ? 0.62 : 1), 0)
  const titleSize = `max(2rem, min(3.5rem, calc(100cqi / ${(ems * 1.3).toFixed(2)})))`
  return <section aria-label="Current lesson" style={{ '--tint': HERO_TINT, '--sun': '95% 150% at 100% 120%' } as CSSProperties} className={`${card} flex min-h-[12.5rem] flex-col justify-between gap-4`}>
    {/* Baobao sits in the glow at the bottom right, fully drawn and alive (blinks, reacts). */}
    <BrandMark live className="pointer-events-none absolute -right-5 -bottom-7 size-40 rotate-[-8deg] drop-shadow-[0_18px_30px_rgb(21_18_15/0.18)] sm:-right-5 sm:-bottom-9 sm:size-48" />
    <div className="relative max-w-[72%] @container">
      <p className="flex items-center gap-2 text-footnote font-semibold text-secondary-label">
        <span aria-hidden="true" className="size-2 rounded-full bg-(--deep)" />{onLesson ? `HSK ${current.level} · Lesson ${current.number}` : 'Next step'}
      </p>
      {onLesson
        ? <h2 lang="zh-CN" style={{ fontSize: titleSize }} className="font-han mt-2 leading-tight font-bold break-words">{current.title}</h2>
        : <h2 className="mt-3 text-title1 leading-snug text-balance">{next.detail}</h2>}
      {onLesson && current.subtitle && <p className="mt-1 text-callout font-medium text-secondary-label sm:text-title3 sm:font-medium text-balance">{current.subtitle}</p>}
    </div>
    <div className="relative flex flex-col items-start gap-3">
      {/* Progress: a slim bar in the level colour with the percentage beside it. */}
      <div aria-hidden="true" className="flex w-full max-w-56 items-center gap-3">
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-(--tile-track)">
          <motion.span initial={reduce ? false : { width: 0 }} animate={{ width: `${pct}%` }} transition={reduce ? { duration: 0 } : { ...spring.smooth, delay: 0.25 }}
            className="block h-full rounded-full bg-(--deep)" />
        </span>
        <span className="text-footnote font-semibold tabular-nums text-secondary-label">{pct}%</span>
      </div>
      <Link to={next.to} aria-label={`${next.label}, ${pct}% of this lesson done`}
        className="ink-pill inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full pr-5 pl-6 text-callout font-bold whitespace-nowrap shadow-(--cta-shadow) transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:brightness-125 active:scale-[0.97]">
        {next.label}<ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.4} />
      </Link>
    </div>
  </section>
}
