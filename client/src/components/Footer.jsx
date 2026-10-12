import { Logo } from "./Navbar";
import { Brand, SOCIALS } from "./Icons";
import { SITE } from "../data/siteConfig";

export default function Footer({ cats, onFolder }) {
  return (
    <footer>
      <div className="wrap">
        <div className="fg">
          <div>
            <Logo />
            <p
              style={{ color: "var(--mut)", maxWidth: 300, margin: "12px 0 0" }}
            >
              Learn to Code. Build Your Future.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              {[
                ["home", "Home"],
                ["courses", "Courses"],
                ["about", "About"],
                ["faq", "FAQ"],
              ].map(([id, t]) => (
                <li key={id}>
                  <a href={"#" + id}>{t}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Categories</h4>
            <ul>
              {cats.map((c) => (
                <li key={c}>
                  <a
                    href="#courses"
                    onClick={(e) => {
                      e.preventDefault();
                      onFolder(c);
                    }}
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="soc">
            <h4>Connect</h4>
            <ul>
              {SOCIALS.filter((k) => SITE[k]).map((k) => (
                <li key={k}>
                  <a href={SITE[k]} target="_blank" rel="noopener noreferrer">
                    <Brand name={k} />
                    {k[0].toUpperCase() + k.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="copy">
          © {new Date().getFullYear()} Sigma Prep. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
