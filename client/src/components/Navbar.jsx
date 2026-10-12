import { useEffect, useRef, useState } from "react";
import { SITE } from "../data/siteConfig";
import { Burger } from "./Icons";

const LINKS = [
  ["home", "Home"],
  ["courses", "Courses"],
  ["why", "Why Sigma Prep"],
  ["about", "About"],
  ["faq", "FAQ"],
];

export function Logo({ onClick }) {
  return (
    <a className="logo" href="#home" onClick={onClick}>
      <span className="lg" role="img" aria-label="Sigma Prep logo" />
      Sigma Prep
    </a>
  );
}

export default function Navbar({ onAdmin }) {
  const [open, setOpen] = useState(false),
    [sc, setSc] = useState(false),
    [act, setAct] = useState("home"),
    clicks = useRef([]);
  useEffect(() => {
    const f = () => setSc(scrollY > 10);
    addEventListener("scroll", f, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setAct(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach(([id]) => {
      const el = document.getElementById(id);
      el && io.observe(el);
    });
    return () => {
      removeEventListener("scroll", f);
      io.disconnect();
    };
  }, []);
  // Hidden admin entry: click the logo 3 times quickly.
  const logo = (e) => {
    const n = Date.now();
    clicks.current = clicks.current.filter((t) => n - t < 900);
    clicks.current.push(n);
    if (clicks.current.length >= 3) {
      clicks.current = [];
      e.preventDefault();
      onAdmin();
    }
  };
  return (
    <header className={sc ? "sc" : ""}>
      <div className="wrap nav">
        <Logo onClick={logo} />
        <button
          className="burger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <Burger />
        </button>
        <nav className={"links" + (open ? " open" : "")} aria-label="Main">
          {LINKS.map(([id, t]) => (
            <a
              key={id}
              className={"l" + (act === id ? " on" : "")}
              href={"#" + id}
              onClick={() => setOpen(false)}
            >
              {t}
            </a>
          ))}
          <a
            className="btn pri"
            href={SITE.telegram}
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: "9px 16px", marginLeft: 6 }}
          >
            Contact on Telegram
          </a>
        </nav>
      </div>
    </header>
  );
}
