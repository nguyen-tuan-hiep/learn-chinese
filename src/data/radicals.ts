import { HSK2_LESSONS } from './course'
import { CHAR_COMPONENTS } from './charComponents'
import { RADICAL_FOR_CHARACTER } from './radicalMap'

/** 214 Kangxi dictionary radicals. Glyphs here are unified ideographs, not the
 * compatibility characters in the Unicode Kangxi Radicals block. The order and
 * stroke groups follow that block; English labels are learner-facing glosses. */
const ROWS = `一|one
丨|vertical stroke
丶|dot
丿|slash
乙|second, hook
亅|hook
二|two
亠|lid
人|person|亻
儿|legs
入|enter
八|eight
冂|down box
冖|cover
冫|ice
几|table
凵|open box
刀|knife|刂
力|power
勹|wrap
匕|spoon
匚|right open box
匸|hiding enclosure
十|ten
卜|divination
卩|seal|㔾
厂|cliff
厶|private
又|again, right hand
口|mouth
囗|enclosure
土|earth
士|scholar
夂|go
夊|go slowly
夕|evening
大|big
女|woman
子|child
宀|roof
寸|inch
小|small|⺌
尢|lame
尸|corpse
屮|sprout
山|mountain
巛|river|川
工|work
己|oneself
巾|towel
干|dry
幺|short thread
广|wide roof
廴|long stride
廾|two hands
弋|shoot
弓|bow
彐|snout|彑
彡|bristle
彳|step
心|heart|忄,⺗
戈|halberd
戶|door|户
手|hand|扌
支|branch
攴|rap|攵
文|script
斗|dipper
斤|axe
方|square
无|not
日|sun, day
曰|say
月|moon, month
木|tree, wood
欠|lack, yawn
止|stop
歹|death|歺
殳|weapon
毋|do not
比|compare
毛|fur
氏|clan
气|steam
水|water|氵,氺
火|fire|灬
爪|claw|爫
父|father
爻|trigrams
爿|split wood|丬
片|slice
牙|fang
牛|cow|牜
犬|dog|犭
玄|profound
玉|jade|王
瓜|melon
瓦|tile
甘|sweet
生|life
用|use
田|field
疋|bolt of cloth
疒|sickness
癶|footsteps
白|white
皮|skin
皿|dish
目|eye
矛|spear
矢|arrow
石|stone
示|spirit|礻
禸|track
禾|grain
穴|cave
立|stand
竹|bamboo|⺮
米|rice
糸|silk|糹,纟
缶|jar
网|net|罒,罓
羊|sheep|⺶
羽|feather
老|old|耂
而|and
耒|plough
耳|ear
聿|brush
肉|meat|⺼
臣|minister
自|self
至|arrive
臼|mortar
舌|tongue
舛|oppose
舟|boat
艮|stopping
色|colour
艸|grass|艹
虍|tiger
虫|insect
血|blood
行|walk
衣|clothes|衤
襾|cover|覀,西
見|see|见
角|horn
言|speech|訁,讠
谷|valley
豆|bean
豕|pig
豸|badger
貝|shell, money|贝
赤|red
走|run
足|foot|⻊
身|body
車|cart|车
辛|bitter
辰|morning
辵|walk|辶
邑|city|阝
酉|wine
釆|distinguish
里|village, mile
金|metal, gold|釒,钅
長|long|长
門|gate|门
阜|mound|阝
隶|slave
隹|short-tailed bird
雨|rain
靑|blue-green|青
非|wrong
面|face
革|leather
韋|tanned leather|韦
韭|leek
音|sound
頁|head, page|页
風|wind|风
飛|fly|飞
食|eat, food|飠,饣
首|head
香|fragrant
馬|horse|马
骨|bone
高|tall
髟|hair
鬥|fight|斗
鬯|sacrificial wine
鬲|cauldron
鬼|ghost
魚|fish|鱼
鳥|bird|鸟
鹵|salt|卤
鹿|deer
麥|wheat|麦
麻|hemp
黃|yellow|黄
黍|millet
黑|black
黹|embroidery
黽|frog|黾
鼎|tripod
鼓|drum
鼠|rat
鼻|nose
齊|even, uniform|齐
齒|tooth|齿
龍|dragon|龙
龜|turtle|龟
龠|flute`

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
HSK2_LESSONS.forEach((lesson, i) => lesson.words.forEach((word) => [...word.hanzi].forEach((char) => {
  const id = RADICAL_FOR_CHARACTER.get(char)
  if (id !== undefined && !FIRST_SEEN.has(id)) FIRST_SEEN.set(id, i)
})))
export const CORE_RADICALS = CORE_GLYPHS.map((glyph) => RADICALS.find((radical) => radical.glyph === glyph)!)
  .sort((a, b) => (FIRST_SEEN.get(a.id) ?? HSK2_LESSONS.length) - (FIRST_SEEN.get(b.id) ?? HSK2_LESSONS.length))
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
