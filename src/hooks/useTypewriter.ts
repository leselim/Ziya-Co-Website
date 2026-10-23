import { useEffect, useRef, useState } from "react";

/** A run of text, optionally carrying a class (the swash ampersand). */
export interface Segment {
  t: string;
  cls?: string;
}

const prefersReduced = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Types a line out character by character.
 *
 * The pace is varied a little so it reads as a hand rather than a machine,
 * and it rests fractionally longer after a comma or a full stop. Anyone who
 * has asked for reduced motion is given the finished line at once.
 *
 * `start` gates it, so a line can wait until it is actually on screen.
 */
export function useTypewriter(
  segments: Segment[],
  { start = true, speed = 62, delay = 0 } = {}
) {
  const total = segments.reduce((n, s) => n + s.t.length, 0);
  const instant = prefersReduced();
  const [shown, setShown] = useState(() => (instant ? total : 0));
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (instant || !start || shown >= total) return;

    const text = segments.map((s) => s.t).join("");
    const step = () => {
      setShown((n) => {
        const next = n + 1;
        if (next < total) {
          const justTyped = text[next - 1];
          /* a breath after punctuation, and a little human jitter */
          const rest = /[,.?]/.test(justTyped) ? 420 : /\s/.test(justTyped) ? 110 : 0;
          timer.current = window.setTimeout(
            step,
            speed + rest + Math.random() * 30
          );
        }
        return next;
      });
    };
    timer.current = window.setTimeout(step, shown === 0 ? delay : speed);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, instant, total]);

  return { shown, total, done: shown >= total, animating: !instant };
}
