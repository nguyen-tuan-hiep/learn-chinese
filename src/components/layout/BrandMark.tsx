import { useId } from 'react'

/**
 * The Hànyǔ mascot: a smiling steamed bun (bánh bao) in frosted glass.
 * Glass is faked inside the SVG: a blurred peach glow sits behind a translucent white body whose fill runs
 * from white to warm cream (one hue), with a white rim fading downward and a highlight on the top left.
 */
export function BrandMark({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const body = `${id}-body`, rim = `${id}-rim`, glow = `${id}-glow`
  return <svg viewBox="0 0 44 44" aria-hidden="true" className={className}>
    <defs>
      <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="1" stopColor="#e8dfd2" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id={rim} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.15" />
      </linearGradient>
      <filter id={glow} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2" /></filter>
    </defs>
    {/* Glow behind the glass, so the translucent body has something to frost. */}
    <circle cx="29" cy="30" r="9" fill="#f6c9a8" opacity="0.9" filter={`url(#${glow})`} />
    <circle cx="13" cy="20" r="6" fill="#ffffff" opacity="0.6" filter={`url(#${glow})`} />
    <path d="M4 30c0-12 8.5-22 18-22s18 10 18 22c0 4.5-4 7.5-18 7.5S4 34.5 4 30z" fill={`url(#${body})`} stroke={`url(#${rim})`} strokeWidth="1.4" />
    <ellipse cx="13" cy="17.5" rx="4.6" ry="2" fill="#fff" opacity="0.75" transform="rotate(-32 13 17.5)" />
    <g fill="none" stroke="#15120f" strokeWidth="2" strokeLinecap="round">
      <path d="M16 11.5c2 3 4 4 6 4s4-1 6-4" />
      <path d="M22 8.5v7" />
      <path d="M19.5 28.5q2.5 2.6 5 0" strokeWidth="1.8" />
    </g>
    <circle cx="15.5" cy="25" r="2" fill="#15120f" />
    <circle cx="28.5" cy="25" r="2" fill="#15120f" />
    <ellipse cx="11" cy="29.2" rx="2.6" ry="1.5" fill="#f08fae" opacity="0.8" />
    <ellipse cx="33" cy="29.2" rx="2.6" ry="1.5" fill="#f08fae" opacity="0.8" />
  </svg>
}
