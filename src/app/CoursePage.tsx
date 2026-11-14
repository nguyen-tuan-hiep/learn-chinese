import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookX } from 'lucide-react'
import { useCourse } from '@/lib/courseModel'
import { setSkipped } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'
import { pathSections, upcoming, type PathItem } from '@/lib/learningPath'
import { LEVELS } from '@/data/course'
import { ButtonLink, Card } from '@/components/ui/Button'
import { Chevron, CollapsiblePanel } from '@/components/ui/Disclosure'
import { LargeTitle } from '@/components/ui/PageHeader'
import { Rise, Stagger } from '@/components/ui/motion'
import { VersionSwitch } from '@/components/ui/VersionSwitch'
import { LevelPanel } from '@/components/course/LevelPanel'
import { ProgressPanel } from '@/components/course/ProgressPanel'
import { TipBubble } from '@/components/ui/TipBubble'
import { CourseSkeleton } from '@/components/course/CourseSkeleton'

function SupplementaryLevel({ level }: { level: (typeof LEVELS)[number] }) {
  const [expanded, setExpanded] = useState(false)
  const headingId = `supplementary-heading-${level.level}`
  const panelId = `supplementary-panel-${level.level}`
  return <section className="glass rounded-card">
    <h3><button type="button" id={headingId} aria-expanded={expanded} aria-controls={panelId} onClick={() => setExpanded((v) => !v)} className="flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-card px-4 py-3 text-left text-headline">
      <span className="flex-1">HSK {level.level} <span className="text-subhead font-normal text-secondary-label">· {level.supplementalWords.length} từ bổ sung</span></span>
      <Chevron open={expanded} />
    </button></h3>
    <CollapsiblePanel id={panelId} labelledBy={headingId} expanded={expanded}>
      <ul className="grid grid-cols-1 gap-x-5 border-t border-separator px-4 py-2 sm:grid-cols-2">
        {level.supplementalWords.map((word) => <li key={word.id} className="flex min-w-0 items-baseline gap-2 border-b border-separator/60 py-2">
          <span lang="zh-CN" className="shrink-0 font-han text-title3">{word.hanzi}</span>
          <span className="min-w-0 truncate text-subhead text-secondary-label">{word.pinyin} · {word.meaning}</span>
        </li>)}
      </ul>
    </CollapsiblePanel>
  </section>
}

/** Extra words on the HSK 2.0 exam list that no textbook lesson covers. */
function SupplementaryVocabulary() {
  const levels = LEVELS.filter((level) => level.supplementalWords.length > 0)
  if (!levels.length) return null
  return <section aria-labelledby="supplementary-vocab-title">
    <h2 id="supplementary-vocab-title" className="text-title3">Từ bổ sung HSK 2.0</h2>
    <p className="mt-1 max-w-2xl text-subhead text-secondary-label">Có trong danh sách thi HSK 2.0 nhưng không thuộc bài nào của HSK Standard Course, nên được tách riêng.</p>
    <div className="mt-3 space-y-2">{levels.map((level) => <SupplementaryLevel key={level.level} level={level} />)}</div>
  </section>
}

/**
 * Lesson list for both HSK versions, driven by useCourse(): progress panel (sticky on wide screens) and one panel per level.
 * Deep links: `?stage=<level id>` or `?level=<n>` open only that level and scroll to it.
 */
export function CoursePage() {
  const course = useCourse()
  const { lessonState } = useStudyData()
  const [params] = useSearchParams()
  const [error, setError] = useState('')
  const focus = params.get('stage') ?? params.get('level')
  const { version, levels, current, loaded } = course
  const is2 = version === '2.0'
  const state = useMemo(() => {
    if (!is2) return null
    const paths = new Map<string, PathItem>()
    for (const section of pathSections(lessonState)) for (const item of section.items) paths.set(item.id, item)
    const [next] = upcoming(lessonState, 1)
    return { paths, partLabel: next?.part.label }
  }, [is2, lessonState])
  const skip = async (ids: string[], skipped: boolean) => {
    setError('')
    try { await setSkipped(ids, skipped) } catch { setError('Chưa lưu được thay đổi. Hãy thử lại.') }
  }
  if (!loaded) return <CourseSkeleton />
  const skippedCount = levels.reduce((n, l) => n + l.lessons.filter((x) => x.status === 'skipped').length, 0)
  return <div className="mx-auto w-full min-w-0 max-w-[72rem] space-y-6 pt-6 pb-12 sm:pt-8 lg:space-y-8">
    <LargeTitle eyebrow={is2 ? 'HSK Standard Course · 1–6' : 'New HSK Course · FLTRP'} title="Bài học">
      {is2 ? <>Học lần lượt từng bài, mỗi bài chia thành vài phần ngắn. Mới bắt đầu? <Link to="/pronunciation?tab=intro" className="text-tint underline">Làm quen phát âm và pinyin</Link> trước.</>
        : 'Học theo từng bài của giáo trình New HSK Course, HSK 1–4, với từ vựng có pinyin, từ loại và nghĩa.'}
    </LargeTitle>
    <TipBubble>{current ? <>Hôm nay học tiếp <b>{`HSK ${current.level} · Bài ${current.number}`}</b> nhé. Mỗi phần chỉ vài phút thôi!</> : <>Bạn đã học hết lộ trình. Ôn lại thẻ từ để nhớ lâu nhé!</>}</TipBubble>
    <VersionSwitch className="w-fit max-w-full" />
    {levels.length === 0 ? <Card className="p-6 text-center">
      <BookX aria-hidden="true" className="mx-auto size-8 text-secondary-label" />
      <p className="mt-3 text-headline">Chưa có bài học nào</p>
      <p className="mt-1 text-subhead text-secondary-label">Nội dung của phiên bản này đang được soạn.</p>
      <ButtonLink to="/" variant="secondary" className="mt-4">Về trang chủ</ButtonLink>
    </Card> : <div className="space-y-6 lg:space-y-8">
      <Stagger>
        <Rise><ProgressPanel course={{ version, summary: course.summary, current }} skipped={skippedCount} partLabel={is2 ? state?.partLabel : 'Từ vựng'} error={error} /></Rise>
      </Stagger>
      <div className="min-w-0 space-y-8">
        <Stagger gap={0.05} delay={0.1} aria-label="Các chặng học" className="space-y-3">
          {levels.map((level, i) => <Rise key={level.id}><LevelPanel level={level} index={i + 1} focus={focus} paths={state?.paths} onSkip={is2 ? skip : undefined} /></Rise>)}
        </Stagger>
        {is2 && <SupplementaryVocabulary />}
        {is2 && <p className="text-subhead text-secondary-label">Muốn tra hoặc luyện thêm bộ thủ? Xem <Link to="/radicals" className="text-tint underline">Từ điển bộ thủ</Link>.</p>}
        {!is2 && <p className="text-footnote text-secondary-label">Nguồn từ vựng: CSV bạn cung cấp. Bài khóa, ngữ pháp và bài tập chưa được đưa vào ứng dụng.</p>}
      </div>
    </div>}
  </div>
}
