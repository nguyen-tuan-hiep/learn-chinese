import { BrandMark } from '@/components/layout/BrandMark'
import { Link } from 'react-router-dom'
import { ArrowRight, PartyPopper } from 'lucide-react'
import type { CourseModel } from '@/lib/courseModel'
import { motion, useReducedMotion } from 'framer-motion'
import { spring } from '@/components/ui/motion'
import { ButtonLink } from '@/components/ui/Button'
import { NowBadge } from '@/components/ui/NowBadge'

const card = 'on-pastel relative overflow-hidden rounded-[2.25rem] bg-[var(--pastel-blue)] p-6 text-[#15120f] shadow-[0_18px_40px_rgb(21_18_15/0.1)] sm:rounded-[2.75rem] sm:p-9 dark:text-[#f5f1e8]'
const pill = 'inline-flex rounded-full bg-white px-3.5 py-1.5 text-footnote font-semibold text-[#15120f] dark:bg-white/15 dark:text-[#f5f1e8]'

/** The lesson to continue: a big pastel card with the lesson's hanzi, progress and the black "continue" pill. */
export function LessonHero({ current, next }: Pick<CourseModel, 'current' | 'next'>) {
  const reduce = useReducedMotion()
  if (!current || !next) {
    return <section className={card}>
      <PartyPopper aria-hidden="true" className="size-8" />
      <h2 className="mt-3 text-title1">You have finished the whole path</h2>
      <p className="mt-1 text-callout opacity-70">Keep reviewing your word cards so they stay fresh.</p>
      <ButtonLink to="/review" size="lg" className="mt-5">Review<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>
    </section>
  }
  const onLesson = next.to === current.to
  const pct = Math.round(current.progress * 100)
  // Fit the title on one line: its width in ems (Latin letters and digits are about half a Han character),
  // and the font shrinks with the card (container units) down to a floor, below which it may wrap.
  const ems = [...current.title].reduce((w, ch) => w + (/[\x00-\x7f]/.test(ch) ? 0.62 : 1), 0)
  const titleSize = `max(2rem, min(5.25rem, calc(100cqi / ${(ems * 1.3).toFixed(2)})))`
  return <section aria-label="Current lesson" style={{ background: 'var(--pastel-green)' }} className={`${card} flex flex-col justify-between gap-6`}>
    {/* A big faint bánh bao, tilted, peeking from the right edge. */}
    <BrandMark className="pointer-events-none absolute -top-6 -right-14 size-64 rotate-[14deg] opacity-20 sm:-top-10 sm:-right-16 sm:size-96" />
    <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute top-5 right-24 size-6 animate-[twinkle_3s_ease-in-out_infinite] fill-white sm:right-40 sm:size-8"><path d="M12 1c.8 6.2 4.8 10.2 11 11-6.2.8-10.2 4.8-11 11-.8-6.2-4.8-10.2-11-11C7.2 11.2 11.2 7.2 12 1z" /></svg>
    <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute right-10 bottom-28 size-4 animate-[twinkle_3s_ease-in-out_1.2s_infinite] fill-white/80 sm:right-16 sm:bottom-36 sm:size-5"><path d="M12 1c.8 6.2 4.8 10.2 11 11-6.2.8-10.2 4.8-11 11-.8-6.2-4.8-10.2-11-11C7.2 11.2 11.2 7.2 12 1z" /></svg>
    <div className="relative @container">
      <div className="flex flex-wrap gap-2">
        <span className={pill}>{onLesson ? `HSK ${current.level} · Lesson ${current.number}` : 'Next step'}</span>
        <NowBadge className="px-3.5 py-1.5 text-footnote" />
      </div>
      {onLesson
        ? <h2 lang="zh-CN" style={{ fontSize: titleSize }} className="font-han mt-4 leading-tight font-bold break-words">{current.title}</h2>
        : <h2 className="mt-4 text-title1 leading-snug text-balance">{next.detail}</h2>}
      {onLesson && current.subtitle && <p className="mt-1 text-callout font-medium opacity-70 sm:text-title3 sm:font-medium text-balance">{current.subtitle}</p>}
    </div>
    <div className="relative flex items-center gap-4">
      {/* The continue button is the progress bar: the ink fills it from the left as the lesson gets done.
          The label is drawn twice, dark on the track and light on the fill, clipped at the fill's edge so it reads everywhere. */}
      <Link to={next.to} aria-label={`${next.label}, ${pct}% of this lesson done`}
        className="group relative isolate flex min-h-14 flex-1 cursor-pointer overflow-hidden rounded-full bg-white text-callout font-bold whitespace-nowrap shadow-[inset_0_0_0_2px_#15120f] transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] active:scale-[0.97] dark:bg-white/15 dark:shadow-[inset_0_0_0_2px_#f3eee4]">
        <motion.span aria-hidden="true" initial={reduce ? false : { width: 0 }} animate={{ width: `${pct}%` }} transition={reduce ? { duration: 0 } : { ...spring.smooth, delay: 0.25 }}
          className="absolute inset-y-0 left-0 bg-[#15120f] group-hover:opacity-90 dark:bg-[#f3eee4]" />
        <Label pct={pct} label={next.label} className="text-[#15120f] dark:text-[#f5f1e8]" />
        <motion.span aria-hidden="true" initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
          transition={reduce ? { duration: 0 } : { ...spring.smooth, delay: 0.25 }} className="absolute inset-0">
          <Label pct={pct} label={next.label} className="text-white dark:text-[#15120f]" />
        </motion.span>
      </Link>
    </div>
  </section>
}

function Label({ pct, label, className }: { pct: number; label: string; className: string }) {
  return <span aria-hidden="true" className={`absolute inset-0 flex items-center justify-center gap-2.5 px-6 tabular-nums ${className}`}>
    {pct}% of lesson · {label}<ArrowRight className="size-4" strokeWidth={2.4} />
  </span>
}
