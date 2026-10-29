import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import { Layout } from './app/Layout'
import { TodayPage } from './app/TodayPage'
import { setPreferredVoice } from './lib/speech'
import { useSettings } from './store/settings'
import { StudyDataProvider } from './lib/useStudyData'

const CoursePage = lazy(() => import('./app/CoursePage').then((m) => ({ default: m.CoursePage })))
const LessonPage = lazy(() => import('./app/LessonPage').then((m) => ({ default: m.LessonPage })))
const PronunciationPage = lazy(() => import('./app/PronunciationPage').then((m) => ({ default: m.PronunciationPage })))
const ReviewPage = lazy(() => import('./app/ReviewPage').then((m) => ({ default: m.ReviewPage })))
const StatsPage = lazy(() => import('./app/StatsPage').then((m) => ({ default: m.StatsPage })))
const StartPage = lazy(() => import('./app/StartPage').then((m) => ({ default: m.StartPage })))
const RadicalsPage = lazy(() => import('./app/RadicalsPage').then((m) => ({ default: m.RadicalsPage })))
const RadicalLessonPage = lazy(() => import('./app/RadicalsPage').then((m) => ({ default: m.RadicalLessonPage })))

function useTheme() {
  const theme = useSettings((s) => s.theme)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && mq.matches))
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])
}

function useVoice() {
  const voice = useSettings((s) => s.voice)
  useEffect(() => setPreferredVoice(voice), [voice])
}

// Re-mount per lesson so switching lessons starts with fresh state.
function LessonRoute() {
  const { id } = useParams()
  return <LessonPage key={id} />
}

export default function App() {
  useTheme()
  useVoice()
  return (
    <StudyDataProvider><BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<p role="status" className="p-8">Đang tải bài học…</p>}><Routes>
        <Route element={<Layout />}>
          <Route index element={<TodayPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="course" element={<CoursePage />} />
          <Route path="lesson/:id" element={<LessonRoute />} />
          <Route path="pronunciation" element={<PronunciationPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="start" element={<StartPage />} />
          <Route path="radicals" element={<RadicalsPage />} />
          <Route path="radicals/:id" element={<RadicalLessonPage />} />
        </Route>
      </Routes></Suspense>
    </BrowserRouter></StudyDataProvider>
  )
}
