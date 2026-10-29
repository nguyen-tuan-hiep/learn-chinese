import { Component, type ReactNode } from 'react'

export class StudyErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <main className="max-w-xl mx-auto p-6 pt-16">
      <h1 className="text-2xl font-bold">Chưa mở được buổi học</h1>
      <p className="mt-3 text-muted">Hãy thử tải lại trang. Nếu trình duyệt đang chặn lưu dữ liệu, hãy cho phép lưu dữ liệu của website rồi thử lại.</p>
      <button className="mt-5 rounded-xl bg-ink text-paper px-4 py-3 font-semibold cursor-pointer" onClick={() => window.location.reload()}>Tải lại trang</button>
    </main>
    return this.props.children
  }
}
