import { CourseSkeleton } from './skeletons'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { ButtonLink, Card } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { riseIn } from '@/components/ui/motion'
import { Badge } from '@/components/ui/Badge'
import { Chevron, CollapsiblePanel } from '@/components/ui/Disclosure'
import { ProgressBar, ProgressRing } from '@/components/ui/Progress'
import { partsFor, setSkipped } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'
import { pathSections, pathSummary, upcoming, type PathItem, type PathSection } from '@/lib/learningPath'
import { lessonName, LEVELS } from '@/data/course'

function useSkip() {
  const [error, setError] = useState('')
  const run = async (ids: string[], skipped: boolean) => {
    setError('')
    try { await setSkipped(ids, skipped) } catch { setError('Chưa lưu được thay đổi. Hãy thử lại.') }
  }
  return { error, run }
}

const plainTitle = (vi: string) => vi.replace(/ · \d+ từ mới$/, '')

/** "⋯" button with the rarely used row actions, so every row is not cluttered with them. */
function RowMenu({ item, onSkip }: { item: PathItem; onSkip: (ids: string[], skipped: boolean) => void }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !box.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close) }
  }, [open])
  if (item.status === 'done') return <span className="size-11 shrink-0" />
  const skipped = item.status === 'skipped'
  const label = `${skipped ? 'Hoàn tác bỏ qua' : 'Bỏ qua'} ${lessonName(item.lesson)}`
  return <div ref={box} className="relative shrink-0">
    <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={`Tùy chọn cho ${lessonName(item.lesson)}`} onClick={() => setOpen(!open)}
      className="grid size-11 cursor-pointer place-items-center rounded-xl text-lg text-muted hover:bg-sunken hover:text-ink">⋯</button>
    {open && <div role="menu" className="absolute right-0 top-full z-10 mt-1 w-52 rounded-xl bg-surface p-1 shadow-lift">
      <button type="button" role="menuitem" aria-label={label} onClick={() => { setOpen(false); onSkip([item.id], !skipped) }}
        className="w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm hover:bg-sunken">{skipped ? 'Hoàn tác bỏ qua' : 'Bỏ qua bài này'}</button>
    </div>}
  </div>
}

function PathRow({ item, onSkip }: { item: PathItem; onSkip: (ids: string[], skipped: boolean) => void }) {
  const parts = partsFor(item.lesson)
  const current = item.status === 'current'
  return <li className={`flex items-center gap-1 pr-2 sm:pr-3 ${current ? 'bg-jade-soft/60' : ''}`}>
    <Link to={item.to} aria-current={current ? 'step' : undefined} className={`group flex min-w-0 flex-1 items-center gap-3 px-3 py-3.5 sm:gap-4 sm:px-5 ${item.status === 'skipped' ? 'opacity-55' : ''}`}>
      <span aria-hidden="true" className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums ${item.status === 'done' ? 'bg-jade text-white dark:text-paper' : current ? 'bg-surface text-jade ring-2 ring-jade' : 'bg-sunken text-muted'}`}>
        {item.status === 'done' ? '✓' : item.lesson.number}
      </span>
      <span className="min-w-0 flex-1" title={`${item.lesson.title} · ${item.lesson.titlePinyin} · ${plainTitle(item.lesson.titleVi)}`}>
        <span className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-3">
          <span lang="zh-CN" className="font-han truncate text-xl leading-snug transition-colors group-hover:text-jade">{item.lesson.title}</span>
          <span className="min-w-0 truncate text-sm text-muted">{plainTitle(item.lesson.titleVi)}</span>
        </span>
        {current && <Pinyin text={item.lesson.titlePinyin} className="mt-0.5 hidden truncate whitespace-nowrap text-sm sm:block" />}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {item.needsPractice && <Badge tone="cinnabar">Cần ôn</Badge>}
        {current ? <Badge tone="jade">Đang học · {item.partsDone}/{parts.length}</Badge>
          : item.status === 'skipped' ? <Badge>Đã bỏ qua</Badge>
          : item.partsDone > 0 && item.status !== 'done' ? <ProgressRing value={item.partsDone / parts.length} size={30} stroke={3.5} />
          : <span className="hidden text-xs text-muted sm:inline">{item.lesson.words.length} từ</span>}
      </span>
    </Link>
    <RowMenu item={item} onSkip={onSkip} />
  </li>
}

function SectionBlock({ section, index, onSkip, focus }: {
  section: PathSection; index: number; onSkip: (ids: string[], skipped: boolean) => void
  /** Stage asked for in the address (?stage=hsk2): only that one opens, and the page scrolls to it. */
  focus: string | null
}) {
  const items = section.items
  const done = items.filter((i) => i.status === 'done').length
  const count = items.length + section.pending
  const finished = items.length > 0 && items.every((i) => i.status === 'done' || i.status === 'skipped')
  const open = items.some((i) => i.status === 'current')
  const focused = focus === section.id
  const [expanded, setExpanded] = useState(focus ? focused : open)
  useEffect(() => { if (open && !focus) setExpanded(true) }, [open, focus])
  const box = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!focused) return
    setExpanded(true)
    // Wait for the stages to finish rising in, so the scroll lands on the final position.
    const timer = setTimeout(() => box.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350)
    return () => clearTimeout(timer)
  }, [focused])
  const headingId = `stage-heading-${section.id}`
  const panelId = `stage-panel-${section.id}`
  return <section ref={box} aria-labelledby={headingId} className={`scroll-mt-20 rounded-2xl bg-surface md:scroll-mt-6 ${open || focused ? 'shadow-card' : 'border border-line'} ${focused ? 'ring-2 ring-jade/40' : ''}`}>
    <h2><button type="button" id={headingId} aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded((value) => !value)}
      className="flex min-h-18 w-full cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-sunken/50 sm:px-6">
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold ${finished ? 'bg-jade-soft text-jade' : open ? 'bg-jade text-white dark:text-paper' : 'bg-sunken text-muted'}`}>{finished ? '✓' : index}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold sm:text-lg">Chặng {index} · {section.title}</span>
        <span className="mt-1.5 flex items-center gap-3">
          <ProgressBar value={count ? done / count : 0} className="h-1.5 max-w-40 flex-1" />
          <span className="text-sm text-muted tabular-nums">{done}/{count} bài</span>
        </span>
      </span>
      <Chevron open={expanded} />
    </button></h2>
    <CollapsiblePanel id={panelId} labelledBy={headingId} expanded={expanded}>
      <ul className="divide-y divide-line border-t border-line">{items.map((item) => <PathRow key={item.id} item={item} onSkip={onSkip} />)}</ul>
      {section.pending > 0 && <p className="border-t border-line px-5 py-3 text-sm text-muted">Còn {section.pending} bài đang soạn nội dung.</p>}
    </CollapsiblePanel>
  </section>
}

function SupplementaryLevel({ level }: { level: (typeof LEVELS)[number] }) {
  const [expanded, setExpanded] = useState(false)
  const headingId = `supplementary-heading-${level.level}`
  const panelId = `supplementary-panel-${level.level}`
  return <section className="rounded-xl border border-line bg-surface">
    <h3><button type="button" id={headingId} aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded((value) => !value)} className="flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition-colors hover:bg-sunken/50">
      <span className="flex-1">HSK {level.level} <span className="font-normal text-muted">· {level.supplementalWords.length} từ bổ sung</span></span>
      <Chevron open={expanded} />
    </button></h3>
    <CollapsiblePanel id={panelId} labelledBy={headingId} expanded={expanded}>
      <ul className="grid grid-cols-1 gap-x-5 border-t border-line px-4 py-3 sm:grid-cols-2">
        {level.supplementalWords.map((word) => <li key={word.id} className="flex min-w-0 items-baseline gap-2 border-b border-line/60 py-2">
          <span className="shrink-0 font-han text-xl">{word.hanzi}</span>
          <span className="min-w-0 truncate text-sm text-muted">{word.pinyin} · {word.meaning}</span>
        </li>)}
      </ul>
    </CollapsiblePanel>
  </section>
}

function SupplementaryVocabulary() {
  const levels = LEVELS.filter((level) => level.supplementalWords.length > 0)
  if (!levels.length) return null
  return <section aria-labelledby="supplementary-vocab-title">
    <h2 id="supplementary-vocab-title" className="text-lg font-semibold">Từ bổ sung HSK 2.0</h2>
    <p className="mt-1 max-w-2xl text-sm text-muted">Có trong danh sách thi HSK 2.0 nhưng không thuộc bài nào của HSK Standard Course, nên được tách riêng.</p>
    <div className="mt-3 space-y-2">{levels.map((level) => <SupplementaryLevel key={level.level} level={level} />)}</div>
  </section>
}

export function CoursePage() {
  const { loaded, lessonState } = useStudyData()
  const { error, run } = useSkip()
  const [params] = useSearchParams()
  const focus = params.get('stage')
  if (!loaded) return <CourseSkeleton />
  const sections = pathSections(lessonState)
  const summary = pathSummary(lessonState)
  const [current] = upcoming(lessonState, 1)
  const pct = summary.total ? summary.done / summary.total : 0
  return (
    <div className="w-full min-w-0 space-y-8 pt-6 pb-12 sm:pt-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-jade">HSK Standard Course · 1–6</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Bài học của bạn</h1>
        <p className="mt-2 max-w-2xl text-muted">Học lần lượt từng bài, mỗi bài chia thành vài phần ngắn. Mới bắt đầu? <Link to="/pronunciation?tab=intro" className="text-jade underline">Làm quen phát âm và pinyin</Link> trước.</p>
      </header>

      <Card raised className="p-5 sm:p-6" aria-label="Tiến độ học tập">
        <div className="flex flex-wrap items-center gap-5">
          <ProgressRing value={pct} size={76} stroke={7} label={`${Math.round(pct * 100)}%`} />
          <div className="min-w-48 flex-1">
            <h2 className="text-lg font-semibold tabular-nums">{summary.done}/{summary.total} bài đã học</h2>
            <p className="mt-0.5 text-sm text-muted">Bộ thủ {summary.radical.done}/{summary.radical.total}{summary.hsk.skipped > 0 ? ` · ${summary.hsk.skipped} bài bỏ qua` : ''}</p>
          </div>
          {current && <ButtonLink to={current.to} size="lg" className="w-full sm:w-auto">Tiếp tục học <span aria-hidden="true">→</span></ButtonLink>}
        </div>
        {current ? <div className="mt-5 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-sunken p-4">
          <span lang="zh-CN" className="font-han min-w-0 text-3xl leading-none break-words">{current.lesson.title}</span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-jade">{lessonName(current.lesson)} · {current.part.label}</p>
            <p className="mt-0.5 truncate text-sm text-muted">{plainTitle(current.lesson.titleVi)}</p>
          </div>
        </div> : <p className="mt-4 text-sm font-medium text-jade">Bạn đã đi hết lộ trình hiện có. Hãy ôn tập và xem lại các bài đã bỏ qua.</p>}
        {error && <p role="alert" className="mt-3 text-sm text-cinnabar">{error}</p>}
      </Card>

      <motion.section aria-label="Các chặng học" className="space-y-3" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}>
        {sections.map((section, i) => <motion.div key={section.id} variants={riseIn}><SectionBlock section={section} index={i + 1} onSkip={run} focus={focus} /></motion.div>)}
      </motion.section>
      <SupplementaryVocabulary />
      <p className="text-sm text-muted">Muốn tra hoặc luyện thêm bộ thủ? Xem <Link to="/radicals" className="text-jade underline">Từ điển bộ thủ</Link>.</p>
    </div>
  )
}
