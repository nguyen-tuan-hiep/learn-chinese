import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronsUpDown } from 'lucide-react'
import { BrandMark } from './BrandMark'
import { useSettings } from '@/store/settings'
import type { HskVersion } from '@/data/course'

const OPTIONS: { value: HskVersion; label: string; levels: string }[] = [
  { value: '2.0', label: 'HSK 2.0', levels: '6 levels' },
  { value: '3.0', label: 'HSK 3.0', levels: '4 levels' },
]

/**
 * The one place to switch HSK 2.0 / 3.0, on every page.
 * Desktop sidebar: grouped with the logo like a workspace switcher, since the version belongs to the whole app,
 * not to a page. `brand` = logo, "Hànyǔ", "HSK 3.0 course" and an up/down mark; `compact` = logo with a "3.0" tag
 * (collapsed sidebar). Phone top bar: `icon`, a round button showing the version.
 * The menu is `position: fixed` from the button's box, so the sidebar's scroll container cannot clip it.
 */
export function VersionMenu({ variant, placement = 'below-start' }: { variant: 'brand' | 'compact' | 'icon'; placement?: 'below-start' | 'below-end' | 'right' }) {
  const version = useSettings((s) => s.hskVersion)
  const set = useSettings((s) => s.set)
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const [pos, setPos] = useState<CSSProperties>({})
  const toggle = () => {
    if (!open && trigger.current) {
      const r = trigger.current.getBoundingClientRect()
      setPos(placement === 'right' ? { top: r.top, left: r.right + 12 }
        : placement === 'below-start' ? { top: r.bottom + 8, left: r.left }
        : { top: r.bottom + 8, right: window.innerWidth - r.right })
    }
    setOpen(!open)
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); trigger.current?.focus() } }
    // The menu is pinned to where the button was; close it if the page moves under it.
    const onMove = () => setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onMove)
    window.addEventListener('scroll', onMove, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onMove); window.removeEventListener('scroll', onMove)
    }
  }, [open])

  const choose = (value: HskVersion) => { set({ hskVersion: value }); setOpen(false); trigger.current?.focus() }

  return <div ref={root} className="relative">
    {variant === 'icon'
      ? <button ref={trigger} type="button" onClick={toggle} aria-haspopup="menu" aria-expanded={open} aria-controls={menuId}
        aria-label={`Course version: HSK ${version}. Change version`} title="Course version"
        className="grid size-10 cursor-pointer place-items-center rounded-full bg-white text-footnote font-extrabold tabular-nums text-[#15120f] transition-transform active:scale-90">
        {version}
      </button>
      : <button ref={trigger} type="button" onClick={toggle} aria-haspopup="menu" aria-expanded={open} aria-controls={menuId}
        aria-label={`Hànyǔ, HSK ${version} course. Change course version`} title="Change course version"
        className={`group cursor-pointer transition-colors hover:bg-white/8 ${variant === 'compact'
          ? 'grid justify-items-center gap-1 rounded-2xl p-1'
          : 'flex w-full min-w-0 items-center gap-2 rounded-[1.25rem] py-1 pr-1.5 pl-1 text-left'}`}>
        <BrandMark live className="size-11 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] group-hover:-rotate-6" />
        {variant === 'compact'
          ? <span aria-hidden="true" className="rounded-full bg-white/12 px-2 py-0.5 text-caption font-bold tabular-nums text-white">{version}</span>
          : <>
            <span aria-hidden="true" className="min-w-0 flex-1 leading-tight">
              <span className="block font-display text-title3 font-black tracking-tight text-white">Hànyǔ</span>
              <span className="block truncate text-caption font-semibold text-white/70">HSK {version} course</span>
            </span>
            <ChevronsUpDown aria-hidden="true" className="size-4 shrink-0 text-white/60" />
          </>}
      </button>}
    <AnimatePresence>
      {open && <motion.div id={menuId} role="menu" aria-label="Course version" style={pos}
        initial={{ opacity: 0, scale: 0.96, ...(placement === 'right' ? { x: -6 } : { y: -6 }) }} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.16 }}
        className={`fixed z-50 w-64 rounded-3xl bg-white p-1.5 text-[#15120f] shadow-[0_14px_36px_rgb(0_0_0/0.22)] ${placement === 'below-end' ? 'origin-top-right' : 'origin-top-left'}`}>
        <p className="px-3 pt-2 pb-1 text-caption font-semibold text-[#5f594f]">Course version</p>
        {OPTIONS.map((o) => {
          const on = o.value === version
          return <button key={o.value} type="button" role="menuitemradio" aria-checked={on} onClick={() => choose(o.value)}
            className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-2xl px-3 text-left text-subhead ${on ? 'bg-[#15120f] text-white' : 'hover:bg-black/5'}`}>
            <span><b className="font-bold">{o.label}</b> <span className={on ? 'text-white/70' : 'text-[#5f594f]'}>· {o.levels}</span></span>
            {on && <Check aria-hidden="true" className="size-4" strokeWidth={2.6} />}
          </button>
        })}
        <p className="px-3 pt-1.5 pb-2 text-caption whitespace-nowrap text-[#5f594f]">Each version keeps its own progress.</p>
      </motion.div>}
    </AnimatePresence>
  </div>
}
