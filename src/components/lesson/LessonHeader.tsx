import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import type { CourseLesson } from '@/data/types'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { spring } from '@/components/ui/motion'
import { levelSoft } from '@/lib/palette'

/**
 * Back button and title of a lesson, shared by the lesson page and its loading placeholder.
 * The Chinese title carries `layoutId="lesson-title-<id>"` for the list-to-lesson morph.
 */
export function LessonHeader({ lesson }: { lesson: CourseLesson }) {
  const { id, level, number, title } = lesson
  return <header className="flex flex-col items-start gap-3">
    <Link to={`/lesson?level=${level}`} aria-label={`Back to HSK ${level} lessons`}
      className="glass grid size-11 shrink-0 place-items-center rounded-full! text-label transition-transform duration-200 active:scale-[0.92]">
      <ChevronLeft aria-hidden="true" className="size-6" />
    </Link>
    <div style={{ background: levelSoft(level) }} className="on-pastel relative w-full min-w-0 overflow-hidden rounded-[2rem] p-5 shadow-card sm:rounded-[2.5rem] sm:p-8">
      <span aria-hidden="true" lang="zh-CN" className="font-han pointer-events-none absolute -top-10 -right-4 text-[11rem] leading-none opacity-[0.07] sm:text-[15rem]">{[...title].at(-1)}</span>
      <p className="relative flex max-w-full items-center gap-2 text-footnote font-semibold"><span className="shrink-0 rounded-full bg-white px-3 py-1 text-[#15120f] dark:bg-white/15 dark:text-label">HSK {level}</span><span className="truncate">Lesson {number} · {lesson.version}{lesson.volume ? ` · ${lesson.volume}` : ''}</span></p>
      <motion.h1 layoutId={`lesson-title-${id}`} transition={spring.smooth} lang="zh-CN" className="relative mt-3 font-han text-4xl font-bold leading-tight text-balance break-words sm:text-6xl">{title}</motion.h1>
      {(lesson.titlePinyin || lesson.titleVi) && <p className="relative mt-1.5 text-callout opacity-75 sm:text-title3 sm:font-medium">{lesson.titlePinyin && <><Pinyin text={lesson.titlePinyin} />{lesson.titleVi && ' · '}</>}{lesson.titleVi}</p>}
    </div>
  </header>
}
