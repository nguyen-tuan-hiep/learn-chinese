import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LESSONS } from '@/data/course'
import type { CourseLesson } from '@/data/types'
import type { Radical } from '@/data/radicals'
import { Button, Card } from '@/components/ui/Button'
import { ColoredHanzi, KNOWN_COLOR, lessonHighlight, TAUGHT_COLOR } from '@/components/hanzi/ColoredHanzi'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { RadicalMindmap } from '@/components/hanzi/RadicalMindmap'
import { StrokeWriter } from '@/components/hanzi/StrokeWriter'
import { charInfo } from '@/lib/chars'
import { lessonRadicals, phoneticFamilies, type PhoneticFamily } from '@/lib/lessonRadicals'
import { CHAR_NOTES } from '@/data/charNotes'
import { radicalPosition } from '@/lib/radicalExamples'
import { radicalFamily } from '@/lib/radicalFamily'
import { introduce } from '@/lib/srs'
import { useStudyData } from '@/lib/useStudyData'

type Step = 'learn' | 'trace' | 'map'
const STEPS: [Step, string][] = [['learn', 'Làm quen & xem nét'], ['trace', 'Tô theo mẫu'], ['map', 'Sơ đồ chữ']]

function Legend() {
  return <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
    <span><span className="inline-block size-2.5 rounded-full align-middle mr-1" style={{ background: TAUGHT_COLOR }} />bộ học hôm nay</span>
    <span><span className="inline-block size-2.5 rounded-full align-middle mr-1" style={{ background: KNOWN_COLOR }} />bộ đã học</span>
    <span><span className="inline-block size-2.5 rounded-full align-middle mr-1 bg-ink" />phần học sau</span>
  </p>
}

/** First part of every lesson: the radicals inside this lesson's new characters, taught where they are used. */
export function CharsPart({ lesson, completed, onComplete }: { lesson: CourseLesson; completed: boolean; onComplete: () => void | Promise<void> }) {
  const { cards } = useStudyData()
  const info = lessonRadicals(lesson.id)!
  const highlight = lessonHighlight(lesson.id)
  const [index, setIndex] = useState(-1) // -1 = overview
  const [step, setStep] = useState(0)
  const [traced, setTraced] = useState<number | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [finished, setFinished] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const firstTry = useRef(new Map<number, boolean>())
  const lock = useRef(false)
  const reviewing = new Set(cards.filter((c) => c.kind === 'radical').map((c) => Number(c.ref)))
  const taught = info.taught
  const lessonIndex = LESSONS.indexOf(lesson)
  // From HSK 4 on, most radicals are known; sound-part families carry the new insight.
  const families = lesson.level > 3 ? phoneticFamilies(lesson.id) : []
  const [showFamilies, setShowFamilies] = useState(false)

  const save = async () => {
    if (lock.current) return
    lock.current = true; setBusy(true); setError('')
    try {
      await introduce(taught.map((r) => ({ kind: 'radical' as const, ref: String(r.id), lessonId: lesson.id, firstTry: firstTry.current.get(r.id) ?? true })))
      await onComplete()
      setFinished(true)
    } catch { setError('Chưa lưu được tiến độ. Hãy thử lại.') }
    finally { lock.current = false; setBusy(false) }
  }
  const next = () => {
    setTraced(null); setUnavailable(false)
    if (index >= 0 && step < STEPS.length - 1) return setStep(step + 1)
    if (index < taught.length - 1) { setIndex(index + 1); setStep(0); return }
    if (families.length && !showFamilies) return setShowFamilies(true)
    void save()
  }

  if (finished) return <Card className="p-6 text-center">
    <p className="font-semibold text-jade">{taught.length ? `Đã học ${taught.length} bộ: ${taught.map((r) => r.writingGlyph).join(' ')}` : 'Đã xem cấu tạo chữ của bài'}</p>
    <p className="text-sm text-muted mt-1">{taught.length ? 'Các bộ đã vào lịch ôn. Ở phần Từ vựng, bộ vừa học được tô màu ngay trong chữ.' : 'Bài này không có bộ mới.'}</p>
    <Link to={`/lesson/${lesson.id}?part=vocab`} className="inline-block mt-4 rounded-xl bg-jade text-white dark:text-paper px-4 py-3 text-sm font-semibold">Sang phần Từ vựng →</Link>
  </Card>

  if (showFamilies) return <Card className="p-5 sm:p-7">
    <h2 className="text-lg font-bold">Họ âm: đoán cách đọc qua phần âm</h2>
    <p className="text-sm text-muted mt-1">Chữ hình thanh có một phần gợi âm. Chữ mới trong bài dùng chung phần âm với những chữ bạn đã biết, nên cách đọc thường gần nhau.</p>
    <div className="mt-4 space-y-4">{families.map((f) => <PhoneticFamilyCard key={f.phonetic} family={f} />)}</div>
    {error && <p role="alert" className="mt-3 text-sm text-cinnabar">{error}</p>}
    <Button className="mt-5" disabled={busy} onClick={next}>{busy ? 'Đang lưu…' : 'Hoàn thành phần này'}</Button>
  </Card>

  if (index < 0) return <Card className="p-5 sm:p-7">
    <h2 className="text-lg font-bold">{info.chars.length} chữ mới trong bài, {taught.length ? <>học {taught.length} bộ hôm nay: <span className="font-han" style={{ color: TAUGHT_COLOR }}>{taught.map((r) => r.writingGlyph).join(' ')}</span></> : 'không có bộ mới'}</h2>
    {info.known.length > 0 && <p className="text-sm mt-1">Bộ bạn đã học xuất hiện lại: <span className="font-han" style={{ color: KNOWN_COLOR }}>{info.known.map((r) => r.writingGlyph).join(' ')}</span></p>}
    <p className="text-sm text-muted mt-2">Mỗi chữ được ghép từ các bộ. Nhìn màu để thấy bộ nằm ở đâu trong chữ.</p>
    <div className="mt-3"><Legend /></div>
    <ul className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">{info.chars.map(({ char, radicals }) => <li key={char} className="rounded-xl bg-sunken p-2 flex flex-col items-center text-center">
      <ColoredHanzi char={char} highlight={highlight} size={64} />
      <span className="text-xs text-muted mt-1 line-clamp-1">{charInfo(char).words.find((w) => w.lesson === lesson)?.word.meaning}</span>
      <span className="mt-1 flex flex-wrap justify-center gap-1">{radicals.map(({ radical, glyph, status }) => <span key={radical.id} className="font-han text-sm rounded px-1" style={{ color: status === 'taught' ? TAUGHT_COLOR : status === 'known' ? KNOWN_COLOR : undefined }} title={radical.meaning}>{glyph}</span>)}</span>
    </li>)}</ul>
    {info.later.length > 0 && <p className="text-xs text-muted mt-3">Gặp ở bài sau: <span className="font-han">{info.later.map((r) => r.writingGlyph).join(' ')}</span></p>}
    {error && <p role="alert" className="mt-3 text-sm text-cinnabar">{error}</p>}
    <Button className="mt-5" disabled={busy} onClick={next}>{taught.length ? `Học bộ đầu tiên: ${taught[0].writingGlyph} →` : families.length ? 'Xem họ âm →' : completed ? 'Xong' : 'Hoàn thành phần này'}</Button>
  </Card>

  const radical = taught[index]
  const inLesson = info.chars.filter((c) => c.radicals.some((r) => r.radical.id === radical.id)).map((c) => c.char)
  const earlier = radicalFamily(radical).filter((m) => { const l = charInfo(m.char).words[0]?.lesson; return !!l && LESSONS.indexOf(l) < lessonIndex }).map((m) => m.char)
  const [stepId] = STEPS[step]
  const canGoOn = stepId !== 'trace' || traced !== null || unavailable
  return <div className="space-y-4">
    <div className="h-1.5 rounded-full bg-line overflow-hidden"><div className="h-full bg-jade" style={{ width: `${((index * STEPS.length + step) / (taught.length * STEPS.length)) * 100}%` }} /></div>
    <p className="text-sm font-semibold text-muted">Bộ {index + 1}/{taught.length} · {STEPS.map(([, label], k) => <span key={label} className={k === step ? 'text-ink' : ''}>{k > 0 && ' → '}{label}</span>)}</p>
    <Card className="p-5 sm:p-7">
      <RadicalHeader radical={radical} inLesson={inLesson} reviewing={reviewing.has(radical.id)} />
      {stepId === 'learn' && <div className="mt-5 flex justify-center"><StrokeWriter key={`${radical.id}-animate`} char={radical.writingGlyph} mode="animate" size={200} onUnavailable={() => setUnavailable(true)} /></div>}
      {stepId === 'trace' && <div className="mt-5 flex flex-col items-center">
        {unavailable ? <div className="font-han text-8xl py-6">{radical.writingGlyph}</div>
          : <StrokeWriter key={`${radical.id}-trace`} char={radical.writingGlyph} mode="trace" size={200} onUnavailable={() => setUnavailable(true)} onComplete={(m) => { setTraced(m); firstTry.current.set(radical.id, m <= 2) }} />}
        {traced !== null && <p role="status" className="mt-3 text-sm">{traced === 0 ? 'Tô đúng hết các nét.' : `${traced} nét chưa đúng; lịch ôn sẽ nhắc lại bộ này.`}</p>}
        {traced === null && !unavailable && <Button variant="ghost" className="mt-2" onClick={() => { setTraced(4); firstTry.current.set(radical.id, false) }}>Để sau, chưa tô được</Button>}
      </div>}
      {stepId === 'map' && <div className="mt-5"><RadicalMindmap key={radical.id} radical={radical} focus={inLesson} dim={earlier} highlight={highlight} /></div>}
      {error && <p role="alert" className="mt-3 text-sm text-cinnabar">{error}</p>}
      {canGoOn && <Button className="mt-5" disabled={busy} onClick={next}>{busy ? 'Đang lưu…' : stepId === 'map' && index === taught.length - 1 ? (families.length ? 'Xem họ âm →' : 'Hoàn thành phần này') : stepId === 'map' ? `Bộ tiếp theo: ${taught[index + 1].writingGlyph} →` : 'Bước tiếp theo →'}</Button>}
    </Card>
  </div>
}

function RadicalHeader({ radical, inLesson, reviewing }: { radical: Radical; inLesson: string[]; reviewing: boolean }) {
  return <div className="flex gap-4 items-start">
    <span className="font-han text-7xl leading-none" style={{ color: TAUGHT_COLOR }}>{radical.writingGlyph}</span>
    <div className="min-w-0">
      <h2 className="text-xl font-bold">{radical.meaning}</h2>
      <p className="text-sm mt-1">Bộ {radical.id}/214 · {radical.strokes} nét{radical.variants.length > 0 && <> · dạng khác: <span className="font-han text-lg">{[radical.glyph, ...radical.variants].filter((g) => g !== radical.writingGlyph).join(' ')}</span></>}</p>
      <p className="text-sm text-muted mt-1">Vị trí thường gặp: {radicalPosition([radical.glyph, ...radical.variants])}</p>
      <p className="text-sm mt-1">Trong bài này: <span className="font-han text-lg">{inLesson.join(' ')}</span></p>
      <p className="mt-1 flex flex-wrap gap-2 text-xs">
        {reviewing && <span className="rounded-md bg-jade-soft text-jade px-1.5 py-0.5">✓ Đã có trong lịch ôn</span>}
      </p>
    </div>
  </div>
}

/** The sound part in the middle of a row of characters that share it, each with its reading. */
function PhoneticFamilyCard({ family }: { family: PhoneticFamily }) {
  const glyphs = new Map([[family.phonetic, TAUGHT_COLOR]])
  const reading = (c: string) => charInfo(c).pinyin
  return <div className="rounded-xl bg-sunken p-4" aria-label={`Họ âm ${family.phonetic}`}>
    <div className="flex items-baseline gap-3">
      <span className="font-han text-5xl" style={{ color: TAUGHT_COLOR }}>{family.phonetic}</span>
      {reading(family.phonetic) && <Pinyin text={reading(family.phonetic)} className="text-lg" />}
      {CHAR_NOTES.get(family.phonetic) && <span className="font-bold tracking-wider text-gold uppercase text-sm">{CHAR_NOTES.get(family.phonetic)!.hanViet}</span>}
    </div>
    <ul className="mt-3 flex flex-wrap gap-3">{family.members.map((m) => <li key={m.char} className={`flex flex-col items-center rounded-lg px-2 py-1 ${m.isNew ? 'bg-surface ring-2 ring-cinnabar/40' : ''}`}>
      <ColoredHanzi char={m.char} highlight={new Map()} glyphs={glyphs} size={56} />
      <Pinyin text={reading(m.char)} className="text-sm" />
      <span className="text-[11px] text-muted">{m.isNew ? 'mới' : 'đã học'}</span>
    </li>)}</ul>
  </div>
}
