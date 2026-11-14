import { motion, useReducedMotion } from 'framer-motion'
import { contourPath, TONE_INFO, type Tone } from '@/lib/pinyin'

const COLOR = ['', 'text-tone1', 'text-tone2', 'text-tone3', 'text-tone4', 'text-tone5']

/**
 * Pitch contour on the 5-level Chao scale, drawn in the tone's own colour.
 * The curve draws itself in when it scrolls into view; reduced motion (or `animate={false}`) shows it at once.
 */
export function ToneContour({ tone, size = 64, animate = true, className = '' }: { tone: Tone; size?: number; animate?: boolean; className?: string }) {
  const reduce = useReducedMotion()
  const draw = animate && !reduce
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={TONE_INFO[tone].name} className={`${COLOR[tone]} ${className}`}>
      {[10, 30, 50, 70, 90].map((y) => (
        <line key={y} x1="6" x2="94" y1={y} y2={y} stroke="var(--color-separator)" strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" />
      ))}
      <motion.path
        d={contourPath(TONE_INFO[tone].contour)}
        fill="none"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={draw ? { pathLength: 0, opacity: 0.4 } : false}
        whileInView={draw ? { pathLength: 1, opacity: 1 } : undefined}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}
