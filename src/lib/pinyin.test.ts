import { describe, expect, it } from 'vitest'
import { checkPinyin, marksToNumbers, getTone, normalizePinyin, numbersToMarks, splitSyllables, stripTones, syllables } from './pinyin'

describe('pinyin basics', () => {
  it('detects tones', () => {
    expect(getTone('mā')).toBe(1)
    expect(getTone('nǚ')).toBe(3)
    expect(getTone('xie')).toBe(5)
  })
  it('strips tones', () => expect(stripTones('nǐ hǎo')).toBe('ni hao'))
  it('splits on spaces', () => expect(syllables(' bú kè qi ')).toEqual(['bú', 'kè', 'qi']))
})

describe('splitSyllables', () => {
  const cases: [string, string[]][] = [
    ['Zhōngguó', ['Zhōng', 'guó']],
    ['shénme', ['shén', 'me']],
    ['jīnnián', ['jīn', 'nián']],
    ['Hànyǔ', ['Hàn', 'yǔ']],
    ['xuésheng', ['xué', 'sheng']],
    ['nǚ\'ér', ['nǚ', 'ér']],
    ['duìbuqǐ', ['duì', 'bu', 'qǐ']],
    ['méi guānxi'.replace(' ', ''), ['méi', 'guān', 'xi']],
    ['péngyou', ['péng', 'you']],
    ['Měiguó', ['Měi', 'guó']],
    ['tóngxué', ['tóng', 'xué']],
    ['míngzi', ['míng', 'zi']],
    ['xīngqī', ['xīng', 'qī']],
    ['píngguǒ', ['píng', 'guǒ']],
    ['èrshí', ['èr', 'shí']],
    ['nàr', ['nàr']],
    ['yìdiǎnr', ['yì', 'diǎnr']],
  ]
  for (const [word, parts] of cases) it(word, () => expect(splitSyllables(word)).toEqual(parts))
})

describe('typed answers', () => {
  it('converts tone numbers', () => {
    expect(numbersToMarks('ni3 hao3')).toBe('nǐ hǎo')
    expect(numbersToMarks('nv3er2')).toBe('nǚér')
    expect(numbersToMarks('guo2')).toBe('guó')
    expect(numbersToMarks('xie4xie5')).toBe('xièxie')
    expect(numbersToMarks('liu4')).toBe('liù')
    expect(numbersToMarks('zen3meyang4')).toBe('zěnmeyàng')
    expect(numbersToMarks('na3r')).toBe('nǎr')
    expect(numbersToMarks('nar3')).toBe('nǎr')
    expect(numbersToMarks('dui4')).toBe('duì')
  })
  it('normalizes', () => expect(normalizePinyin("Nǚ'ér!")).toBe('nǚér'))
  it('checks answers', () => {
    expect(checkPinyin('ni3hao3', 'nǐ hǎo')).toBe('correct')
    expect(checkPinyin('nǐ hǎo', 'nǐhǎo')).toBe('correct')
    expect(checkPinyin('nihao', 'nǐ hǎo')).toBe('tone')
    expect(checkPinyin('ni2 hao3', 'nǐ hǎo')).toBe('tone')
    expect(checkPinyin('wo3', 'nǐ')).toBe('wrong')
    expect(checkPinyin('shui2', ['shéi', 'shuí'])).toBe('correct')
    expect(checkPinyin('', 'nǐ')).toBe('wrong')
  })
})

describe('marksToNumbers', () => {
  it('converts marks to tone numbers', () => {
    expect(marksToNumbers('nǐ hǎo')).toBe('ni3 hao3')
    expect(marksToNumbers('Zhōngguó')).toBe('Zhong1guo2')
    expect(marksToNumbers('nǚ')).toBe('nv3')
    expect(marksToNumbers('lǜ')).toBe('lv4')
    expect(marksToNumbers('xièxie')).toBe('xie4xie')
    expect(marksToNumbers('nǎr')).toBe('nar3')
    expect(marksToNumbers("nǚ'ér")).toBe("nv3'er2")
    expect(marksToNumbers('Wǒ jiào Wáng Míng.')).toBe('Wo3 jiao4 Wang2 Ming2.')
  })
  it('round-trips with numbersToMarks', () => {
    for (const p of ['nǐ hǎo', 'Zhōngguó', 'nǚ', 'xièxie', 'diànnǎo', 'yìdiǎnr', 'lǜ', 'huí jiā'])
      expect(normalizePinyin(numbersToMarks(marksToNumbers(p)))).toBe(normalizePinyin(p))
  })
})
