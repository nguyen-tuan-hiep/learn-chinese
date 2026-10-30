import { useState } from 'react'
import { newCharacters } from '@/data/course'
import type { CourseLesson } from '@/data/types'
import { Card } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { StrokeWriter, type WriterMode } from '@/components/hanzi/StrokeWriter'
import { charInfo } from '@/lib/chars'
import { ColoredHanzi, lessonHighlight } from '@/components/hanzi/ColoredHanzi'
import { RadicalTags } from '@/components/hanzi/RadicalTags'

const STEPS: [WriterMode, string][] = [
  ['trace', 'Viết theo mẫu'],
  ['recall', 'Tự viết'],
]

/** Let learners choose any new character in the lesson and switch freely between writing modes. */
export function WritingPart({ lesson }: { lesson: CourseLesson }) {
  const candidates = newCharacters(lesson)
  if (!candidates.length) return <Card className="p-5"><p className="text-sm text-muted">Bài này chưa có chữ mới để luyện viết.</p></Card>
  return <WritingBatch lesson={lesson} candidates={candidates} />
}

function WritingBatch({ lesson, candidates }: { lesson: CourseLesson; candidates: string[] }) {
  const [chars] = useState(candidates)
  const [i, setI] = useState(0)
  const [step, setStep] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<number | null>(null)
  const ch = chars[i]
  const info = charInfo(ch)
  const mode = STEPS[step][0]

  const selectCharacter = (index: number) => {
    setI(index)
    setResult(null)
  }

  return <div className="space-y-4">
    <nav aria-label="Chọn chữ để luyện viết" className="rounded-2xl border border-line bg-surface p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-semibold">Chọn chữ để luyện viết</h2>
        <span className="text-xs text-muted">{chars.length} chữ mới trong bài</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {chars.map((char, index) => <button
          key={char}
          type="button"
          aria-label={`Luyện viết chữ ${char}`}
          aria-pressed={i === index}
          onClick={() => { selectCharacter(index); setAttempt((value) => value + 1); setStep(0) }}
          className={`inline-flex min-h-12 min-w-12 items-center justify-center gap-1.5 rounded-xl border px-2.5 transition ${i === index ? 'border-jade bg-jade-soft text-ink' : 'border-line bg-surface text-ink hover:bg-sunken'}`}
        >
          <span className="font-han text-2xl leading-none">{char}</span>
        </button>)}
      </div>
    </nav>

    <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-2 xl:gap-6">
      <Card className="h-full min-w-0 p-4 sm:p-6 flex flex-col items-center">
        <div role="group" aria-label="Chế độ luyện viết" className="mb-5 flex flex-wrap justify-center gap-1.5">
          {STEPS.map(([writerMode, label], index) => <button
            key={writerMode}
            type="button"
            aria-pressed={step === index}
            onClick={() => { setStep(index); setResult(null); setAttempt((value) => value + 1) }}
            className={`min-h-11 rounded-lg px-3 py-2 text-sm font-medium transition ${step === index ? 'bg-jade text-white dark:text-paper' : 'bg-sunken text-muted hover:text-ink'}`}
          >{label}</button>)}
        </div>
        <StrokeWriter
          key={`${ch}-${step}-${attempt}`}
          char={ch}
          mode={mode}
          size={320}
          onComplete={setResult}
        />
        <div className="mt-4 min-h-10 text-center">
          {result === null
            ? <span className="text-sm text-muted">{mode === 'trace' ? 'Dùng chuột/tay/bút để viết theo từng nét.' : 'Tự viết chữ từ trí nhớ; pinyin và nghĩa ở bên cạnh.'}</span>
            : <span className={`text-sm font-semibold ${result === 0 ? 'text-jade' : 'text-tone2'}`}>{result === 0 ? 'Không sai nét nào' : `${result} nét sai`}</span>}
          {mode === 'recall' && result !== null && result > 0 && <p role="status" className="mt-1 text-xs text-muted">Có nét chưa đúng. Chọn chế độ để viết lại hoặc chọn chữ khác.</p>}
        </div>
      </Card>

      <Card className="h-full min-w-0 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <h2 className="font-semibold">Chữ đang luyện</h2>
          <span className="text-sm text-muted">{i + 1}/{chars.length}</span>
        </div>
        {mode === 'recall' && result === null ? <div className="mt-4 rounded-xl bg-sunken p-4">
          <p className="text-sm font-semibold">Viết chữ này từ trí nhớ</p>
          <Pinyin text={info.pinyin} className="mt-2 text-xl" />
          <p className="mt-1 text-sm text-muted">{info.words.find((word) => word.lesson.id === lesson.id)?.word.meaning}</p>
        </div> : <>
          <div className="mt-4 flex items-center gap-4">
            <ColoredHanzi char={ch} highlight={lessonHighlight(lesson.id)} size={72} />
            <div className="min-w-0"><Pinyin text={info.pinyin} className="text-xl" /><SpeakButton text={ch} size="sm" /></div>
          </div>
          <RadicalTags text={ch} lessonId={lesson.id} />
          <div className="mt-5">
            <h3 className="text-sm font-semibold">Từ có chữ này trong bài</h3>
            <ul className="mt-2 divide-y divide-line">
              {info.words.filter(({ lesson: sourceLesson }) => sourceLesson.id === lesson.id).slice(0, 4).map(({ word }) => <li key={word.id + word.hanzi} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 py-2">
                <span className="font-han text-lg">{word.hanzi}</span><Pinyin text={word.pinyin} /><span className="text-sm text-muted">· {word.meaning}</span>
              </li>)}
            </ul>
          </div>
        </>}
      </Card>
    </div>
  </div>
}
