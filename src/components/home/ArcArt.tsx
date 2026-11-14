import { useId } from 'react'

/** A restrained Apple Card-like interference pattern, used only on the featured card. */
export function ArcArt({ className = '' }: { className?: string }) {
  const id = useId()
  const arcs = Array.from({ length: 24 }, (_, i) => 14 + i * 9)
  return <svg aria-hidden="true" viewBox="0 0 240 240" className={`pointer-events-none absolute -right-8 -bottom-10 opacity-70 dark:opacity-35 ${className}`} fill="none">
    <defs>
      <linearGradient id={id} x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ff9db1" stopOpacity="0.85" />
        <stop offset="52%" stopColor="#ffb6a5" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
    {arcs.map((r, i) => <path key={r} d={`M${240 - r} 0A${r} ${r} 0 0 0 240 ${r}`} stroke={`url(#${id})`} strokeWidth={i % 6 === 0 ? 1.1 : 0.7} />)}
  </svg>
}
