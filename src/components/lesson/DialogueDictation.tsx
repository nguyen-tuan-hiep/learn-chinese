import { useState } from 'react'
import { Check } from 'lucide-react'
import type { CourseLesson } from '@/data/types'
import { Button, Card } from '@/components/ui/Button'
import { PinyinInput } from '@/components/hanzi/PinyinInput'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { PartBar } from './parts/PartTitle'

/** Listen to each line and type it in pinyin: the hardest and most useful check. */
export function DialogueDictation({ lesson, onFinish }: { lesson: CourseLesson; onFinish: () => void }) {
  const lines = lesson.dialogues.flatMap((d) => d.lines)
  const [i, setI] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [right, setRight] = useState(0)
  const line = lines[i]
  const finish = () => onFinish()

  if (i >= lines.length) {
    return (
      <Card className="p-6 text-center sm:p-8">
        <span aria-hidden="true" className="mx-auto grid size-12 place-items-center rounded-full bg-success-soft text-success-text"><Check className="size-6" strokeWidth={3} /></span>
        <p className="mt-3 text-title3">Nghe chép đúng {right}/{lines.length} câu</p>
        <p className="mx-auto mt-2 max-w-md text-subhead leading-relaxed text-secondary-label">Câu chưa đúng có thể do âm, thanh điệu hoặc cách gõ. Hãy nghe và đối chiếu lại ở chế độ "Có pinyin".</p>
        <Button className="mt-5" onClick={finish}>
          Hoàn tất nghe chép
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-5 sm:p-7" key={i}>
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-headline">Nghe chép chính tả</h4>
        <span className="text-subhead text-secondary-label tabular-nums">
          Câu {i + 1}/{lines.length}
        </span>
      </div>
      <PartBar part="exercises" label="Tiến độ nghe chép" value={i / lines.length} className="mt-3" />
      <div className="my-5 flex items-center gap-3">
        <SpeakButton text={line.hanzi} />
        <SpeakButton text={line.hanzi} slow />
        <span className="min-w-0 text-footnote leading-snug text-secondary-label">Nghe bao nhiêu lần cũng được, rồi gõ lại bằng pinyin có thanh.</span>
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
          }
        }}
      />
      {answered && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-separator pt-4">
          <div className="min-w-0">
            <div lang="zh-CN" className="font-han text-xl break-words">{line.hanzi}</div>
            <div className="text-subhead text-secondary-label">{line.vi}</div>
          </div>
          <Button onClick={() => (setI(i + 1), setAnswered(false))}>Câu tiếp</Button>
        </div>
      )}
    </Card>
  )
}
