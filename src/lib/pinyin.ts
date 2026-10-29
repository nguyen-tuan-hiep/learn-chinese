export type Tone = 1 | 2 | 3 | 4 | 5

const TONE_MARKS: Record<string, [string, Tone]> = {}
const groups: Record<string, string> = {
  a: 'āáǎà',
  e: 'ēéěè',
  i: 'īíǐì',
  o: 'ōóǒò',
  u: 'ūúǔù',
  ü: 'ǖǘǚǜ',
}
for (const [base, marks] of Object.entries(groups)) {
  ;[...marks].forEach((m, i) => (TONE_MARKS[m] = [base, (i + 1) as Tone]))
}

/** Tone of a single pinyin syllable; 5 = neutral tone. */
export function getTone(syllable: string): Tone {
  for (const ch of syllable.toLowerCase()) {
    const hit = TONE_MARKS[ch]
    if (hit) return hit[1]
  }
  return 5
}

/** Strip tone marks: "nǚ" -> "nü". */
export function stripTones(text: string): string {
  return [...text].map((ch) => TONE_MARKS[ch.toLowerCase()]?.[0] ?? ch).join('')
}

export function syllables(pinyin: string): string[] {
  return pinyin.trim().split(/\s+/)
}

export const TONE_INFO: Record<Tone, { name: string; vn: string; contour: string; hint: string }> = {
  1: { name: 'Thanh 1', vn: 'ngang, cao', contour: '55', hint: 'Giữ giọng cao và đều, như đang hát một nốt dài.' },
  2: { name: 'Thanh 2', vn: 'đi lên', contour: '35', hint: 'Bắt đầu ở khoảng giữa rồi đưa giọng lên cao. Nghe mẫu thay vì ghép với dấu tiếng Việt.' },
  3: { name: 'Thanh 3', vn: 'xuống thấp', contour: '214', hint: 'Hạ giọng xuống thấp; khi đọc riêng có thể lên lại. Trong câu, thanh 3 không phải lúc nào cũng có phần lên.' },
  4: { name: 'Thanh 4', vn: 'rơi mạnh', contour: '51', hint: 'Dứt khoát từ cao xuống thấp, như ra lệnh "Đi!".' },
  5: { name: 'Thanh nhẹ', vn: 'nhẹ, ngắn', contour: '3', hint: 'Đọc nhẹ và ngắn, không nhấn.' },
}

/** SVG path (viewBox 0 0 100 100) for a Chao tone-letter contour like "214". */
export function contourPath(contour: string): string {
  const pts = [...contour].map(Number)
  const y = (lvl: number) => 90 - ((lvl - 1) / 4) * 80
  if (pts.length === 1) return `M 35 ${y(pts[0])} L 65 ${y(pts[0])}`
  const step = 80 / (pts.length - 1)
  if (pts.length === 3) {
    return `M 10 ${y(pts[0])} Q 50 ${y(pts[1]) + 12} 90 ${y(pts[2])}`
  }
  return pts.map((p, i) => `${i ? 'L' : 'M'} ${10 + i * step} ${y(p)}`).join(' ')
}

const MARKS: Record<string, string> = groups
const FINALS =
  'iang|iong|uang|ueng|iao|ian|uai|uan|üan|ang|eng|ing|ong|ai|ao|an|ei|en|er|ia|ie|in|iu|ou|ua|uo|ue|üe|ui|un|ün|a|e|i|o|u|ü'
// Initial + final, where the final may not be followed by a vowel (so "jīnnián" splits jin|nian,
// "Hànyǔ" han|yu). If that fails, retry allowing the vowel so a final "n"/"ng" can be shared.
const INITIAL = '(?:zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?'
const STRICT = new RegExp(`${INITIAL}(?:${FINALS})(?![aeiouü])`, 'y')
const LOOSE = new RegExp(`${INITIAL}(?:${FINALS})`, 'y')

/** Split one pinyin word into syllables: "Zhōngguó" -> ["Zhōng", "guó"]. Falls back to the whole word. */
export function splitSyllables(word: string): string[] {
  const out: string[] = []
  for (const part of word.split(/['’-]/)) {
    const plain = stripTones(part).toLowerCase()
    let i = 0
    while (i < plain.length) {
      STRICT.lastIndex = LOOSE.lastIndex = i
      const m = STRICT.exec(plain) ?? LOOSE.exec(plain)
      if (!m) {
        // Erhua: a trailing "r" (那儿 nàr, 一点儿 yìdiǎnr) belongs to the previous syllable.
        if (plain[i] === 'r' && out.length && i === plain.length - 1) {
          out[out.length - 1] += part[i]
          i++
          continue
        }
        return [word]
      }
      out.push(part.slice(i, i + m[0].length))
      i += m[0].length
    }
  }
  return out
}

function markSyllable(base: string, tone: number): string {
  if (tone < 1 || tone > 4) return base
  const s = base.replace(/v|u:/g, 'ü')
  const idx = /[ae]/.test(s) ? s.search(/[ae]/) : s.includes('ou') ? s.indexOf('o') : Math.max(...[...'iouü'].map((v) => s.lastIndexOf(v)))
  if (idx < 0) return s
  return s.slice(0, idx) + MARKS[s[idx]][tone - 1] + s.slice(idx + 1)
}

/**
 * "ni3 hao3" / "nv3" -> "nǐ hǎo" / "nǚ". Text that already has marks passes through.
 * A digit applies to the LAST syllable of the letters before it, so a neutral syllable can simply
 * carry no digit: "zen3meyang4" -> "zěnmeyàng".
 */
export function numbersToMarks(text: string): string {
  return text.replace(/([a-zü:v]+)([0-5])/gi, (_, base: string, d: string) => {
    const syls = splitSyllables(base.toLowerCase().replace(/v|u:/g, 'ü'))
    const last = syls.pop()!
    return syls.join('') + markSyllable(last, Number(d))
  })
}

/** Canonical comparable form: tone marks, lowercase, no spaces/punctuation/apostrophes. */
export function normalizePinyin(text: string): string {
  return numbersToMarks(text.toLowerCase())
    .replace(/v|u:/g, 'ü')
    .replace(/[\s'’\-.,!?，。！？、；;:：…"“”]/g, '')
}

export type PinyinVerdict = 'correct' | 'tone' | 'wrong'

/** Compare a typed answer with the expected pinyin (and accepted alternatives). */
export function checkPinyin(input: string, expected: string | string[]): PinyinVerdict {
  const answers = (Array.isArray(expected) ? expected : [expected]).map(normalizePinyin)
  const got = normalizePinyin(input)
  if (!got) return 'wrong'
  if (answers.includes(got)) return 'correct'
  if (answers.some((a) => stripTones(a) === stripTones(got))) return 'tone'
  return 'wrong'
}

/** Splits text into [other, word, other, word…]; odd indexes are runs of pinyin letters. */
export const PINYIN_WORD = /([A-Za-zÀ-ÿāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüÜ]+)/

/** "nǐ hǎo" -> "ni3 hao3", "nǚ" -> "nv3". Neutral tone gets no digit. The reverse of numbersToMarks. */
export function marksToNumbers(text: string): string {
  return text
    .split(PINYIN_WORD)
    .map((tok, i) =>
      i % 2 === 0
        ? tok
        : splitSyllables(tok)
            .map((syl) => {
              const tone = getTone(syl)
              return stripTones(syl).replace(/ü/g, 'v') + (tone === 5 ? '' : tone)
            })
            .join(''),
    )
    .join('')
}
