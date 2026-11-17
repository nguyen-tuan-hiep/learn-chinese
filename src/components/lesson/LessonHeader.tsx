import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import type { CourseLesson } from '@/data/types'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { spring } from '@/components/ui/motion'
import { BrandMark } from '@/components/layout/BrandMark'
import { levelColor } from '@/lib/palette'

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
    <div style={{ '--tint': levelColor(level) } as CSSProperties} className="flex w-full flex-col gap-4 lg:flex-row lg:items-stretch">
    <div style={{ '--sun': '80% 160% at 100% 125%' } as CSSProperties} className="on-light glass-card glow-tiles relative w-full min-w-0 overflow-hidden rounded-[2rem] p-5 pr-28 sm:rounded-[2.5rem] sm:p-8 sm:pr-52 lg:flex-1">
      {/* The same glow and bánh bao as the home page's lesson card. */}
      <BrandMark live className="pointer-events-none absolute -right-3 -bottom-6 size-28 sm:-right-2 sm:-bottom-10 sm:size-48" />
      <p className="relative flex max-w-full items-center gap-2 text-footnote font-semibold text-secondary-label"><span className="ink-pill shrink-0 rounded-full px-3 py-1">HSK {level}</span><span className="truncate">Lesson {number} · {lesson.version}{lesson.volume ? ` · ${lesson.volume}` : ''}</span></p>
      <motion.h1 layoutId={`lesson-title-${id}`} transition={spring.smooth} lang="zh-CN" className="relative mt-3 font-han text-4xl font-bold leading-tight text-balance break-words sm:text-6xl">{title}</motion.h1>
      {(lesson.titlePinyin || lesson.titleEn) && <p className="relative mt-1.5 text-callout text-secondary-label sm:text-title3 sm:font-medium">{lesson.titlePinyin && <><Pinyin text={lesson.titlePinyin} />{lesson.titleEn && ' · '}</>}{lesson.titleEn}</p>}
    </div>
    {aside}
    </div>
  </header>
}
