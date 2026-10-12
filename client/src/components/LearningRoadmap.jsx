import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import { STEPS } from '../data/siteConfig'

// Steps light up in order (1 → 2 → 3 …) as you scroll, and a line fills between them.
export default function LearningRoadmap() {
  const ref = useRef(), [last, setLast] = useState(-1)
  useEffect(() => {
    let tk = 0
    const upd = () => {
      tk = 0; let l = -1
      ;[...ref.current.children].forEach((x, i) => { if (x.getBoundingClientRect().top < innerHeight * 0.7) l = i })
      setLast(l)
    }
    const on = () => { tk = tk || requestAnimationFrame(upd) }
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); upd()
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on) }
  }, [])
  return (
    <section>
      <div className="wrap">
        <Reveal className="sh"><span className="eyebrow">Roadmap</span><h2>Your Roadmap to Becoming a Developer</h2></Reveal>
        <div className="road" ref={ref} style={{ '--pf': Math.max(last, 0) / (STEPS.length - 1) }}>
          {STEPS.map((s, i) => (
            <div key={s} className={'st' + (i <= last ? ' on' : '')} style={{ '--i': i }}><div className="n">{i + 1}</div><h3>{s}</h3></div>
          ))}
        </div>
      </div>
    </section>
  )
}
