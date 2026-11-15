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

function Face({ mood, blink }: { mood: Mood; blink: boolean }) {
  const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.12 } }
  return <AnimatePresence mode="wait" initial={false}>
    {mood === 'happy' && <motion.g key="happy" {...fade}>
      {/* ^ ^ eyes and an open smile */}
      <g fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round"><path d="M13.3 26q2.2-3 4.4 0" /><path d="M26.3 26q2.2-3 4.4 0" /></g>
      <path d="M18.6 28.2q3.4 4.6 6.8 0z" fill={INK} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
    </motion.g>}
    {mood === 'sad' && <motion.g key="sad" {...fade}>
      <circle cx="15.5" cy="26" r="1.8" fill={INK} /><circle cx="28.5" cy="26" r="1.8" fill={INK} />
      <g fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round"><path d="M12.8 23.6l3.8-1.5" /><path d="M31.2 23.6l-3.8-1.5" /><path d="M19.5 30.6q2.5-2.4 5 0" /></g>
      {/* a little sweat drop */}
      <path d="M35.5 19c1.4 2 1.9 3 1.9 3.8a1.9 1.9 0 0 1-3.8 0c0-.8.5-1.8 1.9-3.8z" fill="#8cc3e8" />
    </motion.g>}
    {mood === 'wow' && <motion.g key="wow" {...fade}>
      <circle cx="15.5" cy="24.6" r="2.5" fill={INK} /><circle cx="28.5" cy="24.6" r="2.5" fill={INK} />
      <circle cx="16.3" cy="23.8" r="0.8" fill="#fff" /><circle cx="29.3" cy="23.8" r="0.8" fill="#fff" />
      <ellipse cx="22" cy="30" rx="1.9" ry="2.3" fill={INK} />
    </motion.g>}
    {mood === 'idle' && <motion.g key="idle" {...fade}>
      {/* Blink by flattening the eyes themselves (ry), not with a transform: an SVG transform origin can slip to
          the corner of the drawing and the eyes would jump out of the face. */}
      {[15.5, 28.5].map((cx) => <motion.ellipse key={cx} cx={cx} cy="25" rx="2" initial={false}
        animate={{ ry: blink ? 0.3 : 2 }} transition={{ duration: 0.07 }} fill={INK} />)}
      <path d="M19.5 28.5q2.5 2.6 5 0" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </motion.g>}
  </AnimatePresence>
}

/**
 * The Hànyǔ mascot: a smiling steamed bun (bánh bao) in frosted glass.
 * Glass is faked inside the SVG: a blurred peach glow sits behind a translucent white body whose fill runs
 * from white to warm cream (one hue), with a white rim fading downward and a highlight on the top left.
 *
 * `live` makes it feel alive: it breathes, blinks, reacts to the shared mood (store/mascot: happy on a right answer,
 * sad on a wrong one, surprised at milestones) and smiles when the pointer comes over it.
 * Without `live` (decorative copies) it is the plain smiling bun. Reduced motion keeps the faces but drops the movement.
 */
export function BrandMark({ className = '', live = false }: { className?: string; live?: boolean }) {
  const id = useId().replace(/:/g, '')
  const body = `${id}-body`, rim = `${id}-rim`, glow = `${id}-glow`
  const shared = useMascot((s) => s.mood)
  const beat = useMascot((s) => s.beat)
  const mood: Mood = live ? shared : 'idle'
  const reduce = useReducedMotion()
  const blink = useBlink(live && !reduce)

  return <svg viewBox="0 0 44 44" aria-hidden="true" className={`overflow-visible ${className}`}
    onPointerEnter={live ? (e) => { if (e.pointerType === 'mouse' && shared === 'idle') cheer('happy', 900) } : undefined}>
    <defs>
      <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="1" stopColor="#e8dfd2" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id={rim} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.15" />
      </linearGradient>
      <filter id={glow} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2" /></filter>
    </defs>
    {/* Glow behind the glass, so the translucent body has something to frost. */}
    <circle cx="29" cy="30" r="9" fill="#f6c9a8" opacity="0.9" filter={`url(#${glow})`} />
    <circle cx="13" cy="20" r="6" fill="#ffffff" opacity="0.6" filter={`url(#${glow})`} />
    {/* Breathing (idle only) wraps the mood motion; both squash from the base of the bun. */}
    <motion.g animate={live && mood === 'idle' ? { scaleY: [1, 1.03, 1], scaleX: [1, 0.99, 1] } : { scaleY: 1, scaleX: 1 }}
      transition={live && mood === 'idle' ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
      style={{ originX: '22px', originY: '37.5px' }}>
      <motion.g key={live ? beat : 0} animate={BODY[mood]} transition={{ duration: 0.3 }} style={{ originX: '22px', originY: '37.5px' }}>
        <path d="M4 30c0-12 8.5-22 18-22s18 10 18 22c0 4.5-4 7.5-18 7.5S4 34.5 4 30z" fill={`url(#${body})`} stroke={`url(#${rim})`} strokeWidth="1.4" />
        <ellipse cx="13" cy="17.5" rx="4.6" ry="2" fill="#fff" opacity="0.75" transform="rotate(-32 13 17.5)" />
        <g fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round">
          <path d="M16 11.5c2 3 4 4 6 4s4-1 6-4" />
          <path d="M22 8.5v7" />
        </g>
        <Face mood={mood} blink={blink} />
        <motion.g animate={{ opacity: mood === 'happy' ? 1 : mood === 'sad' ? 0.35 : 0.8, scale: mood === 'happy' ? 1.25 : 1 }} transition={{ duration: 0.2 }}>
          <ellipse cx="11" cy="29.2" rx="2.6" ry="1.5" fill="#f08fae" />
          <ellipse cx="33" cy="29.2" rx="2.6" ry="1.5" fill="#f08fae" />
        </motion.g>
      </motion.g>
    </motion.g>
  </svg>
}
