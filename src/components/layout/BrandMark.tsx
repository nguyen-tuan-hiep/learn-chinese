import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition } from 'framer-motion'
import { useMascot, cheer, type Mood } from '@/store/mascot'

const INK = '#15120f'

/** How the whole bun moves for each mood (it squashes from its base). */
const BODY: Record<Mood, TargetAndTransition> = {
  idle: { y: 0, scaleX: 1, scaleY: 1, rotate: 0 },
  happy: { y: [0, -5, 0, -2, 0], scaleX: [1, 0.94, 1.06, 0.98, 1], scaleY: [1, 1.06, 0.94, 1.02, 1], rotate: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  sad: { y: 1, scaleX: 1.04, scaleY: 0.95, rotate: [0, -4, 3, -2, 0], transition: { duration: 0.6, ease: 'easeInOut' } },
  wow: { y: [0, -3, 0], scaleX: [1, 1.1, 1], scaleY: [1, 1.1, 1], rotate: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

/** Blinks at a random moment every few seconds, like it is alive. */
function useBlink(on: boolean) {
  const [closed, setClosed] = useState(false)
  useEffect(() => {
    if (!on) return
    let t: ReturnType<typeof setTimeout>
    const loop = () => {
      t = setTimeout(() => {
        setClosed(true)
        t = setTimeout(() => { setClosed(false); loop() }, 140)
      }, 2400 + Math.random() * 3600)
    }
    loop()
    return () => clearTimeout(t)
  }, [on])
  return closed
}

/** The bun's outline, pleats and knot in its 200×200 drawing box (the same art as the app icon, scripts/generate-icons.mjs). */
const BUN = 'M26 142C26 84 60 46 100 46C140 46 174 84 174 142C174 162 150 170 100 170C50 170 26 162 26 142Z'
const KNOT = 'M89 54C89 45 94 40 100 40C106 40 111 45 111 54C106 57 94 57 89 54Z'
const PLEATS = ['M100 54C92 60 82 64 70 66', 'M100 54C95 62 90 68 84 73', 'M100 54V75', 'M100 54C105 62 110 68 116 73', 'M100 54C108 60 118 64 130 66']
const pleats = PLEATS.map((d) => <path key={d} d={d} />)

/** The face in the 200×200 box; moods cross-fade. */
function Face({ mood, blink }: { mood: Mood; blink: boolean }) {
  const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 } }
  const line = { fill: 'none', stroke: INK, strokeLinecap: 'round' as const }
  return <AnimatePresence mode="wait" initial={false}>
    {mood === 'happy' && <motion.g key="happy" {...fade}>
      {/* ^ ^ eyes and an open smile */}
      <path d="M70 121Q77 111 84 121M116 121Q123 111 130 121" {...line} strokeWidth="4.5" />
      <path d="M88 127H112Q110 144 100 144Q90 144 88 127Z" fill={INK} />
      <path d="M93 138Q100 133 107 138Q105 143 100 143Q95 143 93 138Z" fill="#f08fae" />
    </motion.g>}
    {mood === 'sad' && <motion.g key="sad" {...fade}>
      {/* worried brows (inner ends up), a small frown and a sweat drop */}
      <circle cx="78" cy="127" r="5" fill={INK} /><circle cx="122" cy="127" r="5" fill={INK} />
      <path d="M68 118L81 113M132 118L119 113" {...line} strokeWidth="3.5" />
      <path d="M91 143Q100 135 109 143" {...line} strokeWidth="3.5" />
      <path d="M150 80C154 86 156 89 156 92A6 6 0 0 1 144 92C144 89 146 86 150 80Z" fill="#8cc3e8" />
    </motion.g>}
    {mood === 'wow' && <motion.g key="wow" {...fade}>
      <circle cx="78" cy="117" r="8.5" fill={INK} /><circle cx="122" cy="117" r="8.5" fill={INK} />
      <circle cx="81" cy="113.5" r="3" fill="#fff" /><circle cx="125" cy="113.5" r="3" fill="#fff" />
      <ellipse cx="100" cy="135" rx="6" ry="7.5" fill={INK} />
    </motion.g>}
    {mood === 'idle' && <motion.g key="idle" {...fade}>
      {/* Blink by flattening the eyes themselves (ry), not with a transform: an SVG transform origin can slip to
          the corner of the drawing and the eyes would jump out of the face. */}
      {[78, 122].map((cx) => <motion.ellipse key={cx} cx={cx} cy="118" rx="6.5" initial={false}
        animate={{ ry: blink ? 1 : 7.5 }} transition={{ duration: 0.07 }} fill={INK} />)}
      <motion.g initial={false} animate={{ opacity: blink ? 0 : 1 }} transition={{ duration: 0.07 }}>
        <circle cx="80.5" cy="115" r="2.2" fill="#fff" /><circle cx="124.5" cy="115" r="2.2" fill="#fff" />
      </motion.g>
      <path d="M92 129Q96 134 100 129Q104 134 108 129" {...line} strokeWidth="3.5" strokeLinejoin="round" />
    </motion.g>}
  </AnimatePresence>
}

export function BrandMark({ className = '', live = false }: { className?: string; live?: boolean }) {
  const id = useId().replace(/:/g, '')
  const shared = useMascot((s) => s.mood)
  const beat = useMascot((s) => s.beat)
  const mood: Mood = live ? shared : 'idle'
  const reduce = useReducedMotion()
  const blink = useBlink(live && !reduce)

  const url = (name: string) => `url(#${id}-${name})`
  return <svg viewBox="0 0 44 44" aria-hidden="true" className={`overflow-visible ${className}`}
    onPointerEnter={live ? (e) => { if (e.pointerType === 'mouse' && shared === 'idle') cheer('happy', 900) } : undefined}>
    <defs>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.97" /><stop offset="0.6" stopColor="#fbf3e8" stopOpacity="0.9" /><stop offset="1" stopColor="#ead6ba" stopOpacity="0.78" />
      </linearGradient>
      <linearGradient id={`${id}-rim`} x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0" stopColor="#fff" /><stop offset="0.5" stopColor="#fff" stopOpacity="0.25" /><stop offset="1" stopColor="#fff" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id={`${id}-knot`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#efe1cb" /></linearGradient>
      <radialGradient id={`${id}-blush`}><stop offset="0" stopColor="#f58fae" stopOpacity="0.95" /><stop offset="1" stopColor="#f58fae" stopOpacity="0" /></radialGradient>
      <clipPath id={`${id}-clip`}><path d={BUN} /></clipPath>
      <filter id={`${id}-b1`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2" /></filter>
      <filter id={`${id}-b3`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
      <filter id={`${id}-b8`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" /></filter>
    </defs>
    {/* Breathing (idle only) wraps the mood motion; both squash from the base of the bun. */}
    <motion.g animate={live && mood === 'idle' ? { scaleY: [1, 1.03, 1], scaleX: [1, 0.99, 1] } : { scaleY: 1, scaleX: 1 }}
      transition={live && mood === 'idle' ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
      style={{ originX: '22px', originY: '37.5px' }}>
      <motion.g key={live ? beat : 0} animate={BODY[mood]} transition={{ duration: 0.3 }} style={{ originX: '22px', originY: '37.5px' }}>
        {/* The 200×200 drawing, fitted so the bun spans x 4–40 and sits on y 37.5. */}
        <g transform="translate(-2.32 -3.85) scale(0.2432)">
          <ellipse cx="100" cy="174" rx="60" ry="9" fill="#000" opacity="0.3" filter={url('b3')} />
          <ellipse cx="104" cy="142" rx="58" ry="26" fill="#f5b183" opacity="0.45" filter={url('b8')} />
          <path d={BUN} fill={url('glass')} />
          <g clipPath={url('clip')}>
            <ellipse cx="112" cy="176" rx="64" ry="20" fill="#f2b98e" opacity="0.35" filter={url('b8')} />
            <ellipse cx="60" cy="96" rx="34" ry="24" fill="#fff" opacity="0.9" filter={url('b8')} />
          </g>
          <path d={BUN} fill="none" stroke={url('rim')} strokeWidth="3" />
          <path d="M38 128C40 98 56 70 84 56" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.95" />
          <g transform="translate(0 3)" stroke="#6b4a2a" strokeOpacity="0.22" strokeWidth="5" strokeLinecap="round" fill="none" filter={url('b1')}>{pleats}</g>
          <g stroke="#d6ba92" strokeWidth="4.5" strokeLinecap="round" fill="none">{pleats}</g>
          <path d={KNOT} transform="translate(0 3)" fill="#6b4a2a" opacity="0.22" filter={url('b1')} />
          <path d={KNOT} fill={url('knot')} stroke="#fff" strokeWidth="1.2" />
          <path d="M95 47Q100 43 105 47" stroke="#d6ba92" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <motion.g animate={{ opacity: mood === 'happy' ? 1 : mood === 'sad' ? 0.4 : 0.85, scale: mood === 'happy' ? 1.15 : 1 }} transition={{ duration: 0.2 }}>
            <ellipse cx="62" cy="134" rx="14" ry="9" fill={url('blush')} />
            <ellipse cx="138" cy="134" rx="14" ry="9" fill={url('blush')} />
          </motion.g>
          <Face mood={mood} blink={blink} />
        </g>
      </motion.g>
    </motion.g>
  </svg>
}
