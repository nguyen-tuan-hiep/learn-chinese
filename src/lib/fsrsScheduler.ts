import { dateChrono, defineScheduler } from 'ts-fsrs'
import {
  schedulerDesiredRetentionMiddleware,
  schedulerFuzzingMiddleware,
  schedulerLearningStepsMiddleware,
  schedulerMaximumIntervalMiddleware,
  schedulerMonotonicIntervalMiddleware,
  schedulerScheduledDaysMiddleware,
  schedulerStatsMiddleware,
} from 'ts-fsrs/middlewares'
import { FSRS7_DEFAULT_WEIGHTS, FSRS7Model } from 'ts-fsrs/models/fsrs-7'

export const FSRS_MODEL_VERSION = 'FSRS-7' as const
export const FSRS_WEIGHTS = [...FSRS7_DEFAULT_WEIGHTS]

/** Reusable FSRS-7 definition. Policy lives in middleware; user settings are validated per instance. */
export const fsrs7Definition = defineScheduler({
  model: FSRS7Model,
  chrono: dateChrono,
}).use(
  schedulerDesiredRetentionMiddleware,
  schedulerFuzzingMiddleware,
  schedulerStatsMiddleware,
  schedulerScheduledDaysMiddleware,
  schedulerLearningStepsMiddleware,
  schedulerMaximumIntervalMiddleware,
  schedulerMonotonicIntervalMiddleware,
)

export interface FsrsSchedulerOptions {
  desiredRetention: number
  maximumInterval: number
  weights?: readonly number[]
}

export function createFsrs7Scheduler(options: FsrsSchedulerOptions) {
  return fsrs7Definition.create({
    config: {
      weights: options.weights ?? FSRS_WEIGHTS,
      fractionalDays: true,
      enableShortTerm: true,
      desiredRetention: Math.min(0.99, Math.max(0.7, options.desiredRetention)),
      learningSteps: ['1m', '10m'],
      relearningSteps: ['10m'],
      allowModelOverride: true,
      enableFuzz: true,
      maximumInterval: Math.min(36500, Math.max(1, Math.round(options.maximumInterval))),
      clearStatsOnForget: false,
    },
  })
}

export type Fsrs7Scheduler = ReturnType<typeof createFsrs7Scheduler>
export type Fsrs7Card = ReturnType<Fsrs7Scheduler['newCard']>
export type Fsrs7Revlog = ReturnType<Fsrs7Scheduler['review']>['revlog']

