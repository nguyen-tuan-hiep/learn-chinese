import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion'
import { spring } from './motion'
import { lockScroll } from '@/lib/scrollLock'

/** True from tablet width up, where the sheet becomes a side drawer. */
function useWide() {
  const query = '(min-width: 768px)'
  const [wide, setWide] = useState(() => typeof matchMedia === 'function' && matchMedia(query).matches)
  useEffect(() => {
    const mq = matchMedia(query)
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide
}

/**
 * Modal panel: a bottom sheet on phones (swipe down to dismiss), a side drawer on tablets. Esc or the backdrop closes it.
 * The swipe works from anywhere on the sheet while its content is scrolled to the top; otherwise the finger scrolls
 * the content as usual. Areas you draw in opt out with `data-sheet-nodrag`.
 * Rendered into <body>, so page transitions (which wrap the page in a layer) can't put it under the tab bar.
 */
/** `tall`: on phones the sheet keeps one height (its max) so switching tabs or filters inside doesn't make it jump. */
export function Sheet({ open, onClose, label, tall = false, children }: { open: boolean; onClose: () => void; label: string; tall?: boolean; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null)
  const wide = useWide()
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const unlock = lockScroll()
    document.addEventListener('keydown', onKey)
    panel.current?.focus()
    return () => { unlock(); document.removeEventListener('keydown', onKey) }
  }, [open, onClose])
  // Swipe-down to close, by hand rather than framer's `drag`: the sheet is also a scroll container, and `drag` fights
  // native scrolling on touch. Here the swipe only takes over when the content is at the top and the finger moves down.
  const y = useMotionValue<number | string>(0)
  useEffect(() => {
    const el = panel.current
    if (!open || wide || !el) return
    let startY = 0, lastY = 0, lastT = 0, speed = 0
    let state: 'idle' | 'maybe' | 'drag' = 'idle'
    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || (e.target as Element).closest('[data-sheet-nodrag]')) { state = 'idle'; return }
      state = 'maybe'; startY = lastY = e.touches[0].clientY; lastT = e.timeStamp; speed = 0
    }
    const onMove = (e: TouchEvent) => {
      if (state === 'idle') return
      const at = e.touches[0].clientY
      const dy = at - startY
      if (state === 'maybe') {
        if (el.scrollTop > 0 || dy < -4) { state = 'idle'; return } // the content scrolls instead
        if (dy > 0) e.preventDefault()
        if (dy < 6) return
        state = 'drag'; startY = at
      }
      e.preventDefault()
      y.set(Math.max(0, at - startY))
      speed = ((at - lastY) / Math.max(1, e.timeStamp - lastT)) * 1000
      lastY = at; lastT = e.timeStamp
    }
    const onEnd = () => {
      if (state === 'drag') {
        const moved = Number(y.get()) || 0
        if (moved > 120 || speed > 600) onClose()
        else animate(y, 0, spring.snappy)
      }
      state = 'idle'
    }
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd)
    el.addEventListener('touchcancel', onEnd)
    return () => {
      el.removeEventListener('touchstart', onStart); el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd); el.removeEventListener('touchcancel', onEnd)
    }
  }, [open, wide, onClose, y])
  const offscreen = wide ? { x: '100%', y: 0 } : { x: 0, y: '100%' }
  return createPortal(<AnimatePresence>
    {open && <div className="fixed inset-0 z-40 flex items-end md:items-stretch md:justify-end" role="dialog" aria-modal="true" aria-label={label}>
      <motion.button type="button" aria-label="Close" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-sm" />
      <motion.div ref={panel} tabIndex={-1} initial={offscreen} animate={{ x: 0, y: 0 }} exit={offscreen} transition={spring.smooth}
        style={{ y }}
        className={`glass-thick relative max-h-[88dvh] w-full overflow-y-auto [scrollbar-gutter:stable] ${tall ? 'max-md:h-[88dvh]' : ''} overscroll-contain rounded-t-panel rounded-b-none border-b-0 pb-[env(safe-area-inset-bottom)] outline-none md:max-h-none md:w-[30rem] md:rounded-l-panel md:rounded-r-none md:border-y-0 md:border-r-0`}>
        <div aria-hidden="true" className="sticky top-0 z-10 flex justify-center pt-2.5 pb-1 md:hidden"><span className="h-1.5 w-10 rounded-full bg-separator" /></div>
        <div className="p-4 sm:p-5">{children}</div>
      </motion.div>
    </div>}
  </AnimatePresence>, document.body)
}
