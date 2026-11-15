import { motion } from 'framer-motion'
import { Check, Volume2 } from 'lucide-react'
import type { SoundGuide } from '@/data/pronunciationGuide'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { popIn, spring } from '@/components/ui/motion'
import { usePlayback } from './usePlayback'

/**
 * One initial or final: big glyph, English approximation, mouth cue. Tap = hear it.
 * A heard tile (this visit) gets a pink wash and a check. Rows on phones, stacked tiles from `sm`.
 */
export function SoundTile({ item, heard, onPlay }: { item: SoundGuide; heard: boolean; onPlay: (text: string) => Promise<void> | void }) {
  const { playing, press } = usePlayback(onPlay, item.say)
  return (
    <motion.button
      type="button"
      variants={popIn}
      whileTap={{ scale: 0.97 }}
      transition={spring.snappy}
      onClick={press}
      aria-label={`${item.label}: ${item.approximate}. Listen`}
      className={`relative flex min-h-11 min-w-0 cursor-pointer select-none gap-4 rounded-2xl p-4 text-left transition-colors duration-300 sm:flex-col sm:gap-1 ${heard ? 'on-pastel bg-feature-pronunciation-soft' : 'bg-fill'}`}
    >
      <span className="flex w-16 shrink-0 flex-col items-center sm:w-auto sm:flex-row sm:items-baseline sm:gap-2">
        <span className="text-title1 font-semibold leading-none">{item.label}</span>
        <span className="mt-1.5 flex items-baseline gap-1 text-subhead sm:mt-0"><Pinyin text={item.pinyin} /><span lang="zh-CN" className="font-han text-secondary-label">{item.say}</span></span>
      </span>
      <span className="min-w-0 flex-1 sm:mt-1">
        <span className="block text-callout font-semibold">{item.approximate}</span>
        <span className="mt-1 block text-subhead leading-snug">{item.mouth}</span>
        <span className="mt-1 block text-footnote leading-snug text-secondary-label">{item.caution}</span>
      </span>
      <span aria-hidden="true" className="absolute right-3 top-3 text-secondary-label">
        {playing ? <Volume2 size={16} className="animate-pulse text-label" /> : heard ? <Check size={16} strokeWidth={3} className="text-feature-pronunciation" /> : null}
      </span>
    </motion.button>
  )
}
