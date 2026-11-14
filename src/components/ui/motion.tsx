import { motion, type HTMLMotionProps, type Transition, type Variants } from 'framer-motion'

/** The app's one easing curve: quick start, soft landing. */
export const EASE = [0.22, 1, 0.36, 1] as const

/** Spring presets: snappy for presses and toggles, smooth for layout, bouncy for badges that pop in. */
export const spring = {
  snappy: { type: 'spring', stiffness: 500, damping: 35 },
  smooth: { type: 'spring', stiffness: 260, damping: 30 },
  bouncy: { type: 'spring', stiffness: 420, damping: 18 },
} as const satisfies Record<string, Transition>

/** Children of a <Stagger> rise in one after another. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: spring.smooth },
}

/** Smaller step for tiles in a grid. */
export const popIn: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring.snappy },
}

/** A container that reveals its <Rise> children in sequence. */
export function Stagger({ gap = 0.06, delay = 0, ...props }: HTMLMotionProps<'div'> & { gap?: number; delay?: number }) {
  return <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }} {...props} />
}

/** One step of a <Stagger>. */
export function Rise(props: HTMLMotionProps<'div'>) {
  return <motion.div variants={riseIn} {...props} />
}
