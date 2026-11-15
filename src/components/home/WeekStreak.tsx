import { Check } from 'lucide-react'
import { useStudyData } from '@/lib/useStudyData'
import { dateKey } from '@/lib/progress'
import { StreakFlame } from '@/components/ui/StreakFlame'

const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/**
 * This week, Monday to Sunday: a day with at least a minute of study is an orange tick, today has an orange ring
 * (its flame lights once today counts), later days are blank.
 */
export function WeekStreak({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  const { days, now, streak } = useStudyData()
  const studied = new Set(days.filter((d) => d.seconds >= 60).map((d) => d.date))
  const today = dateKey(now)
  const monday = new Date(now)
  monday.setHours(12, 0, 0, 0)
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  const week = LABELS.map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const key = dateKey(d)
    return { label, name: NAMES[i], key, done: studied.has(key), today: key === today, future: key > today }
  })
  const count = week.filter((d) => d.done).length
  const dayState = (d: (typeof week)[number]) => <span className="sr-only">{d.name}: {d.done ? 'studied' : d.future ? 'not yet' : 'missed'}{d.today ? ', today' : ''}</span>
  const dot = (d: (typeof week)[number], size: string) => `grid ${size} place-items-center rounded-full ${d.done && !d.today ? 'bg-streak text-[#15120f]' : 'bg-white'} ${d.today ? 'shadow-[inset_0_0_0_3px_var(--color-streak)]' : ''} ${d.future ? 'opacity-60' : ''}`

  // Phones: one slim row, the streak count on the left and the week's dots on the right.
  if (compact) return <section aria-label={`${streak}-day streak, ${count}/7 days this week`} className={`on-pastel flex items-center gap-3 rounded-[1.75rem] bg-streak-soft py-2.5 pr-3 pl-4 text-[#15120f] ${className}`}>
    <p className="flex shrink-0 items-center gap-1 font-display text-title3 font-extrabold tabular-nums"><StreakFlame className="size-5" lit={studied.has(today)} />{streak}</p>
    <ol className="grid flex-1 grid-cols-7 gap-0.5">
      {week.map((d) => <li key={d.key} className="flex flex-col items-center gap-0.5">
        <span className={dot(d, 'size-6')}>
          {d.today ? <StreakFlame className="size-3.5" lit={d.done} /> : d.done ? <Check aria-hidden="true" className="size-3" strokeWidth={3.4} /> : null}
        </span>
        <span className={`text-[0.625rem] leading-none tabular-nums ${d.today ? 'font-bold' : 'text-[#5f594f]'}`}>{d.label}</span>
        {dayState(d)}
      </li>)}
    </ol>
  </section>

  return <section aria-label="This week's streak" className={`on-pastel rounded-[2.25rem] bg-streak-soft sm:rounded-[2.75rem] p-4 text-[#15120f] sm:px-5 ${className}`}>
    <div className="flex items-center justify-between gap-3">
      <p className="flex items-center gap-1.5 font-display text-callout font-extrabold"><StreakFlame className="size-6" lit={studied.has(today)} />{streak}-day streak</p>
      <p className="text-footnote font-semibold tabular-nums text-[#5f594f]">{count}/7 days this week</p>
    </div>
    <ol className="mt-3 grid grid-cols-7 gap-1">
      {week.map((d) => <li key={d.key} className="flex flex-col items-center gap-1">
        <span className={dot(d, 'size-9')}>
          {d.today ? <StreakFlame className="size-5" lit={d.done} /> : d.done ? <Check aria-hidden="true" className="size-4" strokeWidth={3} /> : null}
        </span>
        <span className={`text-caption tabular-nums ${d.today ? 'font-bold' : 'text-[#5f594f]'}`}>{d.label}</span>
        {dayState(d)}
      </li>)}
    </ol>
  </section>
}
