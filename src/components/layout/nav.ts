import type { Feature } from '@/lib/palette'
import { AudioLines, BookOpen, ChartNoAxesColumn, House, Layers, Grid3x3, type LucideIcon } from 'lucide-react'

export interface NavItem { to: string; label: string; icon: LucideIcon; end?: boolean; feature: Feature }

/** Primary destinations, shared by the sidebar and the phone tab bar. */
export const NAV: NavItem[] = [
  { to: '/', label: 'Trang chủ', icon: House, end: true, feature: 'home' },
  { to: '/review', label: 'Ôn tập', icon: Layers, feature: 'review' },
  { to: '/lesson', label: 'Bài học', icon: BookOpen, feature: 'lesson' },
  { to: '/radicals', label: 'Bộ thủ', icon: Grid3x3, feature: 'radicals' },
  { to: '/pronunciation', label: 'Phát âm', icon: AudioLines, feature: 'pronunciation' },
  { to: '/stats', label: 'Thống kê', icon: ChartNoAxesColumn, feature: 'stats' },
]
