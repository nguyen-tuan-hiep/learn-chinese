import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, PenLine, Plus } from 'lucide-react'
import type { Word } from '@/data/types'
import { Disclosure } from '@/components/ui/Disclosure'
import { Badge } from '@/components/ui/Badge'
import { ValueBadge } from '@/components/ui/ValueBadge'
import { spring } from '@/components/ui/motion'
import { Pinyin } from './Pinyin'
import { SpeakButton } from './SpeakButton'
import { CharBreakdown } from './CharBreakdown'
import { ColoredHanzi, lessonHighlight } from './ColoredHanzi'
import { RadicalTags } from './RadicalTags'

/** The fields the list-item (`row`) card needs; HSK 3.0 book words fit it. */
export interface RowWord { hanzi: string; pinyin: string; meaning: string; pos?: string }

interface BaseProps {
  /** @deprecated Use `variant="compact"`. Kept for the review pages. */
  compact?: boolean
}
type FullProps = BaseProps & { variant?: 'full'; word: Word; lessonId?: string; onWrite?: () => void }
type CompactProps = BaseProps & { variant: 'compact'; word: Word; lessonId?: string }
type RowProps = BaseProps & {
  variant: 'row'; word: RowWord
  /** Pinyin is hidden (but keeps its line) for self-testing. */
  showPinyin?: boolean
  remembered: boolean
  disabled?: boolean
  onToggle: () => void
  onWrite: () => void
}
export type WordCardProps = FullProps | CompactProps | RowProps

/** Pill that opens the stroke-order sheet. */
function WriteButton({ hanzi, onClick, tinted = false }: { hanzi: string; onClick: () => void; tinted?: boolean }) {
  return <button type="button" onClick={onClick} aria-label={`Cách viết ${hanzi}`}
    className={`inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full text-subhead font-semibold text-jade transition-colors ${tinted ? 'bg-tint-soft px-4 hover:brightness-[0.97]' : '-ml-3 px-3 hover:bg-tint-soft'}`}>
    <PenLine aria-hidden="true" className="size-4" />Cách viết
  </button>
}

/** The remember toggle: the pill morphs in place between "Đánh dấu nhớ" and "Đã nhớ", and a "+1" pops above it. */
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
    <span className="pointer-events-none absolute -top-3 right-2 z-10"><ValueBadge value={pop ? '+1' : null} /></span>
    <motion.button layout type="button" onClick={onToggle} disabled={disabled} aria-pressed={remembered} transition={spring.snappy} style={{ borderRadius: 9999 }}
      className={`relative inline-flex min-h-11 cursor-pointer items-center justify-center overflow-hidden px-4 text-subhead font-semibold transition-colors active:scale-[0.97] disabled:cursor-wait disabled:opacity-60 ${remembered ? 'bg-success-text text-white dark:text-black' : 'border border-separator text-secondary-label hover:text-label'}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={remembered ? 'on' : 'off'} layout="position" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.18 }}
          className="inline-flex items-center gap-1.5 whitespace-nowrap">
          {remembered ? <Check aria-hidden="true" className="size-4" strokeWidth={2.5} /> : <Plus aria-hidden="true" className="size-4" />}
          {remembered ? 'Đã nhớ' : 'Đánh dấu nhớ'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  </div>
}

/** One list item (HSK 3.0 vocabulary): word and sound on top, meaning, then stroke order and the remember toggle. */
function RowCard({ word, showPinyin = true, remembered, disabled, onToggle, onWrite }: Omit<RowProps, 'variant' | 'compact'>) {
  return <div className="glass relative flex h-full min-w-0 flex-col rounded-card p-4">
    <motion.span aria-hidden="true" initial={false} animate={{ opacity: remembered ? 1 : 0 }} transition={{ duration: 0.3 }} className="pointer-events-none absolute inset-0 rounded-[inherit] bg-success-soft" />
    <div className="relative flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <p lang="zh-CN" className="font-han text-3xl leading-tight text-balance break-words">{word.hanzi}</p>
        {/* Keeps its line when hidden, so cards don't change height. */}
        <p aria-hidden={!showPinyin} className={`mt-0.5 min-h-6 ${showPinyin ? '' : 'invisible'}`}><Pinyin text={word.pinyin} className="text-base" /></p>
      </div>
      <SpeakButton text={word.hanzi} />
    </div>
    <p className="relative mt-2 mb-3 text-subhead leading-relaxed">
      {word.meaning}
      {word.pos && <Badge className="ml-2 align-[1px]">{word.pos}</Badge>}
    </p>
    <div className="relative mt-auto flex items-center justify-between gap-2 border-t border-separator pt-3">
      <WriteButton hanzi={word.hanzi} onClick={onWrite} />
      <RememberToggle remembered={remembered} disabled={disabled} onToggle={onToggle} />
    </div>
  </div>
}

/**
 * Study card for a word, in three variants:
 * `full` (default) is the detailed card of the HSK 2.0 vocabulary part, `compact` is the review back face,
 * `row` is a list item with the remember toggle (HSK 3.0).
 */
export function WordCard(props: WordCardProps) {
  const variant = props.compact ? 'compact' : props.variant ?? 'full'
  if (variant === 'row') {
    const { word, showPinyin, remembered, disabled, onToggle, onWrite } = props as RowProps
    return <RowCard word={word} showPinyin={showPinyin} remembered={remembered} disabled={disabled} onToggle={onToggle} onWrite={onWrite} />
  }
  const { word, lessonId } = props as FullProps
  if (variant === 'compact') return <CompactCard word={word} />
  return <FullCard word={word} lessonId={lessonId} onWrite={(props as FullProps).onWrite} />
}

function CompactCard({ word }: { word: Word }) {
  return <div className="w-full">
    <div className="font-han text-5xl leading-tight break-all">{word.hanzi}</div>
    <div className="mt-2 flex flex-wrap items-center gap-2"><Pinyin text={word.pinyin} className="text-2xl" /><SpeakButton text={word.hanzi} size="sm" /></div>
    <div className="mt-1 text-lg"><span className="font-semibold text-warning-text">{word.hanViet}</span><span className="text-secondary-label"> · {word.pos}</span></div>
    <div className="text-lg font-semibold">{word.meaning}</div>
    {word.mnemonic && <p className="mt-3 text-sm text-secondary-label"><span className="font-semibold">Mẹo nhớ: </span>{word.mnemonic}</p>}
    <ul className="mt-3 space-y-2">{word.examples.map((ex) => <li key={ex.hanzi} className="flex items-start gap-3">
      <SpeakButton text={ex.hanzi} size="sm" />
      <div><div className="font-han text-lg">{ex.hanzi}</div><div className="text-sm"><Pinyin text={ex.pinyin} /> <span className="text-secondary-label">· {ex.vi}</span></div></div>
    </li>)}</ul>
  </div>
}

function FullCard({ word, lessonId, onWrite }: { word: Word; lessonId?: string; onWrite?: () => void }) {
  const highlight = lessonHighlight(lessonId)
  const han = /\p{Script=Han}/u
  const chars = [...word.hanzi]
  const glyphSize = chars.length > 3 ? 64 : chars.length > 1 ? 84 : 120
  return (
    <div className="w-full space-y-6">
      <div className="grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
        <div lang="zh-CN" aria-label={word.hanzi} className="flex h-44 min-w-44 flex-wrap content-center items-center justify-center justify-self-center rounded-card bg-fill px-5 sm:justify-self-start">
          {lessonId ? chars.map((char, i) => han.test(char) ? <ColoredHanzi key={i} char={char} highlight={highlight} size={glyphSize} /> : <span key={i} className="font-han text-6xl">{char}</span>)
            : <span className="font-han text-7xl">{word.hanzi}</span>}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Pinyin text={word.pinyin} className="text-3xl font-semibold" />
            <SpeakButton text={word.hanzi} size="sm" />
            <SpeakButton text={word.hanzi} size="sm" slow />
          </div>
          <p className="mt-2 text-xl font-semibold leading-snug text-balance">{word.meaning}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {word.hanViet && <Badge tone="gold">Hán Việt · {word.hanViet}</Badge>}
            {word.pos && <Badge>{word.pos}</Badge>}
          </div>
          {lessonId && <RadicalTags text={word.hanzi} lessonId={lessonId} />}
          {onWrite && <div className="mt-3"><WriteButton hanzi={word.hanzi} onClick={onWrite} tinted /></div>}
        </div>
      </div>

      {word.examples.length > 0 && <ul className="divide-y divide-separator rounded-card border border-separator">
        {word.examples.map((ex) => (
          <li key={ex.hanzi} className="flex items-start gap-3 p-3 sm:p-4">
            <SpeakButton text={ex.hanzi} size="sm" />
            <div className="min-w-0">
              <div lang="zh-CN" className="font-han text-xl">{ex.hanzi}</div>
              <div className="text-sm"><Pinyin text={ex.pinyin} /> <span className="text-secondary-label">· {ex.vi}</span></div>
            </div>
          </li>
        ))}
      </ul>}

      {word.mnemonic && <p className="rounded-card bg-warning-soft px-4 py-3 leading-relaxed"><span className="font-semibold">Mẹo nhớ: </span>{word.mnemonic}</p>}

      <Disclosure className="border-t border-separator pt-2"
        summary={<span className="font-semibold">Cấu tạo chữ {word.parts && <span className="font-han font-normal text-secondary-label">· {word.parts}</span>}</span>}>
        <CharBreakdown text={word.hanzi} />
      </Disclosure>
    </div>
  )
}
