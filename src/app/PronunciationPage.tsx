import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { SOUND_GUIDE, SOUND_GROUPS, TONE_GUIDE, type SoundGuide } from '@/data/pronunciationGuide'
import { PRONUNCIATION_UNITS, pronunciationProgress } from '@/data/pronunciationLearning'
import { PronunciationActivity } from '@/components/lesson/PronunciationActivity'
import { PronunciationChart } from '@/components/lesson/PronunciationChart'
import { useStudyData } from '@/lib/useStudyData'
import { PinyinRules, TypingGuide } from '@/components/lesson/PinyinGuide'
import { TonePairDrill } from '@/components/lesson/ToneDrills'
import { useStudyTimer } from '@/lib/useStudyTimer'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { ToneContour } from '@/components/hanzi/ToneContour'
import { speak } from '@/lib/speech'
import { useSettings } from '@/store/settings'

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

function SoundTile({ item, onPlay }: { item: SoundGuide; onPlay: (s: string) => void }) {
  return <motion.button whileTap={{ scale: 0.96 }} onClick={() => onPlay(item.say)} className="min-w-0 text-left rounded-2xl border border-line bg-surface hover:bg-sunken p-4 cursor-pointer">
    <span className="flex flex-wrap items-baseline justify-between gap-1"><span className="text-3xl font-medium">{item.label}</span><span className="flex items-baseline gap-1.5"><Pinyin text={item.pinyin} /><span className="font-han">{item.say}</span></span></span>
    <span className="mt-2 block text-sm font-medium text-jade">{item.approximate}</span>
    <span className="mt-2 block text-xs leading-relaxed">{item.mouth}</span>
    <span className="mt-2 block text-xs text-muted leading-relaxed">{item.caution}</span>
  </motion.button>
}

export function PronunciationPage() {
  useStudyTimer()
  const { lessonState } = useStudyData()
  const progress = pronunciationProgress(lessonState)
  const [params, setParams] = useSearchParams()
  const tab = TABS.find(([id]) => id === params.get('tab'))?.[0] ?? 'tones'
  const setTab = (t: Tab) => setParams({ tab: t }, { replace: true })
  const rate = useSettings((s) => s.speechRate)
  const play = (s: string) => speak(s, rate)

  const unit = (index: number) => PRONUNCIATION_UNITS[index]

  return (
    <div className="pt-6 w-full min-w-0">
      <h1 className="text-2xl font-bold">Phát âm</h1>
      <p className="text-muted mt-1">Chạm vào ô bất kỳ để nghe và đọc to theo. Thanh điệu sai thì nghĩa sai, nên đây là phần cần luyện đều mỗi ngày.</p>

      <p className="mt-2 text-sm text-muted">Gợi âm tiếng Việt chỉ gần đúng. Nghe mẫu rồi điều chỉnh khẩu hình; âm mẫu dùng giọng tiếng Trung trên thiết bị. <Link className="underline" to="/stats#settings">Cài đặt giọng đọc</Link>.</p>
      <p className="mt-3 text-sm font-medium text-jade">Đã hoàn thành {progress.completed}/{progress.total} mục nền tảng</p>
      <div className="mt-6 grid w-full grid-flow-col auto-cols-[8.5rem] sm:auto-cols-[9rem] overflow-x-auto rounded-2xl bg-sunken p-1 gap-1">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            aria-pressed={tab === id} className={`relative w-full min-h-11 rounded-xl px-3.5 py-2 text-sm font-semibold cursor-pointer whitespace-nowrap ${tab === id ? 'text-ink' : 'text-muted'}`}
          >
            {tab === id && <motion.span layoutId="tab" className="absolute inset-0 rounded-xl bg-surface shadow-sm" />}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      {tab === 'intro' && <><PronunciationActivity unit={unit(0)} /><PronunciationActivity unit={unit(1)} /><p className="mt-4 text-sm text-muted">Học theo thứ tự: Thanh điệu → Thanh mẫu → Vận mẫu → Quy tắc đọc → Cách gõ → Tự kiểm tra. Bạn có thể chia mỗi nhóm âm qua nhiều lần học.</p></>}
      {tab === 'tones' && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TONE_GUIDE.filter(t => t.tone !== 5).map((tone) => (
              <button
                key={tone.tone} onClick={() => play(tone.say)}
                className="rounded-2xl border border-line bg-surface p-4 flex flex-col items-center cursor-pointer hover:bg-sunken"
              >
                <ToneContour tone={tone.tone} size={80} />
                <div className="font-bold">{tone.label}</div>
                <div className="text-xs text-muted">{tone.direction}</div>
                <p className="text-xs mt-2 text-center leading-relaxed">{tone.caution}</p>
              </button>
            ))}
          </div>

          <button onClick={() => play(TONE_GUIDE[4].say)} className="rounded-2xl border border-line bg-surface p-4 text-left hover:bg-sunken cursor-pointer"><span className="font-semibold">Thanh nhẹ · māma 妈妈</span><span className="mt-1 block text-sm">{TONE_GUIDE[4].direction}</span><span className="mt-1 block text-xs text-muted">{TONE_GUIDE[4].caution}</span></button>
          <PronunciationActivity unit={unit(2)} className="" />
          <div className="rounded-3xl border border-line bg-surface p-5">
            <h2 className="font-bold">Luyện nghe theo hàng</h2>
            <p className="text-sm text-muted">Chạm lần lượt từ trái sang phải để cảm nhận sự khác biệt.</p>
            <div className="mt-4 grid gap-2">
              {TONE_ROWS.map((row, i) => (
                <div key={i} className="grid grid-cols-4 gap-2">
                  {row.map(([py, hz]) => (
                    <button key={py} onClick={() => play(hz)} className="rounded-xl bg-sunken hover:bg-line py-3 cursor-pointer">
                      <Pinyin text={py} className="text-xl" />
                      <span className="font-han text-muted ml-1.5">{hz}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold mb-3">Quy tắc biến điệu</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {RULES.map((r) => (
                <button key={r.title} onClick={() => play(r.say)} className="text-left rounded-2xl bg-gold-soft p-4 cursor-pointer">
                  <div className="font-bold">{r.title}</div>
                  <div className="text-sm font-bold text-gold mt-1">{r.ex}</div>
                  <p className="text-xs mt-2 leading-relaxed">{r.text}</p>
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
        <details className="mt-4 rounded-xl bg-sunken p-4 text-sm leading-relaxed"><summary className="cursor-pointer font-medium">Cách học nhóm âm này</summary><p className="mt-3">{unit(tab === 'initials' ? 3 : 4).body}</p><ol className="mt-3 space-y-2">{unit(tab === 'initials' ? 3 : 4).steps.map((step, i) => <li key={step}>{i + 1}. {step}</li>)}</ol><p className="mt-2">Chọn một âm, nghe → xem cách đặt miệng → đọc theo ba lần → nghe lại. Mỗi lượt chỉ cần một nhóm nhỏ.</p></details>
        {SOUND_GROUPS.map(group => {
          const sounds = SOUND_GUIDE.filter(sound => sound.group === group.id && sound.kind === tab)
          if (!sounds.length) return null
          return <section key={group.id} className="mt-6"><h2 className="font-semibold">{group.title}</h2><div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-3">{sounds.map(sound => <SoundTile key={sound.id} item={sound} onPlay={play} />)}</div></section>
        })}
        <PronunciationActivity unit={unit(tab === 'initials' ? 3 : 4)} introduction={false} />
      </>}
    </div>
  )
}
