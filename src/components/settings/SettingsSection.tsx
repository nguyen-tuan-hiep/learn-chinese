import type { ReactNode } from 'react'
import { Rise } from '@/components/ui/motion'
import { ListGroup } from '@/components/ui/ListGroup'

/** A Settings section: small secondary header and an inset-grouped list, rising in as part of a Stagger. */
export function SettingsSection({ title, footer, clip = true, "aria-busy": busy, children }: { title: string; footer?: ReactNode; clip?: boolean; "aria-busy"?: boolean; children: ReactNode }) {
  return <Rise className="mt-7" aria-busy={busy}>
    <h2 className="px-4 pb-2 text-footnote font-medium text-secondary-label">{title}</h2>
    <ListGroup clip={clip}>{children}</ListGroup>
    {footer && <p className="px-4 pt-2 text-footnote text-secondary-label">{footer}</p>}
  </Rise>
}

/** A row with the title above and a wide control (segmented bar, slider) below, for controls that do not fit beside the title on a phone. */
export function StackedRow({ icon, title, value, children }: { icon: ReactNode; title: string; value?: ReactNode; children: ReactNode }) {
  return <div className="min-w-0 px-4 py-3">
    <div className="flex min-h-8 items-center gap-3">
      {icon}
      <span className="min-w-0 flex-1 text-body">{title}</span>
      {value && <span className="text-body tabular-nums text-secondary-label">{value}</span>}
    </div>
    <div className="mt-2 min-w-0">{children}</div>
  </div>
}
