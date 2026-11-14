import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

/**
 * Sticky glass bar at the bottom of a lesson: status text on the left, the primary action on the right.
 * On phones it floats above the tab bar (~4.5rem + safe area); from md up it sits near the bottom edge.
 */
export function LessonFinishBar({ status, label, done, busy = false, disabled = false, onClick }: {
  status: ReactNode; label: string; done: boolean; busy?: boolean; disabled?: boolean; onClick: () => void
}) {
  return <div className="glass-thick sticky bottom-[calc(5.25rem+env(safe-area-inset-bottom))] md:bottom-4 z-10 mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-panel p-2.5 pl-5 shadow-lift">
    <p className="min-w-[8rem] flex-1 py-1 text-footnote text-secondary-label tabular-nums">{status}</p>
    <Button variant={done ? 'secondary' : 'primary'} size="lg" disabled={disabled || busy} onClick={onClick} className="shrink-0 whitespace-nowrap max-sm:flex-1 disabled:cursor-wait">
      {busy ? 'Đang lưu…' : label}
    </Button>
  </div>
}
