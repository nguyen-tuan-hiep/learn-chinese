import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SOUND_GUIDE, SOUND_GROUPS, TONE_GUIDE } from '@/data/pronunciationGuide'
import { PRONUNCIATION_UNITS, pronunciationProgress } from '@/data/pronunciationLearning'
import { PronunciationActivity } from '@/components/lesson/PronunciationActivity'
import { PronunciationChart } from '@/components/lesson/PronunciationChart'
import { useStudyData } from '@/lib/useStudyData'
import { PinyinRules, TypingGuide } from '@/components/lesson/PinyinGuide'
import { TonePairDrill } from '@/components/lesson/ToneDrills'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { ToneCard } from '@/components/pronunciation/ToneCard'
import { SoundTile } from '@/components/pronunciation/SoundTile'
import { speak } from '@/lib/speech'
import { useSettings } from '@/store/settings'
import { Glass } from '@/components/ui/Glass'
import { Hint } from '@/components/ui/Disclosure'
import { PageHeader } from '@/components/ui/PageHeader'
import { TipBubble } from '@/components/ui/TipBubble'
import { Segmented } from '@/components/ui/Segmented'
import { ProgressRing } from '@/components/ui/Progress'

const TABS = [
  ['intro', 'Giới thiệu'],
  ['tones', 'Thanh điệu'],
  ['initials', 'Thanh mẫu'],
  ['finals', 'Vận mẫu'],
  ['rules', 'Quy tắc đọc'],
  ['typing', 'Cách gõ'],
  ['pairs', 'Cặp thanh'],
  ['check', 'Tự kiểm tra'],
  ['chart', 'Bảng tra'],
] as const
type Tab = (typeof TABS)[number][0]

const TONE_ROWS: [string, string][][] = [
  [['mā', '妈'], ['má', '麻'], ['mǎ', '马'], ['mà', '骂']],
  [['bā', '八'], ['bá', '拔'], ['bǎ', '把'], ['bà', '爸']],
  [['yī', '衣'], ['yí', '姨'], ['yǐ', '椅'], ['yì', '亿']],
  [['wū', '屋'], ['wú', '无'], ['wǔ', '五'], ['wù', '雾']],
]

const RULES = [
  { title: 'Hai thanh 3 đi liền', ex: 'nǐ hǎo → ní hǎo', say: '你好', text: 'Thanh 3 đứng trước thanh 3 khác sẽ đọc thành thanh 2.' },
  { title: '不 bù', ex: 'bù + thanh 4 → bú', say: '不客气', text: 'Trước thanh 4, 不 đọc thành thanh 2: bú kèqi.' },
  { title: '一 yī', ex: 'yī → yí / yì', say: '一个', text: 'Trước thanh 4 đọc yí, trước thanh 1/2/3 đọc yì. Khi đếm số vẫn đọc yī.' },
]

export function PronunciationPage() {
  useStudyTimer()
  const { lessonState } = useStudyData()
  const progress = pronunciationProgress(lessonState)
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
      <PageHeader eyebrow="Pinyin · thanh điệu" title="Phát âm"
        aside={<div className="flex w-full items-center gap-4 rounded-[1.75rem] bg-[#15120f] p-4 pr-6 text-white shadow-card sm:w-auto dark:bg-black dark:ring-1 dark:ring-white/10">
          <ProgressRing tone="white" color="#ffffff" value={progress.total ? progress.completed / progress.total : 0} size={48} stroke={5} />
          <div><p className="font-semibold tabular-nums">{progress.completed}/{progress.total} mục nền tảng</p><p className="text-sm opacity-70">Học theo thứ tự các tab</p></div>
        </div>}>
        Chạm vào ô bất kỳ để nghe và đọc to theo. Thanh điệu sai thì nghĩa sai, nên đây là phần cần luyện đều mỗi ngày.
      </PageHeader>

      <div className="mt-5"><TipBubble>{progress.completed < progress.total ? <>Mỗi ngày luyện một nhóm âm nhỏ, đọc to theo mẫu ba lần nhé!</> : <>Bạn đã xong phần nền tảng. Luyện cặp thanh để đọc tự nhiên hơn nhé!</>}</TipBubble></div>
      <div className="mt-5"><Hint title="Lưu ý về gợi âm tiếng Việt">Gợi âm tiếng Việt chỉ gần đúng. Nghe mẫu rồi điều chỉnh khẩu hình; âm mẫu dùng giọng tiếng Trung trên thiết bị. <Link className="text-tint-text underline" to="/settings">Cài đặt giọng đọc</Link>.</Hint></div>
      {/* Sticky under the header on phones; the shared picker scrolls to keep the chosen tab in view. */}
      <div className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-10 -mx-4 mt-6 bg-paper/95 px-4 py-2 backdrop-blur md:static md:mx-0 md:bg-transparent md:p-0">
        <Segmented label="Các phần phát âm" value={tab} onChange={setTab} options={TABS.map(([value, label]) => ({ value, label }))} />
      </div>

      {tab === 'intro' && <><PronunciationActivity unit={unit(0)} /><PronunciationActivity unit={unit(1)} /><p className="mt-4 text-sm text-muted">Học theo thứ tự: Thanh điệu → Thanh mẫu → Vận mẫu → Quy tắc đọc → Cách gõ → Tự kiểm tra. Bạn có thể chia mỗi nhóm âm qua nhiều lần học.</p></>}
      {tab === 'tones' && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {TONE_GUIDE.filter(t => t.tone !== 5).map((tone) => <ToneCard key={tone.tone} tone={tone} onPlay={play} />)}
          </div>

          <ToneCard tone={TONE_GUIDE[4]} onPlay={play} compact />
          <PronunciationActivity unit={unit(2)} className="" />
          <Glass as="section" className="rounded-card p-5 sm:p-6">
            <h2 className="text-title3">Luyện nghe theo hàng</h2>
            <p className="text-subhead text-secondary-label">Chạm lần lượt từ trái sang phải để cảm nhận sự khác biệt.</p>
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
            <h2 className="mb-3 text-title3">Quy tắc biến điệu</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {RULES.map((r) => (
                <button key={r.title} type="button" onClick={() => play(r.say)} className="min-h-11 cursor-pointer rounded-2xl bg-feature-pronunciation-soft p-4 text-left transition-transform active:scale-[0.98]">
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
      {tab === 'pairs' && <TonePairDrill />}
      {tab === 'check' && <PronunciationActivity unit={unit(6)} />}
      {tab === 'chart' && <PronunciationChart searchable />}

      {(tab === 'initials' || tab === 'finals') && <>
        <div className="mt-4"><Hint title="Cách học nhóm âm này"><p>{unit(tab === 'initials' ? 3 : 4).body}</p><ol className="mt-3 space-y-2">{unit(tab === 'initials' ? 3 : 4).steps.map((step, i) => <li key={step}>{i + 1}. {step}</li>)}</ol><p className="mt-2">Chọn một âm, nghe → xem cách đặt miệng → đọc theo ba lần → nghe lại. Mỗi lượt chỉ cần một nhóm nhỏ.</p></Hint></div>
        {SOUND_GROUPS.map(group => {
          const sounds = SOUND_GUIDE.filter(sound => sound.group === group.id && sound.kind === tab)
          if (!sounds.length) return null
          return <Glass as="section" key={group.id} className="mt-6 p-4 sm:p-5"><h2 className="text-title3">{group.title}</h2><p className="text-subhead text-secondary-label">Chọn từng âm để nghe mẫu và tập khẩu hình.</p><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{sounds.map(sound => <SoundTile key={sound.id} item={sound} heard={heard.has(sound.id)} onPlay={(text) => playSound(sound.id, text)} />)}</div></Glass>
        })}
        <PronunciationActivity unit={unit(tab === 'initials' ? 3 : 4)} introduction={false} />
      </>}
    </div>
  )
}
