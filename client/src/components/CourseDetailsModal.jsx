import Modal from "./Modal";
import { Arrow } from "./Icons";
import { SITE } from "../data/siteConfig";

const List = ({ t, a }) =>
  a && a.length ? (
    <>
      <h4>{t}</h4>
      <ul>
        {a.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </>
  ) : null;

export default function CourseDetailsModal({ c, onClose }) {
  return (
    <Modal onClose={onClose}>
      {c.img && <img className="ci" src={c.img} alt={c.title} />}
      <span className="meta">
        {c.cat} · {c.level}
      </span>
      <h2 id="mt">{c.title}</h2>
      <h4>Overview</h4>
      <p>{c.desc}</p>
      <List t="What you will learn" a={c.learn} />
      {c.prereq && (
        <>
          <h4>Prerequisites</h4>
          <p>{c.prereq}</p>
        </>
      )}
      <List t="Curriculum" a={c.modules} />
      <h4>Skills you can develop</h4>
      <div className="tags">
        {(c.skills || []).map((s) => (
          <span className="tag" key={s}>
            {s}
          </span>
        ))}
      </div>
      {c.format && (
        <>
          <h4>Format</h4>
          <p>{c.format}</p>
        </>
      )}
      {c.price && <div className="price">{c.price}</div>}
      <div className="row" style={{ marginTop: 22 }}>
        <a
          className="btn pri"
          href={SITE.telegram}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enroll Now — Contact on Telegram <Arrow />
        </a>
      </div>
    </Modal>
  );
}
