import { PageSkeleton } from './skeletons'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { Button, ButtonLink, Card } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { EASE } from '@/components/ui/motion'
import { Badge } from '@/components/ui/Badge'
import { Disclosure } from '@/components/ui/Disclosure'
import { PageHeader } from '@/components/ui/PageHeader'
import { Segmented } from '@/components/ui/Segmented'
import { Sheet } from '@/components/ui/Sheet'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { ProgressBar, ProgressRing } from '@/components/ui/Progress'
import { StrokeWriter } from '@/components/hanzi/StrokeWriter'
import { FreehandWriter } from '@/components/hanzi/FreehandWriter'
import { RADICALS, RADICAL_BY_ID, RADICAL_LESSONS, radicalLesson, type Radical } from '@/data/radicals'
import { learnedRadicalIds, TAUGHT_RADICALS } from '@/lib/lessonRadicals'
import { firstRadicalLesson } from '@/lib/lessonRadicalStudy'
import { lessonName } from '@/data/course'
import { radicalExample, radicalPosition } from '@/lib/radicalExamples'
import { radicalFamily } from '@/lib/radicalFamily'
import { RadicalMindmap } from '@/components/hanzi/RadicalMindmap'
import { ComposeQuiz } from '@/components/lesson/ComposeQuiz'
import { markPart, lessonPartLink } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'

function RadicalDetails({ radical, semanticOnly = false }: { radical: Radical; semanticOnly?: boolean }) {
  const example = radicalExample(radical.id)
  const family = radicalFamily(radical).filter((m) => semanticOnly ? m.role === 'semantic' : m.role !== 'self')
  return <div id={`radical-${radical.id}`} className="scroll-mt-24">
    <div className="flex items-start gap-4">
      <span lang="zh-CN" className="font-han grid size-20 shrink-0 place-items-center rounded-2xl bg-jade-soft text-6xl leading-none text-jade sm:size-24 sm:text-7xl">{radical.writingGlyph}</span>
      <div className="min-w-0">
        <p className="text-sm text-muted tabular-nums">Bộ {radical.id}/214 · {radical.strokes} nét</p>
        <h2 className="mt-0.5 text-2xl font-semibold">{radical.meaning}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>Dạng gốc <span className="font-han text-sm text-ink">{radical.glyph}</span></Badge>
          {radical.variants.length > 0 && <Badge>Dạng khác <span className="font-han text-sm text-ink">{radical.variants.join(' · ')}</span></Badge>}
          <Badge>Vị trí: {radicalPosition(radical.variants)}</Badge>
        </div>
      </div>
    </div>
    <p className="mt-4 rounded-xl bg-sunken px-4 py-3 text-sm leading-relaxed">
      {semanticOnly ? (family.length > 0 ? <>Bộ <span className="font-han text-lg">{radical.writingGlyph}</span> gợi nghĩa trong <b>{family.length} chữ</b> của giáo trình: <span className="font-han text-lg">{family.slice(0, 6).map((member) => member.char).join(' ')}</span>{family.length > 6 && '…'}. Chọn chữ trong sơ đồ bên dưới để xem từ ví dụ.</> : <>Chưa có chữ trong dữ liệu hiện tại được xác định bộ này có vai trò gợi nghĩa.</>) : <>
      {example ? <>Trong giáo trình, <span className="font-han text-lg">{example.char}</span> thuộc bộ <span className="font-han text-lg">{radical.glyph}</span>; gặp trong <span className="font-han">{example.word.hanzi}</span> ({example.word.meaning}).</> : <>Chữ mẫu <span className="font-han text-lg">{radical.glyph}</span> mang nghĩa “{radical.meaning}”. Bộ này chưa xuất hiện trong giáo trình HSK hiện có.</>}
      {family.length > 1 && <> Bộ này ghép ra <b>{family.length} chữ</b> trong giáo trình, như <span className="font-han text-lg">{family.slice(0, 6).map((m) => m.char).join(' ')}</span>.</>}
      </>}
    </p>
  </div>
}

/** Dictionary entry: course links and characters where this radical has a documented semantic role. */
function RadicalEntry({ radical, learned, onClose, flat = false }: { radical: Radical; learned: boolean; onClose: () => void; flat?: boolean }) {
  const lesson = firstRadicalLesson(radical.id)
  const practice = radicalLesson(radical.id)
  const hasSemanticFamily = radicalFamily(radical).some((member) => member.role === 'semantic')
  return <Card raised={!flat} className={`relative ${flat ? 'border-0 bg-transparent' : 'p-5 sm:p-6'}`} aria-label={`Bộ ${radical.writingGlyph}`}>
    <button type="button" onClick={onClose} aria-label="Đóng chi tiết bộ thủ" className="absolute top-3 right-3 grid size-10 cursor-pointer place-items-center rounded-xl text-muted hover:bg-sunken hover:text-ink">✕</button>
    <RadicalDetails radical={radical} semanticOnly />
    <div className="mt-4 grid grid-cols-1 gap-2 min-[400px]:flex min-[400px]:flex-wrap min-[400px]:items-center">
      {lesson ? <ButtonLink to={lessonPartLink(lesson.id, 'chars')}>Học ở {lessonName(lesson)} →</ButtonLink> : <span className="text-sm text-muted">Bộ này chưa được dạy trong giáo trình hiện có.</span>}
      {practice && <ButtonLink to={`/radicals/${practice.id}#radical-${radical.id}`} variant="secondary">Luyện viết thêm</ButtonLink>}
      {learned && <Badge tone="jade">✓ Đã học</Badge>}
    </div>
    {hasSemanticFamily && <div className="mt-6 border-t border-line pt-5"><RadicalMindmap key={radical.id} radical={radical} semanticOnly /></div>}
  </Card>
}

type Filter = 'course' | 'learned' | 'all'
const FILTERS: [Filter, string][] = [['course', 'Trong giáo trình'], ['learned', 'Đã học'], ['all', 'Tất cả 214']]

export function RadicalsPage() {
  const { lessonState } = useStudyData()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('course')
  const learned = learnedRadicalIds(lessonState)
  const selected = RADICAL_BY_ID.get(Number(params.get('r')))
  const needle = query.trim().toLocaleLowerCase('vi-VN')
  const pool = filter === 'all' ? RADICALS : filter === 'learned' ? TAUGHT_RADICALS.filter((r) => learned.has(r.id)) : TAUGHT_RADICALS
  const results = needle ? RADICALS.filter((radical) =>
    String(radical.id) === needle || [radical.glyph, radical.meaning, ...radical.variants].some((value) => value.toLocaleLowerCase('vi-VN').includes(needle))) : pool
  const known = TAUGHT_RADICALS.filter((r) => learned.has(r.id)).length
  const wide = useMediaQuery('(min-width: 1280px)')
  const select = useCallback((id: number | null) => setParams(id === null ? {} : { r: String(id) }, { replace: true }), [setParams])
  return <div className="w-full min-w-0 space-y-8 pt-6 pb-12 sm:pt-8">
    <PageHeader eyebrow="Tra cứu · 214 bộ" title="Từ điển bộ thủ"
      aside={<Card raised className="flex w-full items-center gap-4 p-4 pr-5 sm:w-auto">
        <ProgressRing value={TAUGHT_RADICALS.length ? known / TAUGHT_RADICALS.length : 0} size={48} stroke={5} />
        <div><p className="font-semibold tabular-nums">{known}/{TAUGHT_RADICALS.length} bộ đã học</p><Link to="/lesson" className="text-sm text-jade underline">Tiếp tục lộ trình</Link></div>
      </Card>}>
      Bộ thủ được dạy ngay trong phần <b className="text-ink">Bộ thủ</b> của mỗi bài. Ở đây bạn tra một bộ, xem nó ghép ra những chữ nào và luyện viết thêm.
    </PageHeader>

    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <section aria-label="Danh sách bộ thủ" className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-60 flex-1">
            <span className="sr-only">Tìm theo hình, nghĩa hoặc số thứ tự</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="min-h-12 w-full rounded-xl border border-line bg-surface pr-4 pl-11 text-ink shadow-card placeholder:text-muted" placeholder="Tìm: nước, 氵, 85" />
          </label>
          <Segmented label="Lọc bộ thủ" fill className="w-full sm:w-auto" value={filter} onChange={setFilter} options={FILTERS.map(([value, label]) => ({ value, label }))} />
        </div>
        <p className="text-sm text-muted tabular-nums">{needle ? `${results.length} bộ phù hợp với “${query.trim()}”` : filter === 'course' ? `${results.length} bộ trong giáo trình, theo thứ tự bài` : filter === 'learned' ? `${results.length} bộ bạn đã học` : 'Đủ 214 bộ theo thứ tự Khang Hy'}</p>


        <ul key={`${filter}:${needle}`} className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-5">
          {results.map((radical, i) => { const lesson = firstRadicalLesson(radical.id); const on = selected?.id === radical.id; return <motion.li key={radical.id}
            initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.28, ease: EASE, delay: Math.min(i, 24) * 0.015 }}><button type="button" aria-pressed={on} onClick={() => select(radical.id)}
            title={`${radical.writingGlyph} · ${radical.meaning}${lesson ? ` · ${lessonName(lesson)}` : ''}`}
            className={`relative flex w-full min-w-0 cursor-pointer flex-col items-center rounded-2xl p-3 text-center transition ${on ? 'bg-jade-soft ring-2 ring-jade' : 'bg-surface shadow-card hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0'}`}>
            <span className="absolute top-2 left-2.5 text-[10px] text-muted tabular-nums">{radical.id}</span>
            {learned.has(radical.id) && <span aria-label="Đã học" className="absolute top-2 right-2.5 text-xs font-bold text-jade">✓</span>}
            <span lang="zh-CN" className="font-han mt-2 text-4xl leading-tight">{radical.writingGlyph}</span>
            <span className="mt-1 w-full truncate text-sm font-medium">{radical.meaning}</span>
            <span className="w-full truncate text-[11px] text-muted">{lesson ? lessonName(lesson) : 'Ngoài giáo trình'}</span>
          </button></motion.li> })}
        </ul>
        {results.length === 0 && <Card className="p-6 text-center text-muted">{filter === 'learned' && !needle ? 'Bạn chưa học bộ nào. Học phần Bộ thủ trong bài đầu tiên để bắt đầu.' : 'Không tìm thấy bộ thủ phù hợp.'}</Card>}
      </section>

      <aside aria-label="Chi tiết bộ thủ" className="hidden xl:sticky xl:top-6 xl:block">
        {selected ? <RadicalEntry radical={selected} learned={learned.has(selected.id)} onClose={() => select(null)} />
          : <Card className="grid place-items-center gap-2 border-dashed p-10 text-center text-muted">
            <span aria-hidden="true" className="font-han text-5xl text-line">部</span>
            <p className="font-medium text-ink">Chọn một bộ để xem chi tiết</p>
            <p className="text-sm">Nghĩa, dạng biến thể, bài học có bộ này và sơ đồ các chữ ghép từ nó.</p>
          </Card>}
      </aside>
    </div>
    <PracticeSessions />
    {/* Below xl the detail opens as a sheet over the grid instead of pushing it down. */}
    {!wide && <Sheet open={!!selected} onClose={() => select(null)} label={selected ? `Bộ ${selected.writingGlyph}` : 'Chi tiết bộ thủ'}>
      {selected && <RadicalEntry radical={selected} learned={learned.has(selected.id)} onClose={() => select(null)} flat />}
    </Sheet>}
  </div>
}

/** The old 43 radical sessions, kept as optional writing practice outside the course path. */
function PracticeSessions() {
  const { lessonState } = useStudyData()
  return <Card className="px-5"><Disclosure summary={<span className="block py-3"><span className="block font-semibold">Luyện thêm viết bộ thủ</span><span className="text-sm text-muted">43 buổi, mỗi buổi 5 bộ · không bắt buộc, không nằm trong lộ trình</span></span>}>
    <ul className="grid gap-3 pb-5 sm:grid-cols-2 lg:grid-cols-3">{RADICAL_LESSONS.map((lesson) => <li key={lesson.id}><Link to={`/radicals/${lesson.id}`} className="block rounded-xl bg-sunken/70 p-4 transition hover:bg-sunken">
      <div className="flex justify-between gap-2"><span className="font-semibold">Buổi {lesson.number}</span>{lessonState.get(lesson.id)?.done.radical && <Badge tone="jade">✓ Đã luyện</Badge>}</div>
      <div lang="zh-CN" className="font-han mt-2 text-2xl tracking-widest">{lesson.radicals.map((radical) => radical.writingGlyph).join(' ')}</div>
    </Link></li>)}</ul>
  </Disclosure></Card>
}

type Stage = 'recognize' | 'animate' | 'trace' | 'recall' | 'family'
const STAGES: Stage[] = ['recognize', 'animate', 'trace', 'recall', 'family']
const STAGE_LABELS = ['Nhận diện', 'Xem nét', 'Viết theo mẫu', 'Tự viết', 'Ghép chữ']

export function RadicalLessonPage() {
  useStudyTimer()
  const { id = '' } = useParams()
  const location = useLocation()
  const lesson = RADICAL_LESSONS.find((item) => item.id === id)
  const { loaded, lessonState } = useStudyData()
  const [index, setIndex] = useState(0)
  const [stage, setStage] = useState<Stage>('recognize')
  const [answer, setAnswer] = useState<number | null>(null)
  const [mistakes, setMistakes] = useState<number | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [finished, setFinished] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const lock = useRef(false)
  useEffect(() => {
    const selected = Number(location.hash.match(/^#radical-(\d+)$/)?.[1])
    const nextIndex = lesson?.radicals.findIndex((radical) => radical.id === selected) ?? -1
    setIndex(nextIndex >= 0 ? nextIndex : 0)
    setStage('recognize'); setAnswer(null); setMistakes(null); setUnavailable(false); setFinished(false)
  }, [id, location.hash, lesson])
  if (!lesson) return <p className="pt-8">Không tìm thấy buổi bộ thủ.</p>
  if (!loaded) return <PageSkeleton />
  const radical = lesson.radicals[index]
  const choices = [radical, ...lesson.radicals.filter((item) => item.id !== radical.id).slice(0, 3)]
  const turn = radical.id % choices.length
  const options = [...choices.slice(turn), ...choices.slice(0, turn)]
  const nextLesson = RADICAL_LESSONS[lesson.number]
  const done = !!lessonState.get(lesson.id)?.done.radical
  // Rare radicals that build no course character skip the mindmap step.
  const hasFamily = radicalFamily(radical).some((m) => m.role !== 'self')
  const lastStep = index === lesson.radicals.length - 1 && (stage === 'family' || (stage === 'recall' && !hasFamily))
  const advance = async () => {
    const nextStage = STAGES[STAGES.indexOf(stage) + 1]
    if (nextStage && (nextStage !== 'family' || hasFamily)) { setStage(nextStage); setMistakes(null); setUnavailable(false); return }
    if (index < lesson.radicals.length - 1) { setIndex(index + 1); setStage('recognize'); setAnswer(null); setMistakes(null); setUnavailable(false); return }
    if (lock.current) return
    lock.current = true; setBusy(true); setError('')
    try {
      await markPart(lesson.id, 'radical')
      setFinished(true)
    } catch { setError('Chưa lưu được tiến độ. Hãy thử lại.') }
    finally { lock.current = false; setBusy(false) }
  }
  return <div className="mx-auto w-full max-w-3xl min-w-0 pt-5 pb-12 sm:pt-7">
    <header className="flex items-center gap-3">
      <Link to="/radicals" aria-label="Về từ điển bộ thủ" className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface text-muted transition-colors hover:text-ink">←</Link>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-jade">Luyện thêm bộ thủ</p>
        <h1 className="text-2xl font-semibold">Buổi {lesson.number} <span className="font-han font-normal tracking-widest text-muted">{lesson.radicals.map((r) => r.writingGlyph).join(' ')}</span></h1>
      </div>
      <span className="ml-auto shrink-0 text-sm text-muted tabular-nums">{done ? '✓ Đã luyện' : `Bộ ${index + 1}/${lesson.radicals.length}`}</span>
    </header>
    {finished ? <Card className="mt-6 p-6"><h2 className="text-xl font-bold text-jade">Đã hoàn thành buổi này</h2><p className="mt-2 text-muted">Tiến độ luyện bộ thủ đã được cập nhật.</p><div className="flex flex-wrap gap-3 mt-5"><Link to="/lesson"><Button>Tiếp tục lộ trình →</Button></Link>{nextLesson && <Link to={`/radicals/${nextLesson.id}`}><Button variant="secondary">Học thêm buổi bộ thủ tiếp theo</Button></Link>}</div></Card> : <>
      <ProgressBar value={(index * STAGES.length + STAGES.indexOf(stage)) / (lesson.radicals.length * STAGES.length)} className="mt-5 h-1.5" />
      <ol aria-label="Các bước" className="mt-3 flex flex-wrap gap-2 text-xs">{STAGE_LABELS.map((label, i) => <li key={label}><Badge tone={STAGES[i] === stage ? 'jade' : 'neutral'}>{i + 1}. {label}</Badge></li>)}</ol>
      <Card raised className="mt-4 p-5 sm:p-7">{stage === 'family' ? <RadicalMindmap key={radical.id} radical={radical} /> : stage === 'recall' && mistakes === null ? <div><p className="text-sm text-muted">Bộ {radical.id}/214 · viết từ trí nhớ</p><h2 className="text-xl font-bold mt-1">{radical.meaning}</h2><p className="text-sm text-muted mt-2">Sau khi viết, bạn sẽ thấy lại dạng chữ và ví dụ.</p></div> : <RadicalDetails radical={radical} />}</Card>
      <Card className="mt-4 p-5 sm:p-7">
        {stage === 'recognize' ? <><h3 className="font-bold">{radicalExample(radical.id) ? <>Chữ <span className="font-han text-xl">{radicalExample(radical.id)?.char}</span> thuộc bộ nào?</> : `Bộ nào mang nghĩa “${radical.meaning}”?`}</h3><div className="grid grid-cols-4 gap-2 mt-4">{options.map((option) => <Button key={option.id} variant={answer === option.id ? 'primary' : 'secondary'} onClick={() => { if (answer !== null) return; setAnswer(option.id) }} className="font-han !text-3xl min-h-11">{option.writingGlyph}</Button>)}</div>{answer !== null && <p role="status" className={`mt-3 text-sm ${answer === radical.id ? 'text-jade' : 'text-cinnabar'}`}>{answer === radical.id ? 'Đúng rồi.' : `Đáp án là ${radical.writingGlyph}. Hãy nhìn lại dạng gốc và biến thể.`}</p>}</> : stage === 'family' ? <><ComposeQuiz key={radical.id} radical={radical} /><p className="mt-4 text-sm text-muted">Phần ghép chữ chỉ để luyện, không ảnh hưởng tiến độ.</p></> : <><h3 className="font-bold">{stage === 'animate' ? 'Xem cách viết từng nét' : stage === 'trace' ? 'Viết theo nét chữ' : 'Che mẫu và viết từ trí nhớ'}</h3><div className="flex justify-center mt-4">
          {unavailable && stage !== 'animate' ? <FreehandWriter key={`${radical.id}-${stage}`} glyph={radical.writingGlyph} showModel={stage === 'trace'} onComplete={(remembered) => setMistakes(remembered ? 0 : 4)} /> : unavailable ? <div className="font-han text-8xl py-8">{radical.writingGlyph}</div> : <StrokeWriter key={`${radical.id}-${stage}`} char={radical.writingGlyph} mode={stage} onUnavailable={() => setUnavailable(true)} onComplete={setMistakes} />}
        </div>{mistakes !== null && <p role="status" className="text-center mt-3 text-sm">{mistakes === 0 ? 'Đã viết xong.' : `${mistakes} nét sai hoặc cần luyện thêm.`}</p>}{stage !== 'animate' && mistakes === null && <Button variant="ghost" className="mt-3" onClick={() => setMistakes(4)}>Chưa thể viết, bỏ qua bước này</Button>}</>}
        {error && <p role="alert" className="text-cinnabar mt-3">{error}</p>}
        {(stage === 'animate' || stage === 'family' || (stage === 'recognize' && answer !== null) || (stage !== 'recognize' && mistakes !== null)) && <Button className="mt-5" disabled={busy} onClick={advance}>{busy ? 'Đang lưu…' : lastStep ? 'Hoàn thành buổi' : 'Bước tiếp theo →'}</Button>}
      </Card>
    </>}
  </div>
}
