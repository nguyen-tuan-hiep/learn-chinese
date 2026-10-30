import { useState } from 'react'
import type { CourseLesson } from '@/data/types'
import { Button, Card } from '@/components/ui/Button'
import { PinyinInput } from '@/components/hanzi/PinyinInput'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { dialogueSentences } from '@/lib/sentences'
import { introduce } from '@/lib/srs'

/** Listen to each line and type it in pinyin: the hardest and most useful check. */
export function DialogueDictation({ lesson, onFinish }: { lesson: CourseLesson; onFinish: () => void }) {
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
          Lưu kết quả nghe chép
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

