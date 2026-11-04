#!/usr/bin/env node
/**
 * Draws the iOS launch images (apple-touch-startup-image) into public/splash/, light and dark,
 * for every screen in splash-sizes.json: the app icon with the app name under it.
 *
 * Run it again after changing public/app-icon.svg:  node scripts/generate-splash.mjs
 * Needs rsvg-convert and ImageMagick 7 (macOS: brew install librsvg imagemagick).
 * The Be Vietnam Pro font, used by the site, is downloaded from github.com/google/fonts. Letters it lacks
 * (the ǔ of Hànyǔ) are drawn with a system font, as the browser does.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

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
const fonts = { 600: await font('SemiBold'), 400: await font('Regular') }
// Be Vietnam Pro has no ǔ; like the browser, take that letter from a system font.
const FALLBACK = ['/System/Library/Fonts/SFNS.ttf', '/System/Library/Fonts/Helvetica.ttc', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'].find(existsSync)
const MISSING = /[ǎǐǒǔǚěǍǏǑǓǙĚ]/u

/** Width in pixels of a run of text. */
const widthOf = (content, fontFile, px) => Number(execFileSync('magick', ['-font', fontFile, '-pointsize', String(px), `label:${content}`, '-format', '%w', 'info:']).toString())

/** One line of text as a transparent PNG; each run uses Be Vietnam Pro or, for letters it lacks, the fallback font. */
function text(file, content, { weight, px, color }) {
  const runs = []
  for (const ch of content) {
    const fontFile = MISSING.test(ch) && FALLBACK ? FALLBACK : fonts[weight]
    if (runs.at(-1)?.fontFile === fontFile) runs.at(-1).text += ch
    else runs.push({ fontFile, text: ch })
  }
  const args = ['-size', `${px * 30}x${px * 2}`, 'xc:none', '-fill', color, '-pointsize', String(px)]
  let x = px
  for (const run of runs) {
    // The fallback font has no semibold face here, so thicken its letters to match.
    const bold = run.fontFile === FALLBACK && weight >= 600
    args.push('-font', run.fontFile, '-stroke', bold ? color : 'none', '-strokewidth', String(bold ? Math.max(1, Math.round(px * 0.035)) : 0), '-annotate', `+${x}+${Math.round(px * 1.4)}`, run.text)
    x += widthOf(run.text, run.fontFile, px)
  }
  execFileSync('magick', [...args, '-trim', '+repage', file])
  return file
}

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
      text(join(work, 'title.png'), 'Tự học Hànyǔ', { weight: 600, px: pt(26), color: c.ink }), '-gravity', 'north', '-geometry', `+0+${top + icon + pt(30)}`, '-composite',
      text(join(work, 'sub.png'), 'Học tiếng Trung từ con số 0', { weight: 400, px: pt(15), color: c.muted }), '-gravity', 'north', '-geometry', `+0+${top + icon + pt(72)}`, '-composite',
      // Few colours, so each image stays small.
      '-strip', '-dither', 'None', '-colors', '256', '-define', 'png:compression-level=9', join(out, splashName(s, theme)),
    ])
  }
  console.log(`${s.device}: ${W}×${H}`)
}
