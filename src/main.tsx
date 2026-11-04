import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { StudyErrorBoundary } from './components/StudyErrorBoundary'
import { migrateLegacyDatabase } from './lib/db'
import 'lxgw-wenkai-gb-web/lxgwwenkaigb-regular/result.css'
import './index.css'

// iOS home-screen apps report navigator.standalone; mark the page so layout can pad for the rounded screen corners.
if ((navigator as Navigator & { standalone?: boolean }).standalone || window.matchMedia('(display-mode: standalone)').matches) {
  document.documentElement.classList.add('standalone')
}

// Move progress saved under the project's old name first, so the first screen already shows it.
void migrateLegacyDatabase().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <StudyErrorBoundary><App /></StudyErrorBoundary>
    </StrictMode>,
  )
  hideSplash()
})

/** Play the launch screen's exit (see index.html) once the app has painted, then remove it. */
function hideSplash() {
  const splash = document.getElementById('splash')
  if (!splash) return
  const root = document.documentElement
  // Remember the status bar height of a home-screen app, for placing the launch screen next time.
  if ((navigator as Navigator & { standalone?: boolean }).standalone) {
    const statusBar = screen.height - window.innerHeight
    try { if (statusBar > 0 && statusBar < 120) localStorage.setItem('splash-status-bar', String(statusBar)) } catch { /* storage unavailable */ }
  }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    splash.classList.add('exit')
    root.classList.add('from-splash')
    setTimeout(() => { splash.remove(); root.classList.remove('from-splash') }, 450)
  }))
}
