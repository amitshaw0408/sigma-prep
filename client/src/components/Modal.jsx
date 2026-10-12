import { useEffect, useRef, useState } from 'react'

// Accessible dialog: Escape + close button + backdrop click, focus trap, restores focus on close.
export default function Modal({ onClose, children }) {
  const ref = useRef(), [on, setOn] = useState(false)
  useEffect(() => {
    const prev = document.activeElement
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => setOn(true))
    if (!ref.current.contains(document.activeElement)) ref.current.querySelector('.x').focus()
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const f = [...ref.current.querySelectorAll('button,a[href],input,select,textarea')].filter((x) => !x.disabled)
        if (!f.length) return
        const a = f[0], z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
      }
    }
    addEventListener('keydown', key)
    return () => {
      cancelAnimationFrame(raf); removeEventListener('keydown', key)
      document.body.style.overflow = document.querySelector('.fv') ? 'hidden' : ''
      prev && prev.focus && prev.focus()
    }
  }, [onClose])
  return (
    <div className={'ov show' + (on ? ' vis2' : '')} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="md" role="dialog" aria-modal="true" aria-labelledby="mt" ref={ref}>
        <button className="x" aria-label="Close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  )
}
