import { Link } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import { useSettings } from '@/store/settings'
import { BrandMark } from './BrandMark'
import { LINE_ICONS } from './DockIcons'
import { TodayCard } from './SidebarParts'
import { OPTIONS } from './VersionMenu'

const LINKS = [
  { to: '/stats', label: 'Stats', sub: 'Study time and progress' },
  { to: '/settings', label: 'Settings', sub: 'Daily goal, speech and theme' },
]

/**
 * The phone menu, lying behind the page: it shows when the page slides aside (Layout drives both, and swipes).
 * Today's streak first, then what the five-tab bar has no room for: the course version, Stats and Settings.
 */
export function MobileMenu({ width, onClose, today }: { width: number; onClose: () => void; today: { streak: number; minutes: number; goal: number } }) {
  const version = useSettings((s) => s.hskVersion)
  const set = useSettings((s) => s.set)
  return <nav id="mobile-menu" aria-label="Menu" style={{ width }}
    className="h-full overflow-y-auto px-4 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-label">
    <div className="flex items-center gap-3 px-1">
      <BrandMark live className="size-12 shrink-0" />
      <div className="min-w-0">
        <p className="font-display text-title1 font-black leading-none tracking-tight">Hànyǔ</p>
        <p className="mt-1 text-footnote font-semibold text-secondary-label">HSK {version} course</p>
      </div>
    </div>

    <div className="mt-6"><TodayCard {...today} tone="card" /></div>

    <h2 className="mt-6 mb-2 px-1 text-footnote font-semibold text-secondary-label">Course version</h2>
    <div role="radiogroup" aria-label="Course version" className="grid grid-cols-2 gap-2.5">
      {OPTIONS.map((o) => {
        const on = o.value === version
        return <button key={o.value} type="button" role="radio" aria-checked={on} onClick={() => set({ hskVersion: o.value })}
          className={`relative flex min-h-16 cursor-pointer flex-col items-start justify-center rounded-3xl px-4 text-left transition-transform duration-200 active:scale-[0.97] ${on ? 'ink-pill shadow-(--cta-shadow)' : 'glass-card'}`}>
          <b className="text-headline font-bold">{o.label}</b>
          <span className={`text-caption ${on ? 'text-[color-mix(in_srgb,var(--ink-fg)_70%,transparent)]' : 'text-secondary-label'}`}>{o.levels}</span>
          {on && <Check aria-hidden="true" className="absolute top-3.5 right-3.5 size-4" strokeWidth={2.6} />}
        </button>
      })}
    </div>
    <p className="mt-2 px-1 text-caption text-secondary-label">Progress is saved per version.</p>

    <div className="glass-card mt-6 overflow-hidden rounded-3xl">
      {LINKS.map(({ to, label, sub }, i) => {
        const Icon = LINE_ICONS[to]
        return <Link key={to} to={to} onClick={onClose} className="flex min-h-16 items-center gap-3 pl-4 transition-colors active:bg-fill">
          <Icon active={false} className="size-6 shrink-0" />
          {/* The divider starts after the icon, as in iOS grouped lists. */}
          <span className={`flex min-h-16 min-w-0 flex-1 items-center gap-2 self-stretch pr-4 ${i ? 'border-t border-separator' : ''}`}>
            <span className="min-w-0 flex-1">
              <span className="block text-headline font-semibold">{label}</span>
              <span className="block truncate text-caption text-secondary-label">{sub}</span>
            </span>
            <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-tertiary-label" />
          </span>
        </Link>
      })}
    </div>
  </nav>
}
