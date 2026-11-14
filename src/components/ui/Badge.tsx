import type { CSSProperties, ReactNode } from 'react'

const tones = {
  neutral: 'bg-fill text-secondary-label',
  jade: 'bg-tint-soft text-jade',
  tint: 'bg-tint-soft text-jade',
  success: 'bg-success-soft text-success-text',
  gold: 'bg-warning-soft text-gold',
  cinnabar: 'bg-danger-soft text-cinnabar',
  purple: 'bg-[color-mix(in_srgb,var(--color-purple)_16%,transparent)] text-label',
  orange: 'bg-warning-soft text-warning-text',
  pink: 'bg-[color-mix(in_srgb,var(--color-pink)_15%,transparent)] text-label',
  teal: 'bg-[color-mix(in_srgb,var(--color-teal)_18%,transparent)] text-label',
  indigo: 'bg-[color-mix(in_srgb,var(--color-indigo)_16%,transparent)] text-label',
}

/** Small pill label. */
export function Badge({ tone = 'neutral', className = '', style, children }: { tone?: keyof typeof tones; className?: string; /** Overrides the tone's wash, e.g. `background: levelSoft(2)`. */ style?: CSSProperties; children: ReactNode }) {
  return <span style={style} className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-caption font-semibold ${tones[tone]} ${className}`}>{children}</span>
}
