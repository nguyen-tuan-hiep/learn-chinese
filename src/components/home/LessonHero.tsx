import { Link } from 'react-router-dom'
import { ArrowRight, PartyPopper, Play } from 'lucide-react'
import type { CourseModel } from '@/lib/courseModel'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { ButtonLink } from '@/components/ui/Button'
import { RangeBar } from '@/components/ui/RangeBar'
import { NowBadge } from '@/components/ui/NowBadge'
import { levelSoft } from '@/lib/palette'

const card = 'relative overflow-hidden rounded-[2.25rem] bg-[var(--pastel-blue)] p-6 text-[#15120f] shadow-[0_18px_40px_rgb(21_18_15/0.1)] sm:rounded-[2.75rem] sm:p-9 dark:text-[#f5f1e8]'
const pill = 'inline-flex rounded-full bg-white px-3.5 py-1.5 text-footnote font-semibold text-[#15120f] dark:bg-white/15 dark:text-[#f5f1e8]'

/** The lesson to continue: a big pastel card with the lesson's hanzi, progress and the black "continue" pill. */
export function LessonHero({ current, next }: Pick<CourseModel, 'current' | 'next'>) {
  if (!current || !next) {
    return <section className={card}>
      <PartyPopper aria-hidden="true" className="size-8" />
      <h2 className="mt-3 text-title1">Bạn đã học hết lộ trình</h2>
      <p className="mt-1 text-callout opacity-70">Ôn lại các thẻ từ để giữ chữ trong đầu.</p>
      <ButtonLink to="/review" size="lg" className="mt-5">Ôn tập<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>
    </section>
  }
  const onLesson = next.to === current.to
  const pct = Math.round(current.progress * 100)
  const long = [...current.title].length > 4
  return <section aria-label="Bài đang học" style={{ background: levelSoft(current.level) }} className={`${card} flex min-h-[19rem] flex-col justify-between gap-6 sm:min-h-[24rem]`}>
    <span aria-hidden="true" lang="zh-CN" className="font-han pointer-events-none absolute -top-16 -right-6 text-[18rem] leading-none opacity-[0.07] sm:text-[26rem]">{[...current.title].at(-1)}</span>
    <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute top-5 right-24 size-6 animate-[twinkle_3s_ease-in-out_infinite] fill-white sm:right-40 sm:size-8"><path d="M12 1c.8 6.2 4.8 10.2 11 11-6.2.8-10.2 4.8-11 11-.8-6.2-4.8-10.2-11-11C7.2 11.2 11.2 7.2 12 1z" /></svg>
    <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute right-10 bottom-28 size-4 animate-[twinkle_3s_ease-in-out_1.2s_infinite] fill-white/80 sm:right-16 sm:bottom-36 sm:size-5"><path d="M12 1c.8 6.2 4.8 10.2 11 11-6.2.8-10.2 4.8-11 11-.8-6.2-4.8-10.2-11-11C7.2 11.2 11.2 7.2 12 1z" /></svg>
    <div className="relative">
      <div className="flex flex-wrap gap-2">
        <span className={pill}>{onLesson ? `HSK ${current.level} · Bài ${current.number}` : 'Bước tiếp theo'}</span>
        <NowBadge className="px-3.5 py-1.5 text-footnote" />
      </div>
      {onLesson
        ? <h2 lang="zh-CN" className={`font-han mt-4 leading-tight font-bold break-words ${long ? 'text-[2.75rem] sm:text-[5.25rem]' : 'text-[4rem] sm:text-[6.5rem]'}`}>{current.title}</h2>
        : <h2 className="mt-4 text-title1 leading-snug text-balance">{next.detail}</h2>}
      {onLesson && current.subtitle && <p className="mt-1 text-callout font-medium opacity-70 sm:text-title3 sm:font-medium text-balance">{current.subtitle}</p>}
    </div>
    <div className="relative flex flex-wrap items-end justify-between gap-5">
      <div className="min-w-[12rem] flex-1 sm:max-w-xs">
        <p className="mb-2 text-subhead font-semibold tabular-nums"><AnimatedNumber value={pct} />% đã học</p>
        <RangeBar value={current.progress} className="h-2.5 bg-white! dark:bg-white/15!" />
      </div>
      <Link to={next.to} className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-[#15120f] px-7 text-callout font-bold text-white transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:opacity-90 active:scale-[0.96] max-sm:flex-1 sm:w-auto dark:bg-[#f3eee4] dark:text-[#15120f]">
        {next.label}<ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.4} />
      </Link>
      <span aria-hidden="true" className="hidden size-14 place-items-center rounded-full bg-white text-[#15120f] sm:grid dark:bg-white/15 dark:text-[#f5f1e8]"><Play className="size-5" /></span>
    </div>
  </section>
}
