import { motion } from 'framer-motion'
import { contourPath, TONE_INFO, type Tone } from '@/lib/pinyin'

const STROKE = ['', 'var(--color-tone1)', 'var(--color-tone2)', 'var(--color-tone3)', 'var(--color-tone4)', 'var(--color-tone5)']

/** Pitch contour drawn on the 5-level Chao scale. */
export function ToneContour({ tone, size = 64, animate = true }: { tone: Tone; size?: number; animate?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label={TONE_INFO[tone].name}>
      {[10, 30, 50, 70, 90].map((y) => (
        <line key={y} x1="6" x2="94" y1={y} y2={y} stroke="var(--color-line)" strokeWidth="1.5" strokeDasharray="3 4" />
      ))}
      <motion.path
        d={contourPath(TONE_INFO[tone].contour)}
        fill="none"
        stroke={STROKE[tone]}
        strokeWidth="9"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </svg>
  )
}
