import { useEffect, useState } from 'react'
import { LEVELS } from '@/data/course'
import { Button, Card } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { dateKey } from '@/lib/progress'
import { chineseVoices, currentVoiceName, hasChineseVoice, setPreferredVoice, speak } from '@/lib/speech'
import { State } from '@/lib/srs'
import { useStudyData } from '@/lib/useStudyData'
import { useSettings, type Theme } from '@/store/settings'
import { StudyBackup } from '@/components/StudyBackup'

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium cursor-pointer ${active ? 'border-jade bg-jade text-white dark:text-paper' : 'border-line bg-surface text-muted hover:text-ink'}`}
    >
      {children}
    </button>
  )
}

function Row({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-line last:border-none">
      <div>
        <div className="font-semibold">{title}</div>
        {desc && <div className="text-sm text-muted">{desc}</div>}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

function Heatmap({ days }: { days: { date: string; seconds: number }[] }) {
  const map = new Map(days.map((d) => [d.date, d.seconds]))
  const weeks = 20
  const end = new Date()
  const start = new Date(end)
  start.setDate(end.getDate() - weeks * 7 + 1)
  const cells: { date: string; mins: number; future: boolean }[] = []
  for (let d = new Date(start); cells.length < weeks * 7; d.setDate(d.getDate() + 1)) {
    const k = dateKey(d)
    cells.push({ date: k, mins: Math.round((map.get(k) ?? 0) / 60), future: d > end })
  }
  const shade = (m: number) =>
    m === 0 ? 'bg-sunken' : m < 15 ? 'bg-jade/25' : m < 30 ? 'bg-jade/45' : m < 60 ? 'bg-jade/70' : 'bg-jade'
  return (
    <div className="overflow-x-auto">
      <div className="grid grid-flow-col grid-rows-7 gap-1 w-fit">
        {cells.map((c) => (
          <div key={c.date} title={`${c.date}: ${c.mins} phút`} className={`size-3.5 rounded-[3px] ${c.future ? 'opacity-0' : shade(c.mins)}`} />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
        Ít {['bg-sunken', 'bg-jade/25', 'bg-jade/45', 'bg-jade/70', 'bg-jade'].map((c) => <span key={c} className={`size-3 rounded-[3px] ${c}`} />)} Nhiều (≥ 60 phút)
      </div>
    </div>
  )
}

export function StatsPage() {
  const s = useSettings()
  const { stats, cards, days, streak } = useStudyData()
  const [voices, setVoices] = useState(() => chineseVoices())
  const [, refresh] = useState(0)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const update = () => setVoices(chineseVoices())
    speechSynthesis.addEventListener('voiceschanged', update)
    return () => speechSynthesis.removeEventListener('voiceschanged', update)
  }, [])

  if (!stats) return null
  const recall = cards.filter((c) => c.kind === 'recall')
  const write = cards.filter((c) => c.kind === 'write')
  const mature = (list: typeof cards) => list.filter((c) => c.state === State.Review && c.stability >= 21).length
  const totalMinutes = Math.round(days.reduce((a, d) => a + d.seconds, 0) / 60)
  const maxF = Math.max(1, ...stats.forecast)
  const dayName = (i: number) => (i === 0 ? 'Hôm nay' : new Date(Date.now() + i * 86_400_000).toLocaleDateString('vi-VN', { weekday: 'short' }))

  return (
    <div className="w-full min-w-0 pt-6 pb-10">
      <h1 className="text-2xl font-bold">Thống kê</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
        {[
          ['Từ đã học', recall.length],
          ['Từ nhớ ổn định (ước tính)', mature(recall)],
          ['Chữ viết được', `${mature(write)}/${write.length}`],
          ['Tỉ lệ nhớ (30 ngày)', stats.retention === null ? '—' : `${Math.round(stats.retention * 100)}%`],
          ['Tổng thời gian', totalMinutes >= 60 ? `${(totalMinutes / 60).toFixed(1)} giờ` : `${totalMinutes} phút`],
          ['Chuỗi ngày học', `${streak} ngày`],
          ['Lượt ôn hôm nay', stats.reviewsToday],
          ['Câu đang ôn', cards.filter((c) => c.kind === 'sentence' || c.kind === 'translate').length],
          ['Thẻ đang học', stats.learning],
        ].map(([label, value]) => (
          <Card key={label} className="p-4">
            <div className="text-xl font-bold tabular-nums">{value}</div>
            <div className="text-xs text-muted">{label}</div>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 font-bold">Lượng ôn 7 ngày tới</h2>
      <Card className="mt-3 p-5">
        <div className="flex items-end gap-3 h-32">
          {stats.forecast.map((n, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
              <span className="text-xs tabular-nums mb-1">{n || ''}</span>
              <div className={`w-full rounded-t-md ${i === 0 ? 'bg-ink' : 'bg-ink/30'}`} style={{ height: `${(n / maxF) * 100}%`, minHeight: n ? 4 : 0 }} />
              <span className="text-[11px] text-muted mt-1.5 capitalize">{dayName(i)}</span>
            </div>
          ))}
        </div>
      </Card>

      <h2 className="mt-8 font-bold">Thời gian học</h2>
      <Card className="mt-3 p-5">
        <Heatmap days={days} />
      </Card>

      <h2 className="mt-8 font-bold">Phủ từ vựng HSK</h2>
      <Card className="mt-3 p-5 space-y-3">
        {LEVELS.map((lv) => {
          const n = recall.filter((c) => c.lessonId.startsWith(`hsk${lv.level}-`)).length
          return (
            <div key={lv.level}>
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{lv.title}</span>
                <span className="text-muted tabular-nums">
                  {n}/{lv.totalWords} từ
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-sunken overflow-hidden">
                <div className="h-full bg-jade" style={{ width: `${(n / lv.totalWords) * 100}%` }} />
              </div>
            </div>
          )
        })}
      </Card>

      <h2 id="settings" className="mt-10 font-bold scroll-mt-20">Cài đặt</h2>
      <Card className="mt-3 px-5">
        <Row title="Mục tiêu thời gian mỗi ngày">
          {[10, 15, 20, 30, 60].map((m) => (
            <Chip key={m} active={s.dailyMinutes === m} onClick={() => s.set({ dailyMinutes: m })}>
              {m} phút
            </Chip>
          ))}
        </Row>
        <Row title="Tốc độ giọng đọc" desc={`${s.speechRate.toFixed(1)}×`}>
          <input
            aria-label="Tốc độ giọng đọc"
            type="range"
            min={0.5}
            max={1.1}
            step={0.1}
            value={s.speechRate}
            onChange={(e) => s.set({ speechRate: Number(e.target.value) })}
            className="accent-[var(--color-ink)] w-44"
          />
        </Row>
        <Row title="Giọng đọc" desc={`Đang dùng: ${currentVoiceName() ?? 'không có'}`}>
          <select
            aria-label="Giọng đọc tiếng Trung"
            value={s.voice ?? ''}
            onChange={(e) => {
              const v = e.target.value || null
              setPreferredVoice(v)
              s.set({ voice: v })
            }}
            className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm"
          >
            <option value="">Tự động</option>
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name.replace(' (Chinese (China mainland))', '')}
              </option>
            ))}
          </select>
          <Button variant="secondary" onClick={async () => (await speak('你好，欢迎学习中文', s.speechRate), refresh((n) => n + 1))}>
            Nghe thử
          </Button>
        </Row>
        <Row title="Giao diện">
          {(
            [
              ['system', 'Theo máy'],
              ['light', 'Sáng'],
              ['dark', 'Tối'],
            ] as [Theme, string][]
          ).map(([v, label]) => (
            <Chip key={v} active={s.theme === v} onClick={() => s.set({ theme: v })}>
              {label}
            </Chip>
          ))}
        </Row>
      </Card>

      {!hasChineseVoice() && (
        <p className="mt-4 rounded-xl bg-gold-soft p-4 text-sm leading-relaxed">
          <b>Chưa có giọng đọc tiếng Trung nào dùng được.</b> Trên macOS: System Settings → Accessibility → Spoken Content → System Voice → Manage Voices → thêm
          Chinese (China mainland), ví dụ Tingting. Sau đó tải lại trang.
        </p>
      )}

      <StudyBackup />

      <Card className="mt-8 p-5">
        <div className="font-semibold">Xoá toàn bộ tiến độ</div>
        <p className="text-sm text-muted">Toàn bộ thẻ ôn, lịch sử ôn tập và thời gian học trên trình duyệt này sẽ bị xoá vĩnh viễn.</p>
        {confirmReset ? (
          <div className="flex gap-2 mt-3">
            <Button
              variant="danger"
              onClick={async () => {
                await Promise.all([db.cards.clear(), db.reviews.clear(), db.days.clear(), db.lessonState.clear()])
                setConfirmReset(false)
              }}
            >
              Xoá thật
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Huỷ
            </Button>
          </div>
        ) : (
          <Button variant="secondary" className="mt-3" onClick={() => setConfirmReset(true)}>
            Xoá tiến độ
          </Button>
        )}
      </Card>
    </div>
  )
}
