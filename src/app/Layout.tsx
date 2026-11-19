import { cheer } from '@/store/mascot'
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react'
import { useSettings } from '@/store/settings'
import { useCourse } from '@/lib/courseModel'
import { useReviewQueue } from '@/lib/useReviewQueue'
import { AudioStatus } from '@/components/AudioStatus'
import { UpdatePrompt } from '@/components/UpdatePrompt'
import { spring } from '@/components/ui/motion'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { RangeBar } from '@/components/ui/RangeBar'
import { StreakFlame } from '@/components/ui/StreakFlame'
import { NAV } from '@/components/layout/nav'
import { LINE_ICONS } from '@/components/layout/DockIcons'
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

const SettingsIcon = LINE_ICONS['/settings']

function Brand() {
  return <Link to="/" className="flex items-center gap-2.5 rounded-full" aria-label="Hànyǔ · Home">
    <BrandMark live className="size-11 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-rotate-6 hover:scale-105" />
  </Link>
}

export function Layout() {
  const { pathname, search } = useLocation()
  // Mobile dock shrinks while scrolling down and comes back on scroll up, like Safari's tab bar.
  const dockCompact = useScrollCompact(pathname)
  // The phone tab bar's oval: where the open tab sits inside the bar (kept at the last spot, faded, when no tab is open).
  const dock = useRef<HTMLDivElement>(null)
  const [bead, setBead] = useState<{ x: number; width: number; on: boolean } | null>(null)
  const beadFirst = useRef(true)
  useLayoutEffect(() => {
    const el = dock.current
    if (!el) return
    const measure = () => {
      const on = el.querySelector<HTMLElement>('a[aria-current="page"]')
      setBead((prev) => on ? { x: on.offsetLeft, width: on.offsetWidth, on: true } : prev ? { ...prev, on: false } : null)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [pathname])
  useEffect(() => { if (bead) beadFirst.current = false }, [bead])
  // Stop requested audio when the learner changes pages or lesson tabs.
  useEffect(() => () => { window.speechSynthesis?.cancel() }, [pathname, search])
  const { loaded, minutesToday, streak } = useCourse()
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
    <div className={`min-h-dvh transition-[padding] duration-200 [--frame:#15120f] motion-reduce:transition-none md:bg-(--frame) md:py-3 md:pr-3 ${collapsed ? 'md:pl-[6.5rem]' : 'md:pl-[17.5rem]'}`}>
      {/* Phone: the backdrop stays put behind the page (iOS ignores background-attachment: fixed). */}
      <div aria-hidden="true" className="page-art pointer-events-none fixed inset-0 -z-10 md:hidden" />
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
          {NAV.map((n) => {
            const Icon = LINE_ICONS[n.to]
            return <NavLink key={n.to} to={n.to} end={n.end} className={side} title={collapsed ? n.label : undefined}>
              {({ isActive }) => <>
                <span aria-hidden="true" className="relative grid size-10 shrink-0 place-items-center">
                  <Icon active={isActive} className="size-6" />
                  {collapsed && n.to === '/review' && available > 0 && <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-danger ring-2 ring-[#15120f]" />}
                </span>
                <span className={collapsed ? 'sr-only' : ''}>{n.label}</span>
                {!collapsed && n.to === '/review' && available > 0 && <span className="ml-auto inline-flex min-w-6 items-center justify-center rounded-full bg-danger px-1.5 py-0.5 text-caption font-bold tabular-nums text-white">{available}</span>}
              </>}
            </NavLink>
          })}
        </nav>
        <div className="mt-auto space-y-3">
          {collapsed
            ? <Link to="/stats" title={`Today ${minutesToday}/${goal} min · ${streak}-day streak`} className="grid place-items-center gap-0.5 rounded-3xl border border-white/10 bg-white/[0.07] py-3 text-white">
              <StreakFlame className="size-6" lit={minutesToday > 0} /><b className="text-footnote font-extrabold tabular-nums">{streak}</b>
              <span className="sr-only">{streak}-day streak, {minutesToday} of {goal} minutes today</span>
            </Link>
            : <section aria-label="Today" className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-4 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]">
              <p className="flex items-center gap-1.5 font-display text-callout font-extrabold"><StreakFlame className="size-6" lit={minutesToday > 0} />{streak}-day streak</p>
              <p className="mt-2 text-title2 tabular-nums leading-none"><AnimatedNumber value={minutesToday} /><span className="text-subhead font-semibold opacity-60"> / {goal} min today</span></p>
              <RangeBar value={minutesToday / goal} fill="var(--streak-gradient)" className="mt-3 h-2 bg-white/15!" />
            </section>}
          <NavLink to="/settings" className={side} title={collapsed ? 'Settings' : undefined}>
            {({ isActive }) => <>
              <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center"><SettingsIcon active={isActive} className="size-6" /></span>
              <span className={collapsed ? 'sr-only' : ''}>Settings</span>
            </>}
          </NavLink>
        </div>
      </aside>

      {/* A solid bar in the page colour: no blur, so nothing scrolling under it smears into grey. */}
      <header className="sticky top-0 z-20 bg-paper pt-[env(safe-area-inset-top)] md:hidden">
        {/* Three slots: course switch at the left, Baobao centred, search at the right; quiet grey glyphs, no chips. */}
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-2 sm:px-6">
          <div className="justify-self-start"><VersionMenu variant="icon" placement="below-start" /></div>
          <Brand />
          <button type="button" onClick={() => setSearchOpen(true)} className="grid size-11 cursor-pointer place-items-center justify-self-end rounded-full text-secondary-label transition-transform hover:text-label active:scale-90" aria-label="Search" title="Search"><Search aria-hidden="true" className="size-6" strokeWidth={1.9} /></button>
        </div>
        <Notch hideAtRest className="absolute top-[env(safe-area-inset-top)] left-1/2 -translate-x-1/2" />
      </header>

      <div className="md:min-h-[calc(100dvh-1.5rem)] md:rounded-[2.5rem] md:page-art md:relative md:isolate">
        {/* Inside the sheet: the sheet isolates, so the frame's blur must share its stacking context to sit under the notch. */}
        <DesktopFrame left={collapsed ? 'left-[6.5rem]' : 'left-[17.5rem]'} />
        {/* Sticks to the top of the window while the sheet scrolls, so events stay visible. */}
        <div className="sticky top-3 z-20 hidden h-0 md:block"><Notch size="lg" onOpen={() => setSearchOpen(true)} className="absolute top-0 left-1/2 -translate-x-1/2" /></div>
      <main id="main-content" className="mx-auto w-full max-w-6xl min-w-0 px-4 max-md:-mt-3 pb-[calc(8rem+env(safe-area-inset-bottom))] sm:px-8 md:pt-6 md:pb-14">
        <AudioStatus />
        {/* Each page springs in; while its code downloads, a placeholder of the same shape holds its place. */}
        <motion.div key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.smooth}>
          <Suspense fallback={<RouteSkeleton pathname={pathname} />}><Outlet /></Suspense>
        </motion.div>
      </main>
      </div>

      <UpdatePrompt />
      {searchUsed.current && <Suspense fallback={null}><SearchPalette /></Suspense>}

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-20 flex md:hidden justify-center px-4 sm:px-8 pb-[max(1rem,env(safe-area-inset-bottom))] standalone:pb-[max(0.5rem,calc(env(safe-area-inset-bottom)-0.5rem))] pointer-events-none">
        {/* Phone tab bar: a clear glass pill of plain icon tabs, the open one filled on an oval; Settings lives here rather than in the header. */}
        <motion.div initial={false} animate={{ scale: dockCompact ? 0.8 : 1, y: dockCompact ? 8 : 0 }} transition={spring.snappy} style={{ transformOrigin: '50% 100%' }}
          className="pointer-events-auto flex w-full items-end gap-2">
          {/* As wide as the page content (same side padding as <main>), the tabs sharing it evenly. */}
          <div ref={dock} className="liquid-glass liquid-glass-clear relative flex w-full gap-0.5 rounded-full p-1.5">
            {/* One oval slides to the open tab. Measured with offsetLeft (not a shared layoutId), so the bar's own
                scale while it shrinks and grows on scroll never makes it jump, and it never flies in from elsewhere. */}
            {bead && <motion.span aria-hidden="true" initial={false} animate={{ x: bead.x, width: bead.width, opacity: bead.on ? 1 : 0 }}
              transition={beadFirst.current ? { duration: 0 } : spring.snappy}
              className="dock-bead pointer-events-none absolute top-1.5 bottom-1.5 left-0 rounded-full" />}
            {/* Pronunciation stays out of the phone bar; on phones it is reached from search. */}
            {[...NAV, { to: '/settings', label: 'Settings', end: false }].filter((n) => n.to !== '/pronunciation').map((n) => {
              const Icon = LINE_ICONS[n.to]
              return <NavLink key={n.to} to={n.to} end={n.end} aria-label={n.label} title={n.label}
                className="group relative grid h-12 min-w-0 flex-1 place-items-center rounded-full text-label transition-transform duration-200 active:scale-90">
                {({ isActive }) => <>
                  <Icon active={isActive} className="relative size-6" />
                  {n.to === '/review' && available > 0 && <span className="absolute top-1 left-[calc(50%+0.35rem)] inline-flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-danger px-1 text-[0.6875rem] font-bold tabular-nums text-white">{available > 99 ? '99+' : available}</span>}
                </>}
              </NavLink>
            })}
          </div>
        </motion.div>
      </nav>
    </div>
  )
}
