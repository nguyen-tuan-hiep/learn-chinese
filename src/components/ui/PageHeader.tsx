import type { ReactNode } from 'react'

/** Page title block shared by every top-level page: eyebrow, title, one line of context, optional side content. */
export function PageHeader({ eyebrow, title, children, aside }: { eyebrow?: string; title: string; children?: ReactNode; aside?: ReactNode }) {
  return <header className="flex flex-wrap items-end justify-between gap-4">
    <div className="min-w-0 max-w-2xl">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-widest text-jade">{eyebrow}</p>}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
      {children && <div className="mt-2 leading-relaxed text-muted">{children}</div>}
    </div>
    {aside}
  </header>
}
