import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { Check, PenLine } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { spring } from '@/components/ui/motion'
import { Pinyin } from './Pinyin'
import { SpeakButton } from './SpeakButton'

/** The fields the word card needs. */
export interface RowWord { hanzi: string; pinyin: string; meaning: string; pos?: string; emoji?: string }

interface WordCardProps {
  word: RowWord
  /** Pinyin is hidden (but keeps its line) for self-testing. */
  showPinyin?: boolean
  remembered: boolean
  disabled?: boolean
  onToggle: () => void
  onWrite: () => void
}

const SPARK_COLORS = ['var(--pastel-green)', 'var(--pastel-yellow)', 'var(--pastel-pink)', 'var(--pastel-blue)', 'var(--pastel-lilac)']
const DOUBLE_TAP_MS = 320

/** Pill that opens the stroke-order sheet. */
function WriteButton({ hanzi, onClick }: { hanzi: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-label={`How to write ${hanzi}`}
    className="-ml-3 inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-subhead font-semibold text-jade transition-colors hover:bg-tint-soft">
    <PenLine aria-hidden="true" className="size-4" />Write
  </button>
}

/** A ring and a ring of dots bursting from where the card was marked. */
function Burst({ x, y }: { x: number; y: number }) {
  return <span aria-hidden="true" className="pointer-events-none absolute z-10" style={{ left: x, top: y }}>
    <motion.span initial={{ scale: 0.2, opacity: 0.9 }} animate={{ scale: 1, opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
      className="absolute -top-9 -left-9 size-18 rounded-full border-2 border-success-text/60" />
    {SPARK_COLORS.concat(SPARK_COLORS).map((color, i) => {
      const angle = (i / 10) * Math.PI * 2
      const distance = 30 + (i % 3) * 8
      return <motion.span key={i} initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, scale: 0.2, opacity: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute -top-1 -left-1 size-2 rounded-full" style={{ background: color }} />
    })}
  </span>
}

/**
 * One lesson word: word and sound on top, meaning, then stroke order and a small status circle.
 * Double tap anywhere on the card (outside its buttons) to mark it known; the circle does the same with one tap or the keyboard.
 */
export function WordCard({ word, showPinyin = true, remembered, disabled, onToggle, onWrite }: WordCardProps) {
  const reduce = useReducedMotion()
  const controls = useAnimationControls()
  const [pop, setPop] = useState(false)
  const [burst, setBurst] = useState<{ id: number; x: number; y: number } | null>(null)
  const lastTap = useRef({ time: 0, x: 0, y: 0 })
  const origin = useRef<{ x: number; y: number } | null>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (!reduce) void controls.start({ scale: [1, 1.04, 1], transition: { duration: 0.42, ease: [0.3, 1.6, 0.5, 1] } })
    if (!remembered) { setPop(false); return }
    setPop(true)
    if (!reduce && origin.current) setBurst({ id: Date.now(), ...origin.current })
    const timer = setTimeout(() => { setPop(false); setBurst(null) }, 1300)
    return () => clearTimeout(timer)
  }, [remembered, reduce, controls])

  const toggleFrom = (x: number, y: number) => {
    if (disabled) return
    origin.current = { x, y }
    onToggle()
  }

  // Our own double-tap check: iOS Safari does not fire dblclick reliably on touch.
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - box.left, y = event.clientY - box.top
    const prev = lastTap.current
    if (event.timeStamp - prev.time < DOUBLE_TAP_MS && Math.hypot(x - prev.x, y - prev.y) < 24) {
      lastTap.current = { time: 0, x: 0, y: 0 }
      toggleFrom(x, y)
    } else lastTap.current = { time: event.timeStamp, x, y }
  }

  // The green wash covers the glass border and copies the squircle corner shape, so no white rim shows at the corners;
  // it draws its own green edge so the card keeps an outline.
  return <motion.div animate={controls} onPointerUp={onPointerUp}
    className={`glass relative flex h-full min-w-0 touch-manipulation select-none flex-col rounded-[2rem]! [corner-shape:round]! px-5 pt-4 pb-2.5 sm:px-6 sm:pt-5 sm:pb-3.5`}>
    <motion.span aria-hidden="true" initial={false} animate={{ opacity: remembered ? 1 : 0 }} transition={{ duration: 0.3 }} className="pointer-events-none absolute -inset-px rounded-[inherit] border-[1.5px] border-success-text/30 bg-[color-mix(in_srgb,var(--color-success-soft)_22%,transparent)] [corner-shape:inherit]" />
    {burst && <Burst key={burst.id} x={burst.x} y={burst.y} />}
    <div className="relative flex items-center gap-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <p lang="zh-CN" className="font-han text-3xl leading-tight break-words">{word.hanzi}</p>
        {/* Stays in place when hidden, so cards don't change size. */}
        <p aria-hidden={!showPinyin} className={showPinyin ? '' : 'invisible'}><Pinyin text={word.pinyin} className="text-lg" /></p>
      </div>
      <SpeakButton text={word.hanzi} />
    </div>
    <p className="relative mt-0.5 mb-1 text-subhead leading-relaxed">
      {word.emoji && <span aria-hidden="true" className="mr-1.5 inline-block align-[-0.1em] text-[1.375rem] leading-none">{word.emoji}</span>}
      {word.meaning}
      {word.pos && <Badge className="ml-2 align-[1px]">{word.pos}</Badge>}
    </p>
    <div className="relative mt-auto flex items-center justify-between gap-2">
      <WriteButton hanzi={word.hanzi} onClick={onWrite} />
      <div className="relative">
        {/* "+1" floats up out of the circle and fades, instead of sitting on it as a badge. */}
        <AnimatePresence>
          {pop && <motion.span key="plus" aria-hidden="true" initial={{ y: 0, opacity: 0, scale: 0.6 }}
            animate={{ y: -30, opacity: [0, 1, 1, 0], scale: [0.6, 1.15, 1, 1] }} transition={{ duration: 1.1, ease: 'easeOut', times: [0, 0.2, 0.7, 1] }}
            className="pointer-events-none absolute inset-x-0 top-0 z-10 text-center text-subhead font-bold text-success-text">+1</motion.span>}
        </AnimatePresence>
        <button type="button" disabled={disabled} aria-pressed={remembered} aria-label={`Mark ${word.hanzi} as known`}
          onClick={(event) => {
            const card = event.currentTarget.closest('.glass')!.getBoundingClientRect(), dot = event.currentTarget.getBoundingClientRect()
            toggleFrom(dot.left - card.left + dot.width / 2, dot.top - card.top + dot.height / 2)
          }}
          className="grid size-11 cursor-pointer place-items-center rounded-full disabled:cursor-wait disabled:opacity-60">
          <span className={`grid size-10 place-items-center rounded-full transition-colors ${remembered ? 'bg-success-text text-on-primary' : 'border-[1.5px] border-dashed border-label/55 text-transparent'}`}>
            <AnimatePresence initial={false}>
              {remembered && <motion.span key="check" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={spring.bouncy}>
                <Check aria-hidden="true" className="size-5" strokeWidth={3} />
              </motion.span>}
            </AnimatePresence>
          </span>
        </button>
      </div>
    </div>
  </motion.div>
}
