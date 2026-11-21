import { useEffect, useState } from 'react'
import { Gauge, Mic, Palette, Target, Trash2, TriangleAlert, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ListRow } from '@/components/ui/ListGroup'
import { LargeTitle } from '@/components/ui/PageHeader'
import { Segmented } from '@/components/ui/Segmented'
import { Stagger } from '@/components/ui/motion'
import { StudyBackup } from '@/components/StudyBackup'
import { IconBadge } from '@/components/settings/IconBadge'
import { SrsSettings } from '@/components/settings/SrsSettings'
import { SettingsSection, StackedRow } from '@/components/settings/SettingsSection'
import { db } from '@/lib/db'
import { chineseVoices, currentVoiceName, hasChineseVoice, setPreferredVoice, speak } from '@/lib/speech'
import { useSettings, type Theme } from '@/store/settings'

/** Speech speeds offered, slowest first, each with what it is good for. */
const RATES = [{ v: 0.4, note: 'Very slow, to catch each tone' }, { v: 0.6, note: 'Slow, good for new words' }, { v: 0.8, note: 'Natural, a little gentle' }, { v: 1.0, note: 'Native speed' }, { v: 1.2, note: 'Fast, for fluent listening' }] as const

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

  // A rate saved by the old slider (any 0.1 step) shows as the nearest preset.
  const rate = RATES.reduce((a, b) => (Math.abs(b.v - s.speechRate) < Math.abs(a.v - s.speechRate) ? b : a))

  return (
    <div className="mx-auto w-full max-w-3xl min-w-0 pt-6 pb-10 sm:pt-8">
      <LargeTitle title="Settings" />

      <Stagger gap={0.07}>
        <SettingsSection title="Study">
          <StackedRow icon={<IconBadge color="var(--color-tint)"><Target /></IconBadge>} title="Daily goal">
            <Segmented label="Daily study goal" fill className="max-w-full" value={String(s.dailyMinutes)} onChange={(v) => s.set({ dailyMinutes: Number(v) })}
              options={[10, 15, 20, 30, 60].map((m) => ({ value: String(m), label: `${m}′` }))} />
            {/* <p className="mt-1.5 px-1 text-footnote text-secondary-label">{s.dailyMinutes} minutes a day</p> */}
          </StackedRow>
        </SettingsSection>

        <SrsSettings />

        <SettingsSection title="Voice" clip={false}>
          <StackedRow icon={<IconBadge color="var(--color-tint)"><Gauge /></IconBadge>} title="Speed">
            <Segmented label="Speech speed" fill className="max-w-full" value={String(rate.v)} onChange={(v) => s.set({ speechRate: Number(v) })}
              options={RATES.map((r) => ({ value: String(r.v), label: `${r.v}×` }))} />
            <p className="mt-1.5 px-1 text-footnote text-secondary-label">{rate.note}</p>
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
            title={<span className="text-tint-text">Play sample</span>}
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
            <div role="alertdialog" aria-label="Confirm delete progress" className="min-w-0 px-4 py-3">
              <div className="flex min-h-8 items-center gap-3">
                <IconBadge color="var(--color-danger)"><Trash2 /></IconBadge>
                <span className="min-w-0 flex-1 text-body text-danger-text">Delete all progress?</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="fill" onClick={() => setConfirmReset(false)}>Cancel</Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    await Promise.all([db.cards.clear(), db.reviews.clear(), db.days.clear(), db.lessonState.clear()])
                    setConfirmReset(false)
                  }}
                >
                  Delete
                </Button>
              </div>
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
