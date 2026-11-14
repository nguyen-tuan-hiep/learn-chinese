import { useEffect, useRef, useState } from 'react'
import { Play, Square } from 'lucide-react'
import { Segmented } from '@/components/ui/Segmented'
import type { CourseLesson, Dialogue } from '@/data/types'
import { Button, Card } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { ShadowRecorder } from '@/components/hanzi/ShadowRecorder'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { partSoft } from '@/lib/palette'
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
    <Card className="min-w-0 p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-title3 text-label">{d.title}</h3>
          <p className="mt-0.5 text-subhead text-secondary-label">{d.scene}</p>
        </div>
        <Button variant="secondary" className="shrink-0" onClick={() => (playing === null ? playAll() : ((stop.current = true), speechSynthesis.cancel()))}>
          {playing === null ? <Play aria-hidden="true" className="size-4 fill-current" /> : <Square aria-hidden="true" className="size-4 fill-current" />}
          {playing === null ? 'Nghe cả đoạn' : 'Dừng'}
        </Button>
      </div>
      <Segmented label="Cách luyện hội thoại" className="mt-5" value={view} onChange={setView} options={VIEWS.map(([value, label]) => ({ value, label }))} />
      <p className="mt-3 text-footnote leading-snug text-secondary-label">{VIEWS.find((x) => x[0] === view)![2]}</p>
      <ol className="mt-4 divide-y divide-separator border-t border-separator">
        {d.lines.map((l, i) => (
          <li
            key={i}
            onClick={() => view === 'hanzi' && setPeek(peek === i ? null : i)}
            onKeyDown={(e) => { if (view === 'hanzi' && (e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); setPeek(peek === i ? null : i) } }}
            tabIndex={view === 'hanzi' ? 0 : undefined}
            className={`flex items-start gap-3 px-2 py-3.5 transition-colors ${view === 'hanzi' ? 'cursor-pointer' : ''}`}
            style={playing === i ? { background: partSoft('exercises') } : undefined}
          >
            <SpeakButton text={l.hanzi} size="sm" gender={speakerGender(l.speaker)} />
            <div className="min-w-0 flex-1">
              <div className="text-footnote font-semibold text-secondary-label">{l.speaker}</div>
              {view === 'listen' ? (
                <div aria-label="Đang ẩn câu thoại" className="text-title3 tracking-widest text-tertiary-label">· · ·</div>
              ) : (
                <>
                  {view !== 'pinyin' && <div lang="zh-CN" className="font-han text-xl leading-snug break-words">{l.hanzi}</div>}
                  {(view === 'pinyin' || view === 'full' || view === 'shadow' || peek === i) && (
                    <Pinyin text={l.pinyin} className={view === 'pinyin' ? 'text-lg' : 'text-subhead'} />
                  )}
                  {view === 'full' && <div className="mt-0.5 text-subhead text-secondary-label">{l.vi}</div>}
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
    <div className="space-y-4">
      {lesson.dialogues.map((d) => (
        <DialogueView key={d.id} d={d} />
      ))}

    </div>
  )
}
