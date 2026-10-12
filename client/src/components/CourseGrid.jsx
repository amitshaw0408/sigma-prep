import { useRef } from "react";
import Reveal from "./Reveal";
import { Arrow, FolderIcon } from "./Icons";
import { useAutoScroll } from "../hooks/useAutoScroll";

// One folder card per category. Clicking opens that category's page (see FolderPage).
export default function CourseGrid({
  courses,
  folders: cats,
  fimg,
  status,
  onFolder,
}) {
  const rail = useRef();
  const pause = useAutoScroll(rail, "bounce", true);
  const go = (d) => {
    pause();
    rail.current.scrollBy({ left: d, behavior: "smooth" });
  };
  return (
    <section id="courses">
      <div className="wrap">
        <Reveal className="sh">
          <span className="eyebrow">Courses</span>
          <h2>Explore Our Courses</h2>
          <p>
            Find the right learning path to strengthen your fundamentals,
            improve your problem-solving skills, and build projects that matter.
          </p>
        </Reveal>
        <div className="rh">
          <div className="arr" style={{ marginLeft: "auto" }}>
            <button aria-label="Scroll courses left" onClick={() => go(-300)}>
              ←
            </button>
            <button aria-label="Scroll courses right" onClick={() => go(300)}>
              →
            </button>
          </div>
        </div>
        <div
          className="rail"
          ref={rail}
          tabIndex={0}
          aria-label="Course folders"
        >
          {cats.length ? (
            cats.map((c, i) => {
              const L = courses.filter((x) => x.cat === c),
                im = fimg[c] || (L.find((x) => x.img) || {}).img;
              return (
                <article
                  className="card pop"
                  key={c}
                  style={{ animationDelay: i * 0.08 + "s" }}
                >
                  <div className="th" aria-hidden="true">
                    {im ? <img src={im} alt="" /> : <FolderIcon />}
                  </div>
                  <div className="cb">
                    <span className="meta">
                      Folder · {L.length} course{L.length === 1 ? "" : "s"}
                    </span>
                    <h3>{c}</h3>
                    <p>
                      {L.slice(0, 3)
                        .map((x) => x.title)
                        .join(" · ")}
                    </p>
                    <button className="btn pri" onClick={() => onFolder(c)}>
                      Explore Courses <Arrow />
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty">
              {status === "loading"
                ? "Loading courses…"
                : status === "error"
                  ? "We couldn't load the courses right now. Please contact us on Telegram."
                  : "No courses available yet. Contact us on Telegram for upcoming courses."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
