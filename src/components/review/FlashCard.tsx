import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { spring } from '@/components/ui/motion'
import type { ReviewWord } from '@/lib/courseModel'

// The next card rises from just behind; the old one flies off to the side, above it.
const slide = {
  enter: { opacity: 0.6, x: 0, y: 12, scale: 0.95, zIndex: 1 },
  center: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, zIndex: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -140, rotate: dir * -6, zIndex: 2 }),
}
const fade = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }

const faceClass = 'glass-thick shadow-lift absolute inset-0 flex flex-col overflow-hidden rounded-[2.25rem]! [corner-shape:round]! p-5 [backface-visibility:hidden] sm:rounded-[2.75rem]! sm:p-6'
// `inert` is valid HTML but missing from React 18 typings.
const inertProps = (on: boolean) => (on ? ({ inert: '' } as object) : {})

function FaceHeader({ card }: { card: ReviewWord }) {
  return <div className="flex shrink-0 items-center justify-between gap-3 text-footnote text-secondary-label">
    <Badge tone="tint">{card.lessonLabel}</Badge>
    <span className="truncate">{card.lessonTitle.replace(/ · \d+ new words?$/, '')}</span>
  </div>
}

function Face({ card, revealed, reduce }: { card: ReviewWord; revealed: boolean; reduce: boolean | null }) {
  // Reduced motion: no rotation, the two faces cross-fade instead.
  const faceTransition = reduce ? { duration: 0.2 } : spring.smooth
  return <motion.div
    initial={false}
    animate={reduce ? { rotateY: 0 } : { rotateY: revealed ? 180 : 0 }}
    transition={spring.smooth}
    className="relative h-full [transform-style:preserve-3d]">
    <motion.div initial={false} animate={reduce ? { opacity: revealed ? 0 : 1 } : undefined} transition={faceTransition}
      aria-hidden={revealed} {...inertProps(revealed)} className={faceClass}>
      <FaceHeader card={card} />
      <div className="relative min-h-0 flex-1">
        <span className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span lang="zh-CN" className="font-han max-w-full break-all px-2 text-8xl leading-tight text-label max-sm:data-[long=true]:text-7xl" data-long={card.hanzi.length > 3}>{card.hanzi}</span>
          <span className="mt-5 text-subhead text-secondary-label">Tap the card to flip</span>
        </span>
      </div>
      <div className="flex shrink-0 justify-center"><SpeakButton text={card.hanzi} size="md" /></div>
    </motion.div>
    <motion.div initial={false} animate={reduce ? { opacity: revealed ? 1 : 0 } : undefined} transition={faceTransition}
      aria-hidden={!revealed} {...inertProps(!revealed)}
      className={`${faceClass} ${reduce ? '' : '[transform:rotateY(180deg)]'}`}>
      <FaceHeader card={card} />
      <div className="mt-3 flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-y-auto text-center">
          <span lang="zh-CN" className="font-han text-3xl text-secondary-label">{card.hanzi}</span>
          <Pinyin text={card.pinyin} className="text-4xl font-semibold" />
          <p className="max-w-full text-callout text-label text-pretty [overflow-wrap:anywhere]">{card.emoji && <span aria-hidden="true" className="mr-1.5 inline-block align-[-0.12em] text-2xl leading-none">{card.emoji}</span>}{card.meaning}</p>
          {card.pos && <Badge>{card.pos}</Badge>}
          <SpeakButton text={card.hanzi} size="md" />
        </div>
    </motion.div>
  </motion.div>
}

/**
 * Big glass flashcard. Front shows the Chinese word, the back the reading and meaning.
 * The flip is a spring on rotateY; moving to another card slides it in from the side of travel.
 */
export function FlashCard({ card, revealed, direction, isNew, onFlip }: { card: ReviewWord; revealed: boolean; direction: number; isNew?: boolean; onFlip: () => void }) {
  const reduce = useReducedMotion()
  return <div className="relative mb-5 h-[340px] [perspective:1400px] sm:h-[380px]">
    <AnimatePresence mode="popLayout" custom={direction} initial={false}>
      {/* A tap anywhere on the card flips it, both ways; its own buttons (speaker) keep their action.
          Keyboard users flip with Space or the flip button below the card. */}
      <motion.div key={card.id} custom={direction} variants={reduce ? fade : slide} initial="enter" animate="center" exit="exit" transition={spring.smooth}
        onClick={(e) => { if (!(e.target as HTMLElement).closest('button, a, input, summary')) onFlip() }}
        className="absolute inset-0 cursor-pointer select-none [-webkit-tap-highlight-color:transparent]">
        {/* Inside the sliding card, outside the flip, so it travels with its card and stays readable on both faces. */}
        {isNew && <span className="absolute -top-2 right-4 z-10 rounded-full bg-[#15120f] px-3 py-1 text-caption font-bold text-white dark:bg-[#f3eee4] dark:text-[#15120f]">New word</span>}
        <Face card={card} revealed={revealed} reduce={reduce} />
      </motion.div>
    </AnimatePresence>
  </div>
}
