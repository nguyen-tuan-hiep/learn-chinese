/**
 * Stops the page scrolling behind a modal. The page reserves a scrollbar gutter (scrollbar-gutter: stable), which
 * stays empty while scrolling is locked and would show as a strip beside the drawer. So drop the gutter and pad the
 * page by the same width instead: nothing shifts, and fixed layers (backdrop, drawer) reach the window's edge.
 */
export function lockScroll() {
  const root = document.documentElement
  // clientWidth ignores the reserved gutter when the page is too short to scroll; the element's own box does not.
  const gutter = Math.round(window.innerWidth - root.getBoundingClientRect().width)
  const prev = { overflow: root.style.overflow, gutter: root.style.scrollbarGutter, padding: root.style.paddingRight }
  root.style.overflow = 'hidden'
  root.style.scrollbarGutter = 'auto'
  // Fixed layers anchored to the right edge read --scroll-lock-gap to stay put too.
  if (gutter > 0) { root.style.paddingRight = `${gutter}px`; root.style.setProperty('--scroll-lock-gap', `${gutter}px`) }
  return () => { root.style.overflow = prev.overflow; root.style.scrollbarGutter = prev.gutter; root.style.paddingRight = prev.padding; root.style.removeProperty('--scroll-lock-gap') }
}
