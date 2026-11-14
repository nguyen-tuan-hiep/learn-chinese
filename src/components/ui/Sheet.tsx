import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * Modal panel: a bottom sheet on phones, a side drawer on tablets. Esc or the backdrop closes it.
 * Rendered into <body>, so page transitions (which wrap the page in a layer) can't put it under the tab bar.
 */
export function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    panel.current?.focus()
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey) }
  }, [open, onClose])
  if (!open) return null
  return createPortal(<div className="fixed inset-0 z-40 flex items-end md:items-stretch md:justify-end" role="dialog" aria-modal="true" aria-label={label}>
    <button type="button" aria-label="Đóng" onClick={onClose} className="absolute inset-0 cursor-default bg-ink/30 backdrop-blur-[2px] animate-[fade_150ms_ease-out]" />
    <div ref={panel} tabIndex={-1} className="relative max-h-[88dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-paper pb-[env(safe-area-inset-bottom)] shadow-lift outline-none animate-[sheet-up_220ms_ease-out] md:max-h-none md:w-[30rem] md:rounded-none md:rounded-l-3xl md:animate-[sheet-left_220ms_ease-out]">
      <div aria-hidden="true" className="sticky top-0 z-10 flex justify-center bg-paper/90 pt-2.5 pb-1 backdrop-blur md:hidden"><span className="h-1.5 w-10 rounded-full bg-line" /></div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  </div>, document.body)
}
