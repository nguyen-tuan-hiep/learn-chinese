import { LESSONS, lessonName } from '@/data/course'
import { TAUGHT_COLOR, KNOWN_COLOR } from './ColoredHanzi'
import { radicalsIn, taughtIn } from '@/lib/lessonRadicals'

/** "亻 vừa học · 女 học ở Bài 1" for the radicals of `text` that the course has reached by this lesson. */
export function RadicalTags({ text, lessonId }: { text: string; lessonId: string }) {
  const here = LESSONS.findIndex((l) => l.id === lessonId)
  const seen = new Set<number>()
  const tags = [...text].flatMap((char) => radicalsIn(char)).flatMap(({ radical }) => {
    const lesson = taughtIn(radical.id)
    if (!lesson || seen.has(radical.id) || LESSONS.indexOf(lesson) > here) return []
    seen.add(radical.id)
    return [{ radical, now: lesson.id === lessonId, lesson }]
  })
  if (!tags.length) return null
  return <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">{tags.map(({ radical, now, lesson }) => <span key={radical.id}>
    <span className="font-han text-lg" style={{ color: now ? TAUGHT_COLOR : KNOWN_COLOR }}>{radical.writingGlyph}</span>{' '}
    <span className="text-muted">{radical.meaning} · {now ? 'vừa học' : `học ở ${lesson.level === LESSONS[here]?.level ? `Bài ${lesson.number}` : lessonName(lesson)}`}</span>
  </span>)}</p>
}
