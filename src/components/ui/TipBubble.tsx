import { motion, useReducedMotion } from 'framer-motion'

/** A friendly tip with a small round avatar, like a chat bubble from a study buddy. */
export function TipBubble({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return <motion.div animate={reduce ? undefined : { y: [0, -3, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    className="inline-flex max-w-full items-center gap-3 rounded-full bg-[var(--glass-regular)] py-2 pr-5 pl-2 shadow-card">
    <span aria-hidden="true" lang="zh-CN" className="font-han grid size-10 shrink-0 place-items-center rounded-full bg-[var(--pastel-green)] text-xl text-[#15120f] dark:bg-[#2a3d2d] dark:text-[#f5f1e8]">汉</span>
    <p className="min-w-0 text-subhead sm:text-callout">{children}</p>
  </motion.div>
}
