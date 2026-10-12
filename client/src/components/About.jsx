import Reveal from './Reveal'

export default function About() {
  return (
    <section id="about">
      <div className="wrap ab">
        <Reveal delay={0.1}>
          <span className="eyebrow">About</span>
          <h2>Built for Learners Who Want to Grow</h2>
          <p>Sigma Prep is a coding education brand focused on helping learners develop programming fundamentals, improve problem-solving skills, and build practical development experience.</p>
        </Reveal>
      </div>
    </section>
  )
}
