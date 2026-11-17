import type { ReactNode } from 'react'

/*
 * Plain icons for the phone tab bar and the desktop sidebar: one ink colour, drawn on a 24 grid with a 1.9 round stroke.
 * The open tab shows its filled form, the others their outline, so state reads by shape as well as by the pill behind it.
 */

function Svg({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className={`[&_*]:transition-[fill-opacity,opacity] [&_*]:duration-300 [&_*]:ease-out ${className}`}>{children}</svg>
}

type DockIcon = (p: { active: boolean; className?: string }) => ReactNode
/** The fill is always there and fades in or out, so switching tabs eases between outline and filled forms. */
const fill = (active: boolean) => ({ fill: 'currentColor', fillOpacity: active ? 1 : 0 })

/** A house with its door: a short stroke when outlined, an arched notch when filled. */
const Home: DockIcon = ({ active, className }) => <Svg className={className}>
  {/* Outline house with a door stroke; when open, the filled house with its arched door fades in over it. */}
  <path d="M4 10.4 10.9 4.6a1.7 1.7 0 0 1 2.2 0L20 10.4v8.1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
  <path d="M12 20.5v-4.2" opacity={active ? 0 : 1} />
  <path d="M4 10.4 10.9 4.6a1.7 1.7 0 0 1 2.2 0L20 10.4v8.1a2 2 0 0 1-2 2h-3.8v-3.6a2.2 2.2 0 0 0-4.4 0v3.6H6a2 2 0 0 1-2-2z" stroke="none" {...fill(active)} />
</Svg>

/** Two flashcards: the back one peeks out above and to the right; when open, the front one fills. */
const Review: DockIcon = ({ active, className }) => <Svg className={className}>
  <path d="M8.5 6.5V6A2.5 2.5 0 0 1 11 3.5h6A2.5 2.5 0 0 1 19.5 6v9a2.5 2.5 0 0 1-2.5 2.5h-1.5" />
  <rect x="4.5" y="6.5" width="11" height="14" rx="2.5" {...fill(active)} />
</Svg>

/** A graduation cap; the board fills when open, the band and tassel stay drawn. */
const Lessons: DockIcon = ({ active, className }) => <Svg className={className}>
  <path d="M12 4.5 2 9.5l10 5 10-5z" {...fill(active)} />
  <path d="M6 12.3v4.2c0 1.6 2.7 3 6 3s6-1.4 6-3v-4.2" />
  <path d="M22 9.5V15" />
</Svg>

/** A pie chart with its top-right quarter pulled out. */
const Stats: DockIcon = ({ active, className }) => <Svg className={className}>
  <path d="M11 13V5a8 8 0 1 0 8 8z" {...fill(active)} />
  <path d="M14 10V3a7 7 0 0 1 7 7z" {...fill(active)} />
</Svg>

/** A character's layout: the radical on the left, two parts beside it; when open, the radical fills. */
const Radicals: DockIcon = ({ active, className }) => <Svg className={className}>
  <rect x="3.5" y="3.5" width="6.5" height="17" rx="2" {...fill(active)} />
  <rect x="13" y="3.5" width="7.5" height="7.5" rx="2" />
  <rect x="13" y="13" width="7.5" height="7.5" rx="2" />
</Svg>

/** A speaker with two sound waves; the speaker fills when open. */
const Pronunciation: DockIcon = ({ active, className }) => <Svg className={className}>
  <path d="M3.5 10a1.5 1.5 0 0 1 1.5-1.5h2.5L12 4.8v14.4l-4.5-3.7H5A1.5 1.5 0 0 1 3.5 14z" {...fill(active)} />
  <path d="M15.5 9.2a4 4 0 0 1 0 5.6" />
  <path d="M18.4 6.4a8 8 0 0 1 0 11.2" />
</Svg>

/** A gear; evenodd keeps the hub open when the gear fills. */
const Settings: DockIcon = ({ active, className }) => <Svg className={className}>
  <path fillRule="evenodd" {...fill(active)} d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
</Svg>

/** Two arrows passing each other: switch between course versions. */
export function SwapIcon({ className }: { className?: string }) {
  return <Svg className={className}><path d="M4 8h14.5" /><path d="M15 4.5 18.5 8 15 11.5" /><path d="M20 16H5.5" /><path d="M9 12.5 5.5 16 9 19.5" /></Svg>
}

/** By route. */
export const LINE_ICONS: Record<string, DockIcon> = { '/': Home, '/review': Review, '/lesson': Lessons, '/radicals': Radicals, '/pronunciation': Pronunciation, '/stats': Stats, '/settings': Settings }
