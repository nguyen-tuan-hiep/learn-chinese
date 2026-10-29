import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Button, Card } from '@/components/ui/Button'
import { StrokeWriter } from '@/components/hanzi/StrokeWriter'
import { FreehandWriter } from '@/components/hanzi/FreehandWriter'
import { CORE_RADICALS, RADICALS, RADICAL_LESSONS, radicalLesson, type Radical } from '@/data/radicals'
import { radicalExample, radicalPosition } from '@/lib/radicalExamples'
import { markPart } from '@/lib/lessonState'
import { introduce } from '@/lib/srs'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'

function RadicalDetails({ radical }: { radical: Radical }) {
  const example = radicalExample(radical.id)
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
      {example ? <>Trong giáo trình, <span className="font-han text-xl">{example.char}</span> thuộc bộ <span className="font-han text-xl">{radical.glyph}</span>; gặp trong <span className="font-han">{example.word.hanzi}</span> ({example.word.meaning}).</> : <>Chữ mẫu <span className="font-han text-xl">{radical.glyph}</span> mang nghĩa “{radical.meaning}”. Bộ này chưa xuất hiện trong giáo trình HSK hiện có.</>}
    </p>
  </div>
}

export function RadicalsPage() {
  const { lessonState } = useStudyData()
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const completed = RADICAL_LESSONS.filter((lesson) => !!lessonState.get(lesson.id)?.done.radical).length
  const coreDone = RADICAL_LESSONS.slice(0, 8).filter((lesson) => !!lessonState.get(lesson.id)?.done.radical).length
  const next = RADICAL_LESSONS.find((lesson) => !lessonState.get(lesson.id)?.done.radical)
  const needle = query.trim().toLocaleLowerCase('vi-VN')
  const results = needle ? RADICALS.filter((radical) =>
    String(radical.id) === needle || [radical.glyph, radical.meaning, ...radical.variants].some((value) => value.toLocaleLowerCase('vi-VN').includes(needle))) : showAll ? RADICALS : CORE_RADICALS
  return <div className="max-w-4xl pt-6 pb-12">
    <h1 className="text-2xl font-bold">Học bộ thủ</h1>
    <p className="text-muted mt-2">Học 40 bộ thường gặp trước, rồi học tiếp đủ 214 bộ song song với HSK. Bộ thủ giúp tìm và nhận mặt chữ; một chữ còn có thể chứa các thành phần khác.</p>
    <Card className="mt-6 p-5 flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-48"><p className="font-bold">{coreDone}/8 buổi cốt lõi · {completed}/43 buổi tất cả</p><p className="text-sm text-muted mt-1">Mỗi buổi 5 bộ: nhận diện, xem nét, tô và tự viết.</p></div>
      {next && <Link to={`/radicals/${next.id}`}><Button>{completed ? 'Học buổi tiếp theo →' : 'Bắt đầu bộ thủ →'}</Button></Link>}
    </Card>
    <h2 className="text-lg font-bold mt-8">Các buổi học</h2>
    <div className="grid sm:grid-cols-2 gap-3 mt-3">
      {RADICAL_LESSONS.slice(0, 8).map((lesson) => <Link key={lesson.id} to={`/radicals/${lesson.id}`} className="block rounded-xl border border-line bg-surface p-4 hover:bg-sunken transition">
        <div className="flex justify-between gap-2"><span className="font-semibold">Buổi {lesson.number}{lesson.core ? ' · Cốt lõi' : ''}</span><span className="text-sm text-jade">{lessonState.get(lesson.id)?.done.radical ? '✓ Đã học' : ''}</span></div>
        <div className="font-han text-2xl mt-2 tracking-widest">{lesson.radicals.map((radical) => radical.writingGlyph).join(' ')}</div>
      </Link>)}
    </div>
    <details className="mt-5 rounded-xl border border-line bg-surface p-4"><summary className="cursor-pointer font-semibold">35 buổi mở rộng · 174 bộ còn lại</summary>
      <div className="grid sm:grid-cols-2 gap-3 mt-4">{RADICAL_LESSONS.slice(8).map((lesson) => <Link key={lesson.id} to={`/radicals/${lesson.id}`} className="block rounded-xl border border-line bg-paper p-4 hover:bg-sunken transition">
        <div className="flex justify-between gap-2"><span className="font-semibold">Buổi {lesson.number}</span><span className="text-sm text-jade">{lessonState.get(lesson.id)?.done.radical ? '✓ Đã học' : ''}</span></div>
        <div className="font-han text-2xl mt-2 tracking-widest">{lesson.radicals.map((radical) => radical.writingGlyph).join(' ')}</div>
      </Link>)}</div>
    </details>
    <h2 className="text-lg font-bold mt-10">Tra cứu 214 bộ</h2>
    <label className="block mt-3 text-sm font-semibold">Tìm theo hình, nghĩa hoặc số thứ tự
      <input value={query} onChange={(e) => setQuery(e.target.value)} className="block mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink" placeholder="Ví dụ: nước, 氵, 85" />
    </label>
    <p className="text-sm text-muted mt-3">{needle ? `${results.length} bộ phù hợp` : showAll ? 'Tất cả 214 bộ' : '40 bộ cốt lõi · tìm kiếm để tra cứu cả 214 bộ'}</p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
      {results.map((radical) => <Link key={radical.id} to={`/radicals/${radicalLesson(radical.id)?.id}#radical-${radical.id}`} className="rounded-xl border border-line bg-surface p-3 hover:bg-sunken transition">
        <span className="text-xs text-muted">#{radical.id}</span><div className="font-han text-3xl">{radical.writingGlyph}</div><div className="text-sm font-medium">{radical.meaning}</div>{radical.variants.length > 0 && <div className="font-han text-sm text-muted mt-1">{radical.variants.join(' ')}</div>}
      </Link>)}
    </div>
    {results.length === 0 && <p className="text-muted mt-4">Không tìm thấy bộ thủ phù hợp.</p>}
    {!needle && <Button variant="secondary" className="mt-4" onClick={() => setShowAll((value) => !value)}>{showAll ? 'Thu gọn danh sách' : 'Xem đủ 214 bộ'}</Button>}
    <p className="text-xs text-muted mt-6">40 bộ cốt lõi: {CORE_RADICALS.map((radical) => radical.glyph).join(' ')}</p>
  </div>
}

type Stage = 'recognize' | 'animate' | 'trace' | 'recall'
const STAGES: Stage[] = ['recognize', 'animate', 'trace', 'recall']

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
  const advance = async () => {
    const stageIndex = STAGES.indexOf(stage)
    if (stageIndex < STAGES.length - 1) { setStage(STAGES[stageIndex + 1]); setMistakes(null); setUnavailable(false); return }
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
  return <div className="max-w-3xl pt-6 pb-12">
    <Link to="/radicals" className="text-sm text-muted underline">← Tất cả bộ thủ</Link>
    <h1 className="text-2xl font-bold mt-3">Buổi {lesson.number} · {lesson.core ? 'Bộ cốt lõi' : 'Mở rộng'}</h1>
    <p className="text-muted mt-1">{lesson.radicals.length} bộ · {done ? 'Đã hoàn thành, có thể luyện lại' : `Bộ ${index + 1}/${lesson.radicals.length}`}</p>
    {finished ? <Card className="mt-6 p-6"><h2 className="text-xl font-bold text-jade">Đã hoàn thành buổi này</h2><p className="mt-2 text-muted">Các bộ đã được thêm vào lịch ôn tập.</p><div className="flex flex-wrap gap-3 mt-5">{nextLesson && <Link to={`/radicals/${nextLesson.id}`}><Button>Buổi tiếp theo →</Button></Link>}<Link to={lesson.number === 8 ? '/lesson/hsk1-01' : '/radicals'}><Button variant="secondary">{lesson.number === 8 ? 'Vào HSK 1' : 'Về danh mục'}</Button></Link></div></Card> : <>
      <div className="h-1.5 rounded-full bg-line mt-5 overflow-hidden"><div className="h-full bg-jade" style={{ width: `${((index * 4 + STAGES.indexOf(stage)) / (lesson.radicals.length * 4)) * 100}%` }} /></div>
      <p className="text-sm font-semibold text-muted mt-3">{stage === 'recognize' ? '1. Nhận diện' : stage === 'animate' ? '2. Xem thứ tự nét' : stage === 'trace' ? '3. Tô theo mẫu' : '4. Tự viết lại'}</p>
      <Card className="mt-4 p-5 sm:p-7">{stage === 'recall' && mistakes === null ? <div><p className="text-sm text-muted">Bộ {radical.id}/214 · viết từ trí nhớ</p><h2 className="text-xl font-bold mt-1">{radical.meaning}</h2><p className="text-sm text-muted mt-2">Sau khi viết, bạn sẽ thấy lại dạng chữ và ví dụ.</p></div> : <RadicalDetails radical={radical} />}</Card>
      <Card className="mt-4 p-5 sm:p-7">
        {stage === 'recognize' ? <><h3 className="font-bold">{radicalExample(radical.id) ? <>Chữ <span className="font-han text-xl">{radicalExample(radical.id)?.char}</span> thuộc bộ nào?</> : `Bộ nào mang nghĩa “${radical.meaning}”?`}</h3><div className="grid grid-cols-4 gap-2 mt-4">{options.map((option) => <Button key={option.id} variant={answer === option.id ? 'primary' : 'secondary'} onClick={() => { if (answer !== null) return; setAnswer(option.id); if (option.id !== radical.id) firstTry.current.set(radical.id, false) }} className="font-han text-3xl min-h-11">{option.writingGlyph}</Button>)}</div>{answer !== null && <p role="status" className={`mt-3 text-sm ${answer === radical.id ? 'text-jade' : 'text-cinnabar'}`}>{answer === radical.id ? 'Đúng rồi.' : `Đáp án là ${radical.writingGlyph}. Hãy nhìn lại dạng gốc và biến thể.`}</p>}</> : <><h3 className="font-bold">{stage === 'animate' ? 'Xem cách viết từng nét' : stage === 'trace' ? 'Tô theo nét chữ' : 'Che mẫu và viết từ trí nhớ'}</h3><div className="flex justify-center mt-4">
          {unavailable && stage !== 'animate' ? <FreehandWriter key={`${radical.id}-${stage}`} glyph={radical.writingGlyph} showModel={stage === 'trace'} onComplete={(remembered) => { setMistakes(remembered ? 0 : 4); if (stage === 'recall') firstTry.current.set(radical.id, firstTry.current.get(radical.id) !== false && remembered) }} /> : unavailable ? <div className="font-han text-8xl py-8">{radical.writingGlyph}</div> : <StrokeWriter key={`${radical.id}-${stage}`} char={radical.writingGlyph} mode={stage} onUnavailable={() => setUnavailable(true)} onComplete={(count) => { setMistakes(count); if (stage === 'recall') firstTry.current.set(radical.id, firstTry.current.get(radical.id) !== false && count <= 2) }} />}
        </div>{mistakes !== null && <p role="status" className="text-center mt-3 text-sm">{mistakes === 0 ? 'Đã viết xong.' : `${mistakes} nét sai hoặc cần luyện thêm.`}</p>}{stage !== 'animate' && mistakes === null && <Button variant="ghost" className="mt-3" onClick={() => { setMistakes(4); if (stage === 'recall') firstTry.current.set(radical.id, false) }}>Chưa thể viết, để ôn lại</Button>}</>}
        {error && <p role="alert" className="text-cinnabar mt-3">{error}</p>}
        {(stage === 'animate' || (stage === 'recognize' && answer !== null) || (stage !== 'recognize' && mistakes !== null)) && <Button className="mt-5" disabled={busy} onClick={advance}>{busy ? 'Đang lưu…' : stage === 'recall' && index === lesson.radicals.length - 1 ? 'Hoàn thành buổi' : 'Bước tiếp theo →'}</Button>}
      </Card>
    </>}
  </div>
}
