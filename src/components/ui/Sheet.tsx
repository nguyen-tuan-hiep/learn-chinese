import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { spring } from './motion'

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
 * Modal panel: a bottom sheet on phones (drag down to dismiss), a side drawer on tablets. Esc or the backdrop closes it.
 * Rendered into <body>, so page transitions (which wrap the page in a layer) can't put it under the tab bar.
 */
export function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null)
  const wide = useWide()
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    panel.current?.focus()
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey) }
  }, [open, onClose])
  const onDragEnd = (_: unknown, info: PanInfo) => { if (info.offset.y > 120 || info.velocity.y > 600) onClose() }
  const offscreen = wide ? { x: '100%', y: 0 } : { x: 0, y: '100%' }
  return createPortal(<AnimatePresence>
    {open && <div className="fixed inset-0 z-40 flex items-end md:items-stretch md:justify-end" role="dialog" aria-modal="true" aria-label={label}>
      <motion.button type="button" aria-label="Đóng" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-sm" />
      <motion.div ref={panel} tabIndex={-1} initial={offscreen} animate={{ x: 0, y: 0 }} exit={offscreen} transition={spring.smooth}
        drag={wide ? false : 'y'} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }} dragMomentum={false} onDragEnd={onDragEnd}
        className="glass-thick relative max-h-[88dvh] w-full overflow-y-auto overscroll-contain rounded-t-panel rounded-b-none border-b-0 pb-[env(safe-area-inset-bottom)] outline-none md:max-h-none md:w-[30rem] md:rounded-l-panel md:rounded-r-none md:border-y-0 md:border-r-0">
        <div aria-hidden="true" className="sticky top-0 z-10 flex justify-center pt-2.5 pb-1 md:hidden"><span className="h-1.5 w-10 rounded-full bg-separator" /></div>
        <div className="p-4 sm:p-5">{children}</div>
      </motion.div>
    </div>}
  </AnimatePresence>, document.body)
}
