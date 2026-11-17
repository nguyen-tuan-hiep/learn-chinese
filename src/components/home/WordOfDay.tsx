import { useCallback, useEffect, useMemo, useState } from 'react'
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

/** Card faces of the fan: warm paper in both themes, a shade apart per word, like a hand of real study cards. */
const FAN_COLORS = ['#fffdf8', '#f6f1e7', '#ece5d8']

/**
 * Three characters a day from what the learner has met so far: the single-character words of every lesson
 * up to the current one in their course (the first lesson's words before they start). Same day, same three.
 * Desktop: the chosen word large (hanzi, pinyin, meaning) with Listen and Write; the day's three characters sit as small
 * tiles at the top right, the chosen one inked, and picking another swaps the big word.
 * Phones (`compact`): a small fan of the same three in the corner next to the greeting; tapping a card behind makes it
 * the chosen one, tapping the chosen (left, top) card opens how to write it.
 */
export function WordOfDay({ current, version, day, compact = false, className = '' }: { current: CourseLessonItem | null; version: '2.0' | '3.0'; day: Date; compact?: boolean; className?: string }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const [order, setOrder] = useState([0, 1, 2]) // order[0] is the front card
  // The card just picked hops up out of the fan for a moment before settling on top, like pulling a card from a hand.
  const [hop, setHop] = useState<number | null>(null)
  useEffect(() => {
    if (hop === null) return
    const timer = setTimeout(() => setHop(null), 220)
    return () => clearTimeout(timer)
  }, [hop])
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

  // Slot of each word in the fan: -1 left (the chosen word, on top), 0 middle, 1 right.
  const slots = new Map([[order[0], -1], [order[1], 0], [order[2], 1]])
  const choose = (i: number) => { setOrder([i, ...order.filter((o) => o !== i)]); setHop(i) }

  // Phones: a small fan tucked in the top right corner next to the greeting.
  if (compact) return <>
    <div role="group" aria-label="Words of the day" className={`relative h-[5.75rem] w-[8.5rem] -translate-x-1 shrink-0 ${className}`}>
      <span className="absolute bottom-full left-1/2 z-10 -translate-x-1/2 rounded-full ink-pill px-2 py-0.5 text-[0.625rem] font-bold whitespace-nowrap">Words of the day</span>
      {words.map((w, i) => {
        const slot = slots.get(i) ?? 0
        const isFront = slot === -1
        return <motion.button key={w.hanzi} type="button" lang="zh-CN"
          aria-label={isFront ? `${w.hanzi}, ${w.pinyin}. See how to write it` : `Show ${w.hanzi}, ${w.pinyin}`}
          onClick={() => { if (isFront) setOpen(true); else choose(i) }}
          initial={false} animate={{ x: slot * 42, rotate: slot * 8, y: hop === i ? -22 : 0, scale: hop === i ? 1.08 : 1 }}
          whileTap={{ scale: 0.92 }} transition={spring.bouncy}
          style={{ background: FAN_COLORS[i], zIndex: 2 - slot }}
          className={`on-light absolute bottom-0 left-1/2 -ml-[1.875rem] flex h-[4.75rem] w-[3.75rem] cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border-2 border-white ${isFront ? 'shadow-[0_8px_18px_rgb(21_18_15/0.18)]' : 'shadow-[0_3px_8px_rgb(21_18_15/0.12)]'}`}>
          <span className="font-han text-[1.9rem] leading-none">{w.hanzi}</span>
          <span lang="en" className="mt-1 text-caption font-semibold"><Pinyin text={w.pinyin} /></span>
        </motion.button>
      })}
    </div>
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
