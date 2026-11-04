import type { ReactNode } from 'react'

const tones = {
  neutral: 'bg-sunken text-muted',
  jade: 'bg-jade-soft text-jade',
  gold: 'bg-gold-soft text-gold',
  cinnabar: 'bg-cinnabar-soft text-cinnabar',
}

export function Badge({ tone = 'neutral', className = '', children }: { tone?: keyof typeof tones; className?: string; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}>{children}</span>
}
