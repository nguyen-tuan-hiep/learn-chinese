import { cheer } from '@/store/mascot'
import { lazy, Suspense, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, Play, Search, Settings } from 'lucide-react'
import { useSettings } from '@/store/settings'
import { useCourse } from '@/lib/courseModel'
import { useReviewQueue } from '@/lib/useReviewQueue'
import { AudioStatus } from '@/components/AudioStatus'
import { UpdatePrompt } from '@/components/UpdatePrompt'
import { featurePastel } from '@/lib/palette'
import { spring } from '@/components/ui/motion'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { RangeBar } from '@/components/ui/RangeBar'
import { StreakFlame } from '@/components/ui/StreakFlame'
import { NAV } from '@/components/layout/nav'
import { Notch } from '@/components/layout/Notch'
import { DesktopFrame } from '@/components/layout/DesktopFrame'
import { notify } from '@/store/notch'
import { useSearch } from '@/store/search'

// Loaded on first open: it brings in every lesson's vocabulary.
const SearchPalette = lazy(() => import('@/components/search/SearchPalette'))
import { RouteSkeleton } from './skeletons'
import { BrandMark } from '@/components/layout/BrandMark'
import { useScrollCompact } from '@/lib/useScrollCompact'
import { VersionMenu } from '@/components/layout/VersionMenu'

function Brand() {
  return <Link to="/" className="flex items-center gap-2.5 rounded-full" aria-label="Hànyǔ · Home">
    <BrandMark live className="size-11 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-rotate-6 hover:scale-105" />
    <span className={`font-display text-title3 font-black tracking-tight text-white max-[380px]:sr-only`}>Hànyǔ</span>
  </Link>
}

export function Layout() {
  const { pathname, search } = useLocation()
  // Mobile dock shrinks while scrolling down and comes back on scroll up, like Safari's tab bar.
  const dockCompact = useScrollCompact(pathname)
  // Stop requested audio when the learner changes pages or lesson tabs.
  useEffect(() => () => { window.speechSynthesis?.cancel() }, [pathname, search])
  const { loaded, minutesToday, streak, next } = useCourse()
  // Cards to review today (due + today's new words), as on Anki's deck list.
  const { counts } = useReviewQueue()
  const available = counts.fresh + counts.learning + counts.review
  const goal = useSettings((s) => s.dailyMinutes)

  // "/" or Ctrl/⌘+K opens search from anywhere (not while typing).
  const searchOpen = useSearch((st) => st.open)
  const setSearchOpen = useSearch((st) => st.setOpen)
  const searchUsed = useRef(false)
  if (searchOpen) searchUsed.current = true
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.matches('input, textarea, select, [contenteditable="true"]')
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setSearchOpen(!useSearch.getState().open) }
      else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  // Celebrate in the notch when today's first minute keeps the streak, and when the daily goal is reached.
  // Only on a change seen while the app is open, not on load.
  const seen = useRef<number | null>(null)
  useEffect(() => {
    if (!loaded) return
    const before = seen.current
    seen.current = minutesToday
    if (before === null || minutesToday <= before) return
    if (before < 1 && minutesToday >= 1) { cheer('wow', 2400); notify({ icon: 'streak', text: `${streak}-day streak!`, sub: 'Keep it going' }, 3200) }
    else if (before < goal && minutesToday >= goal) { cheer('happy', 2400); notify({ icon: 'goal', text: 'Daily goal reached', sub: `${goal} min` }, 3200) }
  }, [loaded, minutesToday, goal, streak])

  const collapsed = useSettings((s) => s.sidebarCollapsed)
  const setSettings = useSettings((s) => s.set)
  const side = ({ isActive }: { isActive: boolean }) =>
    `group relative flex min-h-12 items-center gap-3 rounded-full py-1.5 text-callout font-semibold transition-colors ${collapsed ? 'justify-center px-1.5' : 'pr-4 pl-1.5'} ${isActive ? 'bg-white/12 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'}`

  return (
    <div className={`min-h-dvh transition-[padding] duration-200 [--frame:#15120f] motion-reduce:transition-none md:bg-(--frame) md:py-3 md:pr-3 dark:[--frame:#2a2620] ${collapsed ? 'md:pl-[6.5rem]' : 'md:pl-[17.5rem]'}`}>
      <DesktopFrame left={collapsed ? 'left-[6.5rem]' : 'left-[17.5rem]'} />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-primary-bg focus:px-4 focus:py-2.5 focus:text-on-primary">Skip to content</a>

      <aside className={`fixed inset-y-4 left-4 z-20 hidden flex-col gap-5 overflow-y-auto py-5 text-white transition-[width] duration-200 motion-reduce:transition-none md:flex ${collapsed ? 'w-[5rem] px-3' : 'w-[16rem] px-4'}`}>
        {/* Logo and course version together, like a workspace switcher; Home stays in the nav below. */}
        <div className={`flex items-center ${collapsed ? 'flex-col gap-3' : 'gap-1'}`}>
          <div className="min-w-0 flex-1"><VersionMenu variant={collapsed ? 'compact' : 'brand'} placement={collapsed ? 'right' : 'below-start'} /></div>
          <button type="button" onClick={() => setSettings({ sidebarCollapsed: !collapsed })} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className="grid size-10 cursor-pointer place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white">
            {collapsed ? <PanelLeftOpen aria-hidden="true" className="size-5" /> : <PanelLeftClose aria-hidden="true" className="size-5" />}
          </button>
        </div>
        <nav aria-label="Main" className="flex flex-col gap-1.5">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={side} title={collapsed ? n.label : undefined}>
              {({ isActive }) => <>
                <span aria-hidden="true" style={{ background: featurePastel(n.feature) }} className={`relative grid size-10 shrink-0 place-items-center rounded-full text-[#15120f] transition-shadow ${isActive ? 'shadow-[0_0_0_2px_#fff]' : ''}`}>
                  <n.icon className="size-5" strokeWidth={2} />
                  {collapsed && n.to === '/review' && available > 0 && <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-danger ring-2 ring-[#15120f]" />}
                </span>
                <span className={collapsed ? 'sr-only' : ''}>{n.label}</span>
                {!collapsed && n.to === '/review' && available > 0 && <span className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-danger px-1.5 py-0.5 text-caption font-bold tabular-nums text-white">{available}</span>}
              </>}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          {collapsed
            ? <Link to="/stats" title={`Today ${minutesToday}/${goal} min · ${streak}-day streak`} className="grid place-items-center gap-0.5 rounded-3xl bg-streak-soft py-3 text-[#15120f]">
              <StreakFlame className="size-6" lit={minutesToday > 0} /><b className="text-footnote font-extrabold tabular-nums">{streak}</b>
              <span className="sr-only">{streak}-day streak, {minutesToday} of {goal} minutes today</span>
            </Link>
            : <section aria-label="Today" className="rounded-[1.75rem] bg-streak-soft p-4 text-[#15120f]">
              <p className="flex items-center gap-1.5 font-display text-callout font-extrabold"><StreakFlame className="size-6" lit={minutesToday > 0} />{streak}-day streak</p>
              <p className="mt-2 text-title2 tabular-nums leading-none"><AnimatedNumber value={minutesToday} /><span className="text-subhead font-semibold opacity-60"> / {goal} min today</span></p>
              <RangeBar value={minutesToday / goal} fill="var(--streak-gradient)" className="mt-3 h-2 bg-black/10!" />
            </section>}
          <NavLink to="/settings" className={side} title={collapsed ? 'Settings' : undefined}>
            {({ isActive }) => <>
              <span aria-hidden="true" className={`grid size-10 shrink-0 place-items-center rounded-full bg-white/12 ${isActive ? 'shadow-[0_0_0_2px_#fff]' : ''}`}><Settings className="size-5" strokeWidth={2} /></span>
              <span className={collapsed ? 'sr-only' : ''}>Settings</span>
            </>}
          </NavLink>
        </div>
      </aside>

      <header className="sticky top-0 z-20 rounded-b-[2rem] bg-[#15120f] pt-[env(safe-area-inset-top)] shadow-[0_8px_24px_rgb(21_18_15/0.18)] md:hidden dark:bg-[#2a2620] dark:shadow-[inset_0_-1px_0_rgb(245_241_232/0.14),0_10px_28px_rgb(0_0_0/0.55)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
          <Brand />
          <div className="flex items-center gap-2">
            {/* Streak days and today's minutes on one short line, "3d · 2′" (the aria-label spells both out). */}
            <Link to="/stats" className="inline-flex min-h-10 items-center gap-1 rounded-full bg-streak-soft pr-3 pl-1.5 text-[#15120f] tabular-nums"
              aria-label={`${streak}-day streak, ${minutesToday} of ${goal} minutes today`}>
              <StreakFlame className="size-5" lit={minutesToday > 0} />
              <span aria-hidden="true" className="text-footnote font-extrabold whitespace-nowrap">{streak}d<span className="font-semibold opacity-70"> · {minutesToday}′</span></span>
            </Link>
            <VersionMenu variant="icon" placement="below-center" />
            <button type="button" onClick={() => setSearchOpen(true)} className="grid size-10 cursor-pointer place-items-center rounded-full bg-white/12 text-white" aria-label="Search" title="Search"><Search aria-hidden="true" className="size-[18px]" strokeWidth={2.2} /></button>
            <Link to="/settings" className="grid size-10 place-items-center rounded-full bg-white/12 text-white" aria-label="Settings" title="Settings"><Settings aria-hidden="true" className="size-[18px]" strokeWidth={2} /></Link>
          </div>
        </div>
        <Notch hideAtRest className="absolute top-full left-1/2 -translate-x-1/2" />
      </header>

      <div className="md:min-h-[calc(100dvh-1.5rem)] md:rounded-[2.5rem] md:bg-[var(--color-paper)] md:relative">
        {/* Sticks to the top of the window while the sheet scrolls, so events stay visible. */}
        <div className="sticky top-3 z-20 hidden h-0 md:block"><Notch size="lg" onOpen={() => setSearchOpen(true)} className="absolute top-0 left-1/2 -translate-x-1/2" /></div>
      <main id="main-content" className="mx-auto w-full max-w-6xl min-w-0 px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] sm:px-8 md:pt-6 md:pb-14">
        <AudioStatus />
        {/* Each page springs in; while its code downloads, a placeholder of the same shape holds its place. */}
        <motion.div key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.smooth}>
          <Suspense fallback={<RouteSkeleton pathname={pathname} />}><Outlet /></Suspense>
        </motion.div>
      </main>
      </div>

      <UpdatePrompt />
      {searchUsed.current && <Suspense fallback={null}><SearchPalette /></Suspense>}

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-20 flex md:hidden justify-center px-3 pb-[max(1rem,env(safe-area-inset-bottom))] standalone:pb-[max(0.5rem,calc(env(safe-area-inset-bottom)-0.5rem))] pointer-events-none">
        <motion.div initial={false} animate={{ scale: dockCompact ? 0.8 : 1, y: dockCompact ? 6 : 0 }} transition={spring.snappy} style={{ transformOrigin: '50% 100%' }}
          className="pointer-events-auto flex gap-1 rounded-full bg-[#15120f] p-1.5 min-[400px]:gap-1.5 min-[400px]:p-2 shadow-[0_14px_32px_rgb(0_0_0/0.28)] dark:bg-[#2a2620] sm:gap-2.5 sm:p-2.5">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} aria-label={n.label} title={n.label}
              className="group relative grid size-10 place-items-center rounded-full min-[400px]:size-11 transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-1 active:scale-90 sm:size-[3.25rem]">
              {({ isActive }) => <>
                <span aria-hidden="true" style={{ background: featurePastel(n.feature) }} className={`absolute inset-0 rounded-full transition-[box-shadow,transform] duration-200 ${isActive ? 'scale-100 shadow-[0_0_0_3px_#fff]' : 'scale-90 opacity-90 group-hover:scale-100'}`} />
                <n.icon aria-hidden="true" className="relative size-5 text-[#15120f] sm:size-[22px]" strokeWidth={isActive ? 2.4 : 2} />
              </>}
            </NavLink>
          ))}
          {next && <>
            <span aria-hidden="true" className="mx-0.5 my-2 w-px bg-white/20" />
            <Link to={next.to} aria-label={`Continue: ${next.label}`} title="Continue"
              className="grid size-10 place-items-center rounded-full bg-white text-[#15120f] min-[400px]:size-11 transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-1 active:scale-90 sm:size-[3.25rem]">
              <Play aria-hidden="true" className="size-5 translate-x-px fill-current" />
            </Link>
          </>}
        </motion.div>
      </nav>
    </div>
  )
}
