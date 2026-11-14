import { useState, type ReactNode } from 'react'
import { Check, PencilLine } from 'lucide-react'
import type { CourseLesson } from '@/data/types'
import { Card } from '@/components/ui/Button'
import { partColor } from '@/lib/palette'
import { DialoguePart } from './DialoguePart'
import { ReadingPart } from './ReadingPart'
import { DialogueDictation } from './DialogueDictation'
import { VocabTypingPractice } from './VocabTypingPractice'
import { PartBar, PartTitle } from './parts/PartTitle'

function ExerciseSection({ number, title, description, children }: { number: number; title: string; description: string; children: ReactNode }) {
  return <section className="space-y-3.5" aria-labelledby={`exercise-title-${number}`}>
    <header className="flex items-start gap-3">
      <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full text-subhead font-bold tabular-nums text-white dark:text-black" style={{ background: partColor('exercises') }}>{number}</span>
      <div className="min-w-0">
        <h3 id={`exercise-title-${number}`} className="text-title3 text-label">{title}</h3>
        <p className="mt-0.5 text-subhead leading-relaxed text-secondary-label">{description}</p>
      </div>
    </header>
    {children}
  </section>
}

/** Bài tập: typing, dialogues, reading, dictation and the lesson's own checklist, one numbered section each. */
export function ExercisesPart({ lesson }: { lesson: CourseLesson }) {
  const prompts = lesson.lessonExercises ?? []
  const hasDictation = lesson.dialogues.some((dialogue) => dialogue.lines.length > 0)
  const hasReading = !!lesson.readings?.length
  const [dictationDone, setDictationDone] = useState(!hasDictation)
  const [checked, setChecked] = useState<boolean[]>(() => prompts.map(() => false))
  const count = checked.filter(Boolean).length
  let number = 0
  const sections = 1 + (lesson.dialogues.length > 0 ? 1 : 0) + (hasReading ? 1 : 0) + (hasDictation ? 1 : 0) + (prompts.length > 0 ? 1 : 0)

  return <div className="space-y-9">
    <PartTitle part="exercises" icon={PencilLine} title="Bài tập" summary={`${sections} hoạt động`} />
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
      {dictationDone && <p role="status" className="flex items-center gap-1.5 text-subhead font-medium text-success-text"><Check aria-hidden="true" className="size-4" strokeWidth={3} />Đã hoàn thành phần nghe chép.</p>}
    </ExerciseSection>}

    {prompts.length > 0 && <ExerciseSection number={++number} title="Bài tập theo nội dung bài" description="Đánh dấu những hoạt động bạn đã tự luyện. Đây là danh sách gợi ý, không bắt buộc để hoàn thành tab.">
      <Card className="p-5 sm:p-7">
        <ol className="divide-y divide-separator">
          {prompts.map((prompt, index) => <li key={`${index}-${prompt}`}>
            <label className="flex min-h-11 cursor-pointer items-start gap-3 py-3">
              <input type="checkbox" checked={checked[index] ?? false} onChange={(event) => setChecked((current) => current.map((value, i) => i === index ? event.target.checked : value))} className="mt-0.5 size-5 shrink-0 cursor-pointer" style={{ accentColor: partColor('exercises') }} />
              <span className={`text-body leading-snug transition-colors ${checked[index] ? 'text-secondary-label' : 'text-label'}`}>{prompt}</span>
            </label>
          </li>)}
        </ol>
        <PartBar part="exercises" label="Hoạt động đã đánh dấu" value={count / prompts.length} className="mt-3" />
        <p className="mt-2 text-footnote text-secondary-label tabular-nums">{count}/{prompts.length} hoạt động đã đánh dấu</p>
      </Card>
    </ExerciseSection>}

  </div>
}
