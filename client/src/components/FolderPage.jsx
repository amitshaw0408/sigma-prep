import { useEffect, useRef } from 'react'
import CourseCard from './CourseCard'

// Full-page view listing every course inside one folder (category).
export default function FolderPage({ cat, courses, onClose, onOpen }) {
  const back = useRef()
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    back.current.focus()
    const key = (e) => { if (e.key === 'Escape' && !document.querySelector('.ov.show')) onClose() }
    addEventListener('keydown', key)
    return () => { document.body.style.overflow = ''; removeEventListener('keydown', key) }
  }, [onClose])
  const list = courses.filter((c) => c.cat === cat)
  return (
    <div className="fv" role="dialog" aria-modal="true" aria-label={'Courses in ' + cat}>
      <div className="wrap">
        <nav className="bc">
          <button ref={back} className="btn sec" onClick={onClose}>← Back to courses</button>
          <span>Courses / <b>{cat}</b></span>
        </nav>
        <h2>{cat}</h2>
        <div className="cgrid">
          {list.length ? list.map((c, i) => <CourseCard key={c.id} c={c} i={i} onOpen={onOpen} />)
            : <div className="empty">No courses in this folder yet. Contact us on Telegram.</div>}
        </div>
      </div>
    </div>
  )
}
