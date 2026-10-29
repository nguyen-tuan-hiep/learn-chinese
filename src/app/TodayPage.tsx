import { Link } from 'react-router-dom'
import { LEVELS } from '@/data/course'
import { Button, Card } from '@/components/ui/Button'
import { nextStep } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'
import { useSettings } from '@/store/settings'
import { beginnerProgress } from '@/lib/beginner'

function Step({ n, title, detail, minutes, done, action }: { n: number; title: string; detail: React.ReactNode; minutes: string; done?: boolean; action: React.ReactNode }) {
  return (
    <div className="flex flex-wrap sm:flex-nowrap items-start gap-4 px-5 py-5">
      <span className={`mt-0.5 size-7 shrink-0 grid place-items-center rounded-full text-sm font-bold ${done ? 'bg-jade text-white' : 'bg-sunken text-muted'}`}>{done ? '✓' : n}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">{title}</span>
          <span className="text-xs text-muted">{minutes}</span>
        </div>
        <div className="text-sm text-muted mt-0.5">{detail}</div>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  )
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-sm">{label}</div>
      {hint && <div className="text-xs text-muted">{hint}</div>}
    </div>
  )
}

export function TodayPage() {
  const { loaded, stats, lessonState, minutesToday, streak, cards, newWordsToday } = useStudyData()
  const goal = useSettings((s) => s.dailyMinutes)
  const limit = useSettings((s) => s.newWordsPerDay)
  if (!loaded || !stats) return <p role="status" className="pt-8">Đang tải buổi học…</p>

  const next = nextStep(lessonState)
  const beginner = beginnerProgress(lessonState)
  const starting = !!beginner.next && cards.length === 0 && ![...lessonState.values()].some((s) => s.lessonId.startsWith('hsk') && Object.keys(s.done).length)
  const due = stats.dueNow
  const words = new Set(cards.filter((c) => c.kind === 'recall').map((c) => c.ref)).size
  const knownWords = cards.filter((c) => c.kind === 'recall' && c.state === 2 && c.stability >= 21).length
  const chars = cards.filter((c) => c.kind === 'write').length
  const totalWords = LEVELS.reduce((n, l) => n + l.totalWords, 0)
  const date = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="max-w-3xl pt-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-muted capitalize">{date}</p>
          <h1 className="text-2xl font-bold">Buổi học hôm nay</h1>
        </div>
        <div className="text-right text-sm">
          <div>
            <b className="tabular-nums">{minutesToday}</b>/{goal} phút
            {streak > 0 && <span className="text-muted"> · {streak} ngày liên tiếp</span>}
          </div>
          <div className="mt-1.5 h-1.5 w-48 rounded-full bg-line overflow-hidden">
            <div className="h-full bg-ink" style={{ width: `${Math.min(100, (minutesToday / goal) * 100)}%` }} />
          </div>
        </div>
      </div>

      {beginner.next && <Card className="mt-6 p-5 border-jade">
        <p className="text-xs font-bold uppercase tracking-wider text-jade">{starting ? 'Bắt đầu tại đây' : 'Ôn lại nền tảng'} · {beginner.completed}/7 buổi</p>
        <h2 className="mt-2 text-lg font-bold">{starting ? 'Chưa biết tiếng Trung? Mình bắt đầu từng chút.' : '7 buổi nhập môn cho người mới'}</h2>
        <p className="mt-2 text-sm text-muted">Buổi tiếp theo: {beginner.next.title}. Khoảng {beginner.next.minutes} phút; bạn không cần biết pinyin trước.</p>
        <Link to={`/start?session=${beginner.next.id}`} className="inline-block mt-4 rounded-xl bg-ink text-paper px-4 py-3 text-sm font-semibold">{beginner.completed ? 'Tiếp tục nhập môn →' : 'Bắt đầu buổi đầu tiên →'}</Link>
      </Card>}

      {!starting && <Card className="mt-6 divide-y divide-line">
        <Step
          n={1}
          title="Ôn tập"
          minutes={due ? `~${Math.max(1, Math.round((due * 12) / 60))} phút` : ''}
          done={due === 0 && stats.reviewsToday > 0}
          detail={due ? `${due} thẻ đến hạn. Luôn ôn trước khi học bài mới: đây là bước giúp nhớ lâu nhất.` : stats.total ? 'Không còn thẻ nào đến hạn.' : 'Chưa có thẻ nào. Thẻ sẽ được tạo khi bạn học từ vựng.'}
          action={
            due > 0 && (
              <Link to="/review">
                <Button>Ôn {due} thẻ</Button>
              </Link>
            )
          }
        />
        <Step
          n={2}
          title="Bài mới"
          minutes={next ? `~${next.part.minutes} phút` : ''}
          detail={
            next ? (
              <>
                HSK {next.lesson.level} · Bài {next.lesson.number} <span className="font-han text-ink">{next.lesson.title}</span> · phần <b className="text-ink">{next.part.label}</b>
                {next.part.id === 'vocab' && newWordsToday >= limit && (
                  <div className="text-tone2 mt-1">Hôm nay đã học {newWordsToday} từ mới. Nên để phần từ vựng bài này sang mai.</div>
                )}
                {next.part.id === 'vocab' && newWordsToday < limit && <div className="mt-1">Học theo nhóm tối đa {limit - newWordsToday} từ mới; phần còn lại để buổi sau.</div>}
              </>
            ) : (
              'Bạn đã học hết các bài hiện có. Nội dung mới đang được soạn.'
            )
          }
          action={
            next && (
              <Link to={`/lesson/${next.lesson.id}?part=${next.part.id}`}>
                <Button variant={due > 0 ? 'secondary' : 'primary'}>Học</Button>
              </Link>
            )
          }
        />
        <Step
          n={3}
          title="Luyện thanh điệu"
          minutes="~5 phút"
          detail="Nghe chép những từ đã học. Bạn có thể nghe lại và luyện theo nhịp của mình."
          action={
            <Link to="/pronunciation?tab=dictation">
              <Button variant="secondary">Luyện</Button>
            </Link>
          }
        />
      </Card>}
      {starting && <p className="mt-4 text-sm text-muted">Mục tiêu hôm nay: hoàn thành một buổi ngắn. <Link to="/course" className="underline">Đã biết pinyin? Vào giáo trình</Link>.</p>}

      <h2 className="mt-10 text-sm font-bold uppercase tracking-wider text-muted">Tiến độ học</h2>
      <Card className="mt-3 p-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
        <Metric label="Từ đã học" value={String(words)} hint={`trên ${totalWords} từ trong giáo trình`} />
        <Metric label="Từ nhớ ổn định" value={String(knownWords)} hint="ước tính từ lịch ôn, ≥ 21 ngày" />
        <Metric label="Chữ đang luyện viết" value={String(chars)} />
        <Metric
          label="Tỉ lệ nhớ khi ôn"
          value={stats.retention === null ? '—' : `${Math.round(stats.retention * 100)}%`}
          hint={stats.retention === null ? 'cần ít nhất 10 lượt ôn' : `30 ngày, ${stats.retentionSample} lượt · mục tiêu 90%`}
        />
      </Card>
      <p className="mt-3 text-sm text-muted">
        <Link to="/stats" className="underline">
          Xem thống kê chi tiết
        </Link>
      </p>
    </div>
  )
}
