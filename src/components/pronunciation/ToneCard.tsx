import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import type { TONE_GUIDE } from '@/data/pronunciationGuide'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { ToneContour } from '@/components/hanzi/ToneContour'
import { spring } from '@/components/ui/motion'
import { usePlayback } from './usePlayback'

type ToneInfo = (typeof TONE_GUIDE)[number]

/**
 * One tone as a pastel card: its contour in the tone's own colour, a big pinyin example, direction and caution.
 * Pressing plays the example with a ripple from the middle and a "Playing" state.
 * `compact` lays it out as a wide row (used for the neutral tone).
 */
export function ToneCard({ tone, onPlay, compact = false }: { tone: ToneInfo; onPlay: (text: string) => Promise<void> | void; compact?: boolean }) {
  const reduce = useReducedMotion()
  const { playing, pulse, press } = usePlayback(onPlay, tone.say)
  const hue = `var(--color-tone${tone.tone})`
  return (
    <motion.button
      type="button"
      onClick={press}
      whileTap={{ scale: 0.97 }}
      transition={spring.snappy}
      aria-label={`${tone.label}: nghe ${tone.pinyin}`}
      style={{ background: `var(--tone-bg-${tone.tone})` }}
      className={`relative flex shadow-card min-w-0 cursor-pointer select-none gap-4 overflow-hidden rounded-[1.75rem] p-4 text-left ${compact ? 'items-center' : 'items-center min-[480px]:flex-col min-[480px]:gap-3 min-[480px]:p-5 min-[480px]:text-center'}`}
    >
      {!reduce && <AnimatePresence>
        {pulse > 0 && <motion.span key={pulse} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: hue }} initial={{ scale: 0.2, opacity: 0.28 }} animate={{ scale: 2.4, opacity: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />}
      </AnimatePresence>}
      <span className="relative shrink-0"><ToneContour tone={tone.tone} size={compact ? 64 : 76} /></span>
      <span className="relative min-w-0 flex-1">
        <span className="block text-footnote font-semibold text-secondary-label">{tone.label} <span aria-hidden="true">{tone.mark}</span></span>
        <span className="mt-0.5 flex items-baseline gap-2 min-[480px]:justify-center">
          <Pinyin text={tone.pinyin} className="text-title1" />
          <span lang="zh-CN" className="font-han text-title3 text-secondary-label">{tone.say}</span>
        </span>
        <span className="mt-1.5 block text-subhead text-label">{tone.direction}</span>
        <span className="mt-1 block text-footnote text-secondary-label">{tone.caution}</span>
        <span aria-live="polite" className={`mt-2 flex min-h-5 items-center gap-1.5 text-caption font-semibold min-[480px]:justify-center ${playing ? 'text-label' : 'text-tertiary-label'}`}>
          <Volume2 size={14} aria-hidden="true" className={playing ? 'animate-pulse' : ''} />{playing ? 'Playing' : 'Tap to listen'}
        </span>
      </span>
    </motion.button>
  )
}
