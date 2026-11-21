/**
 * The radicals worth knowing first: the ones that head the most characters in the course vocabularies
 * (counted from src/data/radicalChars.json), skipping pure stroke shapes such as 一 and 丿 that carry no meaning.
 * `form` is the shape as it sits in a character; `full` is the stand-alone character it comes from, when different.
 */
export type RadicalGroup = 'people' | 'body' | 'mind' | 'nature' | 'action' | 'things'

export interface Radical {
  form: string
  full?: string
  pinyin: string
  meaning: string
  group: RadicalGroup
  /** One line that helps it stick. */
  note: string
}

export const RADICAL_GROUPS: { id: RadicalGroup; label: string }[] = [
  { id: 'people', label: 'People' },
  { id: 'body', label: 'Body' },
  { id: 'mind', label: 'Mind and speech' },
  { id: 'nature', label: 'Nature' },
  { id: 'action', label: 'Hands and moving' },
  { id: 'things', label: 'Home and things' },
]

export const RADICALS: Radical[] = [
  { form: '亻', full: '人', pinyin: 'rén', meaning: 'person', group: 'people', note: 'A person standing at the side: people, and what people do.' },
  { form: '女', pinyin: 'nǚ', meaning: 'woman', group: 'people', note: 'A kneeling woman: family members and names.' },
  { form: '子', pinyin: 'zǐ', meaning: 'child', group: 'people', note: 'A baby with its arms out.' },
  { form: '犭', full: '犬', pinyin: 'quǎn', meaning: 'animal', group: 'nature', note: 'A dog on its hind legs: most animals.' },

  { form: '口', pinyin: 'kǒu', meaning: 'mouth', group: 'body', note: 'An open mouth: eating, speaking, and sounds.' },
  { form: '目', pinyin: 'mù', meaning: 'eye', group: 'body', note: 'An eye turned on its side: looking and seeing.' },
  { form: '耳', pinyin: 'ěr', meaning: 'ear', group: 'body', note: 'An ear: hearing and listening.' },
  { form: '⺼', full: '肉', pinyin: 'ròu', meaning: 'flesh', group: 'body', note: 'Looks like 月 the moon, but means body parts.' },
  { form: '页', full: '頁', pinyin: 'yè', meaning: 'head', group: 'body', note: 'A head on a body: faces and the top of things.' },
  { form: '足', pinyin: 'zú', meaning: 'foot', group: 'body', note: 'A foot below a knee: running and jumping.' },

  { form: '心', pinyin: 'xīn', meaning: 'heart', group: 'mind', note: 'A heart at the bottom: thoughts and feelings.' },
  { form: '忄', full: '心', pinyin: 'xīn', meaning: 'heart', group: 'mind', note: 'The heart standing upright at the side: emotions.' },
  { form: '讠', full: '言', pinyin: 'yán', meaning: 'speech', group: 'mind', note: 'Words from the mouth: talking, asking, reading.' },

  { form: '氵', full: '水', pinyin: 'shuǐ', meaning: 'water', group: 'nature', note: 'Three drops on the left: things that flow.' },
  { form: '冫', full: '冰', pinyin: 'bīng', meaning: 'ice', group: 'nature', note: 'Two drops, frozen: cold things.' },
  { form: '木', pinyin: 'mù', meaning: 'tree', group: 'nature', note: 'A tree with roots: wood and things made of it.' },
  { form: '艹', full: '艸', pinyin: 'cǎo', meaning: 'grass', group: 'nature', note: 'Two shoots on top: plants, flowers, tea.' },
  { form: '禾', pinyin: 'hé', meaning: 'grain', group: 'nature', note: 'A stalk heavy with grain: crops and seasons.' },
  { form: '⺮', full: '竹', pinyin: 'zhú', meaning: 'bamboo', group: 'nature', note: 'Bamboo leaves on top: things once made of bamboo.' },
  { form: '日', pinyin: 'rì', meaning: 'sun', group: 'nature', note: 'The sun: light, days and time.' },
  { form: '雨', pinyin: 'yǔ', meaning: 'rain', group: 'nature', note: 'Drops under a cloud: weather.' },
  { form: '山', pinyin: 'shān', meaning: 'mountain', group: 'nature', note: 'Three peaks.' },
  { form: '石', pinyin: 'shí', meaning: 'stone', group: 'nature', note: 'A rock under a cliff: stones and hard things.' },
  { form: '土', pinyin: 'tǔ', meaning: 'earth', group: 'nature', note: 'A clod on the ground: soil, places, building.' },
  { form: '火', pinyin: 'huǒ', meaning: 'fire', group: 'nature', note: 'Flames rising: heat and cooking.' },
  { form: '灬', full: '火', pinyin: 'huǒ', meaning: 'fire', group: 'nature', note: 'Four flames at the bottom: cooking over a fire.' },
  { form: '田', pinyin: 'tián', meaning: 'field', group: 'nature', note: 'A field cut into plots.' },
  { form: '米', pinyin: 'mǐ', meaning: 'rice', group: 'nature', note: 'Grains scattered around a stalk.' },
  { form: '马', pinyin: 'mǎ', meaning: 'horse', group: 'nature', note: 'A horse, often just for its sound mǎ.' },
  { form: '虫', pinyin: 'chóng', meaning: 'insect', group: 'nature', note: 'A crawling creature: bugs and snakes.' },

  { form: '扌', full: '手', pinyin: 'shǒu', meaning: 'hand', group: 'action', note: 'A hand at the side: almost any action.' },
  { form: '又', pinyin: 'yòu', meaning: 'right hand', group: 'action', note: 'A hand reaching out.' },
  { form: '力', pinyin: 'lì', meaning: 'strength', group: 'action', note: 'A flexed arm: effort and work.' },
  { form: '攵', full: '攴', pinyin: 'pū', meaning: 'tap', group: 'action', note: 'A hand holding a stick: doing, teaching.' },
  { form: '刂', full: '刀', pinyin: 'dāo', meaning: 'knife', group: 'action', note: 'A blade at the side: cutting and dividing.' },
  { form: '辶', full: '辵', pinyin: 'chuò', meaning: 'walk', group: 'action', note: 'A road underneath: going, coming, far, near.' },
  { form: '彳', pinyin: 'chì', meaning: 'step', group: 'action', note: 'A small step: walking and ways.' },
  { form: '走', pinyin: 'zǒu', meaning: 'walk', group: 'action', note: 'A person running: moving fast.' },

  { form: '宀', pinyin: 'mián', meaning: 'roof', group: 'things', note: 'A roof over a house: home and family.' },
  { form: '广', pinyin: 'guǎng', meaning: 'shelter', group: 'things', note: 'A roof with one wall: buildings and shops.' },
  { form: '门', full: '門', pinyin: 'mén', meaning: 'door', group: 'things', note: 'A double door: gates and openings.' },
  { form: '囗', pinyin: 'wéi', meaning: 'enclosure', group: 'things', note: 'A wall all round: countries and gardens.' },
  { form: '阝', full: '阜', pinyin: 'fù', meaning: 'hill, town', group: 'things', note: 'On the left a hill, on the right a town.' },
  { form: '纟', full: '糸', pinyin: 'sī', meaning: 'silk', group: 'things', note: 'A twisted thread: cloth, colours, knots.' },
  { form: '钅', full: '金', pinyin: 'jīn', meaning: 'metal', group: 'things', note: 'Gold and metal: tools, money, clocks.' },
  { form: '贝', full: '貝', pinyin: 'bèi', meaning: 'shell, money', group: 'things', note: 'A cowrie shell, once used as money: buying and selling.' },
  { form: '车', full: '車', pinyin: 'chē', meaning: 'vehicle', group: 'things', note: 'A cart seen from above.' },
  { form: '衤', full: '衣', pinyin: 'yī', meaning: 'clothing', group: 'things', note: 'A robe at the side: clothes.' },
  { form: '巾', pinyin: 'jīn', meaning: 'cloth', group: 'things', note: 'A hanging cloth: towels, hats, flags.' },
  { form: '饣', full: '食', pinyin: 'shí', meaning: 'food', group: 'things', note: 'A bowl of food: eating and meals.' },
  { form: '王', full: '玉', pinyin: 'yù', meaning: 'jade', group: 'things', note: 'At the side it is jade: precious things.' },
  { form: '皿', pinyin: 'mǐn', meaning: 'dish', group: 'things', note: 'A bowl on a stand.' },
  { form: '疒', pinyin: 'nè', meaning: 'sickness', group: 'things', note: 'A sickbed: illness and pain.' },
]
