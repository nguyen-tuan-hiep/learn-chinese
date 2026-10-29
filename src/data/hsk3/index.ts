import type { CourseLesson } from '../types'
import { hsk3Part1 } from './part1'
import { hsk3Part2 } from './part2'
import { hsk3Part3 } from './part3'
import { hsk3Part4 } from './part4'

export const HSK3: CourseLesson[] = [...hsk3Part1, ...hsk3Part2, ...hsk3Part3, ...hsk3Part4]
