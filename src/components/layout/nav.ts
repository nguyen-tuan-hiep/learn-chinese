import type { Feature } from '@/lib/palette'
import { HomeIcon, LessonsIcon, PronunciationIcon, ReviewIcon, StatsIcon, type GlassIcon } from './GlassNavIcons'

export interface NavItem { to: string; label: string; icon: GlassIcon; end?: boolean; feature: Feature }

/** Primary destinations, shared by the sidebar and the phone tab bar. */
export const NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true, feature: 'home' },
  { to: '/review', label: 'Review', icon: ReviewIcon, feature: 'review' },
  { to: '/lesson', label: 'Lessons', icon: LessonsIcon, feature: 'lesson' },
  { to: '/pronunciation', label: 'Pronunciation', icon: PronunciationIcon, feature: 'pronunciation' },
  { to: '/radicals', label: 'Radicals', icon: LessonsIcon, feature: 'lesson' },
  { to: '/stats', label: 'Stats', icon: StatsIcon, feature: 'stats' },
]
