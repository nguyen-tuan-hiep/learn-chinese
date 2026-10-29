import { Link } from 'react-router-dom'
import { useStudyData } from '@/lib/useStudyData'
import { homeAction } from '@/lib/home'

const AREAS = [
  { to: '/pronunciation?tab=intro', title: 'Phát âm', glyph: '音', description: 'Làm quen pinyin, nghe mẫu và luyện thanh điệu.' },
  { to: '/course', title: 'Giáo trình', glyph: '书', description: 'Học từng bài theo HSK Standard Course từ cấp 1 đến 6.' },
  { to: '/radicals', title: 'Bộ thủ', glyph: '部', description: 'Tra bộ thủ, khám phá cấu tạo chữ và luyện viết.' },
  { to: '/review', title: 'Ôn tập', glyph: '复', description: 'Ôn lại từ và chữ đã học theo lịch ghi nhớ của bạn.' },
]

export function HomePage() {
  const { loaded, lessonState } = useStudyData()
  const action = loaded ? homeAction(lessonState) : null
  return <div className="w-full min-w-0 pt-6 pb-10 sm:pt-8">
    <section aria-labelledby="home-title" className="overflow-hidden rounded-2xl border border-line bg-surface p-5 sm:p-8">
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-jade">Tự học Hànyǔ · HSK 1–6</p>
          <h1 id="home-title" className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Học tiếng Trung từng bước</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">Bắt đầu từ âm đọc, làm quen chữ Hán và học theo giáo trình HSK 1–6. Mỗi lần một phần nhỏ, ôn lại để nhớ lâu hơn.</p>
        </div>
        <img src={`${import.meta.env.BASE_URL}learning-journey.svg`} alt="" width="320" height="240" className="hidden w-56 shrink-0 lg:block xl:w-64" />
      </div>
      <div className="mt-6 border-t border-line pt-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
        {action ? <>
          <p className="min-w-0 text-sm leading-relaxed text-muted sm:flex-1">{action.detail}</p>
          <div className="mt-3 flex shrink-0 flex-wrap items-center gap-3 sm:mt-0">
            <Link to={action.to} className="inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-jade px-4 py-3 text-sm font-semibold text-white dark:text-paper transition-opacity hover:opacity-90">{action.label}<span aria-hidden="true">→</span></Link>
            {action.to !== '/course' && <Link to="/course" className="inline-flex min-h-11 items-center text-sm text-muted underline hover:text-ink">Xem giáo trình</Link>}
          </div>
        </> : <p role="status" className="min-h-11 py-3 text-sm text-muted">Đang tải tiến độ học…</p>}
      </div>
    </section>

    <section aria-labelledby="home-areas" className="mt-8">
      <h2 id="home-areas" className="text-xl font-semibold">Khám phá các phần học</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {AREAS.map(area => <Link key={area.to} to={area.to} className="group flex min-w-0 flex-col rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-jade/40 hover:bg-jade-soft/30 sm:p-5">
          <span aria-hidden="true" className="font-han grid size-11 place-items-center rounded-xl bg-sunken text-2xl text-jade">{area.glyph}</span>
          <span className="mt-4 flex items-center justify-between gap-2 font-semibold">{area.title}<span aria-hidden="true" className="text-muted group-hover:text-jade">→</span></span>
          <span className="mt-2 text-sm leading-relaxed text-muted">{area.description}</span>
        </Link>)}
      </div>
    </section>
  </div>
}
