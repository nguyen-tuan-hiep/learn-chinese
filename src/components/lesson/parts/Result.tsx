import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { spring } from '@/components/ui/motion'

/**
 * Answer state that morphs in place: correct is green with a ✓ that springs in, wrong is red and shakes once.
 * Lives in an aria-live region so screen readers hear the verdict.
 */
export function Result({ ok, children, className = '' }: { ok: boolean; children: ReactNode; className?: string }) {
  return <motion.div role="status" aria-live="polite"
    initial={ok ? { opacity: 0, scale: 0.94 } : { opacity: 1, x: 0 }}
    animate={ok ? { opacity: 1, scale: 1 } : { x: [0, -7, 7, -4, 4, 0] }}
    transition={ok ? spring.bouncy : { duration: 0.4 }}
    className={`inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-4 text-subhead font-semibold ${ok ? 'bg-success-soft text-success-text' : 'bg-danger-soft text-danger-text'} ${className}`}>
    <span aria-hidden="true" className={`grid size-6 place-items-center rounded-full text-white dark:text-black ${ok ? 'bg-success-text' : 'bg-danger'}`}>
      {ok ? <Check className="size-3.5" strokeWidth={3} /> : <X className="size-3.5" strokeWidth={3} />}
    </span>
    {children}
  </motion.div>
}
