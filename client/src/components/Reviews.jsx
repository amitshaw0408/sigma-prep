import { useRef } from "react";
import Reveal from "./Reveal";
import { useAutoScroll } from "../hooks/useAutoScroll";

// "Why Choose Sigma Prep?" — student review cards, auto-scrolling right to left in a seamless loop.
export default function Reviews({ reviews }) {
  const ref = useRef(),
    dup = reviews.length > 2;
  useAutoScroll(ref, "loop", dup);
  return (
    <section id="why">
      <div className="wrap">
        <Reveal className="sh">
          <span className="eyebrow">Why Sigma Prep</span>
          <h2>Why Choose Sigma Prep?</h2>
          <p>Hear from learners who studied with us.</p>
        </Reveal>
        <div className="rv2" ref={ref}>
          {reviews.length ? (
            (dup ? [0, 1] : [0]).map((k) =>
              reviews.map((r, i) => (
                <figure
                  key={`${k}-${r.id ?? i}`}
                  className="rc"
                  aria-hidden={k ? true : undefined}
                >
                  <blockquote>“{r.text}”</blockquote>
                  <figcaption>
                    <b>{r.name}</b>
                    {r.course && <span>{r.course}</span>}
                  </figcaption>
                </figure>
              )),
            )
          ) : (
            <div className="empty" style={{ flex: 1 }}>
              Student reviews will appear here soon.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
