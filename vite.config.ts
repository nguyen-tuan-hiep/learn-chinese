import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

interface SplashSize { width: number; height: number; ratio: number }

/** Links the iOS launch images drawn by scripts/generate-splash.mjs, one per screen size and colour scheme. */
function appleSplashScreens(base: string): Plugin {
  const sizes: SplashSize[] = JSON.parse(readFileSync(new URL('./scripts/splash-sizes.json', import.meta.url), 'utf8'))
  return {
    name: 'apple-splash-screens',
    transformIndexHtml: () => sizes.flatMap((s) => (['light', 'dark'] as const).map((theme) => ({
      tag: 'link',
      injectTo: 'head' as const,
      attrs: {
        rel: 'apple-touch-startup-image',
        media: `screen and (device-width: ${s.width}px) and (device-height: ${s.height}px) and (-webkit-device-pixel-ratio: ${s.ratio}) and (orientation: portrait) and (prefers-color-scheme: ${theme})`,
        href: `${base}splash/apple-splash-${theme}-${s.width * s.ratio}x${s.height * s.ratio}.png`,
      },
    }))),
  }
}

/** Puts public/app-icon.svg inline in the launch screen, so the icon is there on the first frame. */
function inlineSplashIcon(): Plugin {
  return {
    name: 'inline-splash-icon',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const svg = readFileSync(new URL('./public/app-icon.svg', import.meta.url), 'utf8')
          .replace(/<!--[\s\S]*?-->/g, '')
          .replace(/ width="1024" height="1024"/, '')
          // Prefix ids so they cannot clash with other SVGs on the page.
          .replace(/id="([^"]+)"/g, 'id="splash-$1"')
          .replace(/url\(#([^)]+)\)/g, 'url(#splash-$1)')
          .trim()
        return html.replace('<!-- app-icon -->', svg)
      },
    },
  }
}

export default defineConfig(({ command, isPreview }) => {
  // GitHub Pages serves the site under /learn-chinese/; `vite preview` serves the build the same way.
  const base = command === 'build' || isPreview ? '/learn-chinese/' : '/'
  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      inlineSplashIcon(),
    appleSplashScreens(base),
      VitePWA({
        // A new version waits until the learner taps "Tải lại", so nothing changes in the middle of a lesson.
        registerType: 'prompt',
        // Manifest icons and every .svg are added on their own; this is the one icon iOS asks for besides them.
        includeAssets: ['apple-touch-icon.png'],
        manifest: {
          name: 'Tự học Hànyǔ',
          short_name: 'Hànyǔ',
          description: 'Tự học tiếng Trung từ con số 0: phát âm, bộ thủ, từ vựng và bài học HSK.',
          lang: 'vi',
          start_url: './',
          scope: './',
          display: 'standalone',
          orientation: 'portrait',
          // Android builds its splash screen from these colours and the 512px icon.
          background_color: '#faf7f2',
          theme_color: '#faf7f2',
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          // Keep the app shell offline. The Chinese font comes in ~100 slices (about 13 MB),
          // so those are cached only as pages use them, and so are the iOS splash images.
          globPatterns: ['**/*.{js,css,html,svg,ico}'],
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          // BrowserRouter: any address such as /lesson/hsk1-01 opens the app offline.
          navigateFallback: 'index.html',
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'font',
              handler: 'CacheFirst',
              options: { cacheName: 'fonts', expiration: { maxEntries: 300, maxAgeSeconds: 365 * 24 * 3600 }, cacheableResponse: { statuses: [0, 200] } },
            },
            {
              // The Be Vietnam Pro stylesheet from Google Fonts; its font files match the rule above.
              urlPattern: ({ url }) => url.hostname === 'fonts.googleapis.com',
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'font-styles' },
            },
            {
              // Stroke outlines for the writing practice, loaded from jsDelivr by hanzi-writer.
              urlPattern: ({ url }) => url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('/hanzi-writer-data'),
              handler: 'CacheFirst',
              options: { cacheName: 'hanzi-strokes', expiration: { maxEntries: 3000, maxAgeSeconds: 365 * 24 * 3600 }, cacheableResponse: { statuses: [0, 200] } },
            },
            {
              urlPattern: ({ url }) => url.pathname.includes('/splash/'),
              handler: 'CacheFirst',
              options: { cacheName: 'splash', expiration: { maxEntries: 60 } },
            },
          ],
        },
      }),
    ],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  }
})
