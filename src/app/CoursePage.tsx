import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui/Button'
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

const short = (item: PathItem) => lessonName(item.lesson)

function Status({ item }: { item: PathItem }) {
  if (item.status === 'done') return <span className="text-sm font-semibold text-jade">✓ Đã học</span>
  if (item.status === 'skipped') return <span className="text-sm text-muted">↷ Đã bỏ qua</span>
  if (item.status === 'current') return <span className="text-sm font-semibold">● Đang học</span>
  return null
}

function PathRow({ item, onSkip }: { item: PathItem; onSkip: (ids: string[], skipped: boolean) => void }) {
  const muted = item.status === 'skipped' ? 'opacity-60' : ''
  const parts = partsFor(item.lesson)
  return <li className={`flex items-center gap-1 pr-2 sm:pr-3 ${item.status === 'current' ? 'bg-jade-soft/50' : ''}`}>
    <Link to={item.to} aria-current={item.status === 'current' ? 'step' : undefined} className={`group flex min-w-0 flex-1 items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5 hover:bg-sunken/50 transition-colors ${muted}`}>
      <span aria-hidden="true" className={`w-6 shrink-0 text-center text-sm font-medium tabular-nums ${item.status === 'done' ? 'text-jade' : 'text-muted'}`}>
        {item.status === 'done' ? '✓' : String(item.lesson.number).padStart(2, '0')}
      </span>
      <div className="min-w-0 flex-1">
        <>
          <div className="flex min-w-0 items-baseline gap-2" title={`${item.lesson.title} · ${item.lesson.titlePinyin} · ${item.lesson.titleVi.replace(/ · \d+ từ mới$/, '')}`}>
            <span lang="zh-CN" className="font-han max-w-[55%] shrink-0 truncate text-lg leading-snug sm:text-xl group-hover:text-jade transition-colors">{item.lesson.title}</span>
            <span aria-hidden="true" className="text-xs text-muted">·</span>
            <span className="min-w-0 flex-1 truncate text-xs text-muted sm:text-sm">{item.lesson.titleVi.replace(/ · \d+ từ mới$/, '')}</span>
          </div>
          <Pinyin text={item.lesson.titlePinyin} className="mt-0.5 block truncate whitespace-nowrap text-xs sm:text-sm" />
        </>
      </div>
      <div className="shrink-0 text-right">
        <span className="hidden sm:block"><Status item={item} /></span>
        <>
          <div aria-hidden="true" className="mt-1 flex justify-end gap-1">{parts.map((part, index) => <span key={part.id} className={`h-1.5 w-3 rounded-sm sm:w-5 ${index < item.partsDone || item.status === 'done' ? 'bg-jade' : 'bg-line'}`} />)}</div>
          <div className="mt-1 text-xs tabular-nums text-muted">{item.partsDone}/{parts.length} phần · {item.lesson.words.length} từ</div>
          {item.needsPractice && <span className="text-xs text-cinnabar">Cần ôn</span>}
        </>
        {item.status === 'current' && <span className="mt-1 block text-xs font-semibold text-jade sm:hidden">Đang học</span>}
        {item.status === 'skipped' && <span className="mt-1 block text-xs text-muted sm:hidden">Đã bỏ qua</span>}
      </div>
    </Link>
    {item.status !== 'done' && <Button variant="ghost" className="min-h-11 shrink-0 text-xs !px-2" aria-label={`${item.status === 'skipped' ? 'Hoàn tác bỏ qua' : 'Bỏ qua'} ${short(item)}`}
      onClick={() => onSkip([item.id], item.status !== 'skipped')}>{item.status === 'skipped' ? 'Hoàn tác' : 'Bỏ qua'}</Button>}
  </li>
}

/** Measure content once and on resize so both directions animate between pixel heights. */
function CollapsiblePanel({ id, labelledBy, expanded, children }: { id: string; labelledBy: string; expanded: boolean; children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  useLayoutEffect(() => {
    const node = content.current
    if (!node) return
    const measure = () => setHeight(node.getBoundingClientRect().height)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <div id={id} role="region" aria-labelledby={labelledBy} aria-hidden={!expanded} {...(!expanded ? { inert: '' } : {})}
    className="overflow-hidden transition-[height,opacity] duration-300 ease-in-out motion-reduce:transition-none"
    style={{ height: expanded ? height : 0, opacity: expanded ? 1 : 0 }}>
    <div ref={content} className="flow-root">{children}</div>
  </div>
}

function SectionBlock({ section, index, onSkip }: { section: PathSection; index: number; onSkip: (ids: string[], skipped: boolean) => void }) {
  const items = section.items
  const done = items.filter((i) => i.status === 'done').length
  const summary = `${done}/${items.length + section.pending} bài`
  const finished = items.every((i) => i.status === 'done' || i.status === 'skipped')
  const open = items.some((i) => i.status === 'current')
  const [expanded, setExpanded] = useState(open)
  useEffect(() => { if (open) setExpanded(true) }, [open])
  const headingId = `stage-heading-${section.id}`
  const panelId = `stage-panel-${section.id}`
  return <section aria-labelledby={headingId} className="mt-4 rounded-2xl border border-line bg-surface overflow-hidden">
    <h2><button type="button" id={headingId} aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded(value => !value)} className="cursor-pointer w-full text-left flex min-h-18 items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 hover:bg-sunken/50 transition-colors">
      <span className={`size-9 shrink-0 grid place-items-center rounded-xl text-sm font-semibold ${finished ? 'bg-jade-soft text-jade' : open ? 'bg-jade text-white dark:text-paper' : 'bg-sunken text-muted'}`}>{finished ? '✓' : index}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold sm:text-lg">Chặng {index} · {section.title}</span>
        <span className="mt-1 block text-sm text-muted">{summary} đã hoàn thành{open ? ' · Đang học' : ''}</span>
      </span>
      <svg aria-hidden="true" className={`size-5 shrink-0 text-muted transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 9 6 6 6-6" /></svg>
    </button></h2>
    <CollapsiblePanel id={panelId} labelledBy={headingId} expanded={expanded}>

    <ul className="divide-y divide-line border-t border-line">{items.map((item) => <PathRow key={item.id} item={item} onSkip={onSkip} />)}</ul>
    {section.pending > 0 && <p className="px-5 py-3 border-t border-line text-sm text-muted">Còn {section.pending} bài đang soạn nội dung.</p>}
    </CollapsiblePanel>
  </section>
}

function SupplementaryLevel({ level }: { level: (typeof LEVELS)[number] }) {
  const [expanded, setExpanded] = useState(false)
  const headingId = `supplementary-heading-${level.level}`
  const panelId = `supplementary-panel-${level.level}`
  return <section className="rounded-xl border border-line bg-surface">
    <h3><button type="button" id={headingId} aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded(value => !value)} className="flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left font-semibold hover:bg-sunken/50 transition-colors rounded-xl">
      <span className="flex-1">HSK {level.level} <span className="font-normal text-muted">· {level.supplementalWords.length} từ bổ sung</span></span>
      <svg aria-hidden="true" className={`size-5 shrink-0 text-muted transition-transform duration-300 motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 9 6 6 6-6" /></svg>
    </button></h3>
    <CollapsiblePanel id={panelId} labelledBy={headingId} expanded={expanded}>
      <ul className="grid grid-cols-1 gap-x-5 border-t border-line px-4 py-3 sm:grid-cols-2">
        {level.supplementalWords.map(word => <li key={word.id} className="flex min-w-0 items-baseline gap-2 border-b border-line/60 py-2">
          <span className="shrink-0 font-han text-xl">{word.hanzi}</span>
          <span className="min-w-0 truncate text-xs text-muted">{word.pinyin} · {word.meaning}</span>
        </li>)}
      </ul>
    </CollapsiblePanel>
  </section>
}

function SupplementaryVocabulary() {
  const levels = LEVELS.filter((level) => level.supplementalWords.length > 0)
  if (!levels.length) return null
  return <section className="mt-8" aria-labelledby="supplementary-vocab-title">
    <h2 id="supplementary-vocab-title" className="text-xl font-bold">Từ bổ sung HSK 2.0</h2>
    <p className="mt-1 text-sm text-muted">Các từ này thuộc danh sách thi HSK 2.0 nhưng không có trong danh sách từ theo bài của HSK Standard Course, nên được tách riêng thay vì gán vào bài sách.</p>
    <div className="mt-3 space-y-2">
      {levels.map(level => <SupplementaryLevel key={level.level} level={level} />)}
    </div>
  </section>
}

export function CoursePage() {
  const { loaded, lessonState, cards } = useStudyData()
  const { error, run } = useSkip()
  if (!loaded) return <p role="status" className="pt-8">Đang tải giáo trình…</p>
  const sections = pathSections(lessonState)
  const summary = pathSummary(lessonState, cards)
  const [current] = upcoming(lessonState, 1)
  return (
    <div className="w-full min-w-0 pt-6 pb-12 sm:pt-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-jade">HSK Standard Course · 1–6</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Giáo trình của bạn</h1>
      <p className="text-muted mt-3 max-w-2xl leading-relaxed">Học từng bài, vững từng bước. Chọn chặng bên dưới hoặc tiếp tục bài đang học của bạn.</p>

      <Card className="mt-5 p-4 !border-jade/25 bg-jade-soft/30" aria-label="Tiến độ học tập">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <h2 className="font-semibold">Tiến độ học tập</h2>
          <span className="text-muted tabular-nums">{summary.done}/{summary.total} bài đã học</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-line overflow-hidden"><div className="h-full bg-jade" style={{ width: `${(summary.done / summary.total) * 100}%` }} /></div>
        <p className="mt-2 text-xs text-muted">Bộ thủ: {summary.radical.done}/{summary.radical.total} đã học{summary.hsk.skipped > 0 ? ` · ${summary.hsk.skipped} bài bỏ qua` : ''}</p>
        {current ? <div className="mt-3 flex items-center gap-3 border-t border-jade/15 pt-3">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-baseline gap-2"><span className="shrink-0 text-xs font-medium text-jade">HSK {current.lesson.level} · Bài {current.lesson.number}</span><span lang="zh-CN" className="font-han truncate text-xl" title={current.lesson.title}>{current.lesson.title}</span></div>
            <p className="mt-0.5 truncate text-xs text-muted" title={current.lesson.titleVi.replace(/ · \d+ từ mới$/, '')}>{current.lesson.titleVi.replace(/ · \d+ từ mới$/, '')} · {current.part.label}</p>
          </div>
          <Link to={current.to} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-jade text-white dark:text-paper px-3 py-2 text-sm font-semibold hover:opacity-90 transition-opacity">Tiếp tục học <span aria-hidden="true">→</span></Link>
        </div> : <p className="mt-3 text-sm font-medium text-jade">Bạn đã đi hết lộ trình hiện có. Hãy ôn tập và xem lại các bài đã bỏ qua.</p>}
        {error && <p role="alert" className="mt-2 text-sm text-cinnabar">{error}</p>}
      </Card>

      <div className="mt-8 mb-4"><h2 className="text-xl font-semibold">Các chặng học</h2><p className="mt-1 text-sm text-muted">Học lần lượt Chặng 1–6 theo giáo trình HSK.</p></div>
      <p className="mb-4 text-sm text-muted">Mới bắt đầu? <Link to="/pronunciation?tab=intro" className="text-jade underline">Làm quen phát âm và pinyin</Link>.</p>
      {sections.map((section, i) => <SectionBlock key={section.id} section={section} index={i + 1} onSkip={run} />)}
      <SupplementaryVocabulary />
      <p className="mt-6 text-sm text-muted">Muốn tra hoặc luyện thêm bộ thủ? Xem <Link to="/radicals" className="underline">Từ điển bộ thủ</Link>.</p>
    </div>
  )
}
