import type { Item, Lesson } from './types'

const syl = (id: string, label: string, pinyin: string, say: string, note: string): Item => ({
  id,
  kind: 'syllable',
  label,
  pinyin,
  say,
  hanzi: say,
  note,
})

const tones: Lesson = {
  id: 'tones',
  title: 'The four tones',
  subtitle: 'mā · má · mǎ · mà',
  glyph: '声',
  items: [
    syl('t-ma1', 'mā', 'mā', '妈', 'Tone 1: high and level. 妈 means "mum".'),
    syl('t-ma2', 'má', 'má', '麻', 'Tone 2: rising, like asking "huh?". 麻 means "hemp".'),
    syl('t-ma3', 'mǎ', 'mǎ', '马', 'Tone 3: dips low, then lifts. 马 means "horse".'),
    syl('t-ma4', 'mà', 'mà', '骂', 'Tone 4: falls sharply, like a firm "No!". 骂 means "scold".'),
    syl('t-ba1', 'bā', 'bā', '八', 'Tone 1: 八 is the number 8.'),
    syl('t-ba2', 'bá', 'bá', '拔', 'Tone 2: 拔 means "pull out".'),
    syl('t-ba3', 'bǎ', 'bǎ', '把', 'Tone 3: 把 means "hold, grasp".'),
    syl('t-ba4', 'bà', 'bà', '爸', 'Tone 4: 爸 means "dad".'),
  ],
}

const initials1: Lesson = {
  id: 'initials-1',
  title: 'Initials: lips & tongue tip',
  subtitle: 'b p m f · d t n l',
  glyph: '口',
  items: [
    syl('i-b', 'b', 'bō', '波', 'Like the "p" in "spin": no puff of air. Press the lips, then release.'),
    syl('i-p', 'p', 'pō', '坡', '"p" with a strong PUFF of air, as in "pop". A paper in front of your mouth will flutter.'),
    syl('i-m', 'm', 'mō', '摸', 'Just like English "m".'),
    syl('i-f', 'f', 'fó', '佛', 'Just like English "f".'),
    syl('i-d', 'd', 'dé', '得', 'Like the "t" in "stop": unaspirated, not a voiced English "d".'),
    syl('i-t', 't', 'tè', '特', 'Like the "t" in "top": with a puff of air.'),
    syl('i-n', 'n', 'nè', '讷', 'Just like English "n".'),
    syl('i-l', 'l', 'lè', '乐', 'Just like English "l".'),
  ],
}

const initials2: Lesson = {
  id: 'initials-2',
  title: 'Initials: back & front of the tongue',
  subtitle: 'g k h · j q x',
  glyph: '舌',
  items: [
    syl('i-g', 'g', 'gē', '哥', 'Like the "k" in "skate": no puff of air (not a voiced "g").'),
    syl('i-k', 'k', 'kē', '科', '"k" with a PUFF of air, as in "kite".'),
    syl('i-h', 'h', 'hē', '喝', 'Rougher than English "h": friction at the back of the tongue, like Scottish "loch".'),
    syl('i-j', 'j', 'jī', '鸡', 'Close to the "j" in "jeep" but unvoiced. Press the front of the tongue to the palate.'),
    syl('i-q', 'q', 'qī', '七', 'Like the "ch" in "cheese" with a strong puff of air. Never "kw"!'),
    syl('i-x', 'x', 'xī', '西', 'Between "s" and "sh", as in "she" with the lips spread in a smile.'),
  ],
}

const initials3: Lesson = {
  id: 'initials-3',
  title: 'Initials: curled tongue & tongue tip',
  subtitle: 'zh ch sh r · z c s',
  glyph: '齿',
  items: [
    syl('i-zh', 'zh', 'zhī', '知', 'Like the "j" in "jug" with the tongue tip curled back; no puff of air.'),
    syl('i-ch', 'ch', 'chī', '吃', 'Like the "ch" in "church" with the tongue curled back, and a puff of air.'),
    syl('i-sh', 'sh', 'shī', '诗', 'Like the "sh" in "shirt" with the tongue curled back.'),
    syl('i-r', 'r', 'rì', '日', 'Curl the tongue as for "sh" but voice it, close to the "s" in "pleasure" or a soft "r".'),
    syl('i-z', 'z', 'zī', '资', 'Like the "ds" in "cards": tongue tip behind the upper teeth.'),
    syl('i-c', 'c', 'cí', '词', 'Like the "ts" in "cats" with a puff of air. Never "k"!'),
    syl('i-s', 's', 'sī', '思', 'Just like English "s". After z/c/s, the "i" is a buzzing vowel, not "ee".'),
  ],
}

const finals: Lesson = {
  id: 'finals',
  title: 'Basic finals',
  subtitle: 'a o e i u ü · ai ao ou',
  glyph: '韵',
  items: [
    syl('f-a', 'a', 'ā', '啊', 'Like the "a" in "father", mouth wide open.'),
    syl('f-o', 'o', 'ō', '喔', 'Rounded lips, like "aw" sliding towards "wo".'),
    syl('f-e', 'e', 'é', '鹅', 'Like the "u" in "duh", from the back of the throat. Never "eh"!'),
    syl('f-i', 'i', 'yī', '衣', 'Like the "ee" in "see".'),
    syl('f-u', 'u', 'wū', '乌', 'Like the "oo" in "food", lips rounded.'),
    syl('f-v', 'ü', 'yú', '鱼', 'Round the lips as for "oo" but say "ee", like French "u" or German "ü".'),
    syl('f-ai', 'ai', 'ài', '爱', 'Like the "eye" in English. 爱 means "love".'),
    syl('f-ao', 'ao', 'ào', '奥', 'Like the "ow" in "cow".'),
    syl('f-ou', 'ou', 'ōu', '欧', 'Like the "o" in "go".'),
  ],
}

const finals2: Lesson = {
  id: 'finals-2',
  title: 'Compound and nasal finals',
  subtitle: 'an en in · ang eng ing ong · ia ie ua uo · ian uan…',
  glyph: '鼻',
  items: [
    syl('f2-an', 'an', 'bān', '班', 'Like "ahn", ending with the tongue tip on the gum ridge.'),
    syl('f2-en', 'en', 'rén', '人', 'Like the "un" in "under", ending in n. Different from eng (ending in ng).'),
    syl('f2-in', 'in', 'xīn', '心', 'Like "een". Different from ing: xīn (heart) ≠ xīng (star).'),
    syl('f2-un', 'un', 'chūn', '春', 'Written un but SAID as uen: chūn ≈ "chwun".'),
    syl('f2-vn', 'ün', 'yún', '云', 'Lips rounded as for ü, then "n": ü + n.'),
    syl('f2-ang', 'ang', 'máng', '忙', 'Like "ahng", mouth still open at the end (ng at the back of the tongue).'),
    syl('f2-eng', 'eng', 'lěng', '冷', 'Like the "ung" in "lung". Not like English "eng".'),
    syl('f2-ing', 'ing', 'xīng', '星', 'Like the "ing" in "sing", with a light ng.'),
    syl('f2-ong', 'ong', 'zhōng', '中', 'Rounded lips, like "oong": zhōng ≈ "joong".'),
    syl('f2-ia', 'ia', 'jiā', '家', 'i + a run together: jiā ≈ "jyah".'),
    syl('f2-ie', 'ie', 'xiè', '谢', 'i + e run together, like "yeh". Here e sounds like "eh", not "uh".'),
    syl('f2-ua', 'ua', 'huā', '花', 'u + a run together: huā ≈ "hwah".'),
    syl('f2-uo', 'uo', 'guó', '国', 'u + o run together: guó ≈ "gwaw".'),
    syl('f2-ve', 'üe', 'yuè', '月', 'ü + e run together: rounded "ü" into "eh".'),
    syl('f2-iao', 'iao', 'xiǎo', '小', 'i + ao run together: xiǎo ≈ "shyow".'),
    syl('f2-iu', 'iu', 'liù', '六', 'Written iu, said as iou: liù ≈ "lyoh".'),
    syl('f2-ui', 'ui', 'duì', '对', 'Written ui, said as uei: duì ≈ "dway".'),
    syl('f2-uai', 'uai', 'kuài', '块', 'u + ai run together: kuài ≈ "kwhy".'),
    syl('f2-ian', 'ian', 'jiàn', '见', 'Written ian but said "yen", not "ee-an": jiàn ≈ "jyen".'),
    syl('f2-uan', 'uan', 'guān', '关', 'Like "wahn": guān ≈ "gwahn".'),
    syl('f2-van', 'üan', 'yuán', '元', 'Rounded ü into "en": yuán ≈ "ywen".'),
    syl('f2-iang', 'iang', 'xiǎng', '想', 'i + ang: xiǎng ≈ "shyahng".'),
    syl('f2-uang', 'uang', 'guāng', '光', 'u + ang: guāng ≈ "gwahng".'),
    syl('f2-iong', 'iong', 'xióng', '熊', 'i + ong: xióng ≈ "shyoong".'),
    syl('f2-er', 'er', 'èr', '二', 'Say "uh" and curl the tongue tip up, like American "are".'),
  ],
}

export const PRON_LESSONS: Lesson[] = [tones, initials1, initials2, initials3, finals, finals2]
export const PRON_ITEMS: Item[] = PRON_LESSONS.flatMap((l) => l.items)

export function findPronLesson(id: string): Lesson {
  return PRON_LESSONS.find((l) => l.id === id)!
}

/** Two-syllable tone combinations, the backbone of natural-sounding Mandarin. */
export interface TonePair {
  tones: [number, number]
  hanzi: string
  pinyin: string
  vi: string
}

export const TONE_PAIRS: TonePair[] = [
  { tones: [1, 1], hanzi: '星期', pinyin: 'xīngqī', vi: 'week' },
  { tones: [1, 2], hanzi: '中国', pinyin: 'Zhōngguó', vi: 'China' },
  { tones: [1, 3], hanzi: '喝水', pinyin: 'hē shuǐ', vi: 'drink water' },
  { tones: [1, 4], hanzi: '商店', pinyin: 'shāngdiàn', vi: 'shop' },
  { tones: [1, 5], hanzi: '桌子', pinyin: 'zhuōzi', vi: 'table' },
  { tones: [2, 1], hanzi: '明天', pinyin: 'míngtiān', vi: 'tomorrow' },
  { tones: [2, 2], hanzi: '学习', pinyin: 'xuéxí', vi: 'study' },
  { tones: [2, 3], hanzi: '苹果', pinyin: 'píngguǒ', vi: 'apple' },
  { tones: [2, 4], hanzi: '学校', pinyin: 'xuéxiào', vi: 'school' },
  { tones: [2, 5], hanzi: '朋友', pinyin: 'péngyou', vi: 'friend' },
  { tones: [3, 1], hanzi: '老师', pinyin: 'lǎoshī', vi: 'teacher' },
  { tones: [3, 2], hanzi: '有名', pinyin: 'yǒumíng', vi: 'famous' },
  { tones: [3, 3], hanzi: '你好', pinyin: 'nǐ hǎo', vi: 'hello (said ní hǎo)' },
  { tones: [3, 4], hanzi: '米饭', pinyin: 'mǐfàn', vi: 'cooked rice' },
  { tones: [3, 5], hanzi: '椅子', pinyin: 'yǐzi', vi: 'chair' },
  { tones: [4, 1], hanzi: '汽车', pinyin: 'qìchē', vi: 'car' },
  { tones: [4, 2], hanzi: '大学', pinyin: 'dàxué', vi: 'university' },
  { tones: [4, 3], hanzi: '汉语', pinyin: 'Hànyǔ', vi: 'Chinese language' },
  { tones: [4, 4], hanzi: '再见', pinyin: 'zàijiàn', vi: 'goodbye' },
  { tones: [4, 5], hanzi: '谢谢', pinyin: 'xièxie', vi: 'thank you' },
]
