import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { findPronLesson } from '@/data/pronunciation'
import { PinyinRules, TypingGuide } from '@/components/lesson/PinyinGuide'
import { TonePairDrill, PinyinDictation } from '@/components/lesson/ToneDrills'
import { useStudyTimer } from '@/lib/useStudyTimer'
import type { Item } from '@/data/types'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { ToneContour } from '@/components/hanzi/ToneContour'
import { TONE_INFO, type Tone } from '@/lib/pinyin'
import { speak } from '@/lib/speech'
import { useSettings } from '@/store/settings'

const TABS = [
  ['tones', 'Thanh điệu'],
  ['initials', 'Thanh mẫu'],
  ['finals', 'Vận mẫu'],
  ['rules', 'Quy tắc đọc'],
  ['typing', 'Cách gõ'],
  ['pairs', 'Cặp thanh'],
  ['dictation', 'Nghe chép'],
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

function SoundTile({ item, onPlay }: { item: Item; onPlay: (s: string) => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onPlay(item.say)}
      className="text-left rounded-2xl border border-line bg-surface hover:bg-sunken p-4 cursor-pointer"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold">{item.label}</span>
        <span className="flex items-baseline gap-1.5">
          <Pinyin text={item.pinyin} />
          <span className="font-han">{item.hanzi}</span>
        </span>
      </div>
      <p className="text-xs text-muted mt-2 leading-relaxed">{item.note}</p>
    </motion.button>
  )
}

export function PronunciationPage() {
  useStudyTimer()
  const [params, setParams] = useSearchParams()
  const tab = TABS.find(([id]) => id === params.get('tab'))?.[0] ?? 'tones'
  const setTab = (t: Tab) => setParams({ tab: t }, { replace: true })
  const rate = useSettings((s) => s.speechRate)
  const play = (s: string) => speak(s, rate)

  const groups = (ids: string[]) => ids.map(findPronLesson)

  return (
    <div className="pt-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Phát âm</h1>
      <p className="text-muted mt-1">Chạm vào ô bất kỳ để nghe và đọc to theo. Thanh điệu sai thì nghĩa sai, nên đây là phần cần luyện đều mỗi ngày.</p>

      <div className="mt-6 flex max-w-full overflow-x-auto rounded-2xl bg-sunken p-1 gap-1 w-fit">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative rounded-xl px-3.5 py-2 text-sm font-semibold cursor-pointer whitespace-nowrap ${tab === id ? 'text-ink' : 'text-muted'}`}
          >
            {tab === id && <motion.span layoutId="tab" className="absolute inset-0 rounded-xl bg-surface shadow-sm" />}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      {tab === 'tones' && (
        <div className="mt-6 flex flex-col gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([1, 2, 3, 4] as Tone[]).map((t) => (
              <button
                key={t}
                onClick={() => play(TONE_ROWS[0][t - 1][1])}
                className="rounded-2xl border border-line bg-surface p-4 flex flex-col items-center cursor-pointer hover:bg-sunken"
              >
                <ToneContour tone={t} size={80} />
                <div className="font-bold">{TONE_INFO[t].name}</div>
                <div className="text-xs text-muted">{TONE_INFO[t].vn}</div>
                <p className="text-xs mt-2 text-center leading-relaxed">{TONE_INFO[t].hint}</p>
              </button>
            ))}
          </div>

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
      {tab === 'dictation' && <PinyinDictation />}

      {(tab === 'initials' || tab === 'finals') &&
        groups(tab === 'initials' ? ['initials-1', 'initials-2', 'initials-3'] : ['finals', 'finals-2']).map((l) => (
          <section key={l.id} className="mt-6">
            <h2 className="font-bold">{l.title.replace('Thanh mẫu: ', '')}</h2>
            <p className="text-sm text-muted mb-3">{l.subtitle}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {l.items.map((it) => (
                <SoundTile key={it.id} item={it} onPlay={play} />
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}
