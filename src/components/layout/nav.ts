import type { Feature } from '@/lib/palette'
import { AudioLines, BookOpen, ChartNoAxesColumn, House, Layers, Grid3x3, type LucideIcon } from 'lucide-react'

export interface NavItem { to: string; label: string; icon: LucideIcon; end?: boolean; feature: Feature }

/** Primary destinations, shared by the sidebar and the phone tab bar. */
export const NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: House, end: true, feature: 'home' },
  { to: '/review', label: 'Review', icon: Layers, feature: 'review' },
  { to: '/lesson', label: 'Lessons', icon: BookOpen, feature: 'lesson' },
  { to: '/radicals', label: 'Radicals', icon: Grid3x3, feature: 'radicals' },
  { to: '/pronunciation', label: 'Pronunciation', icon: AudioLines, feature: 'pronunciation' },
  { to: '/stats', label: 'Stats', icon: ChartNoAxesColumn, feature: 'stats' },
]
