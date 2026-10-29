/**
 * Reorder the HSK 2.0 exam-list vocabulary into HSK Standard Course lessons.
 *
 * The HTML snapshots are lesson vocabulary pages from HanziStroke. Download
 * them to a local directory as hsk{level}-{lesson}.html before running:
 *   node scripts/align-hsk20-curriculum.mjs /path/to/hsk-source
 *
 * Matching uses the simplified Chinese headword. Vocabulary from the HSK
 * exam list absent from the textbook lists is preserved in supplementalWords.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const sourceDir = resolve(process.argv[2] ?? '/tmp/hsk-source')
const lessonCounts = [15, 15, 20, 20, 36, 40]

function readLevel(level) {
  const file = resolve(`src/data/curriculum/level${level}.ts`)
  const source = readFileSync(file, 'utf8')
  const value = JSON.parse(source.slice(source.indexOf('= ') + 2))
  return { file, value }
}

for (let level = 1; level <= 6; level += 1) {
  const { file, value } = readLevel(level)
  const assignments = new Map()
  for (let lesson = 1; lesson <= lessonCounts[level - 1]; lesson += 1) {
    const html = readFileSync(resolve(sourceDir, `hsk${level}-${lesson}.html`), 'utf8')
    const expression = /aria-label="Practice progress loading\. Lesson item \d+\. ([^"]+?) \(/g
    let match
    while ((match = expression.exec(html))) {
      const hanzi = match[1].replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'")
      if (!assignments.has(hanzi)) assignments.set(hanzi, lesson)
    }
  }

  const words = value.lessons.flatMap((lesson) => lesson.words)
    .filter((word) => word.id !== 'hsk1-w-hello')
  const byLesson = Array.from({ length: lessonCounts[level - 1] }, () => [])
  const supplementalWords = []
  for (const word of words) {
    const lesson = assignments.get(word.hanzi)
    if (lesson) byLesson[lesson - 1].push(word)
    else supplementalWords.push(word)
  }

  for (let index = 0; index < value.lessons.length; index += 1) {
    value.lessons[index].words = byLesson[index]
  }
  value.supplementalWords = supplementalWords
  writeFileSync(file, `import type { CurriculumLevel } from './types'\n\nexport const HSK${level}: CurriculumLevel = ${JSON.stringify(value, null, 2)}\n`)
  console.log(`HSK ${level}: ${words.length - supplementalWords.length} textbook words aligned; ${supplementalWords.length} supplementary HSK words preserved`)
}
