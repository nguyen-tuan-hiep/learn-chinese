import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import type { CourseLesson } from '@/data/types'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { spring } from '@/components/ui/motion'
import { levelSoft } from '@/lib/palette'
import { BrandMark } from '@/components/layout/BrandMark'

/**
 * Back button and title of a lesson, shared by the lesson page and its loading placeholder.
 * The Chinese title carries `layoutId="lesson-title-<id>"` for the list-to-lesson morph.
 */
/** `aside` sits beside the title card on wide screens and below it on phones. */
export function LessonHeader({ lesson, aside }: { lesson: CourseLesson; aside?: ReactNode }) {
  const { id, level, number, title } = lesson
  return <header className="flex flex-col items-start gap-3">
    <Link to={`/lesson?level=${level}`} aria-label={`Back to HSK ${level} lessons`}
      className="glass grid size-11 shrink-0 place-items-center rounded-full! text-label transition-transform duration-200 active:scale-[0.92]">
      <ChevronLeft aria-hidden="true" className="size-6" />
    </Link>
    <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-stretch">
    <div style={{ background: levelSoft(level) }} className="on-pastel relative w-full min-w-0 lg:flex-1 overflow-hidden rounded-[2rem] p-5 shadow-card sm:rounded-[2.5rem] sm:p-8">
      {/* The same big faint bánh bao as the home page's lesson card, tilted and peeking from the right edge. */}
      <BrandMark className="pointer-events-none absolute -top-6 -right-16 size-44 rotate-[14deg] opacity-20 sm:-top-12 sm:-right-14 sm:size-80" />
      <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute top-5 right-28 size-5 animate-[twinkle_3s_ease-in-out_infinite] fill-white sm:right-56 sm:size-7"><path d="M12 1c.8 6.2 4.8 10.2 11 11-6.2.8-10.2 4.8-11 11-.8-6.2-4.8-10.2-11-11C7.2 11.2 11.2 7.2 12 1z" /></svg>
      <p className="relative flex max-w-full items-center gap-2 text-footnote font-semibold"><span className="shrink-0 rounded-full bg-white px-3 py-1 text-[#15120f] dark:bg-white/15 dark:text-label">HSK {level}</span><span className="truncate">Lesson {number} · {lesson.version}{lesson.volume ? ` · ${lesson.volume}` : ''}</span></p>
      <motion.h1 layoutId={`lesson-title-${id}`} transition={spring.smooth} lang="zh-CN" className="relative mt-3 font-han text-4xl font-bold leading-tight text-balance break-words sm:text-6xl">{title}</motion.h1>
      {(lesson.titlePinyin || lesson.titleEn) && <p className="relative mt-1.5 text-callout opacity-75 sm:text-title3 sm:font-medium">{lesson.titlePinyin && <><Pinyin text={lesson.titlePinyin} />{lesson.titleEn && ' · '}</>}{lesson.titleEn}</p>}
    </div>
    {aside}
    </div>
  </header>
}
