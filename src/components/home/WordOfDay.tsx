import { useCallback, useMemo, useState } from 'react'
import { PenLine } from 'lucide-react'
import { HSK3_LESSONS, LESSONS } from '@/data/course'
import type { Word } from '@/data/types'
import type { CourseLessonItem } from '@/lib/courseModel'
import { dateKey } from '@/lib/progress'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { StrokeOrderGuide } from '@/components/hanzi/StrokeOrder'
import { Sheet } from '@/components/ui/Sheet'

const HAN = /^\p{Script=Han}$/u

/** Small stable hash, so the same day always gives the same character. */
function hash(text: string) {
  let h = 2166136261
  for (const ch of text) h = Math.imul(h ^ ch.codePointAt(0)!, 16777619)
  return h >>> 0
}

/**
 * One character a day from what the learner has met so far: the single-character words of every lesson
 * up to the current one in their course (the first lesson's words before they start).
 * Shows it big with pinyin and meaning, a few course words that use it, audio, and opens its stroke order.
 */
export function WordOfDay({ current, version, day, compact = false, className = '' }: { current: CourseLessonItem | null; version: '2.0' | '3.0'; day: Date; compact?: boolean; className?: string }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const today = dateKey(day)
  const pick = useMemo(() => {
    const lessons = version === '3.0' ? HSK3_LESSONS : LESSONS
    const upTo = current ? lessons.findIndex((l) => l.id === current.id) : lessons.length - 1
    const seen = lessons.slice(0, Math.max(0, upTo) + 1).flatMap((l) => l.words)
    const singles = seen.filter((w) => HAN.test(w.hanzi))
    const pool = singles.length ? singles : seen
    if (!pool.length) return null
    const word: Word = pool[hash(`${today}|${version}`) % pool.length]
    const char = [...word.hanzi].find((c) => HAN.test(c)) ?? word.hanzi
    const examples = [...new Set(lessons.flatMap((l) => l.words).filter((w) => w.hanzi !== word.hanzi && w.hanzi.includes(char)).map((w) => w.hanzi))]
      .sort((a, b) => a.length - b.length).slice(0, 3)
    return { word, examples }
  }, [current, version, today])
  if (!pick) return null
  const { word, examples } = pick
  const sheet = <Sheet open={open} onClose={close} label={`How to write ${word.hanzi}`}>
    {open && <StrokeOrderGuide hanzi={word.hanzi} pinyin={word.pinyin} meaning={word.meaning} onClose={close} />}
  </Sheet>

  // Phones: just the tile, tucked in the top right corner next to the greeting.
  if (compact) return <>
    <button type="button" onClick={() => setOpen(true)} aria-label={`Word of the day: ${word.hanzi}, ${word.pinyin}. See how to write it`} style={{ background: 'var(--pastel-lilac)' }}
      className={`on-pastel group relative flex size-[5.5rem] shrink-0 -rotate-3 cursor-pointer flex-col items-center justify-center rounded-[1.75rem] text-[#15120f] shadow-[0_10px_24px_rgb(21_18_15/0.1)] transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:rotate-0 active:scale-95 ${className}`}>
      <span className="absolute -top-2 rounded-full bg-[#15120f] px-2 py-0.5 text-[0.625rem] font-bold whitespace-nowrap text-white">Word of the day</span>
      <span lang="zh-CN" className="font-han mt-1 text-[2.5rem] leading-none">{word.hanzi}</span>
      <span className="mt-1 text-caption font-semibold"><Pinyin text={word.pinyin} /></span>
      {word.emoji && <span aria-hidden="true" className="absolute -right-1.5 -bottom-1.5 grid size-8 place-items-center rounded-full bg-white text-lg leading-none shadow-[0_4px_10px_rgb(21_18_15/0.12)]">{word.emoji}</span>}
    </button>
    {sheet}
  </>

  return <section aria-label="Word of the day" className={`glass relative flex items-center gap-4 rounded-[2.25rem]! p-3 pr-4 [corner-shape:round]! sm:rounded-[2.75rem]! ${className}`}>
    <button type="button" onClick={() => setOpen(true)} aria-label={`Word of the day: ${word.hanzi}, ${word.pinyin}. See how to write it`}
      className="group flex min-w-0 flex-1 cursor-pointer items-center gap-4 text-left">
      <span lang="zh-CN" style={{ background: 'var(--pastel-lilac)' }}
        className="on-pastel font-han grid size-[4.5rem] shrink-0 place-items-center rounded-[1.6rem] text-[2.75rem] sm:rounded-[2rem] leading-none text-[#15120f] transition-transform duration-200 group-hover:-rotate-3 group-active:scale-95">{word.hanzi}</span>
      <span className="min-w-0">
        <span className="block text-caption font-semibold text-secondary-label">Word of the day</span>
        <span className="block text-title3 font-semibold leading-tight"><Pinyin text={word.pinyin} /></span>
        <span className="block truncate text-footnote text-secondary-label">{word.emoji && <span aria-hidden="true" className="mr-1">{word.emoji}</span>}{word.meaning}</span>
        {examples.length > 0 && <span lang="zh-CN" className="font-han mt-0.5 flex items-center gap-1.5 truncate text-subhead">
          {examples.join(' · ')}<PenLine aria-hidden="true" className="ml-1 size-3.5 shrink-0 text-tertiary-label" />
        </span>}
      </span>
    </button>
    <SpeakButton text={word.hanzi} size="sm" className="shrink-0" />
    {sheet}
  </section>
}
