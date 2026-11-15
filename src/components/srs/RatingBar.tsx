import { useEffect } from 'react'
import { Rating, scheduler, type Grade } from '@/lib/srs'
import type { StoredCard } from '@/lib/db'

/** Short Vietnamese interval, e.g. "1 phút", "3 ngày", "2 tháng". */
export function formatInterval(ms: number) {
  const m = ms / 60_000
  if (m < 60) return `${Math.max(1, Math.round(m))} phút`
  const h = m / 60
  if (h < 23.5) return `${Math.round(h)} giờ`
  const d = h / 24
  if (d < 30.5) return `${Math.max(1, Math.round(d))} ngày`
  const mo = d / 30
  return mo < 12 ? `${Math.round(mo)} tháng` : `${(d / 365).toFixed(1)} năm`
}

const LABELS: { grade: Grade; label: string; bg: string }[] = [
  { grade: Rating.Again, label: 'Quên', bg: 'var(--pastel-pink)' },
  { grade: Rating.Hard, label: 'Khó', bg: 'var(--pastel-yellow)' },
  { grade: Rating.Good, label: 'Nhớ', bg: 'var(--pastel-green)' },
  { grade: Rating.Easy, label: 'Dễ', bg: 'var(--pastel-blue)' },
]

/** Again / Hard / Good / Easy with the interval FSRS would give each. Keys 1–4. */
export function RatingBar({ card, onRate, disabled = false }: { card: StoredCard; onRate: (g: Grade) => void; disabled?: boolean }) {
  const now = new Date()
  const preview = scheduler.repeat(card, now)

  useEffect(() => {
    if (disabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (e.target instanceof HTMLElement && e.target.matches('input, textarea, select, [contenteditable="true"]')) return
      const g = Number(e.key)
      if (g >= 1 && g <= 4) { e.preventDefault(); onRate(g as Grade) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onRate, disabled])

  return <div role="group" aria-label="Bạn nhớ từ này thế nào?" className="grid grid-cols-4 gap-2">
    {LABELS.map(({ grade, label, bg }) => {
      const wait = formatInterval(preview[grade].card.due.getTime() - now.getTime())
      return <button key={grade} type="button" disabled={disabled} onClick={() => onRate(grade)} aria-label={`${label}, ôn lại sau ${wait}`}
        style={{ background: bg }}
        className="flex min-h-16 cursor-pointer flex-col items-center justify-center rounded-3xl px-1 py-2 text-[#15120f] transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-0.5 active:scale-95 disabled:cursor-wait disabled:opacity-60 dark:text-[#15120f]">
        <span className="font-display text-callout font-extrabold">{label}</span>
        <span className="text-caption font-semibold tabular-nums opacity-75">{wait}</span>
      </button>
    })}
  </div>
}
