import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { StudyErrorBoundary } from './components/StudyErrorBoundary'
import 'lxgw-wenkai-gb-web/lxgwwenkaigb-regular/result.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudyErrorBoundary><App /></StudyErrorBoundary>
  </StrictMode>,
)
