import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, Plus, Search, Target, Volume2 } from 'lucide-react'
import { useNotch, type NotchIcon, type NotchProgress } from '@/store/notch'
import { StreakFlame } from '@/components/ui/StreakFlame'
import { spring } from '@/components/ui/motion'

const ICON_BG: Record<NotchIcon, string> = {
  audio: 'var(--pastel-blue)', plus: 'var(--pastel-green)', check: 'var(--pastel-green)', goal: 'var(--pastel-yellow)', streak: 'var(--color-streak-soft)',
}

function EventIcon({ icon }: { icon: NotchIcon }) {
  return <span aria-hidden="true" style={{ background: ICON_BG[icon] }} className="grid size-7 shrink-0 place-items-center rounded-full text-[#15120f]">
    {icon === 'audio' && <Volume2 className="size-4" strokeWidth={2.4} />}
    {icon === 'plus' && <Plus className="size-4" strokeWidth={2.6} />}
    {icon === 'check' && <Check className="size-4" strokeWidth={2.6} />}
    {icon === 'goal' && <Target className="size-4" strokeWidth={2.4} />}
    {icon === 'streak' && <StreakFlame className="size-5" />}
  </span>
}

/**
 * The black tab hanging under the top bar; tapping it opens search. At rest it shows a search glyph, or the lesson's progress when a page set one;
 * an event (audio playing, +1 word, part done, goal reached, streak kept) grows it for a moment.
 * `size="lg"` is the desktop one at the top of the paper sheet.
 */
export function Notch({ size = 'sm', onOpen, className = '' }: { size?: 'sm' | 'lg'; onOpen?: () => void; className?: string }) {
  const { event, progress } = useNotch()
  const reduce = useReducedMotion()
  const mode = event ? 'event' : progress ? 'progress' : 'rest'
  const box = mode === 'event' ? { width: size === 'lg' ? 320 : 264, height: 44 }
    : mode === 'progress' ? { width: size === 'lg' ? 280 : 228, height: 34 }
    : size === 'lg' ? { width: 168, height: 28 } : { width: 76, height: 22 }
  return <>
    {/* Tapping the notch, in any state, opens search. */}
    <motion.button type="button" onClick={onOpen} initial={false} animate={box} transition={reduce ? { duration: 0 } : spring.bouncy}
      aria-label={`Tìm kiếm${progress && !event ? ` · ${progress.label}: ${progress.done}/${progress.total}` : ''}`} title="Tìm kiếm (/)"
      className={`block max-w-[calc(100vw-2rem)] cursor-pointer overflow-hidden rounded-b-[1.25rem] bg-[#15120f] text-left text-white outline-offset-2 dark:bg-black ${className}`}>
      <AnimatePresence initial={false} mode="wait">
        {mode === 'event' && event && <motion.div key={`e${event.id}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          className="flex h-full items-center gap-2.5 px-2.5">
          <EventIcon icon={event.icon} />
          <span lang={event.zh ? 'zh-CN' : undefined} className={`min-w-0 truncate font-semibold ${event.zh ? 'font-han text-callout' : 'text-subhead'}`}>{event.text}</span>
          {event.sub && <span className="ml-auto shrink-0 pr-1.5 text-footnote tabular-nums text-white/70">{event.sub}</span>}
        </motion.div>}
        {mode === 'rest' && <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          className="flex h-full items-center justify-center gap-1.5 pb-0.5 text-white/75">
          <Search aria-hidden="true" className={size === 'lg' ? 'size-3.5' : 'size-3.5'} strokeWidth={2.4} />
          {size === 'lg' && <span className="text-caption font-semibold">Tìm kiếm <span className="ml-1 rounded border border-white/25 px-1 text-[10px]">/</span></span>}
        </motion.div>}
        {mode === 'progress' && progress && <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          className="flex h-full flex-col justify-center gap-1 px-4 pb-0.5">
          <span className="flex items-center justify-between gap-3 text-caption font-semibold leading-none">
            <span className="min-w-0 truncate">{progress.label}</span><span className="shrink-0 tabular-nums text-white/70">{progress.done}/{progress.total}</span>
          </span>
          <span className="block h-1 overflow-hidden rounded-full bg-white/20">
            <motion.span initial={false} animate={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }} transition={spring.smooth} className="block h-full rounded-full bg-[var(--pastel-green)]" />
          </span>
        </motion.div>}
      </AnimatePresence>
    </motion.button>
    {/* Events are read out, except audio (the learner hears it). */}
    <p role="status" aria-live="polite" className="sr-only">{event && event.icon !== 'audio' ? `${event.text}${event.sub ? `, ${event.sub}` : ''}` : ''}</p>
  </>
}

/** Rendered by a page to show its progress in the notch while it is open. */
export function NotchProgressBridge(props: NotchProgress) {
  const setProgress = useNotch((s) => s.setProgress)
  const { label, done, total } = props
  useEffect(() => { setProgress({ label, done, total }) }, [label, done, total, setProgress])
  useEffect(() => () => setProgress(null), [setProgress])
  return null
}
