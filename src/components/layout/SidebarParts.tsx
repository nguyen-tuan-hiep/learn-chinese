import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { RangeBar } from '@/components/ui/RangeBar'
import { StreakFlame } from '@/components/ui/StreakFlame'

/** A row on the ink sidebar (desktop) and the phone menu: a light pill when open, a faint wash on hover. */
export const sideItem = (isActive: boolean, collapsed = false) =>
  `group relative flex min-h-12 items-center gap-3 rounded-full py-1.5 text-callout font-semibold transition-colors ${collapsed ? 'justify-center px-1.5' : 'pr-4 pl-1.5'} ${isActive ? 'bg-(--pill-on-ink) shadow-(--pill-on-ink-shadow) text-white' : 'text-white/70 hover:bg-(--hover-on-ink) hover:text-white'}`

/** Today's streak and minutes: on the ink sidebar (`ink`), or as a page card in the phone menu (`card`). */
export function TodayCard({ streak, minutes, goal, tone = 'ink' }: { streak: number; minutes: number; goal: number; tone?: 'ink' | 'card' }) {
  const ink = tone === 'ink'
  return <section aria-label="Today" className={`rounded-[1.75rem] p-4 ${ink ? 'bg-(--card-on-ink) text-white shadow-(--card-on-ink-shadow)' : 'glass-card text-label'}`}>
    <p className="flex items-center gap-1.5 font-display text-callout font-extrabold"><StreakFlame className="size-6" lit={minutes > 0} />{streak}-day streak</p>
    <p className="mt-2 text-title2 tabular-nums leading-none"><AnimatedNumber value={minutes} /><span className={`text-subhead font-semibold ${ink ? 'opacity-60' : 'text-secondary-label'}`}> / {goal} min today</span></p>
    <RangeBar value={minutes / goal} fill="var(--streak-gradient)" className={`mt-3 h-2 ${ink ? 'bg-(--track-on-ink)! shadow-(--track-on-ink-shadow)' : ''}`} />
  </section>
}
