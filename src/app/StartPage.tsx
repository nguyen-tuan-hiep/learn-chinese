import { Navigate, useSearchParams } from 'react-router-dom'
import { pronunciationUnitLink } from '@/data/pronunciationLearning'

/** Preserve bookmarks from the former standalone introduction. */
export function StartPage() {
  const [params] = useSearchParams()
  return <Navigate replace to={pronunciationUnitLink(params.get('session') ?? '')} />
}
