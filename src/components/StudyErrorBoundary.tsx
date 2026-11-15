import { Component, type ReactNode } from 'react'

export class StudyErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <main className="max-w-xl mx-auto p-6 pt-16">
      <h1 className="text-2xl font-bold">Could not open the study session</h1>
      <p className="mt-3 text-muted">Try reloading the page. If your browser blocks site storage, allow this site to store data and try again.</p>
      <button className="mt-5 rounded-xl bg-primary-bg text-on-primary px-4 py-3 font-semibold cursor-pointer" onClick={() => window.location.reload()}>Reload page</button>
    </main>
    return this.props.children
  }
}
