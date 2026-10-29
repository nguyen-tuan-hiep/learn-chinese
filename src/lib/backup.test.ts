import 'fake-indexeddb/auto'
import { afterEach, expect, it } from 'vitest'
import { db } from './db'
import { exportBackup, parseBackup, restoreBackup } from './backup'
import { applyGrade, introduce, newCard, Rating, State } from './srs'
import { markPart } from './lessonState'

afterEach(async () => { await Promise.all([db.cards.clear(), db.reviews.clear(), db.days.clear(), db.lessonState.clear()]) })

it('round trips progress with FSRS dates, beginner sessions and practice flags', async () => {
  const now = new Date('2026-10-29T04:00:00Z')
  const first = applyGrade(newCard('recall', 'hsk1-01:ni', 'hsk1-01', now), Rating.Good, now)
  await db.cards.add(first.card); await db.reviews.add(first.review)
  await db.days.add({ date: '2026-10-29', seconds: 125 })
  await markPart('start-01', 'dialogue'); await markPart('hsk1-01', 'grammar', true)
  const backup = parseBackup(JSON.stringify(await exportBackup()))
  expect(backup.cards[0].due).toBeInstanceOf(Date)
  expect(backup.cards[0].last_review).toBeInstanceOf(Date)
  expect(backup.reviews[0].review).toBeInstanceOf(Date)
  await db.cards.clear(); await db.lessonState.clear()
  await restoreBackup(backup)
  expect(await db.cards.get(first.card.id)).toEqual(first.card)
  expect((await db.lessonState.get('start-01'))?.done.dialogue).toBeTruthy()
  expect((await db.lessonState.get('hsk1-01'))?.needsPractice?.grammar).toBe(true)
})
it('rejects invalid dates, duplicates and wrong formats without changing current progress', async () => {
  const card = newCard('read', 'hsk1-01:ni', 'hsk1-01')
  await db.cards.add(card)
  const source = JSON.parse(JSON.stringify(await exportBackup()))
  expect(() => parseBackup(JSON.stringify({ ...source, format: 'other' }))).toThrow()
  expect(() => parseBackup(JSON.stringify({ ...source, cards: [{ ...source.cards[0], due: 'bad' }] }))).toThrow()
  expect(() => parseBackup(JSON.stringify({ ...source, cards: [source.cards[0], source.cards[0]] }))).toThrow()
  expect(() => parseBackup(JSON.stringify({ ...source, cards: [{ ...source.cards[0], reps: -1 }] }))).toThrow()
  expect(await db.cards.count()).toBe(1)
})
it('restores atomically if a write fails', async () => {
  await db.days.add({ date: '2026-10-29', seconds: 60 })
  const backup = await exportBackup()
  backup.days = [{ date: 'duplicate', seconds: 1 }, { date: 'duplicate', seconds: 2 }]
  await expect(restoreBackup(backup)).rejects.toThrow()
  expect(await db.days.toArray()).toEqual([{ date: '2026-10-29', seconds: 60 }])
})
it('keeps an untested reading skill New without making up a successful review', async () => {
  await introduce([
    { kind: 'recall', ref: 'word', lessonId: 'lesson', firstTry: true },
    { kind: 'listen', ref: 'word', lessonId: 'lesson', firstTry: false },
    { kind: 'read', ref: 'word', lessonId: 'lesson', firstTry: null },
  ])
  expect((await db.cards.get('read:word'))?.state).toBe(State.New)
  expect((await db.cards.get('listen:word'))?.state).toBe(State.Learning)
  expect((await db.reviews.toArray()).map((r) => r.kind).sort()).toEqual(['listen', 'recall'])
})
it('introduces duplicate or concurrent entries once without resetting existing progress', async () => {
  const entry = { kind: 'recall' as const, ref: 'word', lessonId: 'lesson', firstTry: true }
  await Promise.all([introduce([entry, entry]), introduce([entry])])
  const before = await db.cards.get('recall:word')
  expect(await db.cards.count()).toBe(1)
  expect(await db.reviews.count()).toBe(1)
  await introduce([{ ...entry, firstTry: false }])
  expect(await db.cards.get('recall:word')).toEqual(before)
})
it('updates practice status without removing the original completion date', async () => {
  await markPart('hsk1-01', 'grammar', true)
  const before = await db.lessonState.get('hsk1-01')
  await markPart('hsk1-01', 'grammar', false)
  const after = await db.lessonState.get('hsk1-01')
  expect(after?.done.grammar).toBe(before?.done.grammar)
  expect(after?.needsPractice?.grammar).toBe(false)
})
