import { useState } from 'react'
import { Button, Card } from '@/components/ui/Button'

export function ExercisesPart({ prompts, completed, onComplete }: { prompts: string[]; completed: boolean; onComplete: () => void | Promise<void> }) {
  const [checked, setChecked] = useState<boolean[]>(() => prompts.map(() => completed))
  const count = checked.filter(Boolean).length
  return <div className="space-y-4">
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
        <Button disabled={!prompts.length || count < prompts.length} variant={completed ? 'good' : 'primary'} onClick={() => void onComplete()}>
          {completed ? 'Đã hoàn thành' : 'Hoàn thành phần bài tập'}
        </Button>
      </div>
    </Card>
  </div>
}
