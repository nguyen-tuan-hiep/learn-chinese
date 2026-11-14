import type { ReactNode } from 'react'

/** iOS Settings style icon: a white line icon on a coloured rounded square. `color` is a CSS colour or token, e.g. `var(--color-tint)`. */
export function IconBadge({ color, children }: { color: string; children: ReactNode }) {
  // White glyphs need a deep enough ground: yellow, mint, cyan and teal darken, in both light and dark mode.
  const ground = /--color-(yellow|mint|cyan|teal)\b/.test(color) ? `color-mix(in srgb, ${color} 72%, #000)` : color
  return <span aria-hidden="true" style={{ background: ground }} className="grid size-8 shrink-0 place-items-center rounded-lg text-white [&>svg]:size-[18px]">{children}</span>
}
