/**
 * Both textbook courses, built from the user-provided CSVs (see scripts/build-book-vocab.mjs):
 * HSK 2.0 = HSK Standard Course 1–6, HSK 3.0 = FLTRP New HSK Course 1–4.
 * Each lesson is a word list; progress is one lessonState row per word (`done.vocab`) plus one per lesson.
 */
import hsk2Vocabulary from './hsk2Vocabulary.json'
import hsk3Vocabulary from './newHskCourseVocabulary.json'
import wordEmoji from './wordEmoji.json'
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

/** New HSK Course lesson titles: [hanzi, English (editorial translation for navigation), pinyin], as for HSK 2.0. */
const HSK3_TITLES: [string, string, string][][] = [
  [
    ['AI小语，你好！', 'Hello, AI Xiaoyu!', 'AI Xiǎoyǔ, nǐ hǎo!'],
    ['我叫李文', 'My name is Li Wen', 'Wǒ jiào Lǐ Wén'],
    ['我是中国人', "I'm Chinese", 'Wǒ shì Zhōngguó rén'],
    ['我有两个孩子', 'I have two children', 'Wǒ yǒu liǎng ge háizi'],
    ['今天我休息', "I'm off today", 'Jīntiān wǒ xiūxi'],
    ['你的手机号是多少？', "What's your phone number?", 'Nǐ de shǒujī hào shì duōshao?'],
    ['我晚上六点半下班', 'I finish work at 6:30 pm', 'Wǒ wǎnshang liù diǎn bàn xiàbān'],
    ['我爸爸也在医院工作', 'My dad also works at a hospital', 'Wǒ bàba yě zài yīyuàn gōngzuò'],
    ['我明天上午在学校学习', 'Tomorrow morning I study at school', 'Wǒ míngtiān shàngwǔ zài xuéxiào xuéxí'],
    ['这儿的苹果真便宜！', 'The apples here are so cheap!', 'Zhèr de píngguǒ zhēn piányi!'],
    ['我读大学呢', "I'm at university", 'Wǒ dú dàxué ne'],
    ['昨天下雪了', 'It snowed yesterday', 'Zuótiān xià xuě le'],
    ['请给我一杯茶', 'A cup of tea, please', 'Qǐng gěi wǒ yì bēi chá'],
    ['我看了一个电影', 'I watched a film', 'Wǒ kàn le yí ge diànyǐng'],
    ['大兴机场见！', 'See you at Daxing Airport!', 'Dàxīng Jīchǎng jiàn!'],
  ],
  [
    ['她请我们吃了北京烤鸭', 'She treated us to Peking duck', 'Tā qǐng wǒmen chī le Běijīng kǎoyā'],
    ['还是打车去北大吧', "Let's take a taxi to Peking University", 'Háishi dǎchē qù Běi-Dà ba'],
    ['我想去西安旅游', "I want to travel to Xi'an", "Wǒ xiǎng qù Xī'ān lǚyóu"],
    ['你穿红色的很好看', 'You look great in red', 'Nǐ chuān hóngsè de hěn hǎokàn'],
    ['第一次去中国朋友家', "First visit to a Chinese friend's home", 'Dì-yī cì qù Zhōngguó péngyou jiā'],
    ['小雪，生日快乐！', 'Happy birthday, Xiaoxue!', 'Xiǎoxuě, shēngrì kuàilè!'],
    ['他篮球打得很好', 'He plays basketball very well', 'Tā lánqiú dǎ de hěn hǎo'],
    ['虽然你忘了，但是我记得', 'You forgot, but I remember', 'Suīrán nǐ wàng le, dànshì wǒ jìde'],
    ['我去买杯奶茶', "I'm going to buy a bubble tea", 'Wǒ qù mǎi bēi nǎichá'],
    ['就要考试了', 'The exam is coming up', 'Jiù yào kǎoshì le'],
    ['我最喜欢吃中国菜', 'I love Chinese food most', 'Wǒ zuì xǐhuan chī Zhōngguó cài'],
    ['这里比北京冷多了', "It's much colder here than Beijing", 'Zhèlǐ bǐ Běijīng lěng duō le'],
    ['我们爱上中文课', 'We love Chinese class', 'Wǒmen ài shàng Zhōngwén kè'],
    ['一个人过年多没意思啊', 'New Year alone is no fun', 'Yí ge rén guònián duō méi yìsi a'],
    ['我想再去一次中国', 'I want to go to China again', 'Wǒ xiǎng zài qù yí cì Zhōngguó'],
  ],
  [
    ['我们去机场接你们', "We'll pick you up at the airport", 'Wǒmen qù jīchǎng jiē nǐmen'],
    ['你们想吃什么就点什么', "Order whatever you'd like", 'Nǐmen xiǎng chī shénme jiù diǎn shénme'],
    ['这个小区挺好的', 'This neighbourhood is quite nice', 'Zhège xiǎoqū tǐng hǎo de'],
    ['这家宾馆跟别的都不一样', 'This hotel is unlike any other', 'Zhè jiā bīnguǎn gēn bié de dōu bù yíyàng'],
    ['这样的照片才好看', 'Photos like this look good', 'Zhèyàng de zhàopiàn cái hǎokàn'],
    ['高铁上还可以点外卖', 'You can order takeaway on the bullet train', 'Gāotiě shang hái kěyǐ diǎn wàimài'],
    ['那条裙子比短裤更好看', 'That skirt looks better than the shorts', 'Nà tiáo qúnzi bǐ duǎnkù gèng hǎokàn'],
    ['今天我出院了', 'I left hospital today', 'Jīntiān wǒ chūyuàn le'],
    ['打不好没关系', "It's OK if you don't play well", 'Dǎ bu hǎo méi guānxi'],
    ['你明天再把书还给我', 'Give the book back to me tomorrow', 'Nǐ míngtiān zài bǎ shū huán gěi wǒ'],
    ['看来我没办法解决这个问题', "Looks like I can't solve this problem", 'Kànlái wǒ méi bànfǎ jiějué zhège wèntí'],
    ['这个季节天气变化很快', 'The weather changes fast this season', 'Zhège jìjié tiānqì biànhuà hěn kuài'],
    ['我的新邻居来自英国', 'My new neighbour is from the UK', 'Wǒ de xīn línjū láizì Yīngguó'],
    ['这本书被别人借走了', 'Someone has borrowed this book', 'Zhè běn shū bèi biérén jiè zǒu le'],
    ['我是半个南京人', "I'm half from Nanjing", 'Wǒ shì bàn ge Nánjīng rén'],
    ['我听说有的熊猫出国了', 'I hear some pandas went abroad', 'Wǒ tīngshuō yǒude xióngmāo chūguó le'],
    ['我要多向认真的人学习', 'I should learn from hard-working people', 'Wǒ yào duō xiàng rènzhēn de rén xuéxí'],
    ['我学会了包饺子', 'I learned to make dumplings', 'Wǒ xuéhuì le bāo jiǎozi'],
  ],
  [
    ['我们来中国学习了', 'We came to study in China', 'Wǒmen lái Zhōngguó xuéxí le'],
    ['租到了合适的房子', 'Found a good flat to rent', 'Zū dào le héshì de fángzi'],
    ['手机扫一下', 'Just scan it with your phone', 'Shǒujī sǎo yíxià'],
    ['很高兴能帮到你', 'Glad I could help', 'Hěn gāoxìng néng bāng dào nǐ'],
    ['“不怕辣”和“怕不辣”', "“Not afraid of spice” vs “afraid it's not spicy”", '“Bú pà là” hé “pà bú là”'],
    ['我陪你去看病', "I'll take you to the doctor", 'Wǒ péi nǐ qù kànbìng'],
    ['在工作中学习', 'Learning on the job', 'Zài gōngzuò zhōng xuéxí'],
    ['该放松时就放松', "Relax when it's time to relax", 'Gāi fàngsōng shí jiù fàngsōng'],
    ['遇见你，刚刚好', 'Meeting you was just right', 'Yùjiàn nǐ, gānggāng hǎo'],
    ['南方不懂北方的冷', "The south doesn't know the north's cold", 'Nánfāng bù dǒng běifāng de lěng'],
    ['活到老学到老', 'Never too old to learn', 'Huó dào lǎo xué dào lǎo'],
    ['幸福的家庭', 'A happy family', 'Xìngfú de jiātíng'],
    ['美好的日子', 'Good days', 'Měihǎo de rìzi'],
    ['合适才买', 'Buy only if it fits', 'Héshì cái mǎi'],
    ['我去应聘了', 'I went for a job interview', 'Wǒ qù yìngpìn le'],
    ['计划赶不上变化', "Plans can't keep up with change", 'Jìhuà gǎn bu shàng biànhuà'],
    ['运动让我更健康', 'Sport keeps me healthier', 'Yùndòng ràng wǒ gèng jiànkāng'],
    ['科技改变生活', 'Technology changes life', 'Kējì gǎibiàn shēnghuó'],
    ['他们都很棒', "They're all great", 'Tāmen dōu hěn bàng'],
    ['看不完也读不完', 'Too much to watch, too much to read', 'Kàn bu wán yě dú bu wán'],
  ],
]

const words = (rows: Rows, prefix: string, level: number, number: number): Word[] =>
  (rows[`${level}-${number}`] ?? []).map(([hanzi, pinyin, pos, meaning], index) => ({
    id: `${prefix}-${level}-${number}-${index}`, hanzi, pinyin, pos, meaning,
    emoji: (wordEmoji as Record<string, string>)[hanzi.trim()],
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
    lessons: titles.map(([title, titleVi, titlePinyin], j): CourseLesson => ({
      id: `hsk3-book-${level}-${j + 1}`, version: '3.0', level, number: j + 1, title, titleVi, titlePinyin,
      words: words(hsk3Vocabulary as unknown as Rows, 'hsk3-vocab', level, j + 1),
    })),
  }
})

export const booksFor = (version: HskVersion) => version === '3.0' ? HSK3_BOOKS : HSK2_BOOKS

/** HSK 2.0 lessons in course order; the radical and character pages follow this course. */
export const LESSONS: CourseLesson[] = HSK2_BOOKS.flatMap((book) => book.lessons)
export const HSK3_LESSONS: CourseLesson[] = HSK3_BOOKS.flatMap((book) => book.lessons)
const ALL_LESSONS = [...LESSONS, ...HSK3_LESSONS]

export const lessonName = (lesson: Pick<CourseLesson, 'level' | 'number'>) => `HSK ${lesson.level} · Lesson ${lesson.number}`

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
