import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Gauge, Mic, Palette, Target, Trash2, TriangleAlert, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ListRow } from '@/components/ui/ListGroup'
import { LargeTitle } from '@/components/ui/PageHeader'
import { Segmented } from '@/components/ui/Segmented'
import { Stagger } from '@/components/ui/motion'
import { VersionSwitch } from '@/components/ui/VersionSwitch'
import { StudyBackup } from '@/components/StudyBackup'
import { IconBadge } from '@/components/settings/IconBadge'
import { SettingsSection, StackedRow } from '@/components/settings/SettingsSection'
import { db } from '@/lib/db'
import { chineseVoices, currentVoiceName, hasChineseVoice, setPreferredVoice, speak } from '@/lib/speech'
import { useSettings, type Theme } from '@/store/settings'
import '@/components/settings/range.css'

const MIN_RATE = 0.5
const MAX_RATE = 1.1

/** Settings, laid out like the iOS Settings app: titled groups of 44px rows with a coloured icon, title and control. */
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

  const rateProgress = ((s.speechRate - MIN_RATE) / (MAX_RATE - MIN_RATE)) * 100

  return (
    <div className="mx-auto w-full max-w-3xl min-w-0 pt-6 pb-10 sm:pt-8">
      <LargeTitle title="Cài đặt">Mục tiêu học, giọng đọc, giao diện và sao lưu. Xem số liệu ở <Link to="/stats" className="text-tint-text underline">Thống kê</Link>.</LargeTitle>

      <Stagger gap={0.07}>
        <SettingsSection title="Học tập">
          <StackedRow icon={<IconBadge color="var(--color-tint)"><Target /></IconBadge>} title="Mục tiêu mỗi ngày">
            <Segmented label="Mục tiêu thời gian mỗi ngày" fill className="max-w-full" value={String(s.dailyMinutes)} onChange={(v) => s.set({ dailyMinutes: Number(v) })}
              options={[10, 15, 20, 30, 60].map((m) => ({ value: String(m), label: `${m}′` }))} />
            <p className="mt-1.5 px-1 text-footnote text-secondary-label">{s.dailyMinutes} phút mỗi ngày</p>
          </StackedRow>
          <StackedRow icon={<IconBadge color="var(--color-tint)"><BookOpen /></IconBadge>} title="Giáo trình HSK">
            <VersionSwitch className="[&>button]:flex-1" />
            <p className="mt-1.5 px-1 text-footnote text-secondary-label">HSK 3.0 theo đề cương thi 2025. Tiến độ hai phiên bản được giữ riêng.</p>
          </StackedRow>
        </SettingsSection>

        <SettingsSection title="Giọng đọc" clip={false}>
          <StackedRow icon={<IconBadge color="var(--color-tint)"><Gauge /></IconBadge>} title="Tốc độ" value={`${s.speechRate.toFixed(1).replace('.', ',')}×`}>
            <input
              aria-label="Tốc độ giọng đọc"
              type="range"
              min={MIN_RATE}
              max={MAX_RATE}
              step={0.1}
              value={s.speechRate}
              onChange={(e) => s.set({ speechRate: Number(e.target.value) })}
              style={{ '--p': `${rateProgress}%` } as React.CSSProperties}
              className="ios-range block w-full"
            />
          </StackedRow>
          <ListRow
            leading={<IconBadge color="var(--color-tint)"><Mic /></IconBadge>}
            title="Giọng"
            subtitle={`Đang dùng: ${currentVoiceName() ?? 'không có'}`}
            trailing={
              <select
                aria-label="Giọng đọc tiếng Trung"
                value={s.voice ?? ''}
                onChange={(e) => {
                  const v = e.target.value || null
                  setPreferredVoice(v)
                  s.set({ voice: v })
                }}
                className="min-h-10 max-w-[48%] cursor-pointer truncate rounded-full bg-fill px-3 text-subhead text-label"
              >
                <option value="">Tự động</option>
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name.replace(' (Chinese (China mainland))', '')}
                  </option>
                ))}
              </select>
            }
          />
          <ListRow
            leading={<IconBadge color="var(--color-tint)"><Volume2 /></IconBadge>}
            title={<span className="font-medium text-tint-text">Nghe thử</span>}
            onClick={async () => (await speak('你好，欢迎学习中文', s.speechRate), refresh((n) => n + 1))}
          />
          {!hasChineseVoice() && (
            <div role="status" className="flex items-start gap-3 bg-warning-soft px-4 py-3">
              <IconBadge color="var(--color-warning)"><TriangleAlert /></IconBadge>
              <p className="min-w-0 flex-1 text-subhead leading-relaxed">
                <b>Chưa có giọng đọc tiếng Trung nào dùng được.</b> Trên macOS: System Settings → Accessibility → Spoken Content → System Voice → Manage Voices → thêm
                Chinese (China mainland), ví dụ Tingting. Sau đó tải lại trang.
              </p>
            </div>
          )}
        </SettingsSection>

        <SettingsSection title="Giao diện">
          <StackedRow icon={<IconBadge color="var(--color-tint)"><Palette /></IconBadge>} title="Giao diện">
            <Segmented<Theme> label="Giao diện" fill value={s.theme} onChange={(theme) => s.set({ theme })}
              options={[{ value: 'system', label: 'Theo máy' }, { value: 'light', label: 'Sáng' }, { value: 'dark', label: 'Tối' }]} />
          </StackedRow>
        </SettingsSection>

        <StudyBackup />

        <SettingsSection title="Dữ liệu" footer="Tiến độ bài học, thời gian học và dữ liệu ôn tập cũ trên trình duyệt này sẽ bị xoá vĩnh viễn.">
          {confirmReset ? (
            <div className="flex min-h-11 items-center gap-3 px-4 py-3">
              <span className="min-w-0 flex-1 text-body text-danger-text">Xoá toàn bộ tiến độ?</span>
              <Button
                variant="danger"
                size="sm"
                onClick={async () => {
                  await Promise.all([db.cards.clear(), db.reviews.clear(), db.days.clear(), db.lessonState.clear()])
                  setConfirmReset(false)
                }}
              >
                Xoá thật
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                Huỷ
              </Button>
            </div>
          ) : (
            <ListRow
              leading={<IconBadge color="var(--color-danger)"><Trash2 /></IconBadge>}
              title={<span className="text-danger-text">Xoá tiến độ</span>}
              onClick={() => setConfirmReset(true)}
            />
          )}
        </SettingsSection>
      </Stagger>
    </div>
  )
}
