import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { spring } from '@/components/ui/motion'
import type { ReviewWord } from '@/lib/courseModel'

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 56, scale: 0.97 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -56, scale: 0.97 }),
}
const fade = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }

const faceClass = 'glass-thick shadow-lift absolute inset-0 flex flex-col overflow-hidden rounded-panel p-5 [backface-visibility:hidden] sm:p-6'
// `inert` is valid HTML but missing from React 18 typings.
const inertProps = (on: boolean) => (on ? ({ inert: '' } as object) : {})

function FaceHeader({ card }: { card: ReviewWord }) {
  return <div className="flex shrink-0 items-center justify-between gap-3 text-footnote text-secondary-label">
    <Badge tone="tint">{card.lessonLabel}</Badge>
    <span className="truncate">{card.lessonTitle.replace(/ · \d+ từ mới$/, '')}</span>
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
          <span className="mt-5 text-subhead text-secondary-label">Chạm vào thẻ để lật</span>
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
          <p className="max-w-full text-callout text-label text-pretty [overflow-wrap:anywhere]">{card.meaning}</p>
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
export function FlashCard({ card, revealed, direction, onFlip }: { card: ReviewWord; revealed: boolean; direction: number; onFlip: () => void }) {
  const reduce = useReducedMotion()
  return <div className="relative h-[340px] [perspective:1400px] sm:h-[380px]">
    <AnimatePresence mode="popLayout" custom={direction} initial={false}>
      {/* A tap anywhere on the card flips it, both ways; its own buttons (speaker) keep their action.
          Keyboard users flip with Space or the flip button below the card. */}
      <motion.div key={card.id} custom={direction} variants={reduce ? fade : slide} initial="enter" animate="center" exit="exit" transition={spring.smooth}
        onClick={(e) => { if (!(e.target as HTMLElement).closest('button, a, input, summary')) onFlip() }}
        className="absolute inset-0 cursor-pointer select-none [-webkit-tap-highlight-color:transparent]">
        <Face card={card} revealed={revealed} reduce={reduce} />
      </motion.div>
    </AnimatePresence>
  </div>
}
