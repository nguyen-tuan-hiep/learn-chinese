import { useState, type ReactNode } from 'react'
import type { CourseLesson } from '@/data/types'
import { Card } from '@/components/ui/Button'
import { DialoguePart } from './DialoguePart'
import { ReadingPart } from './ReadingPart'
import { DialogueDictation } from './DialogueDictation'
import { VocabTypingPractice } from './VocabTypingPractice'

function ExerciseSection({ number, title, description, children }: { number: number; title: string; description: string; children: ReactNode }) {
  return <section className="space-y-3" aria-labelledby={`exercise-title-${number}`}>
    <header className="flex items-start gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-jade-soft text-sm font-bold text-jade">{number}</span>
      <div className="min-w-0 pt-0.5">
        <h2 id={`exercise-title-${number}`} className="text-lg font-bold">{title}</h2>
        <p className="mt-0.5 text-sm leading-relaxed text-muted">{description}</p>
      </div>
    </header>
    {children}
  </section>
}

export function ExercisesPart({ lesson }: { lesson: CourseLesson }) {
  const prompts = lesson.lessonExercises ?? []
  const hasDictation = lesson.dialogues.some((dialogue) => dialogue.lines.length > 0)
  const hasReading = !!lesson.readings?.length
  const [dictationDone, setDictationDone] = useState(!hasDictation)
  const [checked, setChecked] = useState<boolean[]>(() => prompts.map(() => false))
  const count = checked.filter(Boolean).length
  let number = 0

  return <div className="space-y-7">
    <ExerciseSection number={++number} title="Gõ pinyin từ mới" description="Nhớ nghĩa của từ, gõ cách đọc bằng pinyin, rồi luyện nghe nhận biết.">
      <VocabTypingPractice lesson={lesson} />
    </ExerciseSection>

    {lesson.dialogues.length > 0 && <ExerciseSection number={++number} title="Bài khóa" description="Nghe và luyện đọc các đoạn hội thoại của bài.">
      <DialoguePart lesson={lesson} />
    </ExerciseSection>}

    {hasReading && <ExerciseSection number={++number} title="Bài đọc" description="Đọc nội dung, mở pinyin hoặc bản dịch khi cần, rồi thử câu hỏi đọc hiểu.">
      <ReadingPart lesson={lesson} />
    </ExerciseSection>}

    {hasDictation && <ExerciseSection number={++number} title="Nghe chép" description="Nghe từng câu và gõ lại bằng pinyin có dấu thanh. Có thể nghe mẫu nhiều lần.">
      <DialogueDictation lesson={lesson} onFinish={() => setDictationDone(true)} />
      {dictationDone && <p role="status" className="text-sm text-jade">Đã hoàn thành phần nghe chép.</p>}
    </ExerciseSection>}

    {prompts.length > 0 && <ExerciseSection number={++number} title="Bài tập theo nội dung bài" description="Đánh dấu những hoạt động bạn đã tự luyện. Đây là danh sách gợi ý, không bắt buộc để hoàn thành tab.">
      <Card className="p-5 sm:p-7">
        <ol className="space-y-2">
          {prompts.map((prompt, index) => <li key={`${index}-${prompt}`}>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3 hover:bg-sunken">
              <input type="checkbox" checked={checked[index] ?? false} onChange={(event) => setChecked((current) => current.map((value, i) => i === index ? event.target.checked : value))} className="mt-1 size-4 accent-jade" />
              <span className="text-sm leading-relaxed">{prompt}</span>
            </label>
          </li>)}
        </ol>
        <p className="mt-4 text-xs text-muted">{count}/{prompts.length} hoạt động đã đánh dấu</p>
      </Card>
    </ExerciseSection>}

  </div>
}
