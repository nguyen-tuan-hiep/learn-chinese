import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/** Height-animated panel; content stays mounted so measuring works in both directions. */
export function CollapsiblePanel({ id, labelledBy, expanded, children }: { id: string; labelledBy: string; expanded: boolean; children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  // Clip only while animating, so menus inside an open panel are not cut off.
  const [settled, setSettled] = useState(expanded)
  useLayoutEffect(() => { if (!expanded) setSettled(false) }, [expanded])
  useLayoutEffect(() => {
    const node = content.current
    if (!node) return
    const measure = () => setHeight(node.getBoundingClientRect().height)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <div id={id} role="region" aria-labelledby={labelledBy} aria-hidden={!expanded} {...(!expanded ? { inert: '' } : {})}
    onTransitionEnd={(e) => { if (e.target === e.currentTarget && expanded) setSettled(true) }}
    className={`${settled && expanded ? 'overflow-visible' : 'overflow-hidden'} transition-[height,opacity] duration-300 ease-in-out motion-reduce:transition-none`}
    style={{ height: expanded ? height : 0, opacity: expanded ? 1 : 0 }}>
    <div ref={content} className="flow-root">{children}</div>
  </div>
}

export function Chevron({ open }: { open: boolean }) {
  return <svg aria-hidden="true" className={`size-5 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="m6 9 6 6 6-6" /></svg>
}

/** A labelled toggle row that opens a panel below it. */
export function Disclosure({ summary, children, defaultOpen = false, className = '' }: { summary: ReactNode; children: ReactNode; defaultOpen?: boolean; className?: string }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return <div className={className}>
    <button type="button" id={`${id}-btn`} aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => setOpen(!open)}
      className="flex min-h-11 w-full cursor-pointer items-center gap-3 text-left">
      <span className="min-w-0 flex-1">{summary}</span><Chevron open={open} />
    </button>
    <CollapsiblePanel id={`${id}-panel`} labelledBy={`${id}-btn`} expanded={open}>{children}</CollapsiblePanel>
  </div>
}

/** A one-line "how to use this" hint that expands to the full explanation. */
export function Hint({ title = 'Cách học phần này', children }: { title?: string; children: ReactNode }) {
  return <Disclosure className="rounded-xl bg-jade-soft/60 px-4 text-sm"
    summary={<span className="flex items-center gap-2 font-medium text-jade"><span aria-hidden="true" className="grid size-5 place-items-center rounded-full border border-current text-[11px] font-bold">i</span>{title}</span>}>
    <div className="pb-3 leading-relaxed text-muted">{children}</div>
  </Disclosure>
}
