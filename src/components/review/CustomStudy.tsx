import { useMemo, useState } from 'react'
import { ChevronRight, Layers, X } from 'lucide-react'
import type { CourseLevel, ReviewWord } from '@/lib/courseModel'
import { Sheet } from '@/components/ui/Sheet'
import { Segmented } from '@/components/ui/Segmented'
import { levelColor, levelInk } from '@/lib/palette'

const plainTitle = (vi: string) => vi.replace(/ · \d+ new words?$/, '')

/**
 * "Custom study" (like Anki's): pick an HSK level, then a lesson, and flip through that lesson's
 * remembered words outside the FSRS schedule. Every level can be picked; only lessons with words marked "Known" are listed.
 * `onPick(null)` studies every remembered word.
 */
export function CustomStudySheet({ open, onClose, levels, words, value, onPick }: {
  open: boolean; onClose: () => void; levels: CourseLevel[]; words: ReviewWord[]; value?: string | null; onPick: (lessonId: string | null) => void
}) {
  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const w of words) map.set(w.lessonId, (map.get(w.lessonId) ?? 0) + 1)
    return map
  }, [words])
  const withWords = levels
    .map((level) => ({ level, lessons: level.lessons.filter((l) => counts.has(l.id)) }))
  const valueLevel = withWords.find((l) => l.lessons.some((x) => x.id === value))?.level.level
  const [picked, setPicked] = useState<number | null>(null)
  const shown = withWords.find((l) => l.level.level === (picked ?? valueLevel)) ?? withWords.find((l) => l.lessons.length > 0) ?? withWords[0]
  const levelWords = shown ? shown.lessons.reduce((n, l) => n + (counts.get(l.id) ?? 0), 0) : 0

  return <Sheet open={open} onClose={onClose} label="Custom study" tall>
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-title2 font-black">Custom study</h2>
        <p className="mt-1 text-subhead text-secondary-label text-pretty">Pick a lesson to flip through the words you know. It does not affect your review schedule.</p>
      </div>
      <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-fill text-secondary-label hover:text-label"><X aria-hidden="true" className="size-5" /></button>
    </div>

    <button type="button" onClick={() => onPick(null)} aria-current={value === null ? 'true' : undefined}
      className={`mt-5 flex w-full cursor-pointer items-center gap-3 rounded-[1.5rem] px-4 py-3.5 text-left transition-transform duration-200 active:scale-[0.98] ${value === null ? 'ink-pill' : 'border border-edge bg-[var(--glass-regular)] shadow-card'}`}>
      <span className={`grid size-9 shrink-0 place-items-center rounded-full ${value === null ? 'bg-white/15' : 'bg-fill'}`}><Layers aria-hidden="true" className="size-4.5" /></span>
      <span className="min-w-0 flex-1 text-callout font-semibold">All known words</span>
      <span className="shrink-0 text-footnote font-semibold tabular-nums opacity-70">{words.length} words</span>
    </button>

    {withWords.length > 1 && <p className="mt-5 mb-2 px-1 text-footnote font-semibold text-secondary-label">HSK level</p>}
    {withWords.length > 1 && shown && <Segmented label="HSK level" fill value={String(shown.level.level)} onChange={(v) => setPicked(Number(v))} 
      options={withWords.map((l) => ({ value: String(l.level.level), label: String(l.level.level) }))} />}

    {shown && shown.lessons.length === 0 && <p className="mt-4 rounded-[1.5rem] bg-fill px-4 py-6 text-center text-subhead text-secondary-label text-pretty">
      No {shown.level.shortTitle} words are marked “Known” yet.
    </p>}
    {shown && shown.lessons.length > 0 && <section aria-label={`${shown.level.shortTitle} lessons`} className="mt-4">
      <p className="mb-2 px-1 text-footnote font-semibold text-secondary-label">{shown.level.shortTitle} · {shown.lessons.length} lessons · {levelWords} known words</p>
      <ul className="overflow-hidden rounded-[1.5rem] border border-edge bg-[var(--glass-regular)] shadow-card">
        {shown.lessons.map((lesson, i) => {
          const on = value === lesson.id
          const n = counts.get(lesson.id) ?? 0
          return <li key={lesson.id} className={i > 0 ? 'border-t border-separator' : ''}>
            <button type="button" onClick={() => onPick(lesson.id)} aria-current={on ? 'true' : undefined}
              aria-label={`HSK ${lesson.level} · Lesson ${lesson.number}: ${lesson.title}, ${n} known words`}
              className={`flex min-h-16 w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors ${on ? 'ink-pill' : 'hover:bg-fill'}`}>
              <span aria-hidden="true" style={{ background: levelColor(lesson.level) }} className={`grid size-8 shrink-0 place-items-center rounded-full text-footnote font-semibold tabular-nums ${levelInk(lesson.level)}`}>{lesson.number}</span>
              <span className="min-w-0 flex-1">
                <span lang="zh-CN" className="font-han block truncate text-callout">{lesson.title}</span>
                <span className={`block truncate text-footnote ${on ? 'opacity-75' : 'text-secondary-label'}`}>{lesson.subtitle ? `${plainTitle(lesson.subtitle)} · ` : ''}{n}/{lesson.wordCount} words known</span>
              </span>
              <ChevronRight aria-hidden="true" className={`size-4 shrink-0 ${on ? '' : 'text-tertiary-label'}`} />
            </button>
          </li>
        })}
      </ul>
    </section>}
  </Sheet>
}
