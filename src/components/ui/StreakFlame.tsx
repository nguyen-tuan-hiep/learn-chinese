/**
 * Duolingo-style streak flame: a rounded orange flame with a yellow drop at its core.
 * Colours come from --color-streak / --color-streak-core; `lit={false}` greys it out (no study yet today).
 */
export function StreakFlame({ className = 'size-5', lit = true }: { className?: string; lit?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={`flame shrink-0 ${className}`}>
    <path fill={lit ? 'var(--color-streak)' : 'rgb(0 0 0 / 0.18)'}
      d="M12.7 2.3a1 1 0 0 0-1.45.03L8.4 5.6 6.55 4.55A1 1 0 0 0 5.05 5.4v7.5c0 4.1 3.12 7.6 6.95 7.6s6.95-3.5 6.95-7.6c0-2.05-.85-3.95-2.2-5.45z" />
    <path fill={lit ? 'var(--color-streak-core)' : 'rgb(255 255 255 / 0.55)'}
      d="M12 10.9a.9.9 0 0 0-.66.3c-1.2 1.35-2.3 2.75-2.3 4.2a2.96 2.96 0 0 0 5.92 0c0-1.45-1.1-2.85-2.3-4.2a.9.9 0 0 0-.66-.3z" />
  </svg>
}
