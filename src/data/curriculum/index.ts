import type { CourseLesson } from '../types'
import { HSK1 } from './level1'
import { HSK2 } from './level2'
import { HSK3 } from './level3'
import { HSK4 } from './level4'
import { HSK5 } from './level5'
import { HSK6 } from './level6'
import { addGrammar } from './grammar'
import { TEXTBOOK_LESSONS } from './textbookLessons'
import { TEXTBOOK_MATERIALS_12 } from './materials12'
import { TEXTBOOK_MATERIALS_34 } from './materials34'
import { TEXTBOOK_MATERIALS_56 } from './materials56'

export type { CurriculumLevel } from './types'

const levels = [HSK1, HSK2, HSK3, HSK4, HSK5, HSK6]
export const CURRICULUM_LEVELS = levels.map((level) => ({
  ...level,
  lessons: level.lessons.map((lesson) => {
    const key = `hsk${level.level}-${String(lesson.number).padStart(2, '0')}`
    const material = TEXTBOOK_MATERIALS_12[key] ?? TEXTBOOK_MATERIALS_34[key] ?? TEXTBOOK_MATERIALS_56[key]
    const grammar = material?.grammar ?? addGrammar(level.level, lesson)
    const textbookLesson = TEXTBOOK_LESSONS[level.level]?.[lesson.number - 1]
    const hanziTitle = textbookLesson?.hanzi ?? `第${lesson.number}课`
    const vietnameseTitle = textbookLesson?.vi ?? `Bài ${lesson.number}`
    return {
      ...lesson,
      title: hanziTitle,
      titlePinyin: textbookLesson?.pinyin ?? lesson.titlePinyin,
      titleVi: `${vietnameseTitle} · ${lesson.words.length} từ mới`,
      textbookVolume: textbookLesson?.volume ?? level.textbook,
      topic: hanziTitle,
      grammar,
      dialogues: material?.dialogues ?? lesson.dialogues,
      readings: material?.readings ?? lesson.readings,
      textbookSections: material?.sections,
      lessonExercises: material?.exercises,
      confusables: material?.confusables,
    }
  }),
}))
export const HSK_LEVELS: Record<number, CourseLesson[]> = Object.fromEntries(
  CURRICULUM_LEVELS.map(({ level, lessons }) => [level, lessons]),
)
