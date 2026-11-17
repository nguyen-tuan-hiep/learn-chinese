import type { Feature } from '@/lib/palette'
import { HomeIcon, LessonsIcon, PronunciationIcon, RadicalsIcon, ReviewIcon, StatsIcon, type GlassIcon } from './GlassNavIcons'

export interface NavItem { to: string; label: string; icon: GlassIcon; end?: boolean; feature: Feature }

/** Primary destinations, shared by the sidebar and the phone tab bar. */
export const NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true, feature: 'home' },
  { to: '/review', label: 'Review', icon: ReviewIcon, feature: 'review' },
  { to: '/lesson', label: 'Lessons', icon: LessonsIcon, feature: 'lesson' },
  { to: '/radicals', label: 'Radicals', icon: RadicalsIcon, feature: 'radicals' },
  { to: '/pronunciation', label: 'Pronunciation', icon: PronunciationIcon, feature: 'pronunciation' },
  { to: '/stats', label: 'Stats', icon: StatsIcon, feature: 'stats' },
]
