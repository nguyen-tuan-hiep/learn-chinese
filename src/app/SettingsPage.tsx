import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui/Button'
import { db } from '@/lib/db'
import { chineseVoices, currentVoiceName, hasChineseVoice, setPreferredVoice, speak } from '@/lib/speech'
import { useSettings, type Theme } from '@/store/settings'
import { StudyBackup } from '@/components/StudyBackup'
import { PageHeader } from '@/components/ui/PageHeader'
import { Segmented } from '@/components/ui/Segmented'

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

export function SettingsPage() {
  const s = useSettings()
  const [voices, setVoices] = useState(() => chineseVoices())
  const [, refresh] = useState(0)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const update = () => setVoices(chineseVoices())
    speechSynthesis.addEventListener('voiceschanged', update)
    return () => speechSynthesis.removeEventListener('voiceschanged', update)
  }, [])

  return (
    <div className="mx-auto w-full max-w-3xl min-w-0 pt-6 pb-10 sm:pt-8">
      <PageHeader eyebrow="Tùy chỉnh" title="Cài đặt">Mục tiêu học, giọng đọc, giao diện và sao lưu tiến độ. Xem số liệu học tập ở <Link to="/stats" className="text-jade underline">Thống kê</Link>.</PageHeader>
      <Card raised className="mt-6 px-5">
        <Row title="Mục tiêu thời gian mỗi ngày">
          <Segmented label="Mục tiêu thời gian mỗi ngày" className="max-w-full" value={String(s.dailyMinutes)} onChange={(v) => s.set({ dailyMinutes: Number(v) })}
            options={[10, 15, 20, 30, 60].map((m) => ({ value: String(m), label: `${m} phút` }))} />
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
          <Segmented<Theme> label="Giao diện" value={s.theme} onChange={(theme) => s.set({ theme })}
            options={[{ value: 'system', label: 'Theo máy' }, { value: 'light', label: 'Sáng' }, { value: 'dark', label: 'Tối' }]} />
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
        <p className="text-sm text-muted">Tiến độ bài học, thời gian học và dữ liệu ôn tập cũ trên trình duyệt này sẽ bị xoá vĩnh viễn.</p>
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
