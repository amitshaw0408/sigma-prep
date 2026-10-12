import { Arrow } from "./Icons";

export default function CourseCard({ c, i, onOpen }) {
  const glyph = ["{ }", <i className="mk" key="m" />, "JS", "⚛"][i % 4];
  return (
    <article className="card pop" style={{ animationDelay: i * 0.08 + "s" }}>
      <div className="th" aria-hidden="true">
        {c.img ? <img src={c.img} alt="" loading="lazy" /> : <b>{glyph}</b>}
      </div>
      <div className="cb">
        <span className="meta">
          {c.cat} · {c.level}
        </span>
        <h3>{c.title}</h3>
        <p>{c.desc}</p>
        <div className="tags">
          {c.topics.slice(0, 4).map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
          {c.topics.length > 4 && (
            <span className="tag">+{c.topics.length - 4}</span>
          )}
        </div>
        {c.price && <strong>{c.price}</strong>}
        <button className="btn pri" onClick={() => onOpen(c)}>
          Explore Course <Arrow />
        </button>
      </div>
    </article>
  );
}
