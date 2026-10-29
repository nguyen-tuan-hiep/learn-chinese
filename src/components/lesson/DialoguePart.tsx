import { useEffect, useRef, useState } from 'react'
import type { CourseLesson, Dialogue } from '@/data/types'
import { Button, Card } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { PinyinInput } from '@/components/hanzi/PinyinInput'
import { ShadowRecorder } from '@/components/hanzi/ShadowRecorder'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { dialogueSentences } from '@/lib/sentences'
import { speakerGender } from '@/lib/speakers'
import { speak } from '@/lib/speech'
import { introduce } from '@/lib/srs'
import { useSettings } from '@/store/settings'

type View = 'listen' | 'pinyin' | 'hanzi' | 'shadow' | 'full'
const VIEWS: [View, string, string][] = [
  ['listen', '1 · Chỉ nghe', 'Nghe cả đoạn 2–3 lần, cố đoán nội dung trước khi nhìn chữ.'],
  ['pinyin', '2 · Có pinyin', 'Đọc theo pinyin, chú ý thanh điệu từng âm.'],
  ['hanzi', '3 · Chỉ chữ Hán', 'Đọc chỉ bằng chữ Hán. Bấm vào câu để xem pinyin nếu bí.'],
  ['shadow', '4 · Shadowing', 'Nghe câu mẫu, ghi âm giọng bạn đọc theo, rồi bấm "So sánh" để nghe mẫu và giọng bạn liền nhau. Chú ý thanh điệu và nhịp.'],
  ['full', 'Song ngữ', 'Đối chiếu nghĩa từng câu.'],
]

function DialogueView({ d }: { d: Dialogue }) {
  const [view, setView] = useState<View>('listen')
  const [peek, setPeek] = useState<number | null>(null)
  const [playing, setPlaying] = useState<number | null>(null)
  const stop = useRef(false)
  const rate = useSettings((s) => s.speechRate)

  useEffect(() => () => { stop.current = true; window.speechSynthesis?.cancel() }, [])

  const playAll = async () => {
    stop.current = false
    for (let i = 0; i < d.lines.length && !stop.current; i++) {
      setPlaying(i)
      await speak(d.lines[i].hanzi, rate, speakerGender(d.lines[i].speaker))
      await new Promise((r) => setTimeout(r, 450))
    }
    setPlaying(null)
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">{d.title}</h3>
          <p className="text-sm text-muted">{d.scene}</p>
        </div>
        <Button variant="secondary" onClick={() => (playing === null ? playAll() : ((stop.current = true), speechSynthesis.cancel()))}>
          {playing === null ? '▶ Nghe cả đoạn' : '■ Dừng'}
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {VIEWS.map(([v, label]) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium cursor-pointer ${view === v ? 'bg-jade text-white dark:text-paper' : 'bg-sunken text-muted hover:text-ink'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">{VIEWS.find((x) => x[0] === view)![2]}</p>
      <ol className="mt-4 space-y-3">
        {d.lines.map((l, i) => (
          <li
            key={i}
            onClick={() => view === 'hanzi' && setPeek(peek === i ? null : i)}
            className={`flex items-start gap-3 rounded-xl px-2 py-1.5 transition ${playing === i ? 'bg-sunken' : ''} ${view === 'hanzi' ? 'cursor-pointer' : ''}`}
          >
            <SpeakButton text={l.hanzi} size="sm" gender={speakerGender(l.speaker)} />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-muted">{l.speaker}</div>
              {view === 'listen' ? (
                <div className="text-muted tracking-widest">· · ·</div>
              ) : (
                <>
                  {view !== 'pinyin' && <div className="font-han text-xl">{l.hanzi}</div>}
                  {(view === 'pinyin' || view === 'full' || view === 'shadow' || peek === i) && (
                    <Pinyin text={l.pinyin} className={view === 'pinyin' ? 'text-lg' : 'text-sm'} />
                  )}
                  {view === 'full' && <div className="text-sm text-muted">{l.vi}</div>}
                  {view === 'shadow' && (
                    <div className="mt-2">
                      <ShadowRecorder text={l.hanzi} gender={speakerGender(l.speaker)} />
                    </div>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Card>
  )
}

/** Listen to each line and type it in pinyin: the hardest and most useful check. */
function Dictation({ lesson, onFinish }: { lesson: CourseLesson; onFinish: () => void }) {
  const lines = lesson.dialogues.flatMap((d) => d.lines)
  const [i, setI] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [right, setRight] = useState(0)
  const [correct] = useState(() => new Set<string>())
  const line = lines[i]
  const finish = async () => {
    await introduce(dialogueSentences(lesson).map((s) => ({ kind: 'sentence' as const, ref: s.hanzi, lessonId: lesson.id, firstTry: correct.has(s.hanzi) })))
    onFinish()
  }

  if (i >= lines.length) {
    return (
      <Card className="p-6 text-center">
        <p className="font-semibold">
          Nghe chép đúng {right}/{lines.length} câu.
        </p>
        <p className="text-sm text-muted mt-1">Câu chưa đúng có thể do âm, thanh điệu hoặc cách gõ. Hãy nghe và đối chiếu lại ở chế độ "Có pinyin".</p>
        <p className="text-sm text-muted mt-1">Các câu dài sẽ được thêm vào lịch ôn để luyện nghe hiểu.</p>
        <Button className="mt-4" onClick={finish}>
          Hoàn thành hội thoại
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-6" key={i}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Nghe chép chính tả</h3>
        <span className="text-sm text-muted">
          Câu {i + 1}/{lines.length}
        </span>
      </div>
      <div className="flex items-center gap-3 my-4">
        <SpeakButton text={line.hanzi} />
        <SpeakButton text={line.hanzi} slow />
        <span className="text-sm text-muted">Nghe bao nhiêu lần cũng được, rồi gõ lại bằng pinyin có thanh.</span>
      </div>
      <PinyinInput
        size="md"
        autoFocus={false}
        expected={line.pinyin}
        placeholder="Gõ cả câu bằng pinyin…"
        onResult={(v) => {
          setAnswered(true)
          if (v === 'correct') {
            setRight((r) => r + 1)
            correct.add(line.hanzi)
          }
        }}
      />
      {answered && (
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-han text-xl">{line.hanzi}</div>
            <div className="text-sm text-muted">{line.vi}</div>
          </div>
          <Button onClick={() => (setI(i + 1), setAnswered(false))}>Câu tiếp</Button>
        </div>
      )}
    </Card>
  )
}

export function DialoguePart({ lesson, onComplete, completed }: { lesson: CourseLesson; onComplete: () => void; completed: boolean }) {
  const [dictating, setDictating] = useState(false)
  return (
    <div className="space-y-5">
      {lesson.dialogues.map((d) => (
        <DialogueView key={d.id} d={d} />
      ))}
      {dictating ? (
        <Dictation lesson={lesson} onFinish={onComplete} />
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Khi đã đọc trôi chảy cả 3 chế độ, hãy làm bài nghe chép.</span>
          <Button onClick={() => setDictating(true)}>{completed ? 'Nghe chép lại' : 'Bắt đầu nghe chép'}</Button>
        </div>
      )}
    </div>
  )
}
