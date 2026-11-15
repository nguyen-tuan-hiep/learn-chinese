import { useEffect, useState } from 'react'
import { Gauge, Mic, Palette, Target, Trash2, TriangleAlert, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ListRow } from '@/components/ui/ListGroup'
import { LargeTitle } from '@/components/ui/PageHeader'
import { Segmented } from '@/components/ui/Segmented'
import { Stagger } from '@/components/ui/motion'
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
      <LargeTitle title="Settings" />

      <Stagger gap={0.07}>
        <SettingsSection title="Study">
          <StackedRow icon={<IconBadge color="var(--color-tint)"><Target /></IconBadge>} title="Daily goal">
            <Segmented label="Daily study goal" fill className="max-w-full" value={String(s.dailyMinutes)} onChange={(v) => s.set({ dailyMinutes: Number(v) })}
              options={[10, 15, 20, 30, 60].map((m) => ({ value: String(m), label: `${m}′` }))} />
            <p className="mt-1.5 px-1 text-footnote text-secondary-label">{s.dailyMinutes} minutes a day</p>
          </StackedRow>
        </SettingsSection>

        <SettingsSection title="Voice" clip={false}>
          <StackedRow icon={<IconBadge color="var(--color-tint)"><Gauge /></IconBadge>} title="Speed" value={`${s.speechRate.toFixed(1)}×`}>
            <input
              aria-label="Speech speed"
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
            title="Voice"
            subtitle={`In use: ${currentVoiceName() ?? 'none'}`}
            trailing={
              <select
                aria-label="Chinese voice"
                value={s.voice ?? ''}
                onChange={(e) => {
                  const v = e.target.value || null
                  setPreferredVoice(v)
                  s.set({ voice: v })
                }}
                className="min-h-10 max-w-[48%] cursor-pointer truncate rounded-full bg-fill px-3 text-subhead text-label"
              >
                <option value="">Automatic</option>
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
            title={<span className="font-medium text-tint-text">Play sample</span>}
            onClick={async () => (await speak('你好，欢迎学习中文', s.speechRate), refresh((n) => n + 1))}
          />
          {!hasChineseVoice() && (
            <div role="status" className="flex items-start gap-3 bg-warning-soft px-4 py-3">
              <IconBadge color="var(--color-warning)"><TriangleAlert /></IconBadge>
              <p className="min-w-0 flex-1 text-subhead leading-relaxed">
                <b>No Chinese voice is available.</b> On macOS: System Settings → Accessibility → Spoken Content → System Voice → Manage Voices → add
                Chinese (China mainland), for example Tingting. Then reload the page.
              </p>
            </div>
          )}
        </SettingsSection>

        <SettingsSection title="Appearance">
          <StackedRow icon={<IconBadge color="var(--color-tint)"><Palette /></IconBadge>} title="Theme">
            <Segmented<Theme> label="Theme" fill value={s.theme} onChange={(theme) => s.set({ theme })}
              options={[{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
          </StackedRow>
        </SettingsSection>

        <StudyBackup />

        <SettingsSection title="Data" footer="Lesson progress, study time and review history in this browser will be deleted permanently.">
          {confirmReset ? (
            <div className="flex min-h-11 items-center gap-3 px-4 py-3">
              <span className="min-w-0 flex-1 text-body text-danger-text">Delete all progress?</span>
              <Button
                variant="danger"
                size="sm"
                onClick={async () => {
                  await Promise.all([db.cards.clear(), db.reviews.clear(), db.days.clear(), db.lessonState.clear()])
                  setConfirmReset(false)
                }}
              >
                Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <ListRow
              leading={<IconBadge color="var(--color-danger)"><Trash2 /></IconBadge>}
              title={<span className="text-danger-text">Delete progress</span>}
              onClick={() => setConfirmReset(true)}
            />
          )}
        </SettingsSection>
      </Stagger>
    </div>
  )
}
