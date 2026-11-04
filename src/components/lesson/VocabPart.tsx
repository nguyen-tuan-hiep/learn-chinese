import { useState } from 'react'
import type { CourseLesson } from '@/data/types'
import { Button, Card } from '@/components/ui/Button'
import { Hint } from '@/components/ui/Disclosure'
import { WordCard } from '@/components/hanzi/WordCard'

/** Browse lesson vocabulary directly and inspect stroke order for new characters. */
export function VocabPart({ lesson }: { lesson: CourseLesson }) {
  const [index, setIndex] = useState(0)
  const word = lesson.words[index]
  const last = lesson.words.length - 1

  return <div className="space-y-5">
    {/* Word navigation sits above the card so it stays put while cards of different lengths swap in. */}
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-xl font-semibold">Từ mới <span className="font-normal text-muted tabular-nums">· {lesson.words.length} từ</span></h2>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" aria-label="Từ trước" disabled={index === 0} onClick={() => setIndex((current) => current - 1)}>←</Button>
        <span className="min-w-12 text-center text-sm text-muted tabular-nums">{index + 1}/{lesson.words.length}</span>
        <Button variant="ghost" size="sm" aria-label="Từ tiếp" disabled={index === last} onClick={() => setIndex((current) => current + 1)}>→</Button>
      </div>
    </div>
    <Hint>Mỗi từ hoặc cụm từ có thể gồm một hay nhiều chữ Hán, ví dụ 对不起 (xin lỗi) gồm 3 chữ 对, 不, 起. Nghe mẫu, đọc to theo, rồi mở “Cấu tạo chữ” để thấy chữ được ghép từ những bộ nào. Chọn một từ bên dưới để xem lại nhanh.</Hint>

    <nav aria-label="Danh sách từ mới" className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {lesson.words.map((item, itemIndex) => <button
        key={item.id}
        type="button"
        aria-current={index === itemIndex ? 'true' : undefined}
        onClick={() => setIndex(itemIndex)}
        className={`min-h-12 shrink-0 cursor-pointer rounded-xl border px-3.5 py-1.5 text-left transition ${index === itemIndex ? 'border-jade bg-jade-soft text-ink shadow-[inset_0_0_0_1px_var(--color-jade)]' : 'border-line bg-surface text-muted hover:border-jade/40 hover:text-ink'}`}
      >
        <span lang="zh-CN" className="block whitespace-nowrap font-han text-lg leading-6">{item.hanzi}</span>
        <span className="block whitespace-nowrap text-xs">{item.pinyin}</span>
      </button>)}
    </nav>

    <Card raised className="p-5 sm:p-8"><WordCard key={`${lesson.id}:${word.id}:${index}`} word={word} lessonId={lesson.id} /></Card>

    {index < last && <div className="flex justify-end"><Button variant="secondary" onClick={() => setIndex((current) => current + 1)}>Từ tiếp: <span lang="zh-CN" className="font-han text-base font-normal">{lesson.words[index + 1].hanzi}</span> →</Button></div>}
  </div>
}
