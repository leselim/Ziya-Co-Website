import { Fragment, useEffect, useRef, useState } from "react";
import { useTypewriter, type Segment } from "../hooks/useTypewriter";

interface Props {
  segments: Segment[];
  as?: "h1" | "p";
  className?: string;
  /** Wait until the line is on screen before typing. */
  onView?: boolean;
  speed?: number;
  delay?: number;
}

/**
 * A line that types itself.
 *
 * The finished line is always in the accessible name, so assistive tech and
 * search engines read it whole and immediately; the animated copy is hidden
 * from them. A second, invisible copy holds the full height open so the page
 * never reflows as characters arrive.
 */
export default function Typed({
  segments,
  as: Tag = "p",
  className = "",
  onView = false,
  speed,
  delay,
}: Props) {
  const host = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(!onView);

  useEffect(() => {
    if (started || !host.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStarted(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(host.current);
    return () => io.disconnect();
  }, [started]);

  const { shown, done, animating } = useTypewriter(segments, {
    start: started,
    speed,
    delay,
  });

  let left = shown;
  const typed = segments.map((seg, i) => {
    const take = Math.max(0, Math.min(seg.t.length, left));
    left -= seg.t.length;
    if (!take) return null;
    const slice = seg.t.slice(0, take);
    /* a Fragment, not a span: the standalone build emits a bare text node
       here, and the two DOMs are compared against each other */
    return seg.cls ? (
      <span className={seg.cls} key={i}>
        {slice}
      </span>
    ) : (
      <Fragment key={i}>{slice}</Fragment>
    );
  });

  const whole = segments.map((s) => s.t).join("");

  return (
    <Tag
      ref={host as never}
      className={`typed ${className}`.trim()}
      aria-label={whole}
      /* the finished line is the default; this hands over to the typed one
         only once we know we are animating */
      data-typing={animating && started ? "true" : undefined}
      data-done={done ? "true" : "false"}
    >
      {/* holds the height so nothing moves while the line arrives */}
      <span className="typed__ghost" aria-hidden="true">
        {segments.map((seg, i) =>
          seg.cls ? (
            <span className={seg.cls} key={i}>
              {seg.t}
            </span>
          ) : (
            <Fragment key={i}>{seg.t}</Fragment>
          )
        )}
      </span>
      <span className="typed__out" aria-hidden="true">
        {typed}
      </span>
    </Tag>
  );
}
