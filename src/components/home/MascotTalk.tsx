import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BrandMark } from '@/components/layout/BrandMark'
import { ButtonLink } from '@/components/ui/Button'

/** Things the bánh bao says between today's own tip, in order. */
export const MASCOT_LINES = [
  'Listen, then read it aloud three times. It sticks so much better!',
  'A few words a day is plenty. Showing up every day is the secret.',
  'A wrong tone is a wrong meaning, so listen closely!',
  'Writing a character by hand once helps you remember it far longer.',
  'Know the radicals and you can guess the meaning of lots of new characters.',
  'Reviewing just before you forget is the best way to remember.',
  'Tired? Take a break, we can carry on tomorrow.',
  '加油！Keep going, you are doing great!',
]

const TYPE_MS = 32
const HOLD_MS = 4200

export interface MascotTip { text: ReactNode; plain: string; action?: { label: string; to: string } }

/**
 * The mascot "talking": a speech bubble types out today's tip, then a rotating line from MASCOT_LINES, and loops.
 * The bun bobs while it types. Hovering or focusing the bubble pauses it; with reduced motion lines swap without typing.
 * Screen readers get today's tip once (the rotating lines are decoration).
 */
export function MascotTalk({ tip, className = '' }: { tip: MascotTip; className?: string }) {
  const reduce = useReducedMotion()
  const lines: MascotTip[] = [tip, ...MASCOT_LINES.map((plain) => ({ text: plain, plain }))]
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(0)
  const [paused, setPaused] = useState(false)
  const line = lines[index % lines.length]
  const chars = [...line.plain]
  const done = reduce || typed >= chars.length

  useEffect(() => { setTyped(0) }, [index])
  useEffect(() => {
    if (paused) return
    if (!done) {
      const t = setTimeout(() => setTyped((n) => n + 1), TYPE_MS)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => { if (!document.hidden) setIndex((i) => (i + 1) % lines.length) }, index === 0 ? HOLD_MS * 1.5 : HOLD_MS)
    return () => clearTimeout(t)
  }, [paused, done, typed, index, lines.length])

  return <div className={`flex items-end justify-end gap-2.5 ${className}`}>
    <p className="sr-only">{tip.plain}</p>
    <div onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      className="relative min-w-0 flex-1 sm:max-w-[22rem]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={index} initial={reduce ? false : { opacity: 0, scale: 0.92, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22 }} style={{ transformOrigin: '100% 100%' }}
          className="relative rounded-[1.5rem] rounded-br-md border border-edge bg-[var(--glass-regular)] px-4 py-3 text-subhead leading-relaxed shadow-card sm:text-callout">
          {/* The full line holds the bubble's size while the visible copy types over it. */}
          <span aria-hidden="true" className="relative block">
            <span className="invisible block">{line.text}</span>
            <span className="absolute inset-0">
              {done ? line.text : chars.slice(0, typed).join('')}
              {!done && <span className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-[0.15em] animate-pulse bg-current" />}
            </span>
          </span>
        </motion.div>
      </AnimatePresence>
      {/* Today's action stays put under the bubble while the lines rotate, so it is always there to tap. */}
      {/* Without an action an empty row of the same height (sm button, h-9) keeps the bubble at the bun's face,
          so its pointed corner still points at the bun. */}
      <div className="mt-2 flex h-9 justify-end">
        {tip.action && <ButtonLink to={tip.action.to} size="sm">{tip.action.label}<ArrowRight aria-hidden="true" className="size-4" /></ButtonLink>}
      </div>
    </div>
    <motion.span aria-hidden="true" animate={reduce || done ? { rotate: -8, y: 0 } : { rotate: [-8, -2, -10, -8], y: [0, -3, 0] }}
      transition={reduce || done ? { duration: 0.3 } : { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      className="grid size-20 shrink-0 place-items-center rounded-full bg-level-1-soft sm:size-24">
      <BrandMark live className="size-16 sm:size-20" />
    </motion.span>
  </div>
}
