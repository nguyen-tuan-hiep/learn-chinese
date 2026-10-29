import { LESSONS } from './course'
import { CHAR_COMPONENTS } from './charComponents'
import { RADICAL_FOR_CHARACTER } from './radicalMap'

/** 214 Kangxi dictionary radicals. Glyphs here are unified ideographs, not the
 * compatibility characters in the Unicode Kangxi Radicals block. The order and
 * stroke groups follow that block; Vietnamese labels are learner-facing glosses. */
const ROWS = `一|một
丨|nét sổ
丶|chấm
丿|nét phẩy
乙|nét cong, thứ hai
亅|nét móc
二|hai
亠|nắp, đầu
人|người|亻
儿|chân người
入|vào
八|tám
冂|khung mở dưới
冖|mái che
冫|băng
几|bàn nhỏ
凵|khung mở trên
刀|dao|刂
力|sức mạnh
勹|bao bọc
匕|cái thìa
匚|hộp mở bên phải
匸|khung che giấu
十|mười
卜|bói toán
卩|đốt tre, con dấu|㔾
厂|vách núi
厶|riêng tư
又|lại, bàn tay phải
口|miệng
囗|khung bao quanh
土|đất
士|kẻ sĩ
夂|đi đến
夊|đi chậm
夕|chiều tối
大|lớn
女|phụ nữ
子|con, trẻ nhỏ
宀|mái nhà
寸|tấc
小|nhỏ|⺌
尢|què
尸|thân người nằm
屮|mầm cây
山|núi
巛|sông|川
工|công việc
己|bản thân
巾|khăn
干|khô, can
幺|sợi tơ nhỏ
广|mái nhà rộng
廴|bước dài
廾|hai tay nâng
弋|bắn, cọc
弓|cung tên
彐|đầu thú|彑
彡|lông, nét trang trí
彳|bước chân trái
心|tim, tâm|忄,⺗
戈|giáo mác
戶|cửa một cánh|户
手|tay|扌
支|cành nhánh
攴|đánh nhẹ|攵
文|chữ viết
斗|cái đấu
斤|rìu
方|vuông, phương hướng
无|không có
日|mặt trời, ngày
曰|nói rằng
月|mặt trăng, tháng
木|cây, gỗ
欠|thiếu, ngáp
止|dừng
歹|xương, cái chết|歺
殳|vũ khí
毋|chớ, không
比|so sánh
毛|lông
氏|họ, thị tộc
气|hơi
水|nước|氵,氺
火|lửa|灬
爪|móng vuốt|爫
父|cha
爻|hào trong quẻ
爿|mảnh gỗ dọc|丬
片|mảnh, tấm
牙|răng nanh
牛|trâu, bò|牜
犬|chó|犭
玄|huyền bí
玉|ngọc|王
瓜|quả dưa
瓦|ngói
甘|ngọt
生|sinh ra
用|dùng
田|ruộng
疋|tấm vải
疒|bệnh
癶|bước chân tách
白|trắng
皮|da
皿|đĩa, đồ đựng
目|mắt
矛|giáo
矢|mũi tên
石|đá
示|thần linh, chỉ thị|礻
禸|dấu chân
禾|lúa
穴|hang
立|đứng
竹|tre|⺮
米|gạo
糸|tơ|糹,纟
缶|vò, chum
网|lưới|罒,罓
羊|dê, cừu|⺶
羽|lông vũ
老|già|耂
而|mà, và
耒|cái cày
耳|tai
聿|bút
肉|thịt|⺼
臣|bề tôi
自|bản thân
至|đến nơi
臼|cối giã
舌|lưỡi
舛|trái ngược
舟|thuyền
艮|dừng, cứng
色|màu sắc
艸|cỏ|艹
虍|vằn hổ
虫|sâu, côn trùng
血|máu
行|đi lại
衣|áo quần|衤
襾|che phủ|覀,西
見|nhìn thấy|见
角|sừng
言|lời nói|訁,讠
谷|thung lũng
豆|đậu
豕|lợn
豸|loài thú
貝|vỏ sò, tiền|贝
赤|đỏ
走|chạy
足|chân|⻊
身|thân thể
車|xe|车
辛|cay, vất vả
辰|thìn, buổi sớm
辵|bước đi|辶
邑|ấp, thành|阝
酉|rượu, vò rượu
釆|phân biệt
里|làng, dặm
金|kim loại, vàng|釒,钅
長|dài|长
門|cổng, cửa|门
阜|gò đất|阝
隶|người lệ thuộc
隹|chim đuôi ngắn
雨|mưa
靑|màu xanh|青
非|không phải
面|mặt
革|da thuộc
韋|da thuộc mềm|韦
韭|rau hẹ
音|âm thanh
頁|đầu, trang|页
風|gió|风
飛|bay|飞
食|ăn, thức ăn|飠,饣
首|đầu
香|thơm
馬|ngựa|马
骨|xương
高|cao
髟|tóc dài
鬥|đánh nhau|斗
鬯|rượu tế lễ
鬲|vạc ba chân
鬼|ma, quỷ
魚|cá|鱼
鳥|chim|鸟
鹵|muối|卤
鹿|hươu
麥|lúa mì|麦
麻|gai dầu
黃|vàng|黄
黍|kê
黑|đen
黹|thêu
黽|ếch|黾
鼎|đỉnh ba chân
鼓|trống
鼠|chuột
鼻|mũi
齊|đều, tề|齐
齒|răng|齿
龍|rồng|龙
龜|rùa|龟
龠|sáo cổ`

const CORE_GLYPHS = '一 人 八 刀 力 十 口 土 大 女 子 宀 小 山 广 心 手 日 月 木 水 火 犬 田 白 目 示 竹 糸 耳 艸 言 貝 足 車 辵 金 食 門 馬'.split(' ')

export interface Radical {
  id: number
  glyph: string
  meaning: string
  variants: string[]
  strokes: number
  core: boolean
  /** The usual writing form for simplified Chinese, when it differs. */
  writingGlyph: string
}

const STROKE_ENDS = [6, 29, 60, 94, 117, 145, 167, 175, 186, 196, 200, 204, 208, 210, 212, 213, 214]
const SIMPLIFIED_WRITING = new Set('戶 長 門 見 言 貝 車 金 韋 頁 風 飛 食 馬 鬥 魚 鳥 鹵 麥 黃 黽 齊 齒 龍 龜'.split(' '))

export const RADICALS: Radical[] = ROWS.split('\n').map((row, index) => {
  const [glyph, meaning, forms = ''] = row.split('|')
  const variants = forms ? forms.split(',') : []
  return {
    id: index + 1, glyph, meaning, variants,
    strokes: STROKE_ENDS.findIndex((end) => index + 1 <= end) + 1,
    core: CORE_GLYPHS.includes(glyph),
    writingGlyph: SIMPLIFIED_WRITING.has(glyph) ? variants.at(-1)! : glyph,
  }
})

export const RADICAL_BY_ID = new Map(RADICALS.map((radical) => [radical.id, radical]))
/** Lesson index where each radical first classifies a course character, so a learner meets it right before using it. */
const FIRST_SEEN = new Map<number, number>()
LESSONS.forEach((lesson, i) => lesson.words.forEach((word) => [...word.hanzi].forEach((char) => {
  const id = RADICAL_FOR_CHARACTER.get(char)
  if (id !== undefined && !FIRST_SEEN.has(id)) FIRST_SEEN.set(id, i)
})))
export const CORE_RADICALS = CORE_GLYPHS.map((glyph) => RADICALS.find((radical) => radical.glyph === glyph)!)
  .sort((a, b) => (FIRST_SEEN.get(a.id) ?? LESSONS.length) - (FIRST_SEEN.get(b.id) ?? LESSONS.length))
export const RADICAL_LESSONS = Array.from({ length: Math.ceil(RADICALS.length / 5) }, (_, index) => {
  const ordered = [...CORE_RADICALS, ...RADICALS.filter((radical) => !radical.core)]
  return { id: `radicals-${String(index + 1).padStart(2, '0')}`, number: index + 1, core: index < 8, radicals: ordered.slice(index * 5, index * 5 + 5) }
})

export const radicalLesson = (id: number) => RADICAL_LESSONS.find((lesson) => lesson.radicals.some((radical) => radical.id === id))

/** Any written form of a radical (traditional, variant or simplified) → the radical. */
export const RADICAL_BY_GLYPH = new Map(RADICALS.flatMap((radical) => [radical.glyph, radical.writingGlyph, ...radical.variants].map((glyph) => [glyph, radical] as const)))

// Characters beyond the Unihan-generated radicalMap (HSK 4–6 lessons) take Make Me a Hanzi's radical.
// Where its radical is a form not in the Kangxi list (养 lists 丷), take the first part that is a radical.
for (const [char, data] of CHAR_COMPONENTS) {
  const radical = (data.radical && RADICAL_BY_GLYPH.get(data.radical)) || [...data.decomposition].map((g) => RADICAL_BY_GLYPH.get(g)).find(Boolean)
  if (radical && !RADICAL_FOR_CHARACTER.has(char)) RADICAL_FOR_CHARACTER.set(char, radical.id)
}
