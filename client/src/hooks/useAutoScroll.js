import { useCallback, useEffect, useRef } from 'react'

// Auto-scrolls a horizontal strip. mode 'bounce' = back and forth, 'loop' = seamless loop (content must be duplicated).
// Pauses on hover/touch/focus, when a dialog is open, and with prefers-reduced-motion. Returns a pause() function.
export function useAutoScroll(ref, mode = 'bounce', enabled = true) {
  const hold = useRef(0)
  const pause = useCallback(() => { hold.current = Date.now() + 3000 }, [])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const noMo = matchMedia('(prefers-reduced-motion:reduce)').matches
    let pos = 0, dir = 1, raf
    const evs = ['pointerdown', 'wheel', 'touchstart', 'focusin', 'mousemove']
    evs.forEach((e) => el.addEventListener(e, pause, { passive: true }))
    const tick = () => {
      const max = el.scrollWidth - el.clientWidth
      if (noMo || !enabled || max <= 0 || document.hidden || document.querySelector('.ov.show,.fv') || Date.now() < hold.current) pos = el.scrollLeft
      else {
        if (mode === 'loop') { pos += 0.6; const half = el.scrollWidth / 2; if (pos >= half) pos -= half }
        else { pos += dir * 0.7; if (pos >= max) { pos = max; dir = -1 } else if (pos <= 0) { pos = 0; dir = 1 } }
        el.scrollLeft = pos
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(raf); evs.forEach((e) => el.removeEventListener(e, pause)) }
  }, [ref, mode, enabled, pause])
  return pause
}
