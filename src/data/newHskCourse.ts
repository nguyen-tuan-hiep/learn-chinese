/** FLTRP New HSK Course lessons and user-supplied vocabulary. */
import rawVocabulary from './newHskCourseVocabulary.json'

export const NEW_HSK_COURSE = [
  {
    level: 1,
    source: 'https://www.aijiaocai.com/textbook/details?textbook_id=14062742',
    titles: [
      'AI小语，你好！', '我叫李文', '我是中国人', '我有两个孩子', '今天我休息',
      '你的手机号是多少？', '我晚上六点半下班', '我爸爸也在医院工作', '我明天上午在学校学习',
      '这儿的苹果真便宜！', '我读大学呢', '昨天下雪了', '请给我一杯茶', '我看了一个电影', '大兴机场见！',
    ],
  },
  {
    level: 2,
    source: 'https://www.aijiaocai.com/textbook/details?textbook_id=14062743',
    titles: [
      '她请我们吃了北京烤鸭', '还是打车去北大吧', '我想去西安旅游', '你穿红色的很好看',
      '第一次去中国朋友家', '小雪，生日快乐！', '他篮球打得很好', '虽然你忘了，但是我记得',
      '我去买杯奶茶', '就要考试了', '我最喜欢吃中国菜', '这里比北京冷多了',
      '我们爱上中文课', '一个人过年多没意思啊', '我想再去一次中国',
    ],
  },
  {
    level: 3,
    source: 'https://www.aijiaocai.com/textbook/details?textbook_id=14062744',
    titles: [
      '我们去机场接你们', '你们想吃什么就点什么', '这个小区挺好的', '这家宾馆跟别的都不一样',
      '这样的照片才好看', '高铁上还可以点外卖', '那条裙子比短裤更好看', '今天我出院了',
      '打不好没关系', '你明天再把书还给我', '看来我没办法解决这个问题', '这个季节天气变化很快',
      '我的新邻居来自英国', '这本书被别人借走了', '我是半个南京人', '我听说有的熊猫出国了',
      '我要多向认真的人学习', '我学会了包饺子',
    ],
  },
  {
    level: 4,
    source: '',
    titles: [
      '我们来中国学习了', '租到了合适的房子', '手机扫一下', '很高兴能帮到你', '“不怕辣”和“怕不辣”',
      '我陪你去看病', '在工作中学习', '该放松时就放松', '遇见你，刚刚好', '南方不懂北方的冷',
      '活到老学到老', '幸福的家庭', '美好的日子', '合适才买', '我去应聘了',
      '计划赶不上变化', '运动让我更健康', '科技改变生活', '他们都很棒', '看不完也读不完',
    ],
  },
] as const

const vocabulary = rawVocabulary as unknown as Record<string, [string, string, string, string][]>

/** All 68 lesson lists from the user-provided CSV; repeated senses retain separate entries. */
export const NEW_HSK_BOOK_LESSONS = NEW_HSK_COURSE.flatMap((book) => book.titles.map((title, index) => {
  const number = index + 1
  const entries = vocabulary[`${book.level}-${number}`] ?? []
  return {
    id: `hsk3-book-${book.level}-${number}`,
    band: book.level,
    number,
    title,
    words: entries.map(([hanzi, pinyin, pos, meaning], wordIndex) => ({
      id: 20000 + book.level * 1000 + number * 100 + wordIndex,
      hanzi, pinyin, pos, meaning,
    })),
  }
}))

export const newHskBookLesson = (id: string) => NEW_HSK_BOOK_LESSONS.find((lesson) => lesson.id === id)
/** Keep existing word progress keys when hiding the separate syllabus browser. */
export const bookWordProgressId = (id: number) => `hsk3-vocab-${id}`
