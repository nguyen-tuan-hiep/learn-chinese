import { Link } from 'react-router-dom'
import { LEVELS } from '@/data/course'
import { Card } from '@/components/ui/Button'
import { Pinyin } from '@/components/hanzi/Pinyin'
import { PARTS, partsDone } from '@/lib/lessonState'
import { useStudyData } from '@/lib/useStudyData'

export function CoursePage() {
  const { lessonState } = useStudyData()
  return (
    <div className="max-w-3xl pt-6">
      <h1 className="text-2xl font-bold">Giáo trình</h1>
      <p className="text-muted mt-1">
        Theo cấu trúc HSK Standard Course. Mỗi bài có 4 phần: từ vựng, ngữ pháp, hội thoại, viết chữ. Học từng nhóm nhỏ, mỗi buổi khoảng 10–15 phút; không cần xong cả bài trong một ngày.
      </p>

      <Link to="/start" className="block mt-6">
        <Card className="p-5 hover:bg-sunken transition">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">Nền tảng</div>
          <div className="font-semibold mt-1">Bắt đầu từ số 0 · 7 buổi ngắn</div>
          <div className="text-sm text-muted">Làm quen âm thanh, thanh điệu, cách gõ và cuộc hội thoại đầu tiên. Mỗi buổi 5–10 phút.</div>
        </Card>
      </Link>

      <Link to="/radicals" className="block mt-3">
        <Card className="p-5 hover:bg-sunken transition">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">Nền tảng chữ Hán</div>
          <div className="font-semibold mt-1">Bộ thủ · đủ 214 bộ</div>
          <div className="text-sm text-muted">Bắt đầu với 40 bộ thường gặp, luyện nhận mặt và viết nét; học phần còn lại song song với HSK.</div>
        </Card>
      </Link>

      {LEVELS.map((lv) => (
        <section key={lv.level} className="mt-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold">{lv.title}</h2>
            <span className="text-sm text-muted">
              {lv.lessons.length}/{lv.plannedLessons} bài đã có · {lv.totalWords} từ
            </span>
          </div>
          <div className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
            {Array.from({ length: lv.plannedLessons }, (_, i) => {
              const lesson = lv.lessons[i]
              if (!lesson)
                return (
                  <div key={i} className="flex items-center gap-4 px-5 py-3 text-muted">
                    <span className="w-8 text-sm tabular-nums">{i + 1}</span>
                    <span className="text-sm">Đang soạn nội dung</span>
                  </div>
                )
              const n = partsDone(lessonState, lesson.id)
              return (
                <div key={lesson.id}>
                <Link to={`/lesson/${lesson.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-sunken transition">
                  <span className="w-8 text-sm font-bold tabular-nums text-muted">{lesson.number}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-han text-lg">{lesson.title}</div>
                    <div className="text-sm truncate">
                      <Pinyin text={lesson.titlePinyin} /> <span className="text-muted">· {lesson.titleVi}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1 justify-end">
                      {PARTS.map((p) => (
                        <span key={p.id} className={`h-1.5 w-5 rounded-full ${lessonState.get(lesson.id)?.done[p.id] ? 'bg-jade' : 'bg-line'}`} />
                      ))}
                    </div>
                    <div className="text-xs text-muted mt-1">
                      {n}/4 phần · {lesson.words.length} từ
                    </div>
                    {Object.values(lessonState.get(lesson.id)?.needsPractice ?? {}).some(Boolean) && <div className="text-xs text-cinnabar mt-1">Có phần cần luyện lại</div>}
                  </div>
                </Link>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
