import { useEffect } from 'react'
import { Rating, scheduler, type Grade } from '@/lib/srs'
import type { StoredCard } from '@/lib/db'

function fmt(ms: number) {
  const m = ms / 60_000
  if (m < 60) return `${Math.max(1, Math.round(m))} phút`
  const h = m / 60
  if (h < 24) return `${Math.round(h)} giờ`
  const d = h / 24
  if (d < 31) return `${Math.round(d)} ngày`
  const mo = d / 30
  return mo < 12 ? `${Math.round(mo)} tháng` : `${(d / 365).toFixed(1)} năm`
}

const LABELS: { grade: Grade; label: string; cls: string }[] = [
  { grade: Rating.Again, label: 'Quên', cls: 'text-cinnabar' },
  { grade: Rating.Hard, label: 'Khó', cls: 'text-tone2' },
  { grade: Rating.Good, label: 'Nhớ', cls: 'text-jade' },
  { grade: Rating.Easy, label: 'Dễ', cls: 'text-tone4' },
]

const ALL: Grade[] = [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy]

/** Again / Hard / Good / Easy with the next interval each would give. Keys 1–4, Enter = suggested. */
export function RatingBar({ card, onRate, allowed = ALL, suggested }: { card: StoredCard; onRate: (g: Grade) => void; allowed?: Grade[]; suggested?: Grade }) {
  const preview = scheduler.repeat(card, new Date())
  const now = Date.now()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      const g = Number(e.key) as Grade
      if (g >= 1 && g <= 4 && allowed.includes(g)) onRate(g)
      if (e.key === 'Enter' && suggested && allowed.includes(suggested)) {
        e.preventDefault()
        onRate(suggested)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [allowed, onRate, suggested])

  return (
    <div className="grid grid-cols-4 gap-2">
      {LABELS.map(({ grade, label, cls }) => (
        <button
          key={grade}
          disabled={!allowed.includes(grade)}
          onClick={() => onRate(grade)}
          className={`rounded-xl border py-2.5 cursor-pointer transition disabled:opacity-25 disabled:cursor-not-allowed hover:bg-sunken ${
            suggested === grade ? 'border-ink bg-sunken' : 'border-line bg-surface'
          }`}
        >
          <div className={`font-bold ${cls}`}>{label}</div>
          <div className="text-[11px] text-muted">
            {fmt(preview[grade].card.due.getTime() - now)} · <span className="font-mono">{grade}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
