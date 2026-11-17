import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SOUND_GUIDE, SOUND_GROUPS, TONE_GUIDE } from '@/data/pronunciationGuide'
import { PRONUNCIATION_UNITS } from '@/data/pronunciationLearning'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { PronunciationChart } from '@/components/lesson/PronunciationChart'
import { PinyinRules, TypingGuide } from '@/components/lesson/PinyinGuide'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { ToneCard } from '@/components/pronunciation/ToneCard'
import { SoundTile } from '@/components/pronunciation/SoundTile'
import { speak } from '@/lib/speech'
import { useSettings } from '@/store/settings'
import { Glass } from '@/components/ui/Glass'
import { Hint } from '@/components/ui/Disclosure'
import { PageHeader } from '@/components/ui/PageHeader'
import { Segmented } from '@/components/ui/Segmented'

const TABS = [
  ['intro', 'Intro'],
  ['tones', 'Tones'],
  ['initials', 'Initials'],
  ['finals', 'Finals'],
  ['rules', 'Reading rules'],
  ['typing', 'Typing'],
  ['chart', 'Chart'],
] as const
type Tab = (typeof TABS)[number][0]

const TONE_ROWS: [string, string][][] = [
  [['mā', '妈'], ['má', '麻'], ['mǎ', '马'], ['mà', '骂']],
  [['bā', '八'], ['bá', '拔'], ['bǎ', '把'], ['bà', '爸']],
  [['yī', '衣'], ['yí', '姨'], ['yǐ', '椅'], ['yì', '亿']],
  [['wū', '屋'], ['wú', '无'], ['wǔ', '五'], ['wù', '雾']],
]

const RULES = [
  { title: 'Two tone 3s in a row', ex: 'nǐ hǎo → ní hǎo', say: '你好', text: 'A tone 3 before another tone 3 is read as tone 2.' },
  { title: '不 bù', ex: 'bù + tone 4 → bú', say: '不客气', text: 'Before tone 4, 不 is read as tone 2: bú kèqi.' },
  { title: '一 yī', ex: 'yī → yí / yì', say: '一个', text: 'Before tone 4 it is yí, before tones 1/2/3 it is yì. When counting it stays yī.' },
]

export function PronunciationPage() {
  useStudyTimer()
  const [params, setParams] = useSearchParams()
  const tab = TABS.find(([id]) => id === params.get('tab'))?.[0] ?? 'tones'
  const setTab = (t: Tab) => setParams({ tab: t }, { replace: true })
  const rate = useSettings((s) => s.speechRate)
  const play = (s: string) => speak(s, rate)
  const [heard, setHeard] = useState<Set<string>>(() => new Set())
  const playSound = (id: string, text: string) => {
    setHeard((current) => new Set(current).add(id))
    return play(text)
  }

  const unit = (index: number) => PRONUNCIATION_UNITS[index]

  return (
    <div className="w-full min-w-0 pt-6 pb-10 sm:pt-8">
      <PageHeader eyebrow="Pinyin · tones" title="Pronunciation"
/>

      <div className="mt-5"><Hint title="About the sound hints">The English “sounds like” hints are only approximate. Listen to the sample, then adjust your mouth; samples use the Chinese voice on your device. <Link className="text-tint-text underline" to="/settings">Voice settings</Link>.</Hint></div>
      {/* Sticky under the header on phones; the shared picker scrolls to keep the chosen tab in view. */}
      <div className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-10 -mx-4 mt-6 bg-paper/95 px-4 py-2 backdrop-blur md:static md:mx-0 md:bg-transparent md:p-0">
        <Segmented label="Pronunciation sections" value={tab} onChange={setTab} options={TABS.map(([value, label]) => ({ value, label }))} />
      </div>

      {tab === 'intro' && <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {[unit(0), unit(1)].map((u) => <section key={u.id} className="glass-card rounded-[2rem] p-5 sm:p-6">
          <h2 className="text-title3">{u.title}</h2>
          <p className="mt-2 text-callout leading-relaxed text-secondary-label">{u.body}</p>
          {u.sample && <div className="mt-4 flex items-center gap-3 rounded-2xl bg-fill p-3"><SpeakButton text={u.sample.say} /><span className="text-title3">{u.sample.pinyin} <span lang="zh-CN" className="font-han">{u.sample.say}</span></span></div>}
        </section>)}
        <p className="text-footnote text-secondary-label lg:col-span-2">Go in order: Tones → Initials → Finals → Reading rules → Typing. You can spread each group of sounds over several sessions.</p>
      </div>}
      {tab === 'tones' && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {TONE_GUIDE.filter(t => t.tone !== 5).map((tone) => <ToneCard key={tone.tone} tone={tone} onPlay={play} />)}
          </div>

          <ToneCard tone={TONE_GUIDE[4]} onPlay={play} compact />
          <Glass as="section" className="rounded-card p-5 sm:p-6">
            <h2 className="text-title3">Listen row by row</h2>
            <p className="text-subhead text-secondary-label">Tap from left to right to hear the difference.</p>
            <div className="mt-4 grid gap-2">
              {TONE_ROWS.map((row, i) => (
                <div key={i} className="grid grid-cols-4 gap-2">
                  {row.map(([py, hz]) => (
                    <button key={py} type="button" onClick={() => play(hz)} className="min-h-11 cursor-pointer rounded-xl bg-fill py-3 transition-colors hover:bg-feature-pronunciation-soft">
                      <Pinyin text={py} className="text-xl" />
                      <span className="font-han text-secondary-label ml-1.5">{hz}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </Glass>

          <div>
            <h2 className="mb-3 text-title3">Tone change rules</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {RULES.map((r) => (
                <button key={r.title} type="button" onClick={() => play(r.say)} className="glass-card min-h-11 cursor-pointer rounded-2xl p-4 text-left transition-transform active:scale-[0.98]">
                  <div className="font-bold">{r.title}</div>
                  <div className="mt-1 text-subhead font-bold text-label">{r.ex}</div>
                  <p className="mt-2 text-footnote leading-relaxed text-secondary-label">{r.text}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'rules' && <PinyinRules />}
      {tab === 'typing' && <TypingGuide />}
      {tab === 'chart' && <PronunciationChart searchable />}

      {(tab === 'initials' || tab === 'finals') && <>
        <div className="mt-4"><Hint title="How to study this group"><p>{unit(tab === 'initials' ? 3 : 4).body}</p><ol className="mt-3 space-y-2">{unit(tab === 'initials' ? 3 : 4).steps.map((step, i) => <li key={step}>{i + 1}. {step}</li>)}</ol><p className="mt-2">Pick a sound, listen → see how to shape your mouth → repeat three times → listen again. One small group per session is enough.</p></Hint></div>
        {SOUND_GROUPS.map(group => {
          const sounds = SOUND_GUIDE.filter(sound => sound.group === group.id && sound.kind === tab)
          if (!sounds.length) return null
          return <Glass as="section" key={group.id} className="mt-6 p-4 sm:p-5"><h2 className="text-title3">{group.title}</h2><p className="text-subhead text-secondary-label">Pick a sound to hear it and practise the mouth shape.</p><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{sounds.map(sound => <SoundTile key={sound.id} item={sound} heard={heard.has(sound.id)} onPlay={(text) => playSound(sound.id, text)} />)}</div></Glass>
        })}
      </>}
    </div>
  )
}
