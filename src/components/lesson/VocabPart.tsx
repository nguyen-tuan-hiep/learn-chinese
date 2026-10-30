import { useState } from 'react'
import type { CourseLesson } from '@/data/types'
import { Button, Card } from '@/components/ui/Button'
import { WordCard } from '@/components/hanzi/WordCard'

/** Browse lesson vocabulary directly and inspect stroke order for new characters. */
export function VocabPart({ lesson }: { lesson: CourseLesson }) {
  const [index, setIndex] = useState(0)
  const word = lesson.words[index]

  return <div>
    <div className="mb-4 rounded-xl bg-jade-soft px-4 py-3 text-sm">
      <p className="font-semibold">Bài này có {lesson.words.length} từ vựng</p>
      <p className="mt-1 text-muted">Mỗi từ hoặc cụm từ có thể gồm một hay nhiều chữ Hán. Ví dụ: 对不起 (xin lỗi) gồm 3 chữ: 对, 不, 起. Chọn một từ bên dưới để xem lại nhanh.</p>
    </div>

    <nav aria-label="Danh sách từ mới" className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {lesson.words.map((item, itemIndex) => <button
        key={item.id}
        type="button"
        aria-current={index === itemIndex ? 'true' : undefined}
        onClick={() => setIndex(itemIndex)}
        className={`min-h-11 min-w-0 rounded-xl border px-3 py-2 text-left transition ${index === itemIndex ? 'border-jade bg-jade-soft text-ink' : 'border-line bg-surface text-muted hover:bg-sunken hover:text-ink'}`}
      >
        <span className="block truncate font-han text-lg leading-6">{item.hanzi}</span>
        <span className="block truncate text-xs">{item.pinyin}</span>
      </button>)}
    </nav>

    <Card className="p-5 sm:p-8"><WordCard key={`${lesson.id}:${word.id}:${index}`} word={word} lessonId={lesson.id} /></Card>

    <div className="mt-6 flex justify-between gap-3">
      <Button variant="secondary" disabled={index === 0} onClick={() => setIndex((current) => current - 1)}>← Từ trước</Button>
      <Button disabled={index === lesson.words.length - 1} onClick={() => setIndex((current) => current + 1)}>Từ tiếp →</Button>
    </div>
  </div>
}
