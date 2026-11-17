import type { ReactNode } from 'react'

/** A settings row's leading icon: just the line glyph, no tile behind it. The tint draws in the label colour;
 *  status colours (warning, danger, success) colour the glyph itself. `color` is a CSS colour or token. */
export function IconBadge({ color, children }: { color: string; children: ReactNode }) {
  const glyph = /--color-tint\b/.test(color) ? 'var(--color-label)' : color
  return <span aria-hidden="true" style={{ color: glyph }} className="grid size-8 shrink-0 place-items-center [&>svg]:size-5 [&>svg]:stroke-[1.9]">{children}</span>
}
