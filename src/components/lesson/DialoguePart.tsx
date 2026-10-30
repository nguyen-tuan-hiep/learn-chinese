import { useEffect, useRef, useState } from 'react'
import type { CourseLesson, Dialogue } from '@/data/types'
import { Button, Card } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { ShadowRecorder } from '@/components/hanzi/ShadowRecorder'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { speakerGender } from '@/lib/speakers'
import { speak } from '@/lib/speech'
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

export function DialoguePart({ lesson }: { lesson: CourseLesson }) {
  return (
    <div className="space-y-5">
      {lesson.dialogues.map((d) => (
        <DialogueView key={d.id} d={d} />
      ))}

    </div>
  )
}
