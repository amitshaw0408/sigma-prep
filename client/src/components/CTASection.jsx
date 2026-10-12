import Reveal from './Reveal'
import { SITE } from '../data/siteConfig'

export default function CTASection() {
  return (
    <section style={{ paddingTop: 0 }}>
      <div className="wrap">
        <Reveal className="cta">
          <i style={{ width: 180, height: 180, top: -50, left: -40 }} />
          <i style={{ width: 120, height: 120, bottom: -30, right: '8%', animationDelay: '-3s' }} />
          <h2>Ready to Start Your Coding Journey?</h2>
          <p>Choose your learning path, explore our courses, and take the next step toward becoming a better developer.</p>
          <div className="row">
            <a className="btn pri" href="#courses">Explore Courses</a>
            <a className="btn sec" href={SITE.telegram} target="_blank" rel="noopener noreferrer">Chat on Telegram</a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
