import { useId, type ReactNode } from 'react'

export type GlassIcon = (props: { className?: string }) => ReactNode

/*
 * Tinted glass icons (set 2 of the Figma file "Hanyu – Glass nav icons").
 * Each is one hue from the app palette (same as its area's pastel: Home peach, Review lilac, Lessons green,
 * Radicals yellow, Pronunciation blue, Stats pink; Play coral), a solid shape behind, the same hue as frosted glass in front, white marks on the glass.
 * Where the glass covers the back shape, a blurred copy shows through, like the Figma background blur.
 * 120 grid with the art in the middle 96, so there is room for the soft coloured shadow.
 */

const house = (dx: number, dy: number) => `<path transform="translate(${dx} ${dy})" d="M10 46 37 22.6a10 10 0 0 1 13 0L77 46V72a12 12 0 0 1-12 12H22a12 12 0 0 1-12-12Z"/>`
const speaker = (dx: number, dy: number) => `<path transform="translate(${dx} ${dy})" d="M14 40h14L52 20.5a3 3 0 0 1 5 2.3V77.2a3 3 0 0 1-5 2.3L28 60H14a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8Z"/>`
const bar = (x: number, y: number, w: number, h: number, o = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w, h) / 2}" opacity="${o}"/>`

interface Art { from: string; to: string; back: string; front: string; marks: string; strokes?: string }

function render(a: Art, id: string) {
  const c = `${id}c`, t = `${id}t`, w = `${id}w`, r = `${id}r`, b = `${id}b`, s = `${id}s`, m = `${id}m`, f = `${id}f`
  return `<defs>
  <linearGradient id="${c}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a.from}"/><stop offset="1" stop-color="${a.to}"/></linearGradient>
  <linearGradient id="${t}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a.from}" stop-opacity=".62"/><stop offset="1" stop-color="${a.to}" stop-opacity=".42"/></linearGradient>
  <linearGradient id="${w}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset="1" stop-color="#fff" stop-opacity=".04"/></linearGradient>
  <linearGradient id="${r}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity=".1"/></linearGradient>
  <filter id="${b}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="${s}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="7" stdDeviation="7" flood-color="${a.to}" flood-opacity=".35"/></filter>
  <filter id="${m}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="${a.to}" flood-opacity=".4"/></filter>
  <clipPath id="${f}">${a.front}</clipPath>
</defs>
<g transform="translate(12 12)">
  <g fill="url(#${c})">${a.back}</g>
  <g fill="url(#${t})" filter="url(#${s})" opacity=".55">${a.front}</g>
  <g clip-path="url(#${f})"><g fill="url(#${c})" filter="url(#${b})">${a.back}</g></g>
  <g fill="url(#${t})">${a.front}</g>
  <g fill="url(#${w})">${a.front}</g>
  <g fill="none" stroke="url(#${r})" stroke-width="1.4">${a.front}</g>
  <g filter="url(#${m})" opacity=".92"><g fill="#fff">${a.marks}</g><g fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round">${a.strokes ?? ''}</g></g>
</g>`
}

function icon(a: Art): GlassIcon {
  return function Icon({ className }) {
    // Each instance needs its own gradient, filter and clip ids.
    const id = `g${useId().replace(/[^a-zA-Z0-9]/g, '')}`
    return <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" className={className} dangerouslySetInnerHTML={{ __html: render(a, id) }} />
  }
}

export const HomeIcon = icon({ from: '#feb98f', to: '#d26600', back: house(14, -12), front: house(0, 6), marks: bar(37, 62, 14, 22) })

export const ReviewIcon = icon({ from: '#cec0ff', to: '#926fe3',
  back: '<rect x="34" y="8" width="50" height="62" rx="14" transform="rotate(12 59 39)"/>',
  front: '<rect x="12" y="26" width="52" height="64" rx="14" transform="rotate(-7 38 58)"/>',
  marks: `<g transform="rotate(-7 38 58)">${bar(24, 42, 28, 7)}${bar(24, 56, 18, 7, 0.8)}<circle cx="38" cy="76" r="4" opacity=".8"/></g>` })

export const LessonsIcon = icon({ from: '#8ee0ab', to: '#09a35e',
  back: '<rect x="36" y="6" width="50" height="62" rx="12" transform="rotate(9 61 37)"/>',
  front: '<rect x="12" y="24" width="56" height="66" rx="14"/>',
  marks: bar(22, 34, 7, 46, 0.85) + bar(36, 40, 22, 7) + bar(36, 53, 15, 7, 0.8) })

export const RadicalsIcon = icon({ from: '#f6d56b', to: '#df9201',
  back: '<rect x="36" y="6" width="54" height="54" rx="15" transform="rotate(10 63 33)"/>',
  front: '<rect x="10" y="28" width="60" height="60" rx="17"/>',
  marks: '<rect x="25" y="43" width="13" height="13" rx="4"/><rect x="42" y="43" width="13" height="13" rx="4" opacity=".8"/><rect x="25" y="60" width="13" height="13" rx="4" opacity=".8"/><rect x="42" y="60" width="13" height="13" rx="4"/>' })

export const PronunciationIcon = icon({ from: '#95d3ff', to: '#0292d7', back: speaker(14, -12), front: speaker(0, 0), marks: '',
  strokes: '<path d="M68 38a16 16 0 0 1 0 24"/><path d="M78 28a30 30 0 0 1 0 44" opacity=".75"/>' })

export const StatsIcon = icon({ from: '#feb0ce', to: '#d4558e',
  back: '<rect x="46" y="6" width="40" height="66" rx="13"/>',
  front: '<rect x="10" y="26" width="64" height="62" rx="17"/>',
  marks: bar(23, 60, 9, 16, 0.8) + bar(37.5, 50, 9, 26, 0.9) + bar(52, 40, 9, 36) })

export const PlayIcon = icon({ from: '#ffa192', to: '#e14b39',
  back: '<rect x="36" y="6" width="52" height="52" rx="15" transform="rotate(12 62 32)"/>',
  front: '<rect x="10" y="26" width="64" height="64" rx="19"/>',
  marks: '<path d="M35 44.6a3.5 3.5 0 0 1 5.3-3l21 13.4a3.5 3.5 0 0 1 0 5.9l-21 13.4a3.5 3.5 0 0 1-5.3-3Z"/>' })
