import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { Button, Card } from '@/components/ui/Button'
import { StrokeWriter } from '@/components/hanzi/StrokeWriter'
import { FreehandWriter } from '@/components/hanzi/FreehandWriter'
import { RADICALS, RADICAL_BY_ID, RADICAL_LESSONS, radicalLesson, type Radical } from '@/data/radicals'
import { TAUGHT_RADICALS } from '@/lib/lessonRadicals'
import { firstRadicalLesson } from '@/lib/lessonRadicalStudy'
import { lessonName } from '@/data/course'
import { radicalExample, radicalPosition } from '@/lib/radicalExamples'
import { radicalFamily } from '@/lib/radicalFamily'
import { RadicalMindmap } from '@/components/hanzi/RadicalMindmap'
import { ComposeQuiz } from '@/components/lesson/ComposeQuiz'
import { markPart, lessonPartLink } from '@/lib/lessonState'
import { introduce } from '@/lib/srs'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'

function RadicalDetails({ radical, semanticOnly = false }: { radical: Radical; semanticOnly?: boolean }) {
  const example = radicalExample(radical.id)
  const family = radicalFamily(radical).filter((m) => semanticOnly ? m.role === 'semantic' : m.role !== 'self')
  return <div id={`radical-${radical.id}`} className="scroll-mt-24">
    <div className="flex gap-4 items-start">
      <span className="font-han text-7xl leading-none">{radical.writingGlyph}</span>
      <div className="min-w-0">
        <p className="text-sm text-muted">Bộ {radical.id}/214 · {radical.strokes} nét</p>
        <h2 className="text-xl font-bold mt-1">{radical.meaning}</h2>
        <p className="text-sm mt-1">Dạng gốc: <span className="font-han text-xl">{radical.glyph}</span>{radical.variants.length > 0 && <> · Dạng khác: <span className="font-han text-xl">{radical.variants.join(' · ')}</span></>}</p>
        <p className="text-sm text-muted mt-1">Vị trí thường gặp: {radicalPosition(radical.variants)}</p>
      </div>
    </div>
    <p className="mt-4 rounded-xl bg-sunken px-4 py-3 text-sm">
      {semanticOnly ? (family.length > 0 ? <>Bộ <span className="font-han text-xl">{radical.writingGlyph}</span> có vai trò gợi nghĩa trong <b>{family.length} chữ</b> của giáo trình: <span className="font-han text-lg">{family.slice(0, 6).map((member) => member.char).join(' ')}</span>{family.length > 6 && '…'}. Chọn chữ trong sơ đồ bên dưới để xem từ ví dụ.</> : <>Chưa có chữ trong dữ liệu hiện tại được xác định bộ này có vai trò gợi nghĩa.</>) : <>
      {example ? <>Trong giáo trình, <span className="font-han text-xl">{example.char}</span> thuộc bộ <span className="font-han text-xl">{radical.glyph}</span>; gặp trong <span className="font-han">{example.word.hanzi}</span> ({example.word.meaning}).</> : <>Chữ mẫu <span className="font-han text-xl">{radical.glyph}</span> mang nghĩa “{radical.meaning}”. Bộ này chưa xuất hiện trong giáo trình HSK hiện có.</>}
      {family.length > 1 && <> Bộ này ghép ra <b>{family.length} chữ</b> trong giáo trình, như <span className="font-han text-lg">{family.slice(0, 6).map((m) => m.char).join(' ')}</span>.</>}
      </>}
    </p>
  </div>
}

/** Dictionary entry: course links and characters where this radical has a documented semantic role. */
function RadicalEntry({ radical, learned }: { radical: Radical; learned: boolean }) {
  const lesson = firstRadicalLesson(radical.id)
  const practice = radicalLesson(radical.id)
  const hasSemanticFamily = radicalFamily(radical).some((member) => member.role === 'semantic')
  return <Card className="mt-4 p-5 sm:p-7" aria-label={`Bộ ${radical.writingGlyph}`}>
    <RadicalDetails radical={radical} semanticOnly />
    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
      {lesson ? <Link to={lessonPartLink(lesson.id, 'chars')} className="rounded-xl bg-jade text-white dark:text-paper px-3 py-2 font-semibold">Học ở {lessonName(lesson)} →</Link> : <span className="text-muted">Bộ này chưa được dạy trong giáo trình hiện có.</span>}
      {learned && <span className="rounded-md bg-jade-soft text-jade px-2 py-1 text-xs font-semibold">✓ Đã có trong lịch ôn</span>}
      {practice && <Link to={`/radicals/${practice.id}#radical-${radical.id}`} className="underline text-muted">Luyện viết thêm</Link>}
    </div>
    {hasSemanticFamily && <div className="mt-6"><RadicalMindmap key={radical.id} radical={radical} semanticOnly /></div>}
  </Card>
}

export function RadicalsPage() {
  const { cards } = useStudyData()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const learned = new Set(cards.filter((c) => c.kind === 'radical').map((c) => Number(c.ref)))
  const selected = RADICAL_BY_ID.get(Number(params.get('r')))
  const needle = query.trim().toLocaleLowerCase('vi-VN')
  const results = needle ? RADICALS.filter((radical) =>
    String(radical.id) === needle || [radical.glyph, radical.meaning, ...radical.variants].some((value) => value.toLocaleLowerCase('vi-VN').includes(needle))) : showAll ? RADICALS : TAUGHT_RADICALS
  const known = TAUGHT_RADICALS.filter((r) => learned.has(r.id)).length
  return <div className="w-full min-w-0 pt-6 pb-12">
    <h1 className="text-2xl font-bold">Từ điển bộ thủ</h1>
    <p className="text-muted mt-2">Bộ thủ được dạy ngay trong phần <b className="text-ink">Chữ & bộ thủ</b> ở đầu mỗi bài HSK, đúng những bộ có trong chữ của bài. Trang này để tra cứu một bộ, xem nó ghép ra những chữ nào, và luyện viết thêm khi muốn.</p>
    <Card className="mt-6 p-5 flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-48"><p className="font-bold tabular-nums">Đã học {known}/{TAUGHT_RADICALS.length} bộ trong giáo trình</p><p className="text-sm text-muted mt-1">Số bộ tăng dần khi bạn học tab Bộ thủ của từng bài.</p></div>
      <Link to="/course"><Button>Tiếp tục lộ trình →</Button></Link>
    </Card>
    <h2 className="text-lg font-bold mt-8">Tra cứu</h2>
    <label className="block mt-3 text-sm font-semibold">Tìm theo hình, nghĩa hoặc số thứ tự
      <input value={query} onChange={(e) => setQuery(e.target.value)} className="block mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink" placeholder="Ví dụ: nước, 氵, 85" />
    </label>
    <p className="text-sm text-muted mt-3">{needle ? `${results.length} bộ phù hợp` : showAll ? 'Tất cả 214 bộ' : `${TAUGHT_RADICALS.length} bộ trong giáo trình, theo thứ tự bài · tìm kiếm để tra cả 214 bộ`}</p>
    {selected && <RadicalEntry radical={selected} learned={learned.has(selected.id)} />}
    <div aria-label="Danh sách bộ thủ" className="grid grid-cols-4 gap-2 mt-3">
      {results.map((radical) => { const lesson = firstRadicalLesson(radical.id); return <button key={radical.id} type="button" aria-pressed={selected?.id === radical.id} onClick={() => { setParams({ r: String(radical.id) }, { replace: true }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        title={`${radical.writingGlyph} · ${radical.meaning}${lesson ? ` · ${lessonName(lesson)}` : ''}`} className={`min-w-0 text-left rounded-xl border p-2 sm:p-3 transition ${selected?.id === radical.id ? 'border-ink bg-sunken' : 'border-line bg-surface hover:bg-sunken'}`}>
        <span className="flex justify-between text-xs text-muted"><span>#{radical.id}</span>{learned.has(radical.id) && <span className="text-jade font-semibold">✓</span>}</span>
        <div className="font-han text-3xl">{radical.writingGlyph}</div><div className="truncate text-xs font-medium sm:text-sm">{radical.meaning}</div>
        <div className="truncate text-[10px] sm:text-xs text-muted mt-1">{lesson ? lessonName(lesson) : 'Chưa có trong giáo trình'}</div>
      </button> })}
    </div>
    {results.length === 0 && <p className="text-muted mt-4">Không tìm thấy bộ thủ phù hợp.</p>}
    {!needle && <Button variant="secondary" className="mt-4" onClick={() => setShowAll((value) => !value)}>{showAll ? 'Chỉ xem bộ trong giáo trình' : 'Xem đủ 214 bộ'}</Button>}
    <PracticeSessions />
  </div>
}

/** The old 43 radical sessions, kept as optional writing practice outside the course path. */
function PracticeSessions() {
  const { lessonState } = useStudyData()
  return <details className="mt-10 rounded-xl border border-line bg-surface p-4"><summary className="cursor-pointer font-semibold">Luyện thêm viết bộ thủ · 43 buổi, không bắt buộc</summary>
    <p className="text-sm text-muted mt-2">Mỗi buổi 5 bộ: nhận diện, xem nét, tô, tự viết và sơ đồ chữ. Không nằm trong lộ trình.</p>
    <div className="grid sm:grid-cols-2 gap-3 mt-4">{RADICAL_LESSONS.map((lesson) => <Link key={lesson.id} to={`/radicals/${lesson.id}`} className="block rounded-xl border border-line bg-paper p-4 hover:bg-sunken transition">
      <div className="flex justify-between gap-2"><span className="font-semibold">Buổi {lesson.number}</span><span className="text-sm text-jade">{lessonState.get(lesson.id)?.done.radical ? '✓ Đã luyện' : ''}</span></div>
      <div className="font-han text-2xl mt-2 tracking-widest">{lesson.radicals.map((radical) => radical.writingGlyph).join(' ')}</div>
    </Link>)}</div>
  </details>
}

type Stage = 'recognize' | 'animate' | 'trace' | 'recall' | 'family'
const STAGES: Stage[] = ['recognize', 'animate', 'trace', 'recall', 'family']

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
  const firstTry = useRef(new Map<number, boolean>())
  const lock = useRef(false)
  useEffect(() => {
    const selected = Number(location.hash.match(/^#radical-(\d+)$/)?.[1])
    const nextIndex = lesson?.radicals.findIndex((radical) => radical.id === selected) ?? -1
    setIndex(nextIndex >= 0 ? nextIndex : 0)
    setStage('recognize'); setAnswer(null); setMistakes(null); setUnavailable(false); setFinished(false)
    firstTry.current = new Map()
  }, [id, location.hash, lesson])
  if (!lesson) return <p className="pt-8">Không tìm thấy buổi bộ thủ.</p>
  if (!loaded) return <p role="status" className="pt-8">Đang tải tiến độ…</p>
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
      await introduce(lesson.radicals.map((item) => ({ kind: 'radical' as const, ref: String(item.id), lessonId: lesson.id, firstTry: firstTry.current.get(item.id) ?? false })))
      await markPart(lesson.id, 'radical')
      setFinished(true)
    } catch { setError('Chưa lưu được tiến độ. Hãy thử lại.') }
    finally { lock.current = false; setBusy(false) }
  }
  return <div className="w-full min-w-0 pt-6 pb-12">
    <Link to="/radicals" className="text-sm text-muted underline">← Từ điển bộ thủ</Link>
    <h1 className="text-2xl font-bold mt-3">Luyện thêm · Buổi {lesson.number}</h1>
    <p className="text-muted mt-1">{lesson.radicals.length} bộ · {done ? 'Đã hoàn thành, có thể luyện lại' : `Bộ ${index + 1}/${lesson.radicals.length}`}</p>
    {finished ? <Card className="mt-6 p-6"><h2 className="text-xl font-bold text-jade">Đã hoàn thành buổi này</h2><p className="mt-2 text-muted">Các bộ đã được thêm vào lịch ôn tập.</p><div className="flex flex-wrap gap-3 mt-5"><Link to="/course"><Button>Tiếp tục lộ trình →</Button></Link>{nextLesson && <Link to={`/radicals/${nextLesson.id}`}><Button variant="secondary">Học thêm buổi bộ thủ tiếp theo</Button></Link>}</div></Card> : <>
      <div className="h-1.5 rounded-full bg-line mt-5 overflow-hidden"><div className="h-full bg-jade" style={{ width: `${((index * STAGES.length + STAGES.indexOf(stage)) / (lesson.radicals.length * STAGES.length)) * 100}%` }} /></div>
      <p className="text-sm font-semibold text-muted mt-3">{stage === 'recognize' ? '1. Nhận diện' : stage === 'animate' ? '2. Xem thứ tự nét' : stage === 'trace' ? '3. Tô theo mẫu' : stage === 'recall' ? '4. Tự viết lại' : '5. Ghép chữ & sơ đồ'}</p>
      <Card className="mt-4 p-5 sm:p-7">{stage === 'family' ? <RadicalMindmap key={radical.id} radical={radical} /> : stage === 'recall' && mistakes === null ? <div><p className="text-sm text-muted">Bộ {radical.id}/214 · viết từ trí nhớ</p><h2 className="text-xl font-bold mt-1">{radical.meaning}</h2><p className="text-sm text-muted mt-2">Sau khi viết, bạn sẽ thấy lại dạng chữ và ví dụ.</p></div> : <RadicalDetails radical={radical} />}</Card>
      <Card className="mt-4 p-5 sm:p-7">
        {stage === 'recognize' ? <><h3 className="font-bold">{radicalExample(radical.id) ? <>Chữ <span className="font-han text-xl">{radicalExample(radical.id)?.char}</span> thuộc bộ nào?</> : `Bộ nào mang nghĩa “${radical.meaning}”?`}</h3><div className="grid grid-cols-4 gap-2 mt-4">{options.map((option) => <Button key={option.id} variant={answer === option.id ? 'primary' : 'secondary'} onClick={() => { if (answer !== null) return; setAnswer(option.id); if (option.id !== radical.id) firstTry.current.set(radical.id, false) }} className="font-han !text-3xl min-h-11">{option.writingGlyph}</Button>)}</div>{answer !== null && <p role="status" className={`mt-3 text-sm ${answer === radical.id ? 'text-jade' : 'text-cinnabar'}`}>{answer === radical.id ? 'Đúng rồi.' : `Đáp án là ${radical.writingGlyph}. Hãy nhìn lại dạng gốc và biến thể.`}</p>}</> : stage === 'family' ? <><ComposeQuiz key={radical.id} radical={radical} /><p className="mt-4 text-sm text-muted">Phần ghép chữ chỉ để luyện, không ảnh hưởng lịch ôn.</p></> : <><h3 className="font-bold">{stage === 'animate' ? 'Xem cách viết từng nét' : stage === 'trace' ? 'Tô theo nét chữ' : 'Che mẫu và viết từ trí nhớ'}</h3><div className="flex justify-center mt-4">
          {unavailable && stage !== 'animate' ? <FreehandWriter key={`${radical.id}-${stage}`} glyph={radical.writingGlyph} showModel={stage === 'trace'} onComplete={(remembered) => { setMistakes(remembered ? 0 : 4); if (stage === 'recall') firstTry.current.set(radical.id, firstTry.current.get(radical.id) !== false && remembered) }} /> : unavailable ? <div className="font-han text-8xl py-8">{radical.writingGlyph}</div> : <StrokeWriter key={`${radical.id}-${stage}`} char={radical.writingGlyph} mode={stage} onUnavailable={() => setUnavailable(true)} onComplete={(count) => { setMistakes(count); if (stage === 'recall') firstTry.current.set(radical.id, firstTry.current.get(radical.id) !== false && count <= 2) }} />}
        </div>{mistakes !== null && <p role="status" className="text-center mt-3 text-sm">{mistakes === 0 ? 'Đã viết xong.' : `${mistakes} nét sai hoặc cần luyện thêm.`}</p>}{stage !== 'animate' && mistakes === null && <Button variant="ghost" className="mt-3" onClick={() => { setMistakes(4); if (stage === 'recall') firstTry.current.set(radical.id, false) }}>Chưa thể viết, để ôn lại</Button>}</>}
        {error && <p role="alert" className="text-cinnabar mt-3">{error}</p>}
        {(stage === 'animate' || stage === 'family' || (stage === 'recognize' && answer !== null) || (stage !== 'recognize' && mistakes !== null)) && <Button className="mt-5" disabled={busy} onClick={advance}>{busy ? 'Đang lưu…' : lastStep ? 'Hoàn thành buổi' : 'Bước tiếp theo →'}</Button>}
      </Card>
    </>}
  </div>
}
