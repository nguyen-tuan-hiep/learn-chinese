import { PRON_LESSONS } from './pronunciation'
import type { Tone } from '@/lib/pinyin'

export type SoundKind = 'initials' | 'finals'
export interface SoundGuide {
  id: string; group: string; kind: SoundKind; label: string; pinyin: string; say: string
  approximate: string; mouth: string; caution: string
}
// English cues are editorial mnemonics, not IPA or literal transcriptions.
// Phonetic reference: Open University Pronunciation Guide; MIT Wheatley, Sounds and symbols.
const hints: Record<string, [string, string, string]> = {
  b: ['like p in “spin”', 'Close the lips, then open quickly; very little air.', 'Not a voiced English b. Compare b–p.'],
  p: ['like p in “pop”, with air', 'Close the lips, then release with a clear puff; test with a sheet of paper.', 'Differs from b in the puff of air, not in loudness.'],
  m: ['like m', 'Close the lips and let the air out through the nose.', 'Listen to the final and tone in the model too.'],
  f: ['like f', 'Upper teeth lightly on the lower lip; blow air through the gap.', 'Don\'t close both lips as for p.'],
  d: ['like t in “stop”', 'Tongue tip on the gum ridge, then release with little air.', 'Not a voiced English d.'],
  t: ['like t in “top”, with air', 'Tongue tip on the gum ridge, then release with a clear puff.', 'Compare d–t with a sheet of paper.'],
  n: ['like n', 'Tongue tip on the gum ridge; air through the nose.', 'Tell n from l by where the air escapes.'],
  l: ['like l', 'Tongue tip on the gum ridge; air flows around the sides of the tongue.', 'Don\'t send the air through the nose as for n.'],
  g: ['like k in “skate”', 'Raise the back of the tongue to the soft palate, then release.', 'Not a voiced English g.'],
  k: ['like k in “kite”, with air', 'Same position as g, released with a stronger puff.', 'A clean release, not a rasping sound.'],
  h: ['like a rough h, as in “loch”', 'Keep a narrow gap at the back of the tongue so the air rubs through.', 'It is friction; unlike k, the air is never fully stopped.'],
  j: ['like j in “jeep”, unvoiced', 'Tongue tip down, front of the tongue raised to the hard palate; no puff.', 'Don\'t curl the tongue tip as for zh.'],
  q: ['like ch in “cheese”, with air', 'Same position as j, released with a clear puff.', 'Never read q as “kw”.'],
  x: ['between s and sh, as in “she”', 'Tongue tip down; air rubs between the front of the tongue and the palate.', 'Don\'t use the curled-tongue shape of sh.'],
  zh: ['like j in “jug”, tongue curled', 'Raise the tongue tip behind the gum ridge, then release.', 'No need to curl too far back; compare zh–ch.'],
  ch: ['like ch in “church”, curled, with air', 'Same position as zh, released with a clear puff.', 'Differs from q in tongue position.'],
  sh: ['like sh in “shirt”, curled', 'Raise the tongue tip behind the gum ridge and keep a gap for the air.', 'Follow the model rather than English sh exactly.'],
  r: ['between s in “pleasure” and r', 'Raise the tongue tip behind the gum ridge as for sh, with the voice on.', 'Don\'t roll or trill the tongue.'],
  z: ['like ds in “cards”', 'Tongue tip stops, then releases into a narrow gap by the teeth; no puff.', 'One sound, not two syllables.'],
  c: ['like ts in “cats”, with air', 'Same position as z, released with a clear puff.', 'Never read c as k.'],
  s: ['like s', 'Tongue tip near the lower teeth, air through the gap by the upper teeth.', 'Tell it apart from curled sh.'],
  a: ['like a in “father”', 'Open the mouth wide, tongue low.', 'Keep it clear, then add the tone.'],
  o: ['like aw, with a slight glide', 'Round the lips; notice how it shifts in bo, po, mo, fo.', 'Don\'t use one fixed English vowel for every syllable.'],
  e: ['like u in “duh”', 'Mouth slightly open, lips unrounded, tongue pulled back.', 'Not “eh”; in ie/üe this letter changes.'],
  i: ['like ee in “see”, in yi, ji', 'Lips slightly spread, front of the tongue high.', 'After z/c/s and zh/ch/sh/r, i sounds different; don\'t read it as “ee”.'],
  u: ['like oo in “food”', 'Round the lips, raise the back of the tongue.', 'Tell u from ü.'],
  ü: ['no close English match', 'Hold the tongue as for i, then round the lips as for u.', 'Don\'t split it into u–i. After j/q/x/y, ü is usually written u.'],
  ai: ['like “eye”', 'Glide from a to i within one syllable.', 'Don\'t break between the two vowels.'],
  ei: ['like ay in “day”', 'Glide from e towards i.', 'Not two syllables.'],
  ao: ['like ow in “cow”', 'Glide from a to a rounded ending.', 'Listen for how open the first vowel is.'],
  ou: ['like o in “go”', 'Glide from o towards u, rounding the lips.', 'Not two separate vowels.'],
  an: ['like “ahn”', 'Start with a, end with the tongue tip on the gum ridge.', 'The n ending differs from ng in ang.'],
  en: ['like un in “under”', 'A neutral vowel with unrounded lips; end with n.', 'Tell en from eng.'],
  in: ['like “een”', 'Say i, then close with n.', 'Don\'t turn the n into ng.'],
  un: ['like “wun”', 'u + en run together; after an initial it is written un.', 'Full form uen; jun/qun/xun use ün, not uen.'],
  ün: ['like in with rounded lips', 'Keep the tongue forward, round the lips, end with n.', 'yun/jun/qun/xun drop the dots on ü.'],
  ang: ['like “ahng”', 'Mouth open; the back of the tongue closes the ng.', 'Don\'t close with the tongue tip as for n.'],
  eng: ['like ung in “lung”', 'From a neutral vowel to the ng ending.', 'Differs from en in where it closes.'],
  ing: ['like ing in “sing”', 'Start with i, close with the back of the tongue.', 'Listen to the model to fine-tune the vowel.'],
  ong: ['like “oong”', 'Round the lips, end with ng.', 'Not like English “long”.'],
  ia: ['i + a run together, “yah”', 'Glide from i to a in one syllable.', 'Not two sounds i–a.'],
  ie: ['like “yeh”', 'Glide from i to e, opening the mouth.', 'This e is not the e that stands alone.'],
  ua: ['like “wah”', 'Glide from u to a, opening the lips.', 'Keep it one syllable.'],
  uo: ['like “waw”', 'Glide from u to a more open rounded vowel.', 'Don\'t add a final consonant.'],
  üe: ['ü + “eh”', 'Start with ü, then open into e.', 'Don\'t replace ü with plain u; yue is written without dots.'],
  iao: ['like “yow”', 'Glide from i to ao in one syllable.', 'Don\'t break it into i–ao.'],
  iu: ['like “yoh”', 'Glide i + ou together, rounding at the end.', 'Full form iou; after an initial it is written iu.'],
  ui: ['like “way”', 'Glide u + ei together in one syllable.', 'Full form uei; not “oo-ee”.'],
  uai: ['like “why”', 'Glide u + ai, opening the lips.', 'The initial before it keeps its own aspiration.'],
  ian: ['like “yen”', 'From i to an open vowel, then close with n.', 'Not “ee-an” in two parts.'],
  uan: ['like “wahn”', 'From u to an, ending with n.', 'Tell uan from üan in juan/quan/xuan.'],
  üan: ['like “ywen”', 'Start with the tongue forward and lips rounded, end with n.', 'yuan/juan/quan/xuan drop the dots on ü.'],
  iang: ['like “yahng”', 'i + ang together, ending in ng.', 'The ng ending differs from n in ian.'],
  uang: ['like “wahng”', 'u + ang together, ending in ng.', 'Don\'t drop the ng.'],
  iong: ['like “yoong”', 'Start with the tongue forward, lips rounded, end with ng.', 'Listen to the model xiong; don\'t split it into i–ong.'],
  ueng: ['like “wung”', 'Glide u into eng; on its own it is written weng.', 'Don\'t confuse it with wen (uen), which ends in n.'],
  er: ['like American “are”', 'Say the vowel while raising the tongue tip back.', 'Not “uh” + r as two sounds.'],
}

const extra = [
  { id: 'f-ei', label: 'ei', pinyin: 'bēi', say: '杯', group: 'finals' },
  { id: 'f-ueng', label: 'ueng', pinyin: 'wēng', say: '翁', group: 'finals-2' },
]
export const SOUND_GUIDE: SoundGuide[] = [
  ...PRON_LESSONS.filter(l => l.id !== 'tones').flatMap(l => l.items.map(item => ({ ...item, group: l.id }))),
  ...extra,
].map(item => {
  const label = item.label!
  const [approximate, mouth, caution] = hints[label]
  const group = item.group.startsWith('initials') ? item.group : ['a','o','e','i','u','ü'].includes(label) ? 'vowels' : ['ai','ei','ao','ou'].includes(label) ? 'diphthongs' : ['an','en','in','un','ün','ang','eng','ing','ong','ueng'].includes(label) ? 'nasals' : label === 'er' ? 'er' : 'compound'
  return { id: item.id, group, kind: item.group.startsWith('initials') ? 'initials' : 'finals', label, pinyin: item.id === 'f-o' ? 'bō' : item.pinyin, say: item.id === 'f-o' ? '波' : item.say, approximate, mouth, caution }
})

export const SOUND_GROUPS = [
  { id: 'initials-1', title: 'Lips and tongue tip · b p m f d t n l' },
  { id: 'initials-2', title: 'Back and front of the tongue · g k h j q x' },
  { id: 'initials-3', title: 'Tongue tip and curled tongue · zh ch sh r z c s' },
  { id: 'vowels', title: 'Simple vowels · a o e i u ü' },
  { id: 'diphthongs', title: 'Basic diphthongs · ai ei ao ou' },
  { id: 'nasals', title: 'Nasal endings · n and ng' },
  { id: 'compound', title: 'Finals starting with i/u/ü' },
  { id: 'er', title: 'Special sound · er' },
]
export const TONE_GUIDE: { tone: Tone; label: string; mark: string; pinyin: string; say: string; direction: string; caution: string }[] = [
  { tone: 1, label: 'Tone 1', mark: '¯', pinyin: 'mā', say: '妈', direction: 'High and fairly level.', caution: 'Keep the pitch steady; no need to strain your voice.' },
  { tone: 2, label: 'Tone 2', mark: '´', pinyin: 'má', say: '麻', direction: 'Rises from the middle, like asking “huh?”.', caution: 'Rise smoothly to the end of the syllable.' },
  { tone: 3, label: 'Tone 3', mark: 'ˇ', pinyin: 'mǎ', say: '马', direction: 'Dips low; said on its own it may lift at the end.', caution: 'In a sentence it is usually just low; don\'t force the full dip everywhere.' },
  { tone: 4, label: 'Tone 4', mark: '`', pinyin: 'mà', say: '骂', direction: 'Falls quickly from high, like a firm “No!”.', caution: 'Make it short and decisive, not a slow slide.' },
  { tone: 5, label: 'Neutral tone', mark: 'no mark', pinyin: 'māma', say: '妈妈', direction: 'The second ma is short and light; its pitch depends on the syllable before.', caution: 'Listen to the whole word 妈妈; the neutral tone has no fixed pitch line.' },
]
