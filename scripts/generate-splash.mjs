#!/usr/bin/env node
/**
 * Draws the iOS launch images (apple-touch-startup-image) into public/splash/, light and dark,
 * for every screen in splash-sizes.json: the app icon with the app name under it.
 *
 * Run it again after changing public/app-icon.svg:  node scripts/generate-splash.mjs
 * Needs rsvg-convert and ImageMagick 7 (macOS: brew install librsvg imagemagick).
 * The Be Vietnam Pro font, used by the site, is downloaded from github.com/google/fonts, and the text is
 * turned into shapes with opentype.js. Also writes scripts/splash-text.svg for the launch screen in index.html.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import opentype from 'opentype.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const sizes = JSON.parse(readFileSync(join(root, 'scripts/splash-sizes.json'), 'utf8'))
const out = join(root, 'public/splash')
mkdirSync(out, { recursive: true })

// Colours from src/index.css: paper and ink, light and dark.
const THEMES = {
  light: { background: '#faf7f2', ink: '#1c1917', muted: '#625a52' },
  dark: { background: '#101819', ink: '#edf4f2', muted: '#a7bab7' },
}

const work = mkdtempSync(join(tmpdir(), 'splash-'))
async function font(weight) {
  const file = join(work, `BeVietnamPro-${weight}.ttf`)
  if (!existsSync(file)) {
    const response = await fetch(`https://github.com/google/fonts/raw/main/ofl/bevietnampro/BeVietnamPro-${weight}.ttf`)
    if (!response.ok) throw new Error(`Font download failed: ${response.status}`)
    writeFileSync(file, Buffer.from(await response.arrayBuffer()))
  }
  return file
}
const fonts = {
  600: opentype.parse(readFileSync(await font('SemiBold')).buffer),
  400: opentype.parse(readFileSync(await font('Regular')).buffer),
}

/**
 * One line of text as SVG path data at `size`, with its width. Be Vietnam Pro has no ǔ, so it is
 * written as u plus the combining caron, which is centred over the letter before it.
 */
function layout(font, content, size) {
  const scale = size / font.unitsPerEm
  let x = 0, d = '', prev = null, prevX = 0
  for (const glyph of font.stringToGlyphs(content.replace(/ǔ/g, 'u\u030C'))) {
    if (glyph.advanceWidth === 0 && prev) {
      const box = glyph.getBoundingBox(), base = prev.getBoundingBox()
      d += glyph.getPath(prevX + ((base.x1 + base.x2) / 2 - (box.x1 + box.x2) / 2) * scale, 0, size).toPathData(2)
      continue
    }
    if (prev) x += font.getKerningValue(prev, glyph) * scale
    d += glyph.getPath(x, 0, size).toPathData(2)
    prev = glyph; prevX = x; x += glyph.advanceWidth * scale
  }
  return { d, width: x }
}

// The name and the line under it, in points. Drawn once as shapes and used both in the launch images
// and, inlined by vite.config.ts, in the launch screen of index.html, so the two match exactly.
const TEXT_GAP = 21 // from the bottom of the icon to the top of the text block
const title = layout(fonts[600], 'Tự học Hànyǔ', 26)
const subtitle = layout(fonts[400], 'Học tiếng Trung từ con số 0', 15)
const textWidth = Math.ceil(Math.max(title.width, subtitle.width)) + 4, textHeight = 70
function textSvg(titleFill, subtitleFill) {
  const line = (run, baseline, fill) => `<path transform="translate(${((textWidth - run.width) / 2).toFixed(2)} ${baseline})" ${fill} d="${run.d}"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${textWidth}" height="${textHeight}" viewBox="0 0 ${textWidth} ${textHeight}">`
    + line(title, 27, titleFill) + line(subtitle, 61, subtitleFill) + '</svg>\n'
}
// Colours come from the page: the name takes the text colour, the line under it --splash-muted.
writeFileSync(join(root, 'scripts/splash-text.svg'), textSvg('fill="currentColor"', 'style="fill: var(--splash-muted)"'))

/** Splash image file name for one screen; vite.config.ts builds the same name. */
const splashName = (s, theme) => `apple-splash-${theme}-${s.width * s.ratio}x${s.height * s.ratio}.png`

for (const s of sizes) {
  const W = s.width * s.ratio, H = s.height * s.ratio, pt = (n) => Math.round(n * s.ratio)
  // Same size on every screen, in points: a 112pt icon, the name at 26pt and a 15pt line under it.
  const icon = pt(112)
  const iconFile = join(work, `icon-${icon}.png`)
  execFileSync('rsvg-convert', ['-w', String(icon), '-h', String(icon), join(root, 'public/app-icon.svg'), '-o', iconFile])
  const radius = Math.round(icon * 0.2237)
  const top = Math.round(H * 0.42 - icon / 2)
  for (const [theme, c] of Object.entries(THEMES)) {
    const textFile = join(work, `text-${theme}.png`)
    writeFileSync(join(work, 'text.svg'), textSvg(`fill="${c.ink}"`, `fill="${c.muted}"`))
    execFileSync('rsvg-convert', ['-w', String(pt(textWidth)), '-h', String(pt(textHeight)), join(work, 'text.svg'), '-o', textFile])
    execFileSync('magick', [
      '-size', `${W}x${H}`, `xc:${c.background}`,
      // Icon with iOS-like rounded corners and a soft shadow.
      '(', iconFile,
      '(', '-size', `${icon}x${icon}`, 'xc:black', '-fill', 'white', '-draw', `roundrectangle 0,0,${icon - 1},${icon - 1},${radius},${radius}`, ')',
      '-alpha', 'off', '-compose', 'CopyOpacity', '-composite',
      '(', '+clone', '-background', '#04382d', '-shadow', `${theme === 'light' ? 22 : 40}x${pt(12)}+0+${pt(8)}`, ')',
      '+swap', '-background', 'none', '-compose', 'over', '-layers', 'merge', '+repage', ')',
      // The shadow pads the icon by 2σ (24pt) on each side and is offset 8pt down, so the icon sits 16pt into it.
      '-gravity', 'north', '-geometry', `+0+${top - pt(16)}`, '-compose', 'over', '-composite',
      textFile, '-gravity', 'north', '-geometry', `+0+${top + icon + pt(TEXT_GAP)}`, '-composite',
      // Few colours, so each image stays small.
      '-strip', '-dither', 'None', '-colors', '256', '-define', 'png:compression-level=9', join(out, splashName(s, theme)),
    ])
  }
  console.log(`${s.device}: ${W}×${H}`)
}
