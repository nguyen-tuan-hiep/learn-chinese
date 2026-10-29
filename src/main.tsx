import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { StudyErrorBoundary } from './components/StudyErrorBoundary'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudyErrorBoundary><App /></StudyErrorBoundary>
  </StrictMode>,
)
