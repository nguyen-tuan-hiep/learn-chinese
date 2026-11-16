#!/usr/bin/env node
/**
 * Draws the app icons: the happy bánh bao mascot built from stacked glass layers, floating on ink, with steam and two stars:
 * public/app-icon.svg (favicon, splash source), apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png.
 * Run: node scripts/generate-icons.mjs   (needs rsvg-convert: brew install librsvg)
 * Then regenerate the iOS launch images: node scripts/generate-splash.mjs
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const pub = (file) => join(root, 'public', file)

const INK = '#15120f'
const BODY = 'M26 142C26 84 60 46 100 46C140 46 174 84 174 142C174 162 150 170 100 170C50 170 26 162 26 142Z'
const PLEATS = '<path d="M100 54C92 60 82 64 70 66"/><path d="M100 54C95 62 90 68 84 73"/><path d="M100 54V75"/><path d="M100 54C105 62 110 68 116 73"/><path d="M100 54C108 60 118 64 130 66"/>'
const KNOT = 'M89 54C89 45 94 40 100 40C106 40 111 45 111 54C106 57 94 57 89 54Z'
const face = (ink) => `<path d="M70 121Q77 111 84 121" stroke="${ink}" stroke-width="4.5" stroke-linecap="round" fill="none"/><path d="M116 121Q123 111 130 121" stroke="${ink}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
<path d="M88 127H112Q110 144 100 144Q90 144 88 127Z" fill="${ink}"/>`
const star = (x, y) => `<g transform="translate(${x} ${y}) scale(1.2)"><path d="M0 -9L2.5 -2.5L9 0L2.5 2.5L0 9L-2.5 2.5L-9 0L-2.5 -2.5Z" fill="url(#star)"/><path d="M-1 -6L0.6 -1.6L-1 -1Z" fill="#fff" fill-opacity="0.8"/></g>`

const DEFS = `
<radialGradient id="bg" cx="0.5" cy="0.62" r="0.66"><stop offset="0" stop-color="#3b3027"/><stop offset="1" stop-color="#121010"/></radialGradient>
<linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.97"/><stop offset="0.6" stop-color="#fbf3e8" stop-opacity="0.9"/><stop offset="1" stop-color="#ead6ba" stop-opacity="0.78"/></linearGradient>
<linearGradient id="rim" x1="0.15" y1="0" x2="0.85" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.25"/><stop offset="1" stop-color="#fff" stop-opacity="0.7"/></linearGradient>
<linearGradient id="knot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#efe1cb"/></linearGradient>
<radialGradient id="blush" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f58fae" stop-opacity="0.95"/><stop offset="1" stop-color="#f58fae" stop-opacity="0"/></radialGradient>
<linearGradient id="star" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a8"/><stop offset="1" stop-color="#f4b63c"/></linearGradient>
<linearGradient id="steam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0.75"/><stop offset="1" stop-color="#fff" stop-opacity="0.08"/></linearGradient>
<clipPath id="bodyClip"><path d="${BODY}"/></clipPath>
<filter id="b1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>
<filter id="b3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="b8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="b14" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>`

// Steam: three glass ribbons, a soft wide band with a brighter core, fading as they rise.
const STEAM = ['M430 248Q402 214 430 180Q458 146 430 112', 'M512 232Q484 194 512 156Q540 118 512 80', 'M594 248Q566 214 594 180Q622 146 594 112']
  .map((d) => `<path d="${d}" stroke="url(#steam)" stroke-width="30" stroke-linecap="round" fill="none" opacity="0.55"/><path d="${d}" stroke="url(#steam)" stroke-width="10" stroke-linecap="round" fill="none" transform="translate(-5 0)"/>`).join('')

/** The bun in its 200×200 box, as stacked layers: shadow and caught light, frosted body, raised pleats and knot, face in front. */
const BUN = `
<ellipse cx="100" cy="174" rx="60" ry="9" fill="#000" opacity="0.55" filter="url(#b3)"/>
<ellipse cx="104" cy="142" rx="58" ry="26" fill="#f5b183" opacity="0.45" filter="url(#b8)"/>
<path d="${BODY}" fill="url(#glass)"/>
<g clip-path="url(#bodyClip)"><ellipse cx="112" cy="176" rx="64" ry="20" fill="#f2b98e" opacity="0.35" filter="url(#b8)"/><ellipse cx="60" cy="96" rx="34" ry="24" fill="#fff" opacity="0.9" filter="url(#b8)"/></g>
<path d="${BODY}" fill="none" stroke="url(#rim)" stroke-width="2.4"/>
<path d="M38 128C40 98 56 70 84 56" stroke="#fff" stroke-width="3.2" stroke-linecap="round" fill="none" opacity="0.95"/>
<g transform="translate(0 3)" stroke="#6b4a2a" stroke-opacity="0.22" stroke-width="4.5" stroke-linecap="round" fill="none" filter="url(#b1)">${PLEATS}</g>
<g stroke="#d6ba92" stroke-width="3.6" stroke-linecap="round" fill="none">${PLEATS}</g>
<g transform="translate(-0.6 -0.9)" stroke="#fff" stroke-opacity="0.55" stroke-width="1.2" stroke-linecap="round" fill="none">${PLEATS}</g>
<path d="${KNOT}" transform="translate(0 3)" fill="#6b4a2a" opacity="0.22" filter="url(#b1)"/>
<path d="${KNOT}" fill="url(#knot)" stroke="#fff" stroke-width="1.2"/>
<path d="M95 47Q100 43 105 47" stroke="#d6ba92" stroke-width="3" stroke-linecap="round" fill="none"/>
<g transform="translate(0 2.4)" opacity="0.22" filter="url(#b1)">${face('#5a3e22')}</g>
<ellipse cx="62" cy="134" rx="14" ry="9" fill="url(#blush)"/><ellipse cx="138" cy="134" rx="14" ry="9" fill="url(#blush)"/>
${face(INK)}
<path d="M93 138Q100 133 107 138Q105 143 100 143Q95 143 93 138Z" fill="#f08fae"/>
<path d="M91 129H109" stroke="#fff" stroke-opacity="0.25" stroke-width="1.2" stroke-linecap="round"/>
${star(21, 68)}${star(179, 68)}`

/**
 * The icon; `scale` shrinks the art about the centre (smaller for the maskable safe zone), the background stays full.
 * `rounded` cuts the iOS-style corner (22.37% radius) for places that show the icon as is (favicon, desktop install, splash);
 * apple-touch-icon and the maskable icon stay full-bleed squares, because iOS and Android cut their own shape
 * (iOS would fill transparent corners with black).
 */
const icon = (scale, rounded) => `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
<!-- App icon: the happy bánh bao in stacked glass on ink. Generated by scripts/generate-icons.mjs. -->
<defs>${DEFS}<clipPath id="corner"><rect width="1024" height="1024" rx="229"/></clipPath></defs>
<g${rounded ? ' clip-path="url(#corner)"' : ''}>
<rect width="1024" height="1024" fill="url(#bg)"/>
<g transform="translate(512 512) scale(${scale}) translate(-512 -512)">
<ellipse cx="512" cy="640" rx="380" ry="300" fill="#7a5638" opacity="0.18" filter="url(#b14)"/>${STEAM}
<g transform="translate(52 88) scale(4.6)">${BUN}</g>
</g>
</g>
</svg>
`

writeFileSync(pub('app-icon.svg'), icon(1, true))
const work = mkdtempSync(join(tmpdir(), 'icons-'))
const square = join(work, 'square.svg')
writeFileSync(square, icon(1, false))
const maskable = join(work, 'maskable.svg')
writeFileSync(maskable, icon(0.78, false))
const render = (src, size, file) => execFileSync('rsvg-convert', ['-w', String(size), '-h', String(size), src, '-o', pub(file)])
render(square, 180, 'apple-touch-icon.png')
render(pub('app-icon.svg'), 192, 'icon-192.png')
render(pub('app-icon.svg'), 512, 'icon-512.png')
render(maskable, 512, 'icon-maskable-512.png')
console.log('Icons written to public/')
