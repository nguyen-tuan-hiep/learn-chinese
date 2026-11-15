/**
 * Stops the page scrolling behind a modal. The page reserves a scrollbar gutter (scrollbar-gutter: stable), which
 * stays empty while scrolling is locked and would show as a strip beside the drawer. So drop the gutter and pad the
 * page by the same width instead: nothing shifts, and fixed layers (backdrop, drawer) reach the window's edge.
 */
export function lockScroll() {
  const root = document.documentElement
  const gutter = window.innerWidth - root.clientWidth
  const prev = { overflow: root.style.overflow, gutter: root.style.scrollbarGutter, padding: root.style.paddingRight }
  root.style.overflow = 'hidden'
  root.style.scrollbarGutter = 'auto'
  if (gutter > 0) root.style.paddingRight = `${gutter}px`
  return () => { root.style.overflow = prev.overflow; root.style.scrollbarGutter = prev.gutter; root.style.paddingRight = prev.padding }
}
