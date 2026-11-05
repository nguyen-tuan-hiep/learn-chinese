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
void migrateLegacyDatabase().finally(() => createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudyErrorBoundary><App /></StudyErrorBoundary>
  </StrictMode>,
))
