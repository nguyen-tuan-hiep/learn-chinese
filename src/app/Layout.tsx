import { Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Clock, Flame, PanelLeftClose, PanelLeftOpen, Play, Settings } from 'lucide-react'
import { useSettings } from '@/store/settings'
import { useCourse } from '@/lib/courseModel'
import { AudioStatus } from '@/components/AudioStatus'
import { UpdatePrompt } from '@/components/UpdatePrompt'
import { featurePastel } from '@/lib/palette'
import { spring } from '@/components/ui/motion'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { RangeBar } from '@/components/ui/RangeBar'
import { NAV } from '@/components/layout/nav'
import { RouteSkeleton } from './skeletons'

function Brand({ compact = false }: { compact?: boolean }) {
  return <Link to="/" className="flex items-center gap-2.5 rounded-full" aria-label="Tự học Hànyǔ · Trang chủ">
    <img src={`${import.meta.env.BASE_URL}app-icon.svg`} alt="" className="size-10 shrink-0 rounded-full" />
    <span className={`font-display text-title3 font-black tracking-tight text-white max-[380px]:sr-only ${compact ? 'sr-only' : ''}`}>Hànyǔ</span>
  </Link>
}

export function Layout() {
  const { pathname, search } = useLocation()
  // Stop requested audio when the learner changes pages or lesson tabs.
  useEffect(() => () => { window.speechSynthesis?.cancel() }, [pathname, search])
  const { reviewDeck, minutesToday, streak, next } = useCourse()
  const available = reviewDeck.length
  const goal = useSettings((s) => s.dailyMinutes)

  const collapsed = useSettings((s) => s.sidebarCollapsed)
  const setSettings = useSettings((s) => s.set)
  const side = ({ isActive }: { isActive: boolean }) =>
    `group relative flex min-h-12 items-center gap-3 rounded-full py-1.5 text-callout font-semibold transition-colors ${collapsed ? 'justify-center px-1.5' : 'pr-4 pl-1.5'} ${isActive ? 'bg-white/12 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'}`

  return (
    <div className={`min-h-dvh transition-[padding] duration-200 motion-reduce:transition-none md:bg-[#15120f] md:py-3 md:pr-3 dark:md:bg-black ${collapsed ? 'md:pl-[6.5rem]' : 'md:pl-[17.5rem]'}`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-primary-bg focus:px-4 focus:py-2.5 focus:text-on-primary">Đến nội dung chính</a>

      <aside className={`fixed inset-y-4 left-4 z-20 hidden flex-col gap-5 overflow-y-auto py-5 text-white transition-[width] duration-200 motion-reduce:transition-none md:flex ${collapsed ? 'w-[5rem] px-3' : 'w-[16rem] px-4'}`}>
        <div className={`flex items-center ${collapsed ? 'flex-col gap-3' : 'justify-between pl-1'}`}>
          <Brand compact={collapsed} />
          <button type="button" onClick={() => setSettings({ sidebarCollapsed: !collapsed })} aria-label={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'} aria-expanded={!collapsed}
            title={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'} className="grid size-10 cursor-pointer place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white">
            {collapsed ? <PanelLeftOpen aria-hidden="true" className="size-5" /> : <PanelLeftClose aria-hidden="true" className="size-5" />}
          </button>
        </div>
        <nav aria-label="Điều hướng chính" className="flex flex-col gap-1.5">
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
            ? <Link to="/stats" title={`Hôm nay ${minutesToday}/${goal} phút · chuỗi ${streak} ngày`} className="grid place-items-center gap-0.5 rounded-3xl bg-white/8 py-3 text-white ring-1 ring-white/15">
              <Flame aria-hidden="true" className="flame size-4" /><b className="text-footnote tabular-nums">{streak}</b>
              <span className="sr-only">Chuỗi {streak} ngày, hôm nay {minutesToday} trên {goal} phút</span>
            </Link>
            : <section aria-label="Hôm nay" className="rounded-3xl bg-white/8 p-4 text-white ring-1 ring-white/15">
              <p className="flex items-center gap-1.5 text-footnote font-semibold"><Flame aria-hidden="true" className="flame size-4 text-[var(--pastel-yellow)]" />Chuỗi {streak} ngày</p>
              <p className="mt-2 text-title2 tabular-nums leading-none"><AnimatedNumber value={minutesToday} /><span className="text-subhead font-semibold opacity-70"> / {goal} phút</span></p>
              <RangeBar value={minutesToday / goal} fill="var(--pastel-yellow)" className="mt-3 h-2 bg-white/15!" />
            </section>}
          <NavLink to="/settings" className={side} title={collapsed ? 'Cài đặt' : undefined}>
            {({ isActive }) => <>
              <span aria-hidden="true" className={`grid size-10 shrink-0 place-items-center rounded-full bg-white/12 ${isActive ? 'shadow-[0_0_0_2px_#fff]' : ''}`}><Settings className="size-5" strokeWidth={2} /></span>
              <span className={collapsed ? 'sr-only' : ''}>Cài đặt</span>
            </>}
          </NavLink>
        </div>
      </aside>

      <header className="sticky top-0 z-20 rounded-b-[2rem] bg-[#15120f] pt-[env(safe-area-inset-top)] shadow-[0_8px_24px_rgb(21_18_15/0.18)] md:hidden dark:bg-black">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
          <Brand />
          <div className="flex items-center gap-2">
            <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[var(--pastel-yellow)] px-3.5 text-subhead font-semibold text-[#15120f] tabular-nums" aria-label={`Chuỗi ${streak} ngày`}>
              <Flame aria-hidden="true" className="flame size-4" />{streak}<span className="max-sm:sr-only"> ngày</span>
            </span>
            <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white/12 px-3.5 text-subhead font-semibold text-white tabular-nums" aria-label={`Hôm nay ${minutesToday} trên ${goal} phút`}>
              <Clock aria-hidden="true" className="size-4" />{minutesToday}/{goal}<span className="max-sm:sr-only"> phút</span>
            </span>
            <Link to="/settings" className="grid size-10 place-items-center rounded-full bg-white/12 text-white" aria-label="Cài đặt" title="Cài đặt"><Settings aria-hidden="true" className="size-[18px]" strokeWidth={2} /></Link>
          </div>
        </div>
        <span aria-hidden="true" className="absolute top-full left-1/2 h-3 w-24 -translate-x-1/2 rounded-b-[1.25rem] bg-[#15120f] dark:bg-black" />
      </header>

      <div className="md:min-h-[calc(100dvh-1.5rem)] md:rounded-[2.5rem] md:bg-[var(--color-paper)] md:relative">
        <span aria-hidden="true" className="absolute top-0 left-1/2 hidden h-4 w-40 -translate-x-1/2 rounded-b-[1.5rem] bg-[#15120f] md:block dark:bg-black" />
      <main id="main-content" className="mx-auto w-full max-w-6xl min-w-0 px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] sm:px-8 md:pt-6 md:pb-14">
        <AudioStatus />
        {/* Each page springs in; while its code downloads, a placeholder of the same shape holds its place. */}
        <motion.div key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring.smooth}>
          <Suspense fallback={<RouteSkeleton pathname={pathname} />}><Outlet /></Suspense>
        </motion.div>
      </main>
      </div>

      <UpdatePrompt />

      <nav aria-label="Điều hướng chính" className="fixed inset-x-0 bottom-0 z-20 flex md:hidden justify-center px-3 pb-[max(1rem,env(safe-area-inset-bottom))] standalone:pb-[max(0.5rem,calc(env(safe-area-inset-bottom)-0.5rem))] pointer-events-none">
        <div className="pointer-events-auto flex gap-1 rounded-full bg-[#15120f] p-1.5 min-[400px]:gap-1.5 min-[400px]:p-2 shadow-[0_14px_32px_rgb(0_0_0/0.28)] dark:bg-[#2a2620] sm:gap-2.5 sm:p-2.5">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} aria-label={n.label} title={n.label}
              className="group relative grid size-10 place-items-center rounded-full min-[400px]:size-11 transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-1 active:scale-90 sm:size-[3.25rem]">
              {({ isActive }) => <>
                <span aria-hidden="true" style={{ background: featurePastel(n.feature) }} className={`absolute inset-0 rounded-full transition-[box-shadow,transform] duration-200 ${isActive ? 'scale-100 shadow-[0_0_0_3px_#fff]' : 'scale-90 opacity-90 group-hover:scale-100'}`} />
                <n.icon aria-hidden="true" className="relative size-5 text-[#15120f] sm:size-[22px]" strokeWidth={isActive ? 2.4 : 2} />
                {n.to === '/review' && available > 0 && <span className="absolute -top-0.5 -right-0.5 grid min-w-[1.125rem] place-items-center rounded-full bg-danger px-1 text-[10px] leading-[1.125rem] font-bold tabular-nums text-white ring-2 ring-[#15120f]"><span className="sr-only">{available} thẻ cần ôn</span><span aria-hidden="true">{available > 99 ? '99+' : available}</span></span>}
              </>}
            </NavLink>
          ))}
          {next && <>
            <span aria-hidden="true" className="mx-0.5 my-2 w-px bg-white/20" />
            <Link to={next.to} aria-label={`Học tiếp: ${next.label}`} title="Học tiếp"
              className="grid size-10 place-items-center rounded-full bg-white text-[#15120f] min-[400px]:size-11 transition-transform duration-200 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-1 active:scale-90 sm:size-[3.25rem]">
              <Play aria-hidden="true" className="size-5 translate-x-px fill-current" />
            </Link>
          </>}
        </div>
      </nav>
    </div>
  )
}
