import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookX } from 'lucide-react'
import { useCourse } from '@/lib/courseModel'
import { setSkipped } from '@/lib/lessonState'
import { ButtonLink, Card } from '@/components/ui/Button'
import { LargeTitle } from '@/components/ui/PageHeader'
import { Rise, Stagger } from '@/components/ui/motion'
import { LevelPanel } from '@/components/course/LevelPanel'
import { ProgressPanel } from '@/components/course/ProgressPanel'
import { CourseSkeleton } from '@/components/course/CourseSkeleton'

/**
 * Lesson list for both HSK versions, driven by useCourse(): progress panel (sticky on wide screens) and one panel per level.
 * Deep links: `?stage=<level id>` or `?level=<n>` open only that level and scroll to it.
 */
export function CoursePage() {
  const course = useCourse()
  const [params] = useSearchParams()
  const [error, setError] = useState('')
  const focus = params.get('stage') ?? params.get('level')
  const { version, levels, current, loaded } = course
  const is2 = version === '2.0'
  const skip = async (ids: string[], skipped: boolean) => {
    setError('')
    try { await setSkipped(ids, skipped) } catch { setError('Could not save the change. Please try again.') }
  }
  if (!loaded) return <CourseSkeleton />
  const skippedCount = levels.reduce((n, l) => n + l.lessons.filter((x) => x.status === 'skipped').length, 0)
  return <div className="mx-auto w-full min-w-0 max-w-[72rem] space-y-6 pt-6 pb-12 sm:pt-8 lg:space-y-8">
    <LargeTitle eyebrow={is2 ? 'HSK Standard Course 2.0' : 'New HSK Course 3.0'} title="Lessons" />
    {levels.length === 0 ? <Card className="p-6 text-center">
      <BookX aria-hidden="true" className="mx-auto size-8 text-secondary-label" />
      <p className="mt-3 text-headline">No lessons yet</p>
      <p className="mt-1 text-subhead text-secondary-label">The content for this version is still being written.</p>
      <ButtonLink to="/" variant="secondary" className="mt-4">Back to home</ButtonLink>
    </Card> : <div className="space-y-6 lg:space-y-8">
      <Stagger>
        <Rise><ProgressPanel course={{ version, summary: course.summary, current }} skipped={skippedCount} partLabel="Vocabulary" error={error} /></Rise>
      </Stagger>
      <div className="min-w-0 space-y-8">
        <Stagger gap={0.05} delay={0.1} aria-label="Levels" className="space-y-3">
          {levels.map((level, i) => <Rise key={level.id}><LevelPanel level={level} index={i + 1} focus={focus} onSkip={skip} /></Rise>)}
        </Stagger>
      </div>
    </div>}
  </div>
}
