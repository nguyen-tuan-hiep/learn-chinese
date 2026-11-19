/**
 * The app's colours by meaning, for inline styles (`style={{ color: ... }}`) where a Tailwind class is awkward.
 * The values are CSS variables from index.css, so they follow light and dark mode.
 * Tailwind equivalents: `bg-feature-review`, `bg-feature-review-soft`, `bg-level-3`, `bg-level-3-soft`.
 */
export type Feature = 'home' | 'lesson' | 'review' | 'pronunciation' | 'stats' | 'settings'

/** Solid hue of a feature: icons, rings, bars. Not for small text. */
export const featureColor = (feature: Feature) => `var(--color-feature-${feature})`
/** Pale wash of a feature hue: icon backgrounds, tinted rows. */
export const featureSoft = (feature: Feature) => `var(--color-feature-${feature}-soft)`

/** HSK levels run 1–6; anything else falls back to level 1. */
const level = (n: number) => (n >= 1 && n <= 6 ? Math.floor(n) : 1)
/** Solid hue of an HSK level. */
export const levelColor = (n: number) => `var(--color-level-${level(n)})`
/** Pale wash of an HSK level hue. */
export const levelSoft = (n: number) => `var(--color-level-${level(n)}-soft)`
/** Progress-bar fill of an HSK level: its pastel deepening along the bar. */
export const levelBar = (n: number) => `var(--level-bar-${level(n)})`
/** Apple Card style artwork gradient of an HSK level. */
export const levelGradient = (n: number) => `var(--gradient-level-${level(n)})`

/** Lesson parts carry no colour of their own (the lesson's HSK level gives the page its pastel): ink marks on white. */
export const partColor = (_part: string) => 'var(--color-label)'
/** Neutral wash behind a lesson part's icon. */
export const partSoft = (_part: string) => 'var(--color-fill)'

/** Text on a level's pastel (the same pastels in light and dark). */
export const levelInk = (_n: number) => 'text-[#15120f]'

const PASTEL: Record<Feature, string> = { home: 'peach', lesson: 'green', review: 'lilac', pronunciation: 'blue', stats: 'pink', settings: 'blue' }
/** The raw pastel of a feature (same in light and dark), for circles that always carry dark ink. */
export const featurePastel = (feature: Feature) => `var(--pastel-${PASTEL[feature]})`
