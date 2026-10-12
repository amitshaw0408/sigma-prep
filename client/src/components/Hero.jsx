import { SITE } from '../data/siteConfig'
import Reveal from './Reveal'
import { Arrow } from './Icons'

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="blob" style={{ width: 340, height: 340, background: 'var(--m)', top: -60, right: -80 }} />
      <div className="blob" style={{ width: 240, height: 240, background: 'var(--s)', bottom: -40, left: -60, animationDelay: '-3s' }} />
      <div className="wrap g">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Reveal as="span" className="eyebrow">Your journey into tech starts here</Reveal>
          <Reveal as="h1" delay={0.1}>Master Coding. <em>Build Real Skills.</em> Shape Your Future.</Reveal>
          <Reveal as="p" className="lead" delay={0.2}>Learn programming, master DSA, and build real-world projects with practical coding courses designed to help you grow from beginner to confident developer.</Reveal>
          <Reveal className="row" delay={0.3}>
            <a className="btn pri" href="#courses">Explore Courses <Arrow /></a>
            <a className="btn sec" href={SITE.telegram} target="_blank" rel="noopener noreferrer">Contact on Telegram</a>
          </Reveal>
        </div>
        <Reveal className="vis" delay={0.25}>
          <div className="code" role="img" aria-label="Sample JavaScript code">
            <div className="dots"><i /><i /><i /></div>
            <span className="c">// sigma-prep.js</span><br />
            <span className="k">const</span> <span className="f">learner</span> = {'{'}<br />
            &nbsp;&nbsp;skills: [<span className="f">"DSA"</span>, <span className="f">"Web"</span>],<br />
            &nbsp;&nbsp;projects: <span className="k">true</span><br />
            {'};'}<br />
            <span className="k">function</span> <span className="f">grow</span>(dev) {'{'}<br />
            &nbsp;&nbsp;<span className="k">return</span> dev.<span className="f">practice</span>().<span className="f">build</span>();<br />
            {'}'}
          </div>
          <span className="chip">DSA</span>
          <span className="chip" style={{ animationDelay: '-2s' }}>JavaScript</span>
          <span className="chip" style={{ animationDelay: '-4s' }}>Projects</span>
          <span className="chip" style={{ animationDelay: '-1s' }}>Web Dev</span>
        </Reveal>
      </div>
    </section>
  )
}
