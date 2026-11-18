import { useCallback, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { db } from '@/lib/db'
import { useParams } from 'react-router-dom'
import { useStudyData } from '@/lib/useStudyData'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { ButtonLink, Card } from '@/components/ui/Button'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { Badge } from '@/components/ui/Badge'
import { Hint } from '@/components/ui/Disclosure'
import { ProgressBar } from '@/components/ui/Progress'
import { Rise, Stagger, spring } from '@/components/ui/motion'
import { Sheet } from '@/components/ui/Sheet'
import { WordCard } from '@/components/hanzi/WordCard'
import { NotchProgressBridge } from '@/components/layout/Notch'
import { notify } from '@/store/notch'
import { cheer } from '@/store/mascot'
import { StrokeOrderGuide } from '@/components/hanzi/StrokeOrder'
import { LessonHeader } from '@/components/lesson/LessonHeader'
import { LessonFinishBar } from '@/components/lesson/LessonFinishBar'
import { LessonSkeleton } from '@/components/lesson/LessonSkeleton'
import { findCourseLesson, followingLesson } from '@/data/course'

/** iOS-style switch row; `on` means pinyin is hidden. */
function HidePinyinSwitch({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  return <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)}
    className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 text-left">
    <span className="text-subhead">Hide pinyin to test yourself</span>
    <span className={`flex h-[1.9375rem] w-[3.1875rem] shrink-0 items-center rounded-full p-0.5 transition-colors ${on ? 'bg-success justify-end' : 'bg-fill justify-start'}`}>
      <motion.span layout transition={spring.snappy} className="size-[1.6875rem] rounded-full bg-white shadow-card" />
    </span>
  </button>
}

/** A textbook lesson (HSK 2.0 or 3.0): header, progress panel, grid of word cards, sticky finish bar. */
export function LessonPage() {
  useStudyTimer()
  const { id = '' } = useParams()
  const lesson = findCourseLesson(id)
  const { lessonState, loaded } = useStudyData()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [showPinyin, setShowPinyin] = useState(true)
  // On "I learned these words" the cards hop one after another, like a wave across the grid.
  const wave = useAnimationControls()
  // The word whose stroke order is open, by id.
  const [writing, setWriting] = useState<string | null>(null)
  const closeWriting = useCallback(() => setWriting(null), [])

  if (!lesson) return <Card className="mx-auto mt-10 max-w-3xl p-6 text-center"><p className="text-headline">Lesson not found</p><ButtonLink to="/lesson" className="mt-4">Back to lessons</ButtonLink></Card>
  if (!loaded) return <LessonSkeleton lesson={lesson} />

  const total = lesson.words.length
  const learned = lesson.words.filter((word) => lessonState.get(word.id)?.done.vocab).length
  // A lesson is complete when every word is remembered; there is no separate lesson-level flag.
  const done = total > 0 && learned === total
  const next = followingLesson(lesson)
  const save = async (ids: string[], complete: boolean) => {
    setBusy(ids.join()); setError('')
    try {
      await db.lessonState.bulkPut(ids.map((id) => ({ lessonId: id, done: complete ? { vocab: Date.now() } : {} })))
      const remaining = lesson.words.filter((w) => !lessonState.get(w.id)?.done.vocab && !ids.includes(w.id)).length
      if (!complete) return
      if (remaining === 0) {
        notify({ icon: 'check', text: 'Lesson complete' })
        cheer('wow', 2400)
        void wave.start((i: number) => ({ y: [0, -14, 0], scale: [1, 1.03, 1], transition: { delay: Math.min(i, 12) * 0.05, duration: 0.5, ease: 'easeOut' } }))
      } else if (ids.length === 1) {
        const word = lesson.words.find((w) => w.id === ids[0])
        if (word) notify({ icon: 'plus', text: word.hanzi, zh: true, sub: `+1 · ${learned + 1}/${total}` })
      }
    }
    catch { setError('Could not save your progress. Please try again.') }
    finally { setBusy(null) }
  }
  const writingWord = lesson.words.find((item) => item.id === writing)

  return <div className="mx-auto w-full max-w-3xl min-w-0 pt-5 sm:pt-7 lg:max-w-none">
    <NotchProgressBridge label={`Lesson ${lesson.number} · New words`} done={learned} total={total} />
    <LessonHeader lesson={lesson} aside={
    <section aria-label="Vocabulary progress" className="glass-card flex flex-col justify-center rounded-[2rem] p-5 sm:p-6 lg:w-[22rem] lg:shrink-0 lg:rounded-[2.5rem]">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-footnote font-medium text-secondary-label">Vocabulary progress</p>
          <p className="text-title1 leading-tight"><AnimatedNumber value={learned} /><span className="text-title3 text-secondary-label">/{total} words</span></p>
        </div>
        {done && <Badge tone="success">All words learned</Badge>}
      </div>
      <ProgressBar color="oklch(from var(--tint) calc(l - 0.12) calc(c + 0.06) h)" value={total ? learned / total : 0} className="mt-3 bg-[color-mix(in_srgb,var(--tint)_35%,transparent)]!" />
      <div className="mt-2 border-t border-separator pt-1"><HidePinyinSwitch on={!showPinyin} onChange={(on) => setShowPinyin(!on)} /></div>
    </section>} />

    <section aria-labelledby="lesson-vocab-title" className="@container mt-6">
      <h2 id="lesson-vocab-title" className="mb-3 text-title3">New words</h2>
      <Hint>Listen to each word and read it aloud, then double tap the card (or tap its circle) once you remember it. Remembered words become review cards.</Hint>
      {error && <p role="alert" className="mt-3 text-subhead text-danger">{error}</p>}
      {total === 0 ? <Card className="mt-4 rounded-panel p-5 text-subhead text-secondary-label">This lesson has no verified words in the app yet. You can study it in the textbook PDF and come back once the data is added.</Card>
        : <Stagger gap={0.04} role="list" className="mt-4 grid gap-3 sm:grid-cols-2 @3xl:grid-cols-3">{lesson.words.map((word, i) => {
          const remembered = !!lessonState.get(word.id)?.done.vocab
          return <Rise key={word.id} role="listitem" className="min-w-0">
            <motion.div custom={i} animate={wave} className="h-full">
              <WordCard word={word} showPinyin={showPinyin} remembered={remembered} disabled={busy !== null}
                onToggle={() => void save([word.id], !remembered)} onWrite={() => setWriting(word.id)} />
            </motion.div>
          </Rise>
        })}</Stagger>}
    </section>

    {total > 0 && <LessonFinishBar
      done={done} disabled={busy !== null}
      status={<><b className="font-semibold text-label">{learned}/{total}</b> words remembered</>}
      label={done ? 'Unmark' : 'I learned these words'}
      onClick={() => void save(lesson.words.map((w) => w.id), !done)} />}

    <nav aria-label="Lesson navigation" className="mt-6 flex justify-end pb-2">{next && <ButtonLink to={`/lesson/${next.id}`} variant="secondary">Next lesson →</ButtonLink>}</nav>

    <Sheet open={!!writingWord} onClose={closeWriting} label={writingWord ? `How to write ${writingWord.hanzi}` : 'How to write'}>
      {writingWord && <StrokeOrderGuide key={writingWord.id} hanzi={writingWord.hanzi} pinyin={writingWord.pinyin} meaning={writingWord.meaning} onClose={closeWriting} />}
    </Sheet>
  </div>
}
