import { useState } from 'react'
import type { CourseLesson } from '@/data/types'
import { DialoguePart } from './DialoguePart'
import { ReadingPart } from './ReadingPart'
import { DialogueDictation } from './DialogueDictation'
import { Button, Card } from '@/components/ui/Button'

export function ExercisesPart({ lesson, completed, onComplete }: { lesson: CourseLesson; completed: boolean; onComplete: () => void | Promise<void> }) {
  const prompts = lesson.lessonExercises ?? []
  const hasDictation = lesson.dialogues.some((dialogue) => dialogue.lines.length > 0)
  const hasReading = !!lesson.readings?.length
  const [readingDone, setReadingDone] = useState(completed || !hasReading)
  const [dictationDone, setDictationDone] = useState(completed || !hasDictation)
  const [checked, setChecked] = useState<boolean[]>(() => prompts.map(() => completed))
  const count = checked.filter(Boolean).length
  return <div className="space-y-4">
    {hasDictation && <section aria-label="Bài khóa"><h2 className="mb-3 text-lg font-bold">Bài khóa</h2><DialoguePart lesson={lesson} /></section>}
    {hasReading && <section aria-label="Bài khóa · đọc"><h2 className="mb-3 text-lg font-bold">Bài khóa · đọc</h2><ReadingPart lesson={lesson} completed={readingDone} onComplete={() => setReadingDone(true)} /></section>}
    {hasDictation && <DialogueDictation lesson={lesson} onFinish={() => setDictationDone(true)} />}
    {hasDictation && dictationDone && <p role="status" className="text-sm text-jade">Đã lưu phần nghe chép.</p>}
    <Card className="p-5 sm:p-7">
      <h2 className="text-lg font-bold">Luyện tập theo bài</h2>
      <p className="mt-1 text-sm text-muted">Hoàn thành các hoạt động theo từ mới và điểm ngôn ngữ của bài. Bài tập được website biên soạn theo nội dung sách.</p>
      <ol className="mt-4 space-y-2">
        {prompts.map((prompt, index) => <li key={`${index}-${prompt}`}>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3 hover:bg-sunken">
            <input type="checkbox" checked={checked[index] ?? false} onChange={(event) => setChecked((current) => current.map((value, i) => i === index ? event.target.checked : value))} className="mt-1 size-4 accent-ink" />
            <span className="text-sm leading-relaxed">{prompt}</span>
          </label>
        </li>)}
      </ol>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-muted">{count}/{prompts.length} hoạt động đã đánh dấu</span>
        <Button disabled={!readingDone || !dictationDone || count < prompts.length} variant={completed ? 'good' : 'primary'} onClick={() => void onComplete()}>
          {completed ? 'Đã hoàn thành' : 'Hoàn thành phần bài tập'}
        </Button>
      </div>
    </Card>
  </div>
}
