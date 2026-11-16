import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { PenLine } from 'lucide-react'
import { HSK3_LESSONS, LESSONS } from '@/data/course'
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

/** Card colours of the fan, one per word (they stay with the word as it moves to the front). */
const FAN_COLORS = ['var(--pastel-lilac)', 'var(--pastel-blue)', 'var(--pastel-yellow)']

/**
 * Three characters a day from what the learner has met so far: the single-character words of every lesson
 * up to the current one in their course (the first lesson's words before they start). Same day, same three.
 * Desktop: a fan of three pastel cards (hanzi, pinyin, meaning), the chosen one on the left and on top. Hovering spreads
 * it, clicking another card makes it the chosen one, clicking the front card reads it aloud, and "Write" opens the front word's stroke order.
 * Phones (`compact`): a small fan of the same three in the corner next to the greeting; tapping a card behind makes it
 * the chosen one, tapping the chosen (left, top) card opens how to write it.
 */
export function WordOfDay({ current, version, day, compact = false, className = '' }: { current: CourseLessonItem | null; version: '2.0' | '3.0'; day: Date; compact?: boolean; className?: string }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const [order, setOrder] = useState([0, 1, 2]) // order[0] is the front card
  const [spread, setSpread] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  // Width of the desktop fan's area, so the spread leaves at least 16px on each side however narrow the card gets.
  const fanRef = useRef<HTMLDivElement>(null)
  const [fanWidth, setFanWidth] = useState(0)
  useEffect(() => {
    const el = fanRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setFanWidth(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [compact])
  const rate = useSettings((st) => st.speechRate)
  const today = dateKey(day)
  const words = useMemo(() => {
    const lessons = version === '3.0' ? HSK3_LESSONS : LESSONS
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
  const choose = (i: number) => setOrder([i, ...order.filter((o) => o !== i)])

  // Phones: a small fan tucked in the top right corner next to the greeting.
  if (compact) return <>
    <div role="group" aria-label="Words of the day" className={`relative h-[5.75rem] w-[8.5rem] -translate-x-1 shrink-0 ${className}`}>
      <span className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#15120f] px-2 py-0.5 text-[0.625rem] font-bold whitespace-nowrap text-white dark:bg-[#f3eee4] dark:text-[#15120f]">Words of the day</span>
      {words.map((w, i) => {
        const slot = slots.get(i) ?? 0
        const isFront = slot === -1
        return <motion.button key={w.hanzi} type="button" lang="zh-CN"
          aria-label={isFront ? `${w.hanzi}, ${w.pinyin}. See how to write it` : `Show ${w.hanzi}, ${w.pinyin}`}
          onClick={() => { if (isFront) setOpen(true); else choose(i) }}
          initial={false} animate={{ x: slot * 42, rotate: slot * 8 }}
          whileTap={{ scale: 0.92 }} transition={spring.bouncy}
          style={{ background: FAN_COLORS[i], zIndex: 2 - slot }}
          className={`on-pastel absolute bottom-0 left-1/2 -ml-[1.875rem] flex h-[4.75rem] w-[3.75rem] cursor-pointer flex-col items-center justify-center rounded-[1.25rem] border-2 border-white text-[#15120f] dark:border-white/20 ${isFront ? 'shadow-[0_8px_18px_rgb(21_18_15/0.18)]' : 'shadow-[0_3px_8px_rgb(21_18_15/0.12)]'}`}>
          <span className="font-han text-[1.9rem] leading-none">{w.hanzi}</span>
          <span lang="en" className="mt-1 text-caption font-semibold"><Pinyin text={w.pinyin} /></span>
          {w.emoji && <span aria-hidden="true" className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-white text-sm leading-none shadow-[0_3px_8px_rgb(21_18_15/0.14)]">{w.emoji}</span>}
        </motion.button>
      })}
    </div>
    {sheet}
  </>

  // A 96×108px card tilted 13° is about 118px wide: half of that plus a 16px margin must fit beside the centre.
  const room = fanWidth ? fanWidth / 2 - 75 : 84
  return <section aria-label="Words of the day" className={`glass relative min-h-[9.5rem] overflow-hidden rounded-[2.25rem]! [corner-shape:round]! sm:rounded-[2.75rem]! ${className}`}>
    <p className="absolute top-3.5 left-5 text-caption font-semibold text-secondary-label">Words of the day</p>
    <button type="button" onClick={() => setOpen(true)} aria-label={`How to write ${word.hanzi}`}
      className="absolute top-2.5 right-3 z-10 inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-full bg-[#15120f] px-3 text-caption font-bold text-white transition-transform active:scale-95 dark:bg-[#f3eee4] dark:text-[#15120f]">
      <PenLine aria-hidden="true" className="size-3.5" />Write
    </button>
    <div role="group" aria-label="Today's three words" onPointerEnter={(e) => { if (e.pointerType === 'mouse') setSpread(true) }} onPointerLeave={() => setSpread(false)}
      onFocus={() => setSpread(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setSpread(false) }}
      ref={fanRef} className="absolute inset-x-0 bottom-3 h-[6.75rem]">
      {words.map((w, i) => {
        const slot = slots.get(i) ?? 0
        const isFront = slot === -1
        const lifted = hovered === i
        return <motion.button key={w.hanzi} type="button" lang="zh-CN"
          aria-label={isFront ? `${w.hanzi}, ${w.pinyin}, ${w.meaning}. Listen` : `Show ${w.hanzi}, ${w.pinyin}`}
          onClick={() => { if (isFront) void speak(w.hanzi, rate); else choose(i) }}
          onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHovered(i) }} onPointerLeave={() => setHovered((h) => (h === i ? null : h))}
          onFocus={() => setHovered(i)} onBlur={() => setHovered((h) => (h === i ? null : h))}
          // Stacked left over middle over right, like a hand of cards; the card under the pointer rises above all.
          initial={false} animate={{ x: slot * Math.max(24, Math.min(spread ? 84 : 54, room)), rotate: slot * (spread ? 13 : 8), y: lifted ? -10 : 0, scale: lifted ? 1.04 : 1 }}
          whileTap={{ scale: 0.95 }} transition={spring.bouncy}
          style={{ background: FAN_COLORS[i], zIndex: lifted ? 4 : 2 - slot }}
          className={`on-pastel absolute bottom-0 left-1/2 -ml-12 flex h-full w-24 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-white px-1.5 text-[#15120f] transition-shadow dark:border-white/20 ${isFront || lifted ? 'shadow-[0_10px_22px_rgb(21_18_15/0.2)]' : 'shadow-[0_4px_12px_rgb(21_18_15/0.12)]'}`}>
          {w.emoji && <span aria-hidden="true" className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-white text-base leading-none shadow-[0_3px_8px_rgb(21_18_15/0.14)]">{w.emoji}</span>}
          <span className="font-han text-[2.5rem] leading-none">{w.hanzi}</span>
          <span lang="en" className="mt-1.5 text-footnote font-bold"><Pinyin text={w.pinyin} /></span>
          <span lang="en" className="w-full truncate text-center text-caption opacity-75">{w.meaning}</span>
        </motion.button>
      })}
    </div>
    {sheet}
  </section>
}
