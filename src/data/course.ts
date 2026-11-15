/**
 * Both textbook courses, built from the user-provided CSVs (see scripts/build-book-vocab.mjs):
 * HSK 2.0 = HSK Standard Course 1–6, HSK 3.0 = FLTRP New HSK Course 1–4.
 * Each lesson is a word list; progress is one lessonState row per word (`done.vocab`) plus one per lesson.
 */
import hsk2Vocabulary from './hsk2Vocabulary.json'
import hsk3Vocabulary from './newHskCourseVocabulary.json'
import { TEXTBOOK_LESSONS } from './hsk2Titles'
import type { CourseLesson, Word } from './types'

export type HskVersion = '2.0' | '3.0'

export interface Book {
  version: HskVersion
  level: number
  /** e.g. "HSK Standard Course 4A–4B". */
  textbook: string
  lessons: CourseLesson[]
}

type Rows = Record<string, [string, string, string, string][]>

const HSK2_LESSON_COUNTS = [15, 15, 20, 20, 36, 40]
const HSK2_TEXTBOOKS = ['HSK Standard Course 1', 'HSK Standard Course 2', 'HSK Standard Course 3', 'HSK Standard Course 4A–4B', 'HSK Standard Course 5A–5B', 'HSK Standard Course 6A–6B']

const HSK3_TITLES: string[][] = [
  [
    'AI小语，你好！', '我叫李文', '我是中国人', '我有两个孩子', '今天我休息',
    '你的手机号是多少？', '我晚上六点半下班', '我爸爸也在医院工作', '我明天上午在学校学习',
    '这儿的苹果真便宜！', '我读大学呢', '昨天下雪了', '请给我一杯茶', '我看了一个电影', '大兴机场见！',
  ],
  [
    '她请我们吃了北京烤鸭', '还是打车去北大吧', '我想去西安旅游', '你穿红色的很好看',
    '第一次去中国朋友家', '小雪，生日快乐！', '他篮球打得很好', '虽然你忘了，但是我记得',
    '我去买杯奶茶', '就要考试了', '我最喜欢吃中国菜', '这里比北京冷多了',
    '我们爱上中文课', '一个人过年多没意思啊', '我想再去一次中国',
  ],
  [
    '我们去机场接你们', '你们想吃什么就点什么', '这个小区挺好的', '这家宾馆跟别的都不一样',
    '这样的照片才好看', '高铁上还可以点外卖', '那条裙子比短裤更好看', '今天我出院了',
    '打不好没关系', '你明天再把书还给我', '看来我没办法解决这个问题', '这个季节天气变化很快',
    '我的新邻居来自英国', '这本书被别人借走了', '我是半个南京人', '我听说有的熊猫出国了',
    '我要多向认真的人学习', '我学会了包饺子',
  ],
  [
    '我们来中国学习了', '租到了合适的房子', '手机扫一下', '很高兴能帮到你', '“不怕辣”和“怕不辣”',
    '我陪你去看病', '在工作中学习', '该放松时就放松', '遇见你，刚刚好', '南方不懂北方的冷',
    '活到老学到老', '幸福的家庭', '美好的日子', '合适才买', '我去应聘了',
    '计划赶不上变化', '运动让我更健康', '科技改变生活', '他们都很棒', '看不完也读不完',
  ],
]

const words = (rows: Rows, prefix: string, level: number, number: number): Word[] =>
  (rows[`${level}-${number}`] ?? []).map(([hanzi, pinyin, pos, meaning], index) => ({
    id: `${prefix}-${level}-${number}-${index}`, hanzi, pinyin, pos, meaning,
  }))

export const HSK2_BOOKS: Book[] = HSK2_LESSON_COUNTS.map((count, i) => {
  const level = i + 1
  return {
    version: '2.0', level, textbook: HSK2_TEXTBOOKS[i],
    lessons: Array.from({ length: count }, (_, j): CourseLesson => {
      const number = j + 1
      const title = TEXTBOOK_LESSONS[level]?.[j]
      return {
        id: `hsk${level}-${String(number).padStart(2, '0')}`, version: '2.0', level, number,
        title: title?.hanzi ?? `第${number}课`, titlePinyin: title?.pinyin, titleVi: title?.vi,
        volume: title && level >= 4 ? title.volume : undefined,
        words: words(hsk2Vocabulary as unknown as Rows, 'hsk2-vocab', level, number),
      }
    }),
  }
})

export const HSK3_BOOKS: Book[] = HSK3_TITLES.map((titles, i) => {
  const level = i + 1
  return {
    version: '3.0', level, textbook: `New HSK Course ${level}`,
    lessons: titles.map((title, j): CourseLesson => ({
      id: `hsk3-book-${level}-${j + 1}`, version: '3.0', level, number: j + 1, title,
      words: words(hsk3Vocabulary as unknown as Rows, 'hsk3-vocab', level, j + 1),
    })),
  }
})

export const booksFor = (version: HskVersion) => version === '3.0' ? HSK3_BOOKS : HSK2_BOOKS

/** HSK 2.0 lessons in course order; the radical and character pages follow this course. */
export const LESSONS: CourseLesson[] = HSK2_BOOKS.flatMap((book) => book.lessons)
export const HSK3_LESSONS: CourseLesson[] = HSK3_BOOKS.flatMap((book) => book.lessons)
const ALL_LESSONS = [...LESSONS, ...HSK3_LESSONS]

export const lessonName = (lesson: Pick<CourseLesson, 'level' | 'number'>) => `HSK ${lesson.level} · Bài ${lesson.number}`

/** Every word of both courses by id, with its lesson. */
export const WORDS: Map<string, { word: Word; lesson: CourseLesson }> = new Map(
  ALL_LESSONS.flatMap((lesson) => lesson.words.map((word) => [word.id, { word, lesson }] as const)),
)

export function findCourseLesson(id: string): CourseLesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id)
}

/** The lesson after this one in the same course, or undefined at the end. */
export function followingLesson(lesson: CourseLesson): CourseLesson | undefined {
  const list = lesson.version === '3.0' ? HSK3_LESSONS : LESSONS
  return list[list.indexOf(lesson) + 1]
}

/** HSK 3.0 word ids before the string ids: 20000 + level·1000 + lesson·100 + index. They overlapped from lesson 10 on. */
export const legacyHsk3WordId = (level: number, number: number, index: number) => 20000 + level * 1000 + number * 100 + index

const CJK = /\p{Script=Han}/u

/** Characters introduced in a lesson for the first time (HSK 2.0 course order). */
export function newCharacters(lesson: CourseLesson): string[] {
  const before = new Set(LESSONS.slice(0, LESSONS.indexOf(lesson)).flatMap((l) => l.words.flatMap((w) => [...w.hanzi])))
  const out: string[] = []
  for (const w of lesson.words) for (const ch of w.hanzi) if (CJK.test(ch) && !before.has(ch) && !out.includes(ch)) out.push(ch)
  return out
}
