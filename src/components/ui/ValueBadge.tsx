import { AnimatePresence, motion } from 'framer-motion'
import { spring } from './motion'

/** Small green pill (e.g. "+1") that pops in whenever `value` changes. Renders nothing for an empty value. */
export function ValueBadge({ value, className = '' }: { value: string | number | null | undefined; className?: string }) {
  const shown = value !== null && value !== undefined && value !== ''
  return <AnimatePresence mode="popLayout" initial={false}>
    {shown && <motion.span key={value} initial={{ scale: 0.4, opacity: 0, y: 6 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.6, opacity: 0 }} transition={spring.bouncy}
      className={`inline-flex items-center whitespace-nowrap rounded-full bg-success-text px-2 py-0.5 text-caption font-semibold tabular-nums text-on-primary ${className}`}>{value}</motion.span>}
  </AnimatePresence>
}
