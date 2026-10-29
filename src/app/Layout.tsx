import { NavLink, Outlet } from 'react-router-dom'
import { useStudyData } from '@/lib/useStudyData'
import { useSettings } from '@/store/settings'
import { AudioStatus } from '@/components/AudioStatus'

const NAV = [
  { to: '/', label: 'Hôm nay', glyph: '今', end: true },
  { to: '/review', label: 'Ôn tập', glyph: '复', end: false },
  { to: '/course', label: 'Giáo trình', glyph: '书', end: false },
  { to: '/radicals', label: 'Bộ thủ', glyph: '部', end: false },
  { to: '/pronunciation', label: 'Phát âm', glyph: '音', end: false },
  { to: '/stats', label: 'Thống kê', glyph: '统', end: false },
]
const MOBILE_NAV = NAV.filter((item) => item.to !== '/stats')

export function Layout() {
  const { stats, minutesToday } = useStudyData()
  const goal = useSettings((s) => s.dailyMinutes)
  const due = stats?.dueNow ?? 0

  const badge = (to: string) =>
    to === '/review' && due > 0 ? <span className="ml-auto rounded-full bg-cinnabar px-1.5 text-[11px] font-bold text-white tabular-nums">{due}</span> : null

  return (
    <div className="min-h-dvh md:pl-56">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:p-3">Đến nội dung chính</a>
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-56 flex-col border-r border-line px-3 py-6 bg-paper">
        <div className="flex items-center gap-2.5 px-3 mb-8">
          <img src={`${import.meta.env.BASE_URL}seal.svg`} alt="" className="size-8" />
          <span className="font-bold">Hànyǔ Path</span>
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-sunken text-ink' : 'text-muted hover:text-ink'}`
              }
            >
              <span className="font-han text-lg w-5 text-center">{n.glyph}</span>
              {n.label}
              {badge(n.to)}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-3 text-xs text-muted">
          Hôm nay: <b className="text-ink">{minutesToday}</b>/{goal} phút
          <div className="mt-1.5 h-1 rounded-full bg-line overflow-hidden">
            <div className="h-full bg-ink" style={{ width: `${Math.min(100, (minutesToday / goal) * 100)}%` }} />
          </div>
        </div>
      </aside>

      <header className="md:hidden sticky top-0 z-20 bg-paper/90 backdrop-blur border-b border-line">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}seal.svg`} alt="" className="size-7" />
            <span className="font-bold">Hànyǔ Path</span>
          </div>
          <span className="text-sm text-muted">
            <b className="text-ink">{minutesToday}</b>/{goal} phút
          </span>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-5xl px-4 sm:px-8 pb-28 md:pb-12">
        <AudioStatus />
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-paper/95 backdrop-blur border-t border-line grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {MOBILE_NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `relative flex flex-col items-center py-2 text-[11px] font-medium ${isActive ? 'text-ink' : 'text-muted'}`}>
            <span className="font-han text-xl leading-tight">{n.glyph}</span>
            {n.label}
            {n.to === '/review' && due > 0 && <span className="absolute top-1 right-[22%] size-2 rounded-full bg-cinnabar" />}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
