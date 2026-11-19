import { fsrs, generatorParameters } from 'ts-fsrs'

export const FSRS_MODEL_VERSION = 'FSRS-6' as const
export const FSRS_WEIGHTS = [...generatorParameters().w]

export interface FsrsSchedulerOptions {
  desiredRetention: number
  maximumInterval: number
  weights?: readonly number[]
}
export function createFsrs6Scheduler(options: FsrsSchedulerOptions) {
  const weights = options.weights && [17, 19, 21].includes(options.weights.length)
    ? options.weights
    : FSRS_WEIGHTS
  return fsrs(generatorParameters({
    w: weights,
    request_retention: Math.min(0.99, Math.max(0.7, options.desiredRetention)),
    maximum_interval: Math.min(36500, Math.max(1, Math.round(options.maximumInterval))),
    enable_fuzz: true,
  }))
}

