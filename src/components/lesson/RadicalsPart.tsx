import { useState } from 'react'
import type { CourseLesson, Word } from '@/data/types'
import { RADICAL_FOR_CHARACTER } from '@/data/radicalMap'
import { Button, Card } from '@/components/ui/Button'
import { ColoredHanzi } from '@/components/hanzi/ColoredHanzi'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { SpeakButton } from '@/components/hanzi/SpeakButton'
import { StrokeWriter } from '@/components/hanzi/StrokeWriter'
import { lessonRadicalStudy, type LessonRadicalStudy } from '@/lib/lessonRadicalStudy'
import { radicalPosition } from '@/lib/radicalExamples'

function ExampleWord({ word, radicalId }: { word: Word; radicalId: number }) {
  const highlight = new Map([[radicalId, 'var(--color-jade)']])
  return <li className="flex items-start gap-2 py-2">
    <SpeakButton text={word.hanzi} size="sm" />
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="inline-flex flex-wrap items-center" aria-label={word.hanzi}>
          {[...word.hanzi].map((char, index) => RADICAL_FOR_CHARACTER.get(char) === radicalId
            ? <span key={index} className="inline-flex items-center rounded bg-jade-soft" title={`Chữ ${char} có bộ đang học`}><ColoredHanzi char={char} highlight={highlight} size={28} /></span>
            : <span key={index} className="font-han text-2xl leading-7">{char}</span>)}
        </span>
        <Pinyin text={word.pinyin} className="text-sm" />
      </div>
      <p className="mt-0.5 text-sm leading-relaxed text-muted break-words">{word.meaning}</p>
    </div>
  </li>
}

function RadicalPractice({ glyph }: { glyph: string }) {
  const [mode, setMode] = useState<'animate' | 'trace'>('animate')
  const [unavailable, setUnavailable] = useState(false)
  const [mistakes, setMistakes] = useState<number | null>(null)
  return <div className="mt-3 rounded-xl bg-sunken p-3">
    <div className="mb-3 flex flex-wrap gap-2" aria-label="Cách luyện bộ thủ">
      <Button variant={mode === 'animate' ? 'primary' : 'secondary'} aria-pressed={mode === 'animate'} onClick={() => setMode('animate')}>Xem nét</Button>
      <Button variant={mode === 'trace' ? 'primary' : 'secondary'} aria-pressed={mode === 'trace'} onClick={() => setMode('trace')}>Viết theo mẫu</Button>
    </div>
    <div className="flex justify-center"><StrokeWriter key={`${glyph}-${mode}`} char={glyph} mode={mode} size={204} onUnavailable={() => setUnavailable(true)} onComplete={setMistakes} /></div>
    {unavailable && <p className="mt-2 text-xs text-muted">Nếu không tải được nét chữ, bạn có thể quan sát hình bộ phía trên và luyện lại sau.</p>}
    {mode === 'trace' && mistakes !== null && <p role="status" className="mt-2 text-sm text-jade">Đã viết xong bộ này.</p>}
  </div>
}

function RadicalStudyRow({ item }: { item: LessonRadicalStudy }) {
  const { radical, words, examples } = item
  const [practicing, setPracticing] = useState(false)
  const variants = [...new Set([radical.glyph, ...radical.variants])].filter((glyph) => glyph !== radical.writingGlyph)
  const titleId = `lesson-radical-${radical.id}`
  return <Card className="min-w-0 overflow-hidden p-4 sm:p-5" role="region" aria-labelledby={titleId}>
    <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(16rem,0.9fr)_minmax(0,1fr)_minmax(20rem,1.2fr)]">
      <div className="min-w-0">
        <div className="flex items-start gap-3 xl:flex-col">
          <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-jade-soft" aria-label={`Bộ ${radical.writingGlyph}`}>
            <ColoredHanzi char={radical.writingGlyph} highlight={new Map([[radical.id, 'var(--color-jade)']])} size={64} />
          </div>
          <div className="min-w-0">
            <h3 id={titleId} className="font-semibold">Bộ {radical.meaning}</h3>
            {variants.length > 0 && <p className="mt-1 flex flex-wrap items-baseline gap-x-1 text-xs text-muted">Dạng khác: <span className="font-han text-xl leading-7 text-ink">{variants.join(' · ')}</span></p>}
            <p className="mt-1 text-xs text-muted">Vị trí: {radicalPosition([radical.writingGlyph, radical.glyph, ...radical.variants])}</p>
            <p className="mt-2 text-xs text-muted">{item.introducedEarlier ? 'Đã xuất hiện ở bài trước' : 'Lần đầu xuất hiện trong giáo trình'}</p>
          </div>
        </div>
        <Button variant="secondary" className="mt-3 w-full sm:w-auto xl:w-full" aria-expanded={practicing} aria-controls={`radical-practice-${radical.id}`} onClick={() => setPracticing(!practicing)}>{practicing ? 'Đóng luyện viết' : 'Luyện viết bộ này'}</Button>
      </div>
      <section className="min-w-0 border-t border-line pt-4 xl:border-t-0 xl:border-l xl:pl-5 xl:pt-0" aria-labelledby={`radical-lesson-words-${radical.id}`}>
        <h4 id={`radical-lesson-words-${radical.id}`} className="text-sm font-semibold">Trong bài này</h4>
        <ul className="mt-1 divide-y divide-line">{words.map((word) => <ExampleWord key={word.id} word={word} radicalId={radical.id} />)}</ul>
      </section>
      <section className="min-w-0 border-t border-line pt-4 xl:border-t-0 xl:border-l xl:pl-5 xl:pt-0" aria-labelledby={`radical-example-words-${radical.id}`}>
        <h4 id={`radical-example-words-${radical.id}`} className="text-sm font-semibold">Ví dụ thêm</h4>
        {examples.length > 0
          ? <ul className="mt-1 divide-y divide-line">{examples.map((word) => <ExampleWord key={word.id} word={word} radicalId={radical.id} />)}</ul>
          : <p className="mt-2 text-sm text-muted">Chưa có ví dụ thêm trong dữ liệu hiện tại.</p>}
      </section>
    </div>
    <div id={`radical-practice-${radical.id}`}>
      {practicing && <RadicalPractice glyph={radical.writingGlyph} />}
    </div>
  </Card>
}

export function RadicalsPart({ lesson }: { lesson: CourseLesson }) {
  const items = lessonRadicalStudy(lesson)
  const primary = items.slice(0, 5)
  const additional = items.slice(5)
  const [expanded, setExpanded] = useState(false)
  const renderRow = (item: LessonRadicalStudy) => <RadicalStudyRow key={item.radical.id} item={item} />
  return <div className="space-y-4">
    <div>
      <h2 className="text-xl font-semibold">Bộ thủ</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">Nhận diện bộ thủ qua các từ ở tab Từ mới, rồi xem thêm từ khác có cùng bộ. Chữ chứa bộ đang học được đánh dấu bằng nền xanh.</p>
    </div>
    {items.length > 0 ? <>
      <div className="rounded-xl bg-jade-soft px-4 py-3 text-sm leading-relaxed">
        <p className="font-semibold">{items.length} bộ thủ có trong từ vựng của bài</p>
        <p className="mt-1 text-muted"><span className="font-medium text-ink">Bộ ưu tiên học trước:</span> tối đa 5 bộ, chọn các bộ lần đầu xuất hiện trong giáo trình trước. Trong mỗi nhóm, bộ có trong nhiều từ của bài hơn được xếp trước.</p>
        {additional.length > 0 && <p className="mt-1 text-muted"><span className="font-medium text-ink">Các bộ còn lại:</span> {additional.length} bộ cũng có trong từ vựng của bài, có thể gồm cả bộ lần đầu xuất hiện và bộ đã gặp ở bài trước. Bạn có thể mở để học tiếp khi muốn.</p>}
        <p className="mt-1 text-xs text-muted">“Đã xuất hiện” tính theo thứ tự giáo trình, không phải đánh giá bạn đã nhớ bộ đó.</p>
      </div>
      <section aria-labelledby="priority-lesson-radicals-title" className="space-y-3">
        <h3 id="priority-lesson-radicals-title" className="text-base font-semibold">Bộ ưu tiên học trước ({primary.length})</h3>
        {primary.map(renderRow)}
      </section>
      {additional.length > 0 && <section>
        <Button variant="secondary" aria-expanded={expanded} aria-controls="additional-lesson-radicals" onClick={() => setExpanded(!expanded)}>{expanded ? 'Ẩn các bộ còn lại' : 'Xem các bộ còn lại của bài'} ({additional.length})</Button>
        <div id="additional-lesson-radicals" hidden={!expanded}>
          {expanded && <div className="mt-3 space-y-3">{additional.map(renderRow)}</div>}
        </div>
      </section>}
    </> : <Card className="p-5"><p className="text-sm text-muted">Chưa có dữ liệu bộ thủ cho các từ của bài này. Bạn vẫn có thể hoàn thành phần học và quay lại sau.</p></Card>}
  </div>
}
