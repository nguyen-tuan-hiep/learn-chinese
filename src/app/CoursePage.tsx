import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookX } from 'lucide-react'
import { useCourse } from '@/lib/courseModel'
import { setSkipped } from '@/lib/lessonState'
import { ButtonLink, Card } from '@/components/ui/Button'
import { LargeTitle } from '@/components/ui/PageHeader'
import { Rise, Stagger } from '@/components/ui/motion'
import { VersionSwitch } from '@/components/ui/VersionSwitch'
import { LevelPanel } from '@/components/course/LevelPanel'
import { ProgressPanel } from '@/components/course/ProgressPanel'
import { TipBubble } from '@/components/ui/TipBubble'
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
    try { await setSkipped(ids, skipped) } catch { setError('Chưa lưu được thay đổi. Hãy thử lại.') }
  }
  if (!loaded) return <CourseSkeleton />
  const skippedCount = levels.reduce((n, l) => n + l.lessons.filter((x) => x.status === 'skipped').length, 0)
  return <div className="mx-auto w-full min-w-0 max-w-[72rem] space-y-6 pt-6 pb-12 sm:pt-8 lg:space-y-8">
    <LargeTitle eyebrow={is2 ? 'HSK Standard Course · 1–6' : 'New HSK Course · FLTRP'} title="Bài học">
      Học theo từng bài của giáo trình {is2 ? 'HSK Standard Course, HSK 1–6' : 'New HSK Course, HSK 1–4'}, với từ vựng có pinyin, từ loại và nghĩa. Mới bắt đầu? <Link to="/pronunciation?tab=intro" className="text-tint underline">Làm quen phát âm và pinyin</Link> trước.
    </LargeTitle>
    <TipBubble>{current ? <>Hôm nay học tiếp <b>{`HSK ${current.level} · Bài ${current.number}`}</b> nhé. Mỗi ngày vài từ thôi cũng được!</> : <>Bạn đã học hết lộ trình. Ôn lại thẻ từ để nhớ lâu nhé!</>}</TipBubble>
    <VersionSwitch className="w-fit max-w-full" />
    {levels.length === 0 ? <Card className="p-6 text-center">
      <BookX aria-hidden="true" className="mx-auto size-8 text-secondary-label" />
      <p className="mt-3 text-headline">Chưa có bài học nào</p>
      <p className="mt-1 text-subhead text-secondary-label">Nội dung của phiên bản này đang được soạn.</p>
      <ButtonLink to="/" variant="secondary" className="mt-4">Về trang chủ</ButtonLink>
    </Card> : <div className="space-y-6 lg:space-y-8">
      <Stagger>
        <Rise><ProgressPanel course={{ version, summary: course.summary, current }} skipped={skippedCount} partLabel="Từ vựng" error={error} /></Rise>
      </Stagger>
      <div className="min-w-0 space-y-8">
        <Stagger gap={0.05} delay={0.1} aria-label="Các chặng học" className="space-y-3">
          {levels.map((level, i) => <Rise key={level.id}><LevelPanel level={level} index={i + 1} focus={focus} onSkip={skip} /></Rise>)}
        </Stagger>
        <p className="text-subhead text-secondary-label">Muốn tra hoặc luyện thêm bộ thủ? Xem <Link to="/radicals" className="text-tint underline">Từ điển bộ thủ</Link>.</p>
        <p className="text-footnote text-secondary-label">Nguồn từ vựng: CSV bạn cung cấp. Bài khóa, ngữ pháp và bài tập chưa được đưa vào ứng dụng.</p>
      </div>
    </div>}
  </div>
}
