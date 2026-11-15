import { motion, useReducedMotion } from 'framer-motion'
import { BrandMark } from '@/components/layout/BrandMark'

/** A friendly tip from the bánh bao mascot, like a chat bubble from a study buddy. */
export function TipBubble({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return <motion.div animate={reduce ? undefined : { y: [0, -3, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    className="inline-flex max-w-full items-center gap-3 rounded-full border border-edge bg-[var(--glass-regular)] py-2 pr-5 pl-2 shadow-card">
    <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-level-1-soft"><BrandMark live className="size-9" /></span>
    <p className="min-w-0 text-subhead sm:text-callout">{children}</p>
  </motion.div>
}
