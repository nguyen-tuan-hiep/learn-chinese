import { useEffect, useState } from 'react'

const R = 40 // the sheet's corner radius (2.5rem)

/** One inverted corner: frame colour outside a quarter circle, so the sheet looks rounded underneath. */
function Corner({ at }: { at: 'tl' | 'tr' | 'bl' | 'br' }) {
  const place = { tl: 'left-0 top-full', tr: 'right-0 top-full', bl: 'left-0 bottom-full', br: 'right-0 bottom-full' }[at]
  return <span aria-hidden="true" className={`absolute ${place}`}
    style={{ width: R, height: R, background: `radial-gradient(circle at ${at[1] === 'l' ? '100%' : '0'} ${at[0] === 't' ? '100%' : '0'}, transparent ${R - 0.5}px, var(--frame) ${R}px)` }} />
}

/**
 * Desktop only: the black frame's top and bottom strips (with the sheet's rounded corners) stay put while the page scrolls,
 * and content passing under the top strip blurs out gradually.
 * `left` matches the sheet's left edge (it follows the sidebar width).
 */
export function DesktopFrame({ left }: { left: string }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const edge = `pointer-events-none fixed right-3 z-[15] hidden md:block transition-[left] duration-200 motion-reduce:transition-none ${left}`
  return <>
    {/* Progressive blur: strongest right under the strip, fading out over 3.5rem. Only once the page has moved. */}
    <div aria-hidden="true" className={`${edge} top-3 h-14 transition-opacity duration-200 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', background: 'linear-gradient(var(--color-paper), transparent)',
        maskImage: 'linear-gradient(black 20%, transparent)', WebkitMaskImage: 'linear-gradient(black 20%, transparent)', borderRadius: `${R}px ${R}px 0 0` }} />
    <div aria-hidden="true" className={`${edge} top-0 h-3 bg-(--frame)`}><Corner at="tl" /><Corner at="tr" /></div>
    <div aria-hidden="true" className={`${edge} bottom-0 h-3 bg-(--frame)`}><Corner at="bl" /><Corner at="br" /></div>
  </>
}
