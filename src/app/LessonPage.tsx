import { useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { findCourseLesson, levelName } from '@/data/course'
import type { LessonPart } from '@/lib/db'
import { markPart, partsFor } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { CharsPart } from '@/components/lesson/CharsPart'
import { VocabPart } from '@/components/lesson/VocabPart'
import { GrammarPart } from '@/components/lesson/GrammarPart'
import { DialoguePart } from '@/components/lesson/DialoguePart'
import { ReadingPart } from '@/components/lesson/ReadingPart'
import { WritingPart } from '@/components/lesson/WritingPart'
import { PronunciationChart } from '@/components/lesson/PronunciationChart'
import { TonePairDrill } from '@/components/lesson/ToneDrills'
import { ExercisesPart } from '@/components/lesson/ExercisesPart'
import { ConfusablesPart } from '@/components/lesson/ConfusablesPart'

const BOOK_SECTION_LABELS: Record<string, string> = {
  pronunciation: 'Phát âm', text: 'Bài khóa', newWords: 'Từ mới', languagePoints: 'Điểm ngôn ngữ',
  exercises: 'Bài tập', comprehensiveExercises: 'Bài tập tổng hợp', confusablePhrases: 'Từ ngữ dễ nhầm', culture: 'Văn hóa',
  '近义词辨析': 'Phân biệt từ',
}

export function LessonPage() {
  useStudyTimer()
  const { id = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const lesson = findCourseLesson(id)
  const { loaded, lessonState, newWordsToday } = useStudyData()
  // Without ?part=, open the first unfinished part and stay there after it is completed.
  const opened = useRef<LessonPart | null>(null)

  if (!loaded) return <p role="status" className="pt-8">Đang tải tiến độ…</p>

  if (!lesson) return <p className="pt-10">Không tìm thấy bài học.</p>

  const done = lessonState.get(lesson.id)?.done ?? {}
  const requested = params.get('part')
  const parts = partsFor(lesson)
  const part = parts.find((p) => p.id === requested)?.id ?? (opened.current ??= parts.find((p) => !done[p.id])?.id ?? 'chars')
  const complete = (p: LessonPart) => markPart(lesson.id, p)

  return (
    <div className="w-full min-w-0 pt-6">
      <Link to="/course" className="text-sm text-muted hover:text-ink">
        ← Giáo trình {levelName(lesson.level)}
      </Link>
      <div className="mt-3 flex items-baseline gap-4 flex-wrap">
        <span className="text-sm font-bold text-muted">Bài {lesson.number}</span>
        <h1 className="font-han text-3xl sm:text-4xl leading-relaxed">{lesson.title}</h1>
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{lesson.textbookVolume} · HSK Standard Course</p>
      <div className="mt-1">
        {lesson.titlePinyin && <><Pinyin text={lesson.titlePinyin} /> <span className="text-muted">· </span></>}
        <span className="text-muted">{lesson.titleVi}</span>
      </div>
      {lesson.textbookSections?.length ? <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Các mục trong sách">
        <span className="mr-1 text-xs text-muted">Mục sách:</span>
        {lesson.textbookSections.map((section) => <span key={section} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">{BOOK_SECTION_LABELS[section] ?? section}</span>)}
      </div> : null}
      {(lesson.dialogues.length > 0 || (lesson.readings?.length ?? 0) > 0) && <p className="mt-2 text-xs text-muted">Hội thoại và bài đọc trên website được biên soạn theo chủ điểm bài học; đây không phải văn bản chép từ sách.</p>}

      <nav className="mt-6 flex gap-1 border-b border-line overflow-x-auto">
        {parts.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setParams({ part: p.id }, { replace: true })}
            className={`relative -mb-px whitespace-nowrap px-4 py-2.5 text-sm font-semibold border-b-2 cursor-pointer ${
              part === p.id ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {done[p.id] ? <span className="text-jade">✓ </span> : <span className="text-muted/60">{i + 1}. </span>}
            {p.label}
            <span className="ml-1.5 text-xs font-normal text-muted">~{p.minutes}′</span>
          </button>
        ))}
      </nav>

      <div className="mt-6 pb-10" key={part}>
        {part === 'pronunciation' && <section aria-labelledby="pronunciation-title"><h2 id="pronunciation-title" className="text-xl font-semibold">Ôn phát âm và áp dụng vào bài</h2><p className="mt-2 text-sm text-muted">Nghe và đọc theo các từ trong bài khóa. Nếu chưa học phát âm, bắt đầu từ <Link to="/pronunciation?tab=intro" className="underline text-jade">Giới thiệu phát âm</Link>; phần dưới giúp bạn ôn lại nhóm âm cần dùng.</p><div className="mt-3 flex flex-wrap gap-3 text-sm"><Link className="underline text-jade" to="/pronunciation?tab=tones">Ôn thanh điệu</Link><Link className="underline text-jade" to="/pronunciation?tab=initials">Ôn thanh mẫu</Link><Link className="underline text-jade" to="/pronunciation?tab=finals">Ôn vận mẫu</Link></div><PronunciationChart kind={lesson.number === 1 ? 'tones' : 'initials'} /><TonePairDrill /></section>}
        {part === 'chars' && <CharsPart lesson={lesson} completed={!!done.chars} onComplete={() => complete('chars')} />}
        {part === 'vocab' && <VocabPart lesson={lesson} newWordsToday={newWordsToday} onComplete={() => complete('vocab')} />}
        {part === 'grammar' && <GrammarPart lesson={lesson} completed={!!done.grammar} needsPractice={!!lessonState.get(lesson.id)?.needsPractice?.grammar} onComplete={(needsPractice) => markPart(lesson.id, 'grammar', needsPractice)} />}
        {part === 'confusables' && <ConfusablesPart pairs={lesson.confusables ?? []} />}
        {part === 'dialogue' && <DialoguePart lesson={lesson} completed={!!done.dialogue} onComplete={() => complete('dialogue')} />}
        {part === 'reading' && <ReadingPart lesson={lesson} completed={!!done.reading} onComplete={() => complete('reading')} />}
        {part === 'exercises' && <ExercisesPart prompts={lesson.lessonExercises ?? []} completed={!!done.exercises} onComplete={() => complete('exercises')} />}
        {part === 'writing' && <WritingPart lesson={lesson} completed={!!done.writing} onComplete={() => complete('writing')} />}
      </div>
    </div>
  )
}
