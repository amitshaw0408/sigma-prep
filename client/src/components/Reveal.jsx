import { useEffect, useRef, useState } from "react";

// Fades/slides content in when it scrolls into view (CSS in index.css; respects prefers-reduced-motion).
export default function Reveal({
  as: T = "div",
  delay = 0,
  className = "",
  style,
  children,
  ...rest
}) {
  const ref = useRef(),
    [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <T
      ref={ref}
      className={`rv ${className} ${seen ? "in" : ""}`}
      style={{ "--d": delay + "s", ...style }}
      {...rest}
    >
      {children}
    </T>
  );
}
