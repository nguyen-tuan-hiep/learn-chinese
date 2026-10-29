import type { CourseLesson } from '../types'
import { hsk2Part1 } from './part1'
import { hsk2Part2 } from './part2'
import { hsk2Part3 } from './part3'

export const HSK2: CourseLesson[] = [...hsk2Part1, ...hsk2Part2, ...hsk2Part3]
