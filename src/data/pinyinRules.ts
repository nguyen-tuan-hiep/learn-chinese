export interface RuleExample {
  pinyin: string
  hanzi: string
  note?: string
}

export interface Rule {
  id: string
  title: string
  body: string
  examples: RuleExample[]
}

/** Spelling and reading rules that trip up English-speaking learners, in the order they are useful. */
export const RULES: Rule[] = [
  {
    id: 'syllable',
    title: 'A syllable has 3 parts',
    body: 'Every pinyin syllable = initial (opening consonant) + final (the rest) + tone. There are 21 initials and about 36 finals. Some syllables have no initial and start straight with the final. Practise splitting syllables in your head as you read.',
    examples: [
      { pinyin: 'zhōng', hanzi: '中', note: 'zh + ong + tone 1' },
      { pinyin: 'xué', hanzi: '学', note: 'x + üe + tone 2' },
      { pinyin: 'shēng', hanzi: '生', note: 'sh + eng + tone 1' },
      { pinyin: 'ài', hanzi: '爱', note: 'no initial: ai + tone 4' },
    ],
  },
  {
    id: 'tone-mark',
    title: 'Where does the tone mark go?',
    body: 'Priority order a, then e, then o: if there is an a, mark the a; if not, mark the e or o. For iu and ui, mark the SECOND letter. Otherwise (only one vowel) mark that vowel.',
    examples: [
      { pinyin: 'hǎo', hanzi: '好', note: 'has a → mark on a' },
      { pinyin: 'xiè', hanzi: '谢', note: 'no a → mark on e' },
      { pinyin: 'gǒu', hanzi: '狗', note: 'ou → mark on o' },
      { pinyin: 'liù', hanzi: '六', note: 'iu → mark on u' },
      { pinyin: 'duì', hanzi: '对', note: 'ui → mark on i' },
    ],
  },
  {
    id: 'abbrev',
    title: 'Three short spellings: iu, ui, un',
    body: 'After an initial, iou is written iu, uei is written ui, and uen is written un. Only the SPELLING is shortened; you still SAY the middle vowel.',
    examples: [
      { pinyin: 'liù', hanzi: '六', note: 'written iu, said liou' },
      { pinyin: 'duì', hanzi: '对', note: 'written ui, said duei' },
      { pinyin: 'chūn', hanzi: '春', note: 'written un, said chuen' },
    ],
  },
  {
    id: 'y-w',
    title: 'y and w at the start of a syllable',
    body: 'When a final starts with i, u or ü and there is no initial, add y or w: i → yi, ia → ya, ie → ye, in → yin, ing → ying, u → wu, ua → wa, uo → wo, uan → wan, ü → yu, üe → yue. This is only spelling; y and w are not real initials: yī sounds like "ee", wǔ like "oo".',
    examples: [
      { pinyin: 'yī', hanzi: '一', note: 'i → yi' },
      { pinyin: 'yǒu', hanzi: '有', note: 'iou → you' },
      { pinyin: 'wǒ', hanzi: '我', note: 'uo → wo' },
      { pinyin: 'wèn', hanzi: '问', note: 'uen → wen' },
      { pinyin: 'yuè', hanzi: '月', note: 'üe → yue' },
    ],
  },
  {
    id: 'umlaut',
    title: 'ü, and u after j, q, x, y',
    body: 'After j, q, x, y the letter u is always ü (rounded lips, tongue as for "ee"): qù = qü, xué = xüé. Pinyin drops the dots to keep it short. Only after l and n is ü written in full to tell it from a real u: lù (road) differs from lǜ (green). On a keyboard, type ü as v: nǚ is nv3, lǜ is lv4.',
    examples: [
      { pinyin: 'qù', hanzi: '去', note: 'said qü' },
      { pinyin: 'xué', hanzi: '学', note: 'said xüé' },
      { pinyin: 'nǚ', hanzi: '女', note: 'type nv3' },
      { pinyin: 'lǜ', hanzi: '绿', note: 'real ü, type lv4' },
      { pinyin: 'lù', hanzi: '路', note: 'real u, rounded "oo"' },
    ],
  },
  {
    id: 'i-silent',
    title: 'The "special" i after zh ch sh r z c s',
    body: 'After these 7 initials, i is NOT "ee". It just stretches the consonant into a buzzing vowel (zhi ≈ "jr", zi ≈ "dzz"). A very common mistake: reading chī (eat) as "chee".',
    examples: [
      { pinyin: 'zhī', hanzi: '知', note: 'curled tongue, like "jr"' },
      { pinyin: 'chī', hanzi: '吃', note: 'curled tongue, with air' },
      { pinyin: 'shì', hanzi: '是', note: 'curled tongue' },
      { pinyin: 'rì', hanzi: '日', note: 'curled tongue, voiced' },
      { pinyin: 'sì', hanzi: '四', note: 'tongue tip, like "sz"' },
    ],
  },
  {
    id: 'nasal',
    title: 'Nasal finals: -n and -ng',
    body: 'Finals in -n end with the tongue tip on the gum ridge, as in "run". Finals in -ng end at the back of the tongue with the mouth open and the sound in the nose, as in "sing". Mixing them up gives a different word.',
    examples: [
      { pinyin: 'xīn', hanzi: '新', note: 'new' },
      { pinyin: 'xīng', hanzi: '星', note: 'star' },
      { pinyin: 'mín', hanzi: '民', note: 'people' },
      { pinyin: 'míng', hanzi: '明', note: 'bright' },
      { pinyin: 'bān', hanzi: '班', note: 'class' },
      { pinyin: 'bāng', hanzi: '帮', note: 'help' },
    ],
  },
  {
    id: 'aspirated',
    title: 'Aspirated and unaspirated sounds',
    body: 'There are 6 pairs: b/p, d/t, g/k, j/q, zh/ch, z/c. The first of each pair has NO puff of air; the second releases a strong puff. Hold a sheet of paper in front of your mouth: p, t, k, q, ch, c make it flutter, b, d, g, j, zh, z barely move it. In pinyin, b/d/g are not voiced as in English, so practise this carefully.',
    examples: [
      { pinyin: 'bà', hanzi: '爸', note: 'dad, no puff' },
      { pinyin: 'pà', hanzi: '怕', note: 'afraid, with a puff' },
      { pinyin: 'gē', hanzi: '哥', note: 'older brother' },
      { pinyin: 'kē', hanzi: '科', note: 'subject, with a puff' },
    ],
  },
  {
    id: 'neutral',
    title: 'Neutral tone: no mark',
    body: 'Some syllables are said light and short, and pinyin gives them no mark: māma, xièxie, shénme, wǒmen. There is no general rule; learn them word by word (the course marks them for you). When typing in the app, a neutral syllable needs no number.',
    examples: [
      { pinyin: 'māma', hanzi: '妈妈', note: 'type ma1ma' },
      { pinyin: 'xièxie', hanzi: '谢谢', note: 'type xie4xie' },
      { pinyin: 'shénme', hanzi: '什么', note: 'type shen2me' },
      { pinyin: 'péngyou', hanzi: '朋友', note: 'type peng2you' },
    ],
  },
  {
    id: 'apostrophe',
    title: "The syllable divider (')",
    body: "When a syllable starting with a, o or e follows another syllable, pinyin adds ' to show the boundary. For example xī'ān (Xi'an, two syllables) differs from xiān (first, one syllable).",
    examples: [
      { pinyin: "xī'ān", hanzi: '西安', note: 'xī + ān' },
      { pinyin: 'xiān', hanzi: '先', note: 'one syllable' },
      { pinyin: "nǚ'ér", hanzi: '女儿', note: 'nǚ + ér' },
    ],
  },
  {
    id: 'erhua',
    title: 'The curled 儿 (r) ending',
    body: 'In Beijing speech, 儿 at the end of a word is not a separate "er" syllable; the tongue curls and joins the syllable before: nǎr, zhèr. When typing, nǎr can be nar3 or na3r.',
    examples: [
      { pinyin: 'nǎr', hanzi: '哪儿', note: 'where' },
      { pinyin: 'zhèr', hanzi: '这儿', note: 'here' },
      { pinyin: 'yìdiǎnr', hanzi: '一点儿', note: 'a little' },
    ],
  },
]
