import type { CourseLesson, Word } from '../types'

export interface CurriculumLevel {
  level: 1 | 2 | 3 | 4 | 5 | 6
  textbook: string
  plannedLessons: number
  lessons: CourseLesson[]
  /** HSK syllabus entries that do not occur in this textbook's lesson lists. */
  supplementalWords?: Word[]
}
