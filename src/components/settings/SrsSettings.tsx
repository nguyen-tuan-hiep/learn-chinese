import { BrainCircuit, CalendarClock, Layers3, RotateCcw, TimerReset } from 'lucide-react'
import { ListRow } from '@/components/ui/ListGroup'
import { Segmented } from '@/components/ui/Segmented'
import { IconBadge } from './IconBadge'
import { SettingsSection, StackedRow } from './SettingsSection'
import { DEFAULT_SRS_SETTINGS, useSettings } from '@/store/settings'

const RETENTIONS = [80, 85, 90, 95, 99]
const NEW_CARDS = [5, 10, 15, 20, 30]
const INTERVALS = [{ v: 365, label: ' 1y' }, { v: 1095, label: '3y' }, { v: 1825, label: '5y' }, { v: 2920, label: '8y' }, { v: 3650, label: '10y' }]
const LEARN_AHEAD = [{ v: 0, label: 'Off' }, { v: 10, label: '10m' }, { v: 20, label: '20m' }, { v: 30, label: '30m' }, { v: 60, label: '60m' }]

/** The small, high-impact subset of Anki's deck options that this app supports. */
export function SrsSettings() {
  const s = useSettings()
  const retention = Math.round(s.desiredRetention * 100)
  const retentionNote = retention > 97
    ? 'Very high retention can increase the review workload sharply.'
    : retention < 85
      ? 'Fewer reviews, but you are more likely to forget cards between sessions.'
      : 'Higher retention means shorter intervals and more reviews.'

  return <SettingsSection title="Spaced repetition" footer="Scheduling changes apply to future answers. Existing due dates are left unchanged, as in Anki's default behavior.">
    <StackedRow icon={<IconBadge color="var(--color-tint)"><BrainCircuit /></IconBadge>} title="Desired retention">
      <Segmented label="Desired retention" fill className="max-w-full" value={String(retention)} onChange={(v) => s.set({ desiredRetention: Number(v) / 100 })}
        options={RETENTIONS.map((r) => ({ value: String(r), label: `${r}%` }))} />
      <p className="mt-1.5 px-1 text-footnote text-secondary-label">{retention}% · {retentionNote}</p>
    </StackedRow>

    <StackedRow icon={<IconBadge color="var(--color-tint)"><Layers3 /></IconBadge>} title="New cards/day">
      <Segmented label="New cards per day" fill className="max-w-full" value={String(s.newCardsPerDay)} onChange={(v) => s.set({ newCardsPerDay: Number(v) })}
        options={NEW_CARDS.map((n) => ({ value: String(n), label: String(n) }))} />
      <p className="mt-1.5 px-1 text-footnote text-secondary-label">{s.newCardsPerDay} cards a day · maximum unseen words introduced.</p>
    </StackedRow>

    <StackedRow icon={<IconBadge color="var(--color-tint)"><CalendarClock /></IconBadge>} title="Maximum interval">
      <Segmented label="Maximum interval" fill className="max-w-full" value={String(s.maximumInterval)} onChange={(v) => s.set({ maximumInterval: Number(v) })}
        options={INTERVALS.map((i) => ({ value: String(i.v), label: i.label }))} />
      <p className="mt-1.5 px-1 text-footnote text-secondary-label">{Math.round(s.maximumInterval / 365)} years · longest delay FSRS may schedule.</p>
    </StackedRow>

    <StackedRow icon={<IconBadge color="var(--color-tint)"><TimerReset /></IconBadge>} title="Learn ahead limit">
      <Segmented label="Learn ahead limit" fill className="max-w-full" value={String(s.learnAheadMinutes)} onChange={(v) => s.set({ learnAheadMinutes: Number(v) })}
        options={LEARN_AHEAD.map((l) => ({ value: String(l.v), label: l.label }))} />
      <p className="mt-1.5 px-1 text-footnote text-secondary-label">{s.learnAheadMinutes ? `${s.learnAheadMinutes} min` : 'Off'} · show same-day learning cards a little early.</p>
    </StackedRow>

    <ListRow leading={<IconBadge color="var(--color-tint)"><RotateCcw /></IconBadge>}
      title={<span className="text-tint-text">Restore scheduling defaults</span>}
      // subtitle="90% retention · 20 new/day · 10-year maximum · 20m ahead"
      onClick={() => s.set({ ...DEFAULT_SRS_SETTINGS })} />
  </SettingsSection>
}
