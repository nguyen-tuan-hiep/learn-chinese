import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Search, Volume2, X } from 'lucide-react'
import { useSearch } from '@/store/search'
import { useCourse } from '@/lib/courseModel'
import { useReviewQueue } from '@/lib/useReviewQueue'
import { search, type SearchKind } from '@/lib/searchIndex'
import { speak } from '@/lib/speech'
import { useSettings } from '@/store/settings'
import { lockScroll } from '@/lib/scrollLock'
import { Kbd } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { StrokeOrderGuide } from '@/components/hanzi/StrokeOrder'

interface Row { id: string; glyph: string; han?: boolean; title: string; sub: string; to: string; say?: string; word?: { hanzi: string; pinyin: string; meaning: string } }

const GROUP_TITLE: Record<SearchKind, string> = { word: 'Words', lesson: 'Lessons', radical: 'Radicals' }

/** Where the island hangs from, always the window's top edge: over the desktop Search notch, or (phones) the middle of the screen. */
function islandAnchor() {
  const notch = document.querySelector<HTMLElement>('[data-search-island]')
  // Desktop: reach up through the black frame strip to the window's top edge, so the blurred backdrop never shows an island top edge.
  // `face` copies what the notch shows (search hint or lesson progress), so the island lands looking exactly like it.
  if (notch?.offsetParent) { const r = notch.getBoundingClientRect(); return { cx: r.left + r.width / 2, pad: `${r.top}px`, width: r.width, height: r.top + r.height, faceHeight: r.height, face: notch.innerHTML } }
  // Phones: drop from the top edge itself (over the blurred top bar), clear of the status bar.
  return { cx: window.innerWidth / 2, pad: 'env(safe-area-inset-top)', width: 120, height: 0, faceHeight: 0, face: '' }
}

// The desktop island grows out of the black notch, so its text uses the dark-mode tokens in both themes.
// On phones there is no notch to grow from, so the panel follows the theme (white by day, dark grey at night).
const ISLAND_TOKENS = {
  '--color-label': '#f5f1e8', '--color-secondary-label': '#b3ab9d', '--color-tertiary-label': '#8a8378',
  '--color-fill': 'rgb(245 241 232 / 0.1)', '--color-separator': 'rgb(245 241 232 / 0.12)',
} as React.CSSProperties
// Grows with a little give, like the Dynamic Island.
const OPEN = { type: 'spring', stiffness: 420, damping: 30 } as const
/** The close keyframes, read when closing starts: height is 'auto' while open, and keyframes cannot start from 'auto'. */
function fold(el: HTMLDivElement | null, to: { width: number; height: number }) {
  return {
    width: [el?.offsetWidth ?? to.width, to.width - 8, to.width],
    height: [el?.offsetHeight ?? to.height, Math.max(0, to.height - 3), to.height],
    boxShadow: '0 0px 0px rgb(0 0 0 / 0)', pointerEvents: 'none' as const, transition: CLOSE,
  }
}
// One smooth fold straight into the notch, ending in a small fixed-size settle (a few px past, then back) like the notch's
// own events. A spring is not used: its overshoot grows with the ~600px distance and would dip far past the notch.
const CLOSE = { duration: 0.42, times: [0, 0.8, 1], ease: [[0.32, 0.72, 0, 1], 'easeOut'], boxShadow: { duration: 0.25 } } as const

/** Quick search and jump: lessons, words (characters, pinyin with or without tones, meaning) and radicals. */
export default function SearchPalette() {
  const { open, setOpen } = useSearch()
  const navigate = useNavigate()
  const { next, current } = useCourse()
  const { counts } = useReviewQueue()
  const rate = useSettings((s) => s.speechRate)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [writing, setWriting] = useState<Row['word'] | null>(null)
  const closeWriting = useCallback(() => setWriting(null), [])
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const listId = useId()
  const reduce = useReducedMotion()
  // Measured once per opening; the page cannot scroll while search is open, so it stays right.
  const anchor = useMemo(() => (open ? islandAnchor() : null), [open])
  const island = useRef<HTMLDivElement>(null)
  const wide = Math.min(576, window.innerWidth - 24)

  useEffect(() => {
    if (!open) return
    setQuery(''); setActive(0)
    const unlock = lockScroll()
    requestAnimationFrame(() => input.current?.focus())
    return unlock
  }, [open])

  const groups = useMemo((): { title: string; rows: Row[] }[] => {
    if (!query.trim()) {
      const due = counts.fresh + counts.learning + counts.review
      const go: Row[] = [
        { id: 'p-home', glyph: '今', han: true, title: 'Today', sub: 'Next lesson and cards to review', to: '/' },
        { id: 'p-review', glyph: '習', han: true, title: due ? `Review ${due} due card${due === 1 ? '' : 's'}` : 'Review', sub: 'Start a spaced repetition session', to: '/review' },
        { id: 'p-lesson', glyph: '课', han: true, title: 'Lessons', sub: 'The HSK path, level by level', to: '/lesson' },
        { id: 'p-radicals', glyph: '部', han: true, title: 'Radicals', sub: '214 radicals to hear and write', to: '/radicals' },
        { id: 'p-sound', glyph: '音', han: true, title: 'Pronunciation', sub: 'Tones, initials and finals', to: '/pronunciation' },
        { id: 'p-chart', glyph: '表', han: true, title: 'Pinyin chart', sub: 'Look up and hear every syllable', to: '/pronunciation?tab=chart' },
        { id: 'p-stats', glyph: '统', han: true, title: 'Stats', sub: 'Study time and progress', to: '/stats' },
      ]
      const tip: Row[] = next && current ? [{ id: 'p-next', glyph: [...current.title].find((c) => /\p{Script=Han}/u.test(c)) ?? '学', han: true, title: `Continue: ${current.title}`, sub: next.detail, to: next.to }] : []
      return [{ title: 'Go to', rows: go }, ...(tip.length ? [{ title: 'Suggested', rows: tip }] : [])]
    }
    const found = search(query)
    return (['word', 'lesson', 'radical'] as SearchKind[]).filter((k) => found[k].length).map((k) => ({
      title: GROUP_TITLE[k],
      rows: found[k].map((e, i) => ({ id: `${k}-${i}-${e.to}-${e.glyph}`, glyph: e.glyph, han: true, title: e.title, sub: e.sub, to: e.to, say: e.say, word: e.word })),
    }))
  }, [query, counts, next, current])
  const rows = groups.flatMap((g) => g.rows)

  useEffect(() => { setActive(0) }, [query])
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const go = (row?: Row) => {
    if (!row) return
    setOpen(false)
    // A word opens on its own (sound, meaning, stroke order) over the current page, not inside its lesson.
    if (row.word) setWriting(row.word)
    else navigate(row.to)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(rows.length - 1, a + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); go(rows[active]) }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false) }
  }

  let index = -1
  const palette = createPortal(<AnimatePresence>
    {open && anchor && <div className="pointer-events-none fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search" onKeyDown={onKeyDown}>
      <motion.button type="button" aria-label="Close search" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, pointerEvents: 'none', transition: { duration: 0.2, delay: 0.08 } }} transition={{ duration: 0.18 }}
        className="pointer-events-auto absolute inset-0 cursor-default bg-black/35 backdrop-blur-sm" />
      {/* The notch itself drops down into the search box, and folds back into it on close. */}
      <motion.div initial={{ width: anchor.width, height: anchor.height, boxShadow: '0 0px 0px rgb(0 0 0 / 0)' }} animate={{ width: wide, height: 'auto', boxShadow: '0 24px 60px rgb(0 0 0 / 0.35)' }}
        ref={island} variants={{ closed: () => fold(island.current, anchor) }} exit={reduce ? { width: anchor.width, height: anchor.height, transition: { duration: 0 } } : 'closed'} transition={reduce ? { duration: 0 } : OPEN}
        style={{ top: 0, left: anchor.cx, x: '-50%', maxHeight: `min(calc(40rem + ${anchor.pad}), calc(100dvh - 12px))` }}
        className={`pointer-events-auto absolute flex flex-col overflow-hidden rounded-b-[1.75rem] backdrop-blur-2xl backdrop-saturate-150 ${anchor.face ? 'bg-[#15120f]/78' : 'bg-surface/78'}`}>
        {anchor.face && <motion.div aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 0 }} exit={{ opacity: 1, transition: { duration: 0.15, delay: 0.15 } }}
          style={{ width: anchor.width, height: anchor.faceHeight }} dangerouslySetInnerHTML={{ __html: anchor.face }}
          className="pointer-events-none absolute bottom-0 left-1/2 z-10 -translate-x-1/2 text-white" />}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.2, delay: reduce ? 0 : 0.1 } }} exit={{ opacity: 0, transition: { duration: 0.08 } }}
          style={{ width: wide, paddingTop: anchor.pad, ...(anchor.face ? ISLAND_TOKENS : {}) }} className={`${anchor.face ? 'dark' : ''} mx-auto flex min-h-0 flex-1 flex-col text-label`}>
        <div className="flex items-center gap-3 border-b border-separator px-4 py-3">
          <Search aria-hidden="true" className="size-5 shrink-0 text-secondary-label" />
          <input ref={input} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search lessons, characters (学), pinyin, meaning…"
            role="combobox" aria-expanded="true" aria-controls={listId} aria-activedescendant={rows[active] ? `${listId}-${active}` : undefined} aria-autocomplete="list"
            enterKeyHint="go" autoComplete="off" autoCorrect="off" spellCheck={false}
            className="min-h-11 min-w-0 flex-1 bg-transparent text-body outline-none! placeholder:text-tertiary-label" />
          <span className="max-sm:hidden"><Kbd>Esc</Kbd></span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid size-10 cursor-pointer place-items-center rounded-full bg-fill text-secondary-label sm:hidden"><X aria-hidden="true" className="size-5" /></button>
        </div>
        <div ref={list} id={listId} role="listbox" aria-label="Results" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 [color-scheme:dark] [scrollbar-color:rgb(245_241_232/0.25)_transparent] [scrollbar-width:thin]">
          {rows.length === 0 && <p className="px-3 py-8 text-center text-subhead text-secondary-label">Nothing found for “{query.trim()}”. Try characters, pinyin without tones (xuesheng) or an English meaning.</p>}
          {groups.map((group) => <div key={group.title} role="group" aria-label={group.title}>
            <p className="px-3 pt-3 pb-1.5 text-caption font-bold tracking-wide text-secondary-label">{group.title}</p>
            {group.rows.map((row) => {
              index += 1
              const i = index
              const on = i === active
              return <SearchRow key={row.id} id={`${listId}-${i}`} index={i} on={on} row={row}
                onHover={() => setActive(i)} onOpen={() => go(row)}
                speaker={row.say ? <button type="button" tabIndex={-1} aria-label={`Nghe ${row.say}`} onClick={(e) => { e.stopPropagation(); void speak(row.say!, rate) }}
                  className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-secondary-label hover:bg-fill hover:text-label"><Volume2 aria-hidden="true" className="size-4" /></button> : null} />
            })}
          </div>)}
        </div>
        <p className="flex items-center gap-2 border-t border-separator px-4 py-2.5 text-caption text-secondary-label max-sm:hidden">
          <Kbd>↑</Kbd><Kbd>↓</Kbd> select <span className="mx-1" /> <Kbd>↵</Kbd> open <span className="mx-1" /> <Kbd>/</Kbd> search from anywhere
        </p>
        </motion.div>
      </motion.div>
    </div>}
  </AnimatePresence>, document.body)
  const sheet = <Sheet open={!!writing} onClose={closeWriting} label={writing ? `How to write ${writing.hanzi}` : 'How to write'}>
    {writing && <StrokeOrderGuide key={writing.hanzi} hanzi={writing.hanzi} pinyin={writing.pinyin} meaning={writing.meaning} onClose={closeWriting} />}
  </Sheet>
  return <>{palette}{sheet}</>
}

// Everything that marks the active row changes on one shared timing, so the highlight, tile and "Open" move together.
const SWAP = 'transition-colors duration-150 ease-out'

const glyphSize = (n: number) => n <= 1 ? 'text-2xl' : n === 2 ? 'text-lg' : 'text-sm'

function SearchRow({ id, index, on, row, speaker, onHover, onOpen }: { id: string; index: number; on: boolean; row: Row; speaker: ReactNode; onHover: () => void; onOpen: () => void }) {
  return <div id={id} data-index={index} role="option" aria-selected={on} onMouseMove={onHover} onClick={onOpen}
    className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 ${SWAP} ${on ? 'bg-fill' : ''}`}>
    <span lang="zh-CN" aria-hidden="true" className={`grid h-11 min-w-11 shrink-0 place-items-center rounded-2xl px-1.5 font-han whitespace-nowrap ${SWAP} ${on ? 'ink-pill' : 'bg-fill text-label'} ${glyphSize([...row.glyph].length)}`}>{[...row.glyph].slice(0, 3).join('')}</span>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-callout font-semibold">{row.title}</span>
      <span className="block truncate text-footnote text-secondary-label">{row.sub}</span>
    </span>
    {speaker}
    <span aria-hidden="true" className={`shrink-0 text-caption font-semibold max-sm:hidden ${SWAP} ${on ? 'text-label' : 'text-transparent'}`}>Open ↵</span>
  </div>
}
