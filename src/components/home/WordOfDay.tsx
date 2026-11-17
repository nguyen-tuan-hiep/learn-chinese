import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PenLine, Volume2 } from 'lucide-react'
import { HSK3_LESSONS, HSK2_LESSONS } from '@/data/course'
import type { Word } from '@/data/types'
import type { CourseLessonItem } from '@/lib/courseModel'
import { dateKey } from '@/lib/progress'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { speak } from '@/lib/speech'
import { useSettings } from '@/store/settings'
import { spring } from '@/components/ui/motion'
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
 * Three characters a day from what the learner has met so far: the single-character words of every lesson
 * up to the current one in their course (the first lesson's words before they start). Same day, same three.
 * Desktop: the chosen word large (hanzi, pinyin, meaning) with Listen and Write; the day's three characters sit as small
 * tiles at the top right, the chosen one inked, and picking another swaps the big word.
 * Phones (`compact`): a small labelled card beside the greeting, filling the space next to it: the chosen word with its
 * pinyin, meaning and memory emoji (tap it to see how to write it) over the day's three characters, the chosen one inked.
 */
export function WordOfDay({ current, version, day, compact = false, className = '' }: { current: CourseLessonItem | null; version: '2.0' | '3.0'; day: Date; compact?: boolean; className?: string }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const [order, setOrder] = useState([0, 1, 2]) // order[0] is the chosen word
  const rate = useSettings((st) => st.speechRate)
  const today = dateKey(day)
  const words = useMemo(() => {
    const lessons = version === '3.0' ? HSK3_LESSONS : HSK2_LESSONS
    const upTo = current ? lessons.findIndex((l) => l.id === current.id) : lessons.length - 1
    const seen = lessons.slice(0, Math.max(0, upTo) + 1).flatMap((l) => l.words)
    const singles = seen.filter((w) => HAN.test(w.hanzi))
    const pool = [...new Map((singles.length >= 3 ? singles : seen).map((w) => [w.hanzi, w])).values()]
    // A stable daily shuffle: order the pool by a hash of (day, version, word) and take the first three.
    return pool.map((w) => ({ w, k: hash(`${today}|${version}|${w.hanzi}`) })).sort((x, y) => x.k - y.k).slice(0, 3).map(({ w }) => w as Word)
  }, [current, version, today])
  if (!words.length) return null
  const front = order.find((i) => i < words.length) ?? 0
  const word = words[front]
  const sheet = <Sheet open={open} onClose={close} label={`How to write ${word.hanzi}`}>
    {open && <StrokeOrderGuide hanzi={word.hanzi} pinyin={word.pinyin} meaning={word.meaning} onClose={close} />}
  </Sheet>

  const choose = (i: number) => setOrder([i, ...order.filter((o) => o !== i)])

  // Phones: a small card tucked in the top right corner next to the greeting.
  if (compact) return <>
    <section aria-labelledby="wod-label" className={`glass-card max-w-[13rem] min-w-[8.75rem] flex-1 rounded-[1.5rem] p-1.5 ${className}`}>
      <h2 id="wod-label" className="px-1.5 pt-0.5 pb-1 text-[11px] font-semibold text-secondary-label">Words of the day</h2>
      <button type="button" lang="zh-CN" onClick={() => setOpen(true)} aria-label={`${word.hanzi}, ${word.pinyin}, ${word.meaning}. See how to write it`}
        className="relative block min-h-12 w-full cursor-pointer overflow-hidden rounded-[1.125rem] bg-fill text-left transition-transform active:scale-[0.97]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={word.hanzi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={spring.snappy}
            className="flex min-h-12 items-center gap-2 px-2.5 py-1.5">
            {/* Longer words step the hanzi down so pinyin and meaning keep their room. */}
            <span className={`font-han shrink-0 leading-none ${[...word.hanzi].length > 2 ? 'text-[1.25rem]' : [...word.hanzi].length > 1 ? 'text-[1.5rem]' : 'text-[1.75rem]'}`}>{word.hanzi}</span>
            <span lang="en" className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-caption font-semibold"><Pinyin text={word.pinyin} /></span>
              <span className="truncate text-[11px] text-secondary-label">{word.meaning}</span>
            </span>
            {word.emoji && <span aria-hidden="true" className="shrink-0 text-[1.375rem] leading-none">{word.emoji}</span>}
          </motion.span>
        </AnimatePresence>
      </button>
      <div role="group" aria-label="Today's three words" className="mt-1 grid grid-cols-3 gap-0.5 rounded-full bg-fill p-0.5">
        {words.map((w, i) => {
          const on = i === front
          return <button key={w.hanzi} type="button" lang="zh-CN" aria-pressed={on} aria-label={`${w.hanzi}, ${w.pinyin}`} onClick={() => { if (!on) choose(i) }}
            className={`grid h-7 w-full cursor-pointer place-items-center overflow-hidden rounded-full font-han text-sm whitespace-nowrap transition-[transform,background-color,color] duration-200 active:scale-90 ${on ? 'ink-pill' : 'text-secondary-label'}`}>{w.hanzi}</button>
        })}
      </div>
    </section>
    {sheet}
  </>

  return <section aria-label="Words of the day" className={`glass relative flex flex-col justify-between gap-2 rounded-[2.25rem]! p-4 sm:rounded-[2.75rem]! sm:px-5 ${className}`}>
    <div className="flex items-center justify-between gap-3">
      <p className="text-footnote font-semibold text-secondary-label">Words of the day</p>
      {/* The day's three characters; the inked one is shown below. */}
      <div role="group" aria-label="Today's three words" className="flex gap-1.5">
        {words.map((w, i) => {
          const on = i === front
          return <button key={w.hanzi} type="button" lang="zh-CN" aria-pressed={on} aria-label={`${w.hanzi}, ${w.pinyin}`} onClick={() => { if (!on) choose(i) }}
            className={`grid size-9 cursor-pointer place-items-center rounded-xl font-han text-lg transition-[transform,background-color,color] duration-200 active:scale-90 ${on ? 'ink-pill' : 'bg-fill text-label hover:bg-separator'}`}>{w.hanzi}</button>
        })}
      </div>
    </div>
    <div className="flex items-end justify-between gap-4">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div key={word.hanzi} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={spring.snappy} className="min-w-0">
          <p className="flex items-end gap-3">
            <span lang="zh-CN" className="font-han text-[2rem] leading-none">{word.hanzi}</span>
            <Pinyin text={word.pinyin} className="pb-1 text-title3 font-semibold" />
          </p>
          <p className="mt-1 truncate text-subhead text-secondary-label">{word.meaning}</p>
        </motion.div>
      </AnimatePresence>
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={() => void speak(word.hanzi, rate)} aria-label={`Listen to ${word.hanzi}`}
          className="grid size-10 cursor-pointer place-items-center rounded-full bg-fill text-label transition-transform hover:bg-separator active:scale-90"><Volume2 aria-hidden="true" className="size-[1.125rem]" /></button>
        <button type="button" onClick={() => setOpen(true)} aria-label={`How to write ${word.hanzi}`}
          className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full ink-pill px-4 text-footnote font-bold transition-transform active:scale-95">
          <PenLine aria-hidden="true" className="size-3.5" />Write
        </button>
      </div>
    </div>
    {sheet}
  </section>
}
