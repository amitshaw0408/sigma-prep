import { useState } from 'react'
import Reveal from './Reveal'
import { Chevron } from './Icons'
import { FAQS } from '../data/siteConfig'

export default function FAQ() {
  const [open, setOpen] = useState([])
  const tog = (i) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))
  return (
    <section id="faq">
      <div className="wrap">
        <Reveal className="sh"><span className="eyebrow">FAQ</span><h2>Frequently Asked Questions</h2></Reveal>
        <div className="faq">
          {FAQS.map(([q, a], i) => (
            <Reveal key={q} className={'q' + (open.includes(i) ? ' open' : '')}>
              <button aria-expanded={open.includes(i)} aria-controls={'a' + i} onClick={() => tog(i)}><span>{q}</span><Chevron /></button>
              <div className="a" id={'a' + i} role="region"><div><p>{a}</p></div></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
