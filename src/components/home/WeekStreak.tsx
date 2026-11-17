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
  // Studied: solid orange tick. Today: orange ring on a faint orange wash. Missed: a faint filled dot. Still to come: an empty outline.
  const dot = (d: (typeof week)[number], size: string) => `grid ${size} place-items-center rounded-full ${
    d.today ? 'bg-streak/15 shadow-[inset_0_0_0_2.5px_var(--color-streak)]'
    : d.done ? 'bg-streak text-[#15120f]'
    : d.future ? 'shadow-[inset_0_0_0_1.5px_rgb(21_18_15/0.16)] dark:shadow-[inset_0_0_0_1.5px_rgb(255_255_255/0.28)]'
    : 'bg-black/10 dark:bg-white/18'}`

  // Phones: one slim row, the streak count on the left and the week's dots on the right.
  if (compact) return <section aria-label={`${streak}-day streak, ${count}/7 days this week`} className={`on-pastel glass-card flex items-center gap-3 rounded-[1.75rem] py-2.5 pr-3 pl-4 text-label ${className}`}>
    <p className="flex shrink-0 items-center gap-1 font-display text-title3 font-extrabold tabular-nums"><StreakFlame className="size-5" lit={studied.has(today)} />{streak}</p>
    <ol className="grid flex-1 grid-cols-7 gap-0.5">
      {week.map((d) => <li key={d.key} className="flex flex-col items-center gap-0.5">
        <span className={dot(d, 'size-6')}>
          {d.today ? <StreakFlame className="size-3.5" lit={d.done} /> : d.done ? <Check aria-hidden="true" className="size-3" strokeWidth={3.4} /> : null}
        </span>
        <span className={`text-[0.625rem] leading-none tabular-nums ${d.today ? 'font-bold' : 'text-secondary-label'}`}>{d.label}</span>
        {dayState(d)}
      </li>)}
    </ol>
  </section>

  return <section aria-label="This week's streak" className={`on-pastel glass-card rounded-[2.25rem] sm:rounded-[2.75rem] p-4 text-label sm:px-5 ${className}`}>
    {/* The streak as one big number, the week's tally quietly beside it. */}
    <div className="flex items-center justify-between gap-3">
      <p className="flex items-baseline gap-1.5">
        <span className="font-display text-title1 leading-none font-black tabular-nums">{streak}</span>
        <span className="text-subhead font-semibold text-secondary-label">day streak</span>
      </p>
      <p className="flex items-center gap-1.5 text-footnote font-semibold tabular-nums text-secondary-label"><StreakFlame className="size-5" lit={studied.has(today)} />{count}/7 this week</p>
    </div>
    <ol className="mt-2.5 grid grid-cols-7 gap-1">
      {week.map((d) => <li key={d.key} className="flex flex-col items-center gap-1">
        <span className={dot(d, 'size-8')}>
          {d.today ? <StreakFlame className="size-5" lit={d.done} /> : d.done ? <Check aria-hidden="true" className="size-4" strokeWidth={3} /> : null}
        </span>
        <span className={`text-caption tabular-nums ${d.today ? 'font-bold' : 'text-secondary-label'}`}>{d.label}</span>
        {dayState(d)}
      </li>)}
    </ol>
  </section>
}
