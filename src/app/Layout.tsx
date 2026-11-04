import { Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useStudyData } from '@/lib/useStudyData'
import { useSettings } from '@/store/settings'
import { AudioStatus } from '@/components/AudioStatus'
import { completedLessonWords } from '@/lib/lessonState'
import { ProgressBar, ProgressRing } from '@/components/ui/Progress'
import { EASE } from '@/components/ui/motion'
import { RouteSkeleton } from './skeletons'

const NAV = [
  { to: '/', label: 'Trang chủ', glyph: '家', end: true },
  { to: '/review', label: 'Ôn tập', glyph: '复', end: false },
  { to: '/lesson', label: 'Bài học', glyph: '书', end: false },
  { to: '/radicals', label: 'Bộ thủ', glyph: '部', end: false },
  { to: '/pronunciation', label: 'Phát âm', glyph: '音', end: false },
]
const SECONDARY = [
  { to: '/stats', label: 'Thống kê', glyph: '统' },
  { to: '/settings', label: 'Cài đặt', glyph: '设' },
]
// Phones get Thống kê as a sixth tab; Cài đặt stays behind the gear in the header.
const MOBILE_NAV = [...NAV, { ...SECONDARY[0], end: false }]

function GearIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <Link to="/" className="flex items-center gap-2.5 rounded-lg" aria-label={compact ? 'Tự học Hànyǔ · Trang chủ' : undefined}>
    <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className="size-8 shrink-0" />
    {!compact && <span className="font-bold tracking-tight">Tự học Hànyǔ</span>}
  </Link>
}

function SidebarIcon({ collapsed }: { collapsed: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16" />
    <path d={collapsed ? 'm13 10 2 2-2 2' : 'm16 10-2 2 2 2'} />
  </svg>
}

/** The highlight behind the current sidebar item; it slides to the new item on navigation. */
function NavPill() {
  return <motion.span layoutId="nav-pill" transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }} className="absolute inset-0 rounded-xl bg-surface shadow-card" />
}

export function Layout() {
  const { pathname, search } = useLocation()
  // Stop requested audio when the learner changes pages or lesson tabs.
  useEffect(() => () => { window.speechSynthesis?.cancel() }, [pathname, search])
  const { lessonState, minutesToday, streak } = useStudyData()
  const goal = useSettings((s) => s.dailyMinutes)
  const collapsed = useSettings((s) => s.sidebarCollapsed)
  const setSettings = useSettings((s) => s.set)
  const available = completedLessonWords(lessonState).length

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors ${collapsed ? 'justify-center px-0' : 'px-3'} ${isActive ? 'text-ink' : 'text-muted hover:bg-sunken hover:text-ink'}`
  // Collapsed: icon only, with the label kept for screen readers and as a hover tooltip.
  const label = (text: string) => <span className={collapsed ? 'sr-only' : 'relative'}>{text}</span>

  return (
    <div className={`min-h-dvh transition-[padding] duration-200 motion-reduce:transition-none ${collapsed ? 'md:pl-[4.5rem]' : 'md:pl-60'}`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:p-3">Đến nội dung chính</a>
      <aside className={`hidden md:flex fixed inset-y-0 left-0 flex-col gap-6 overflow-y-auto border-r border-line bg-paper py-6 transition-[width] duration-200 motion-reduce:transition-none ${collapsed ? 'w-[4.5rem] px-2.5' : 'w-60 px-4'}`}>
        <div className={`flex items-center gap-2 ${collapsed ? 'flex-col' : 'justify-between pl-2'}`}>
          <Brand compact={collapsed} />
          <button type="button" onClick={() => setSettings({ sidebarCollapsed: !collapsed })} aria-label={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'} aria-expanded={!collapsed}
            title={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'} className="grid size-9 cursor-pointer place-items-center rounded-lg text-muted hover:bg-sunken hover:text-ink">
            <SidebarIcon collapsed={collapsed} />
          </button>
        </div>
        <nav aria-label="Điều hướng chính" className="flex flex-col gap-1">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={navClass} title={collapsed ? n.label : undefined}>
              {({ isActive }) => <>
                {isActive && <NavPill />}
                <span aria-hidden="true" className="font-han relative w-5 text-center text-lg">{n.glyph}</span>
                {label(n.label)}
                {n.to === '/review' && available > 0 && (collapsed
                  ? <span className="absolute top-1.5 right-2 size-2 rounded-full bg-jade" />
                  : <span className="relative ml-auto rounded-full bg-jade px-1.5 text-[11px] font-bold tabular-nums text-white dark:text-paper">{available}</span>)}
              </>}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          {collapsed ? <Link to="/stats" title={`Hôm nay ${minutesToday}/${goal} phút · chuỗi ${streak} ngày`} className="grid place-items-center rounded-2xl bg-surface py-3 shadow-card">
            <ProgressRing value={minutesToday / goal} size={40} stroke={4} label={`${minutesToday}′`} />
            <span className="sr-only">Hôm nay {minutesToday} trên {goal} phút, chuỗi {streak} ngày</span>
          </Link> : <section aria-label="Hôm nay" className="rounded-2xl bg-surface p-4 shadow-card">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-semibold">Hôm nay</span>
              <span className="tabular-nums text-muted"><b className="text-ink">{minutesToday}</b>/{goal} phút</span>
            </div>
            <ProgressBar value={minutesToday / goal} className="mt-2" />
            <div className="mt-3 flex justify-between text-xs text-muted">
              <span>Chuỗi <b className="text-ink tabular-nums">{streak}</b> ngày</span>
              <span><b className="text-ink tabular-nums">{available}</b> thẻ ôn</span>
            </div>
          </section>}
          <nav aria-label="Khác" className="flex flex-col gap-1">
            {SECONDARY.map((n) => <NavLink key={n.to} to={n.to} className={navClass} title={collapsed ? n.label : undefined}>
              {({ isActive }) => <>
                {isActive && <NavPill />}
                <span aria-hidden="true" className="font-han relative w-5 text-center text-lg">{n.glyph}</span>{label(n.label)}
              </>}
            </NavLink>)}
          </nav>
        </div>
      </aside>

      <header className="md:hidden sticky top-0 z-20 border-b border-line bg-paper/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-3 pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))]">
          <Brand />
          <div className="flex items-center gap-1">
            <span className="px-2.5 text-sm text-muted tabular-nums" aria-label={`Hôm nay ${minutesToday} trên ${goal} phút`}><b className="text-ink">{minutesToday}</b>/{goal}′</span>
            <Link to="/settings" className="grid size-11 place-items-center rounded-xl text-muted hover:bg-sunken hover:text-ink" aria-label="Cài đặt"><GearIcon /></Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-6xl min-w-0 px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:px-8 md:pb-14">
        <AudioStatus />
        {/* Each page eases in; while its code downloads, a placeholder of the same shape holds its place. */}
        <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, ease: EASE }}>
          <Suspense fallback={<RouteSkeleton pathname={pathname} />}><Outlet /></Suspense>
        </motion.div>
      </main>

      <nav aria-label="Điều hướng chính" className="md:hidden fixed bottom-0 inset-x-0 z-20 grid grid-cols-6 border-t border-line bg-paper/95 pt-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] pr-[max(0.25rem,env(safe-area-inset-right))] pl-[max(0.25rem,env(safe-area-inset-left))] backdrop-blur standalone:px-[max(0.75rem,env(safe-area-inset-left))] standalone:pb-[max(0.5rem,calc(env(safe-area-inset-bottom)-0.875rem))]">
        {MOBILE_NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `relative flex min-w-0 flex-col items-center gap-0.5 py-2 text-[10.5px] font-medium ${isActive ? 'text-jade' : 'text-muted'}`}>
            {({ isActive }) => <>
              <span aria-hidden="true" className="font-han relative grid h-7 w-11 place-items-center text-xl leading-none">
                {isActive && <motion.span layoutId="tab-pill" transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} className="absolute inset-0 rounded-full bg-jade-soft" />}
                <motion.span className="relative" animate={{ scale: isActive ? 1.08 : 1 }} transition={{ duration: 0.25, ease: EASE }}>{n.glyph}</motion.span>
              </span>
              {n.label}
              {n.to === '/review' && available > 0 && <span className="absolute top-1.5 right-[22%] size-2 rounded-full bg-jade" />}
            </>}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
