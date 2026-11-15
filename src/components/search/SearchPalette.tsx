import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Volume2, X } from 'lucide-react'
import { useSearch } from '@/store/search'
import { useCourse } from '@/lib/courseModel'
import { useReviewQueue } from '@/lib/useReviewQueue'
import { search, type SearchKind } from '@/lib/searchIndex'
import { speak } from '@/lib/speech'
import { useSettings } from '@/store/settings'
import { spring } from '@/components/ui/motion'
import { Kbd } from '@/components/ui/Button'

interface Row { id: string; glyph: string; han?: boolean; title: string; sub: string; to: string; say?: string }

const GROUP_TITLE: Record<SearchKind, string> = { word: 'Từ vựng', lesson: 'Bài học', radical: 'Bộ thủ' }

/** Quick search and jump: lessons, words (chữ Hán, pinyin with or without tones, Hán Việt, nghĩa) and radicals. */
export default function SearchPalette() {
  const { open, setOpen } = useSearch()
  const navigate = useNavigate()
  const { next, current } = useCourse()
  const { counts } = useReviewQueue()
  const rate = useSettings((s) => s.speechRate)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    setQuery(''); setActive(0)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => input.current?.focus())
    return () => { document.body.style.overflow = overflow }
  }, [open])

  const groups = useMemo((): { title: string; rows: Row[] }[] => {
    if (!query.trim()) {
      const due = counts.fresh + counts.learning + counts.review
      const go: Row[] = [
        { id: 'p-home', glyph: '今', han: true, title: 'Hôm nay', sub: 'Bài tiếp theo và việc cần ôn', to: '/' },
        { id: 'p-review', glyph: '習', han: true, title: due ? `Ôn ${due} thẻ đến hạn` : 'Ôn tập', sub: 'Bắt đầu phiên ôn tập ngắt quãng', to: '/review' },
        { id: 'p-lesson', glyph: '课', han: true, title: 'Bài học', sub: 'Lộ trình HSK theo cấp', to: '/lesson' },
        { id: 'p-radicals', glyph: '部', han: true, title: 'Bộ thủ', sub: '214 bộ, nghe và tập viết', to: '/radicals' },
        { id: 'p-sound', glyph: '音', han: true, title: 'Phát âm', sub: 'Thanh điệu, thanh mẫu, vận mẫu', to: '/pronunciation' },
        { id: 'p-chart', glyph: '表', han: true, title: 'Bảng pinyin', sub: 'Tra và nghe từng âm tiết', to: '/pronunciation?tab=chart' },
        { id: 'p-stats', glyph: '统', han: true, title: 'Thống kê', sub: 'Thời gian học và tiến độ', to: '/stats' },
      ]
      const tip: Row[] = next && current ? [{ id: 'p-next', glyph: [...current.title].find((c) => /\p{Script=Han}/u.test(c)) ?? '学', han: true, title: `Học tiếp: ${current.title}`, sub: next.detail, to: next.to }] : []
      return [{ title: 'Đi tới', rows: go }, ...(tip.length ? [{ title: 'Gợi ý', rows: tip }] : [])]
    }
    const found = search(query)
    return (['word', 'lesson', 'radical'] as SearchKind[]).filter((k) => found[k].length).map((k) => ({
      title: GROUP_TITLE[k],
      rows: found[k].map((e, i) => ({ id: `${k}-${i}-${e.to}-${e.glyph}`, glyph: e.glyph, han: true, title: e.title, sub: e.sub, to: e.to, say: e.say })),
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
    navigate(row.to)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(rows.length - 1, a + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); go(rows[active]) }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false) }
  }

  let index = -1
  return createPortal(<AnimatePresence>
    {open && <div className="fixed inset-0 z-50 flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-[10vh]" role="dialog" aria-modal="true" aria-label="Tìm kiếm" onKeyDown={onKeyDown}>
      <motion.button type="button" aria-label="Đóng tìm kiếm" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
        className="absolute inset-0 cursor-default bg-black/35 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, y: -16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }} transition={spring.snappy}
        className="relative flex max-h-[min(40rem,calc(100dvh-1.5rem))] w-full max-w-xl flex-col overflow-hidden rounded-[1.75rem] bg-[var(--glass-regular)] shadow-[0_24px_60px_rgb(0_0_0/0.28)] ring-1 ring-separator sm:max-h-[75vh]">
        <div className="flex items-center gap-3 border-b border-separator px-4 py-3">
          <Search aria-hidden="true" className="size-5 shrink-0 text-secondary-label" />
          <input ref={input} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm bài, chữ Hán (学, HỌC), pinyin, nghĩa…"
            role="combobox" aria-expanded="true" aria-controls={listId} aria-activedescendant={rows[active] ? `${listId}-${active}` : undefined} aria-autocomplete="list"
            enterKeyHint="go" autoComplete="off" autoCorrect="off" spellCheck={false}
            className="min-h-11 min-w-0 flex-1 bg-transparent text-body outline-none! placeholder:text-tertiary-label" />
          <span className="max-sm:hidden"><Kbd>Esc</Kbd></span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Đóng" className="grid size-10 cursor-pointer place-items-center rounded-full bg-fill text-secondary-label sm:hidden"><X aria-hidden="true" className="size-5" /></button>
        </div>
        <div ref={list} id={listId} role="listbox" aria-label="Kết quả" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
          {rows.length === 0 && <p className="px-3 py-8 text-center text-subhead text-secondary-label">Không tìm thấy “{query.trim()}”. Thử chữ Hán, pinyin không dấu (xuesheng) hoặc nghĩa tiếng Việt.</p>}
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
          <Kbd>↑</Kbd><Kbd>↓</Kbd> chọn <span className="mx-1" /> <Kbd>↵</Kbd> mở <span className="mx-1" /> <Kbd>/</Kbd> mở nhanh từ bất kỳ đâu
        </p>
      </motion.div>
    </div>}
  </AnimatePresence>, document.body)
}

const glyphSize = (n: number) => n <= 1 ? 'text-2xl' : n === 2 ? 'text-lg' : 'text-sm'

function SearchRow({ id, index, on, row, speaker, onHover, onOpen }: { id: string; index: number; on: boolean; row: Row; speaker: ReactNode; onHover: () => void; onOpen: () => void }) {
  return <div id={id} data-index={index} role="option" aria-selected={on} onMouseMove={onHover} onClick={onOpen}
    className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 transition-colors ${on ? 'bg-fill' : ''}`}>
    <span lang="zh-CN" aria-hidden="true" className={`grid h-11 min-w-11 shrink-0 place-items-center rounded-2xl px-1.5 font-han whitespace-nowrap ${on ? 'bg-[#15120f] text-white dark:bg-[#f3eee4] dark:text-[#15120f]' : 'bg-fill text-label'} ${glyphSize([...row.glyph].length)}`}>{[...row.glyph].slice(0, 3).join('')}</span>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-callout font-semibold">{row.title}</span>
      <span className="block truncate text-footnote text-secondary-label">{row.sub}</span>
    </span>
    {speaker}
    <span aria-hidden="true" className={`shrink-0 text-caption font-semibold max-sm:hidden ${on ? 'text-label' : 'text-transparent'}`}>Mở ↵</span>
  </div>
}
