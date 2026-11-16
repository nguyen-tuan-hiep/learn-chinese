import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, PenLine, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ValueBadge } from '@/components/ui/ValueBadge'
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

/** Pill that opens the stroke-order sheet. */
function WriteButton({ hanzi, onClick }: { hanzi: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-label={`How to write ${hanzi}`}
    className="-ml-3 inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-subhead font-semibold text-jade transition-colors hover:bg-tint-soft">
    <PenLine aria-hidden="true" className="size-4" /><span className="@max-[15rem]:sr-only">Write</span>
  </button>
}

/** The remember toggle: the pill morphs in place between "Mark as known" and "Known", and a "+1" pops above it. */
function RememberToggle({ remembered, disabled, onToggle }: { remembered: boolean; disabled?: boolean; onToggle: () => void }) {
  const [pop, setPop] = useState(false)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (!remembered) { setPop(false); return }
    setPop(true)
    const timer = setTimeout(() => setPop(false), 1300)
    return () => clearTimeout(timer)
  }, [remembered])
  return <div className="relative">
    <span className="pointer-events-none absolute -top-3 right-2 z-10"><ValueBadge value={pop ? '+1' : null} className="ring-[3px] ring-success-soft" /></span>
    <motion.button layout type="button" onClick={onToggle} disabled={disabled} aria-pressed={remembered} transition={spring.snappy} style={{ borderRadius: 9999 }}
      className={`relative inline-flex min-h-11 cursor-pointer items-center justify-center overflow-hidden px-4 text-subhead font-semibold transition-colors active:scale-[0.97] disabled:cursor-wait disabled:opacity-60 ${remembered ? 'bg-success-text text-white dark:text-black' : 'border border-separator text-secondary-label hover:text-label'}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={remembered ? 'on' : 'off'} layout="position" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.18 }}
          className="inline-flex items-center gap-1.5 whitespace-nowrap">
          {remembered ? <Check aria-hidden="true" className="size-4" strokeWidth={2.5} /> : <Plus aria-hidden="true" className="size-4" />}
          {remembered ? 'Known' : 'Mark as known'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  </div>
}

/** One lesson word: word and sound on top, meaning, then stroke order and the remember toggle. */
export function WordCard({ word, showPinyin = true, remembered, disabled, onToggle, onWrite }: WordCardProps) {
  // The green wash covers the glass border and copies the squircle corner shape, so no white rim shows at the corners;
  // it draws its own green edge so the card keeps an outline.
  return <div className={`@container glass relative flex h-full min-w-0 flex-col rounded-[2rem]! [corner-shape:round]! p-5 sm:p-6 ${remembered ? 'on-pastel' : ''}`}>
    <motion.span aria-hidden="true" initial={false} animate={{ opacity: remembered ? 1 : 0 }} transition={{ duration: 0.3 }} className="pointer-events-none absolute -inset-px rounded-[inherit] border-2 border-success-text/35 bg-success-soft [corner-shape:inherit]" />
    <div className="relative flex items-center gap-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <p lang="zh-CN" className="font-han text-3xl leading-tight break-words">{word.hanzi}</p>
        {/* Stays in place when hidden, so cards don't change size. */}
        <p aria-hidden={!showPinyin} className={showPinyin ? '' : 'invisible'}><Pinyin text={word.pinyin} className="text-lg" /></p>
      </div>
      <SpeakButton text={word.hanzi} />
    </div>
    <p className="relative mt-2 mb-3 text-subhead leading-relaxed">
      {word.emoji && <span aria-hidden="true" className="mr-1.5 inline-block align-[-0.1em] text-[1.375rem] leading-none">{word.emoji}</span>}
      {word.meaning}
      {word.pos && <Badge className="ml-2 align-[1px]">{word.pos}</Badge>}
    </p>
    <div className="relative mt-auto flex items-center justify-between gap-2 border-t border-separator pt-3">
      <WriteButton hanzi={word.hanzi} onClick={onWrite} />
      <RememberToggle remembered={remembered} disabled={disabled} onToggle={onToggle} />
    </div>
  </div>
}
