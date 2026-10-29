import HanziWriter from 'hanzi-writer'
import { useEffect, useState } from 'react'
import { strokeParts } from '@/data/charComponents'
import { LESSONS } from '@/data/course'
import { RADICAL_BY_GLYPH } from '@/data/radicals'
import { lessonRadicals } from '@/lib/lessonRadicals'

const cache = new Map<string, Promise<string[] | null>>()
function strokesOf(char: string) {
  if (!cache.has(char)) {
    let load: Promise<string[] | null>
    try { load = HanziWriter.loadCharacterData(char).then((d) => (d ? d.strokes : null), () => null) } catch { load = Promise.resolve(null) }
    cache.set(char, load)
  }
  return cache.get(char)!
}

export const TAUGHT_COLOR = 'var(--color-cinnabar)'
export const KNOWN_COLOR = 'var(--color-jade)'

/** Radicals to colour for a lesson: taught in this lesson in red, in any earlier lesson in green. */
export function lessonHighlight(lessonId: string | undefined): Map<number, string> {
  const at = LESSONS.findIndex((l) => l.id === lessonId)
  const map = new Map<number, string>()
  LESSONS.slice(0, at + 1).forEach((lesson, i) => {
    for (const r of lessonRadicals(lesson.id)?.taught ?? []) map.set(r.id, i === at ? TAUGHT_COLOR : KNOWN_COLOR)
  })
  return map
}

/** A character drawn from its stroke outlines, with the strokes of chosen radicals coloured. Falls back to plain text.
 * Pass `at` to draw it inside another SVG (centred on that point). */
export function ColoredHanzi({ char, highlight, glyphs, size = 96, className = '', at, baseFill = 'var(--color-ink)' }: {
  char: string; highlight: Map<number, string>
  /** Colour by component instead of by radical, e.g. the sound part 青 in 请. */
  glyphs?: Map<string, string>
  size?: number; className?: string; at?: { x: number; y: number }; baseFill?: string
}) {
  const [strokes, setStrokes] = useState<string[] | null | undefined>(undefined)
  useEffect(() => {
    let live = true
    strokesOf(char).then((s) => { if (live) setStrokes(s) })
    return () => { live = false }
  }, [char])
  const parts = strokeParts(char)
  if (!strokes && at) return <text x={at.x} y={at.y + 2} textAnchor="middle" dominantBaseline="middle" className="font-han" fontSize={size * 0.9} fill={baseFill}>{char}</text>
  if (!strokes) return <span className={`font-han leading-none ${className}`} style={{ fontSize: size * 0.9 }} aria-label={char}>{char}</span>
  const self = RADICAL_BY_GLYPH.get(char)
  // Colour by the outermost part that is a radical, matching how lessonRadicals reads characters.
  const colorOf = (i: number) => {
    const part = glyphs && (parts[i] ?? []).find((g) => glyphs.has(g))
    if (part) return glyphs!.get(part)!
    if (self) return highlight.get(self.id) ?? baseFill
    const radical = (parts[i] ?? []).map((glyph) => RADICAL_BY_GLYPH.get(glyph)).find(Boolean)
    return (radical && highlight.get(radical.id)) ?? baseFill
  }
  const place = at ? { x: at.x - size / 2, y: at.y - size / 2 } : {}
  return <svg {...place} viewBox="0 0 1024 1024" width={size} height={size} role="img" aria-label={char} className={`inline-block shrink-0 ${className}`}>
    <g transform="translate(0, 900) scale(1, -1)">{strokes.map((d, i) => <path key={i} d={d} fill={colorOf(i)} />)}</g>
  </svg>
}
