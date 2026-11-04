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
import { Card } from '@/components/ui/Button'
import { Hint } from '@/components/ui/Disclosure'
import { PageHeader } from '@/components/ui/PageHeader'
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

function SoundTile({ item, onPlay }: { item: SoundGuide; onPlay: (s: string) => void }) {
  return <motion.button whileTap={{ scale: 0.98 }} onClick={() => onPlay(item.say)} className="group flex min-w-0 cursor-pointer gap-4 rounded-2xl bg-surface p-4 text-left shadow-card transition hover:shadow-lift sm:flex-col sm:gap-0">
    <span className="flex w-16 shrink-0 flex-col items-center sm:w-auto sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-1">
      <span className="text-3xl font-semibold group-hover:text-jade">{item.label}</span>
      <span className="mt-1 flex items-baseline gap-1 text-sm sm:mt-0 sm:gap-1.5 sm:text-base"><Pinyin text={item.pinyin} /><span className="font-han">{item.say}</span></span>
    </span>
    <span className="min-w-0">
      <span className="block text-sm font-medium text-jade sm:mt-2">{item.approximate}</span>
      <span className="mt-1 block text-sm leading-relaxed sm:mt-2">{item.mouth}</span>
      <span className="mt-1 block text-xs leading-relaxed text-muted sm:mt-2">{item.caution}</span>
    </span>
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
    <div className="w-full min-w-0 pt-6 pb-10 sm:pt-8">
      <PageHeader eyebrow="Pinyin · thanh điệu" title="Phát âm"
        aside={<Card raised className="flex w-full items-center gap-4 p-4 pr-5 sm:w-auto">
          <ProgressRing value={progress.total ? progress.completed / progress.total : 0} size={48} stroke={5} />
          <div><p className="font-semibold tabular-nums">{progress.completed}/{progress.total} mục nền tảng</p><p className="text-sm text-muted">Học theo thứ tự các tab</p></div>
        </Card>}>
        Chạm vào ô bất kỳ để nghe và đọc to theo. Thanh điệu sai thì nghĩa sai, nên đây là phần cần luyện đều mỗi ngày.
      </PageHeader>

      <div className="mt-5"><Hint title="Lưu ý về gợi âm tiếng Việt">Gợi âm tiếng Việt chỉ gần đúng. Nghe mẫu rồi điều chỉnh khẩu hình; âm mẫu dùng giọng tiếng Trung trên thiết bị. <Link className="text-jade underline" to="/settings">Cài đặt giọng đọc</Link>.</Hint></div>
      {/* Sticky under the header on phones; the shared picker scrolls to keep the chosen tab in view. */}
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-10 -mx-4 mt-6 bg-paper/95 px-4 py-2 backdrop-blur md:static md:mx-0 md:bg-transparent md:p-0">
        <Segmented label="Các phần phát âm" value={tab} onChange={setTab} options={TABS.map(([value, label]) => ({ value, label }))} />
      </div>

      {tab === 'intro' && <><PronunciationActivity unit={unit(0)} /><PronunciationActivity unit={unit(1)} /><p className="mt-4 text-sm text-muted">Học theo thứ tự: Thanh điệu → Thanh mẫu → Vận mẫu → Quy tắc đọc → Cách gõ → Tự kiểm tra. Bạn có thể chia mỗi nhóm âm qua nhiều lần học.</p></>}
      {tab === 'tones' && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {TONE_GUIDE.filter(t => t.tone !== 5).map((tone) => (
              <button
                key={tone.tone} onClick={() => play(tone.say)}
                className="flex cursor-pointer items-center gap-4 rounded-2xl bg-surface p-4 text-left shadow-card transition hover:shadow-lift min-[480px]:flex-col min-[480px]:gap-0 min-[480px]:text-center"
              >
                <span className="shrink-0"><ToneContour tone={tone.tone} size={72} /></span>
                <span className="min-w-0">
                  <span className="block font-semibold">{tone.label}</span>
                  <span className="block text-sm text-muted">{tone.direction}</span>
                  <span className="mt-1.5 block text-sm leading-relaxed">{tone.caution}</span>
                </span>
              </button>
            ))}
          </div>

          <button onClick={() => play(TONE_GUIDE[4].say)} className="cursor-pointer rounded-2xl bg-surface p-4 text-left shadow-card transition hover:shadow-lift"><span className="font-semibold">Thanh nhẹ · māma 妈妈</span><span className="mt-1 block text-sm">{TONE_GUIDE[4].direction}</span><span className="mt-1 block text-xs text-muted">{TONE_GUIDE[4].caution}</span></button>
          <PronunciationActivity unit={unit(2)} className="" />
          <div className="rounded-2xl bg-surface p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold">Luyện nghe theo hàng</h2>
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
            <h2 className="mb-3 text-lg font-semibold">Quy tắc biến điệu</h2>
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
        <div className="mt-4"><Hint title="Cách học nhóm âm này"><p>{unit(tab === 'initials' ? 3 : 4).body}</p><ol className="mt-3 space-y-2">{unit(tab === 'initials' ? 3 : 4).steps.map((step, i) => <li key={step}>{i + 1}. {step}</li>)}</ol><p className="mt-2">Chọn một âm, nghe → xem cách đặt miệng → đọc theo ba lần → nghe lại. Mỗi lượt chỉ cần một nhóm nhỏ.</p></Hint></div>
        {SOUND_GROUPS.map(group => {
          const sounds = SOUND_GUIDE.filter(sound => sound.group === group.id && sound.kind === tab)
          if (!sounds.length) return null
          return <section key={group.id} className="mt-8"><h2 className="text-lg font-semibold">{group.title}</h2><div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{sounds.map(sound => <SoundTile key={sound.id} item={sound} onPlay={play} />)}</div></section>
        })}
        <PronunciationActivity unit={unit(tab === 'initials' ? 3 : 4)} introduction={false} />
      </>}
    </div>
  )
}
