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
  title: 'Bốn thanh điệu',
  subtitle: 'mā · má · mǎ · mà',
  glyph: '声',
  items: [
    syl('t-ma1', 'mā', 'mā', '妈', 'Thanh 1: cao và đều. 妈 nghĩa là "mẹ".'),
    syl('t-ma2', 'má', 'má', '麻', 'Thanh 2: đi lên như dấu sắc. 麻 nghĩa là "cây gai".'),
    syl('t-ma3', 'mǎ', 'mǎ', '马', 'Thanh 3: xuống thấp rồi nhấc lên. 马 nghĩa là "ngựa".'),
    syl('t-ma4', 'mà', 'mà', '骂', 'Thanh 4: rơi mạnh, dứt khoát. 骂 nghĩa là "mắng".'),
    syl('t-ba1', 'bā', 'bā', '八', 'Thanh 1: 八 là số 8.'),
    syl('t-ba2', 'bá', 'bá', '拔', 'Thanh 2: 拔 nghĩa là "nhổ".'),
    syl('t-ba3', 'bǎ', 'bǎ', '把', 'Thanh 3: 把 nghĩa là "cầm, nắm".'),
    syl('t-ba4', 'bà', 'bà', '爸', 'Thanh 4: 爸 nghĩa là "bố".'),
  ],
}

const initials1: Lesson = {
  id: 'initials-1',
  title: 'Thanh mẫu: môi & lưỡi',
  subtitle: 'b p m f · d t n l',
  glyph: '口',
  items: [
    syl('i-b', 'b', 'bō', '波', 'Như "p" không bật hơi. Môi mím nhẹ rồi bật ra.'),
    syl('i-p', 'p', 'pō', '坡', '"p" BẬT HƠI mạnh. Để tờ giấy trước miệng sẽ thấy giấy rung.'),
    syl('i-m', 'm', 'mō', '摸', 'Giống hệt "m" tiếng Việt.'),
    syl('i-f', 'f', 'fó', '佛', 'Giống "ph" tiếng Việt.'),
    syl('i-d', 'd', 'dé', '得', 'Như "t" tiếng Việt (không phải "đ" hay "d").'),
    syl('i-t', 't', 'tè', '特', 'Như "th" tiếng Việt: có bật hơi.'),
    syl('i-n', 'n', 'nè', '讷', 'Giống "n" tiếng Việt.'),
    syl('i-l', 'l', 'lè', '乐', 'Giống "l" tiếng Việt.'),
  ],
}

const initials2: Lesson = {
  id: 'initials-2',
  title: 'Thanh mẫu: cuống & mặt lưỡi',
  subtitle: 'g k h · j q x',
  glyph: '舌',
  items: [
    syl('i-g', 'g', 'gē', '哥', 'Như "c/k" tiếng Việt, không bật hơi.'),
    syl('i-k', 'k', 'kē', '科', '"k" BẬT HƠI. Không phải "kh" tiếng Việt!'),
    syl('i-h', 'h', 'hē', '喝', 'Gần "kh" tiếng Việt: hơi ma sát ở cuống lưỡi.'),
    syl('i-j', 'j', 'jī', '鸡', 'Gần "ch" tiếng Việt. Mặt lưỡi áp vào vòm miệng.'),
    syl('i-q', 'q', 'qī', '七', 'Như "ch" nhưng BẬT HƠI mạnh. Không đọc là "kw"!'),
    syl('i-x', 'x', 'xī', '西', 'Gần "x" tiếng Việt, môi hơi dẹt như đang cười.'),
  ],
}

const initials3: Lesson = {
  id: 'initials-3',
  title: 'Thanh mẫu: uốn lưỡi & đầu lưỡi',
  subtitle: 'zh ch sh r · z c s',
  glyph: '齿',
  items: [
    syl('i-zh', 'zh', 'zhī', '知', 'Gần "tr" tiếng Việt: uốn đầu lưỡi lên, không bật hơi.'),
    syl('i-ch', 'ch', 'chī', '吃', 'Như "tr" uốn lưỡi nhưng BẬT HƠI.'),
    syl('i-sh', 'sh', 'shī', '诗', 'Như "s" uốn lưỡi (giọng miền Trung/Nam đọc chuẩn).'),
    syl('i-r', 'r', 'rì', '日', 'Uốn lưỡi như "sh" nhưng rung dây thanh, nghe gần "r" mềm.'),
    syl('i-z', 'z', 'zī', '资', 'Âm "ts": đầu lưỡi chạm chân răng trên.'),
    syl('i-c', 'c', 'cí', '词', '"ts" BẬT HƠI. Không đọc là "k"!'),
    syl('i-s', 's', 'sī', '思', 'Giống "x" tiếng Việt. Sau z/c/s, chữ "i" đọc thành "ư".'),
  ],
}

const finals: Lesson = {
  id: 'finals',
  title: 'Vận mẫu cơ bản',
  subtitle: 'a o e i u ü · ai ao ou',
  glyph: '韵',
  items: [
    syl('f-a', 'a', 'ā', '啊', 'Như "a" tiếng Việt, mở miệng to.'),
    syl('f-o', 'o', 'ō', '喔', 'Gần "ô" tiếng Việt, tròn môi và hơi kéo về "ua".'),
    syl('f-e', 'e', 'é', '鹅', 'Gần "ơ" kéo về phía "ưa". Không đọc là "e"!'),
    syl('f-i', 'i', 'yī', '衣', 'Như "i" tiếng Việt.'),
    syl('f-u', 'u', 'wū', '乌', 'Như "u" tiếng Việt, môi tròn.'),
    syl('f-v', 'ü', 'yú', '鱼', 'Môi tròn như "u" nhưng lưỡi đọc "i". Gần "uy" đọc liền.'),
    syl('f-ai', 'ai', 'ài', '爱', 'Như "ai" tiếng Việt. 爱 nghĩa là "yêu".'),
    syl('f-ao', 'ao', 'ào', '奥', 'Như "ao" tiếng Việt.'),
    syl('f-ou', 'ou', 'ōu', '欧', 'Như "âu" tiếng Việt.'),
  ],
}

const finals2: Lesson = {
  id: 'finals-2',
  title: 'Vận mẫu ghép và vận mẫu mũi',
  subtitle: 'an en in · ang eng ing ong · ia ie ua uo · ian uan…',
  glyph: '鼻',
  items: [
    syl('f2-an', 'an', 'bān', '班', 'Như "an" tiếng Việt, kết thúc bằng đầu lưỡi chạm lợi trên.'),
    syl('f2-en', 'en', 'rén', '人', 'Gần "ân/ơn", kết thúc bằng n. Khác với eng (kết thúc bằng ng).'),
    syl('f2-in', 'in', 'xīn', '心', 'Như "in" tiếng Việt. Khác với ing: xīn (tim) ≠ xīng (sao).'),
    syl('f2-un', 'un', 'chūn', '春', 'Viết un nhưng ĐỌC đủ uen, gần "uân": chūn ≈ "truân".'),
    syl('f2-vn', 'ün', 'yún', '云', 'Môi tròn như u, lưỡi đọc "in". Gần "uyn".'),
    syl('f2-ang', 'ang', 'máng', '忙', 'Như "ang" tiếng Việt, miệng vẫn mở khi kết thúc (ng sau cuống lưỡi).'),
    syl('f2-eng', 'eng', 'lěng', '冷', 'Gần "âng/ơng". Không đọc là "eng" như tiếng Anh.'),
    syl('f2-ing', 'ing', 'xīng', '星', 'Gần "inh" tiếng Việt, âm ng cuối nhẹ.'),
    syl('f2-ong', 'ong', 'zhōng', '中', 'Môi tròn, gần "ung": zhōng ≈ "trung" (Hán Việt TRUNG).'),
    syl('f2-ia', 'ia', 'jiā', '家', 'i + a đọc liền: jiā ≈ "gia" (Hán Việt GIA).'),
    syl('f2-ie', 'ie', 'xiè', '谢', 'i + ê đọc liền. Chữ e ở đây đọc "ê", không phải "ơ".'),
    syl('f2-ua', 'ua', 'huā', '花', 'u + a đọc liền: gần "hoa".'),
    syl('f2-uo', 'uo', 'guó', '国', 'u + o đọc liền, gần "quô" (Hán Việt QUỐC).'),
    syl('f2-ve', 'üe', 'yuè', '月', 'ü + ê đọc liền. Gần "uê" với môi tròn (Hán Việt NGUYỆT).'),
    syl('f2-iao', 'iao', 'xiǎo', '小', 'i + ao đọc liền: xiǎo ≈ "xiểu" (Hán Việt TIỂU).'),
    syl('f2-iu', 'iu', 'liù', '六', 'Viết iu, đọc đủ iou: liù ≈ "liêu".'),
    syl('f2-ui', 'ui', 'duì', '对', 'Viết ui, đọc đủ uei: duì ≈ "tuây" (d đọc như t Việt).'),
    syl('f2-uai', 'uai', 'kuài', '块', 'u + ai đọc liền: gần "khoai".'),
    syl('f2-ian', 'ian', 'jiàn', '见', 'Viết ian nhưng đọc "iên", không phải "i-an": jiàn ≈ "chiến" (Hán Việt KIẾN).'),
    syl('f2-uan', 'uan', 'guān', '关', 'Gần "oan": guān ≈ "quan" (Hán Việt QUAN).'),
    syl('f2-van', 'üan', 'yuán', '元', 'Gần "uyên" (Hán Việt NGUYÊN).'),
    syl('f2-iang', 'iang', 'xiǎng', '想', 'i + ang: xiǎng ≈ "xiảng" (Hán Việt TƯỞNG).'),
    syl('f2-uang', 'uang', 'guāng', '光', 'u + ang: guāng ≈ "quang" (Hán Việt QUANG).'),
    syl('f2-iong', 'iong', 'xióng', '熊', 'i + ong: gần "xiung" (Hán Việt HÙNG).'),
    syl('f2-er', 'er', 'èr', '二', 'Đọc "ơ" rồi cuốn đầu lưỡi lên (Hán Việt NHỊ).'),
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
  { tones: [1, 1], hanzi: '星期', pinyin: 'xīngqī', vi: 'tuần lễ' },
  { tones: [1, 2], hanzi: '中国', pinyin: 'Zhōngguó', vi: 'Trung Quốc' },
  { tones: [1, 3], hanzi: '喝水', pinyin: 'hē shuǐ', vi: 'uống nước' },
  { tones: [1, 4], hanzi: '商店', pinyin: 'shāngdiàn', vi: 'cửa hàng' },
  { tones: [1, 5], hanzi: '桌子', pinyin: 'zhuōzi', vi: 'cái bàn' },
  { tones: [2, 1], hanzi: '明天', pinyin: 'míngtiān', vi: 'ngày mai' },
  { tones: [2, 2], hanzi: '学习', pinyin: 'xuéxí', vi: 'học tập' },
  { tones: [2, 3], hanzi: '苹果', pinyin: 'píngguǒ', vi: 'quả táo' },
  { tones: [2, 4], hanzi: '学校', pinyin: 'xuéxiào', vi: 'trường học' },
  { tones: [2, 5], hanzi: '朋友', pinyin: 'péngyou', vi: 'bạn bè' },
  { tones: [3, 1], hanzi: '老师', pinyin: 'lǎoshī', vi: 'giáo viên' },
  { tones: [3, 2], hanzi: '有名', pinyin: 'yǒumíng', vi: 'nổi tiếng' },
  { tones: [3, 3], hanzi: '你好', pinyin: 'nǐ hǎo', vi: 'xin chào (đọc ní hǎo)' },
  { tones: [3, 4], hanzi: '米饭', pinyin: 'mǐfàn', vi: 'cơm' },
  { tones: [3, 5], hanzi: '椅子', pinyin: 'yǐzi', vi: 'cái ghế' },
  { tones: [4, 1], hanzi: '汽车', pinyin: 'qìchē', vi: 'xe hơi' },
  { tones: [4, 2], hanzi: '大学', pinyin: 'dàxué', vi: 'đại học' },
  { tones: [4, 3], hanzi: '汉语', pinyin: 'Hànyǔ', vi: 'tiếng Hán' },
  { tones: [4, 4], hanzi: '再见', pinyin: 'zàijiàn', vi: 'tạm biệt' },
  { tones: [4, 5], hanzi: '谢谢', pinyin: 'xièxie', vi: 'cảm ơn' },
]
