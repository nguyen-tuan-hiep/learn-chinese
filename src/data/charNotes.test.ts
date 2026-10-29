import { describe, expect, it } from 'vitest'
import { charFamily } from '@/lib/chars'
import { CHAR_COMPONENTS } from './charComponents'
import { CHAR_NOTES } from './charNotes'
import { LESSONS, LEVELS, newCharacters } from './course'

describe('character notes', () => {
  it('explains every character introduced in HSK 1', () => {
    const hsk1 = LEVELS[0].lessons.flatMap(newCharacters)
    expect(hsk1.filter((char) => !CHAR_NOTES.has(char))).toEqual([])
    for (const note of CHAR_NOTES.values()) expect(note.hanViet && note.kind && note.story).toBeTruthy()
  })

  it('has structure data for every course character', () => {
    const chars = new Set(LESSONS.flatMap((lesson) => lesson.words.flatMap((word) => [...word.hanzi].filter((char) => /\p{Script=Han}/u.test(char)))))
    expect([...chars].filter((char) => !CHAR_COMPONENTS.has(char))).toEqual([])
    expect(CHAR_COMPONENTS.get('妈')).toMatchObject({ type: 'pictophonetic', semantic: '女', phonetic: '马' })
  })

  it('groups characters that share a component', () => {
    expect(charFamily('妈').find((group) => group.part === '马')?.chars).toContain('吗')
    expect(charFamily('你').find((group) => group.part === '亻')?.chars).toContain('们')
  })
})
