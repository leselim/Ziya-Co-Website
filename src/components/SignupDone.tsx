import { useEffect, useRef, useState } from "react";
import { useTypewriter } from "../hooks/useTypewriter";
import Wordmark from "./Wordmark";

/* What she says back, once an address is safely in the sheet. Three short
   lines, so the typing stays a moment rather than a wait. */
const LINES = [
  "Thank you.",
  "Ziya & Co has your email.",
  "I’ll write to you on 9 December — the day the doors open.",
];

/** One line of the message, typing itself once the line before it lands. */
function Line({
  text,
  start,
  onDone,
}: {
  text: string;
  start: boolean;
  onDone: () => void;
}) {
  const { shown, done, animating } = useTypewriter([{ t: text }], {
    start,
    speed: 62,
  });

  /* held in a ref so a new closure on every parent render cannot restart
     this effect, which would otherwise fire on each pass */
  const report = useRef(onDone);
  report.current = onDone;

  useEffect(() => {
    if (start && done) report.current();
  }, [start, done]);

  return (
    <p
      className="done__line"
      aria-hidden="true"
      /* same bargain as the lines on the page: the finished text is what the
         markup shows, and it only hands over to the typed copy once we know
         we are animating. Reduced motion leaves the whole line in place. */
      data-typing={animating ? "true" : undefined}
      data-caret={start && animating && !done ? "true" : undefined}
    >
      {/* holds the full height so the block never jumps as characters land */}
      <span className="done__ghost">{text}</span>
      <span className="done__out">{text.slice(0, shown)}</span>
    </p>
  );
}

export default function SignupDone({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closer = useRef<HTMLButtonElement>(null);
  /* how many lines have finished; the next one starts when this reaches it */
  const [landed, setLanded] = useState(0);

  /* a second signup in the same visit types itself out again rather than
     opening already finished */
  useEffect(() => {
    if (open) setLanded(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    /* the page behind must not scroll while this is up */
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      /* only one thing in here is focusable, so the trap is simply this */
      if (e.key === "Tab") {
        e.preventDefault();
        closer.current?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="done"
      role="dialog"
      aria-modal="true"
      aria-labelledby="done-said"
      ref={panel}
      tabIndex={-1}
    >
      {/* the whole message, read at once rather than letter by letter */}
      <p id="done-said" className="sr-only">
        {LINES.join(" ")}
      </p>

      <div className="done__inner">
        <Wordmark className="done__mark" />

        <div className="done__rule" aria-hidden="true" />

        <div className="done__lines">
          {LINES.map((t, i) => (
            <Line
              key={t}
              text={t}
              start={i <= landed}
              onDone={() => setLanded((n) => (i + 1 > n ? i + 1 : n))}
            />
          ))}
        </div>

        <button
          type="button"
          className="btn btn--line done__close"
          ref={closer}
          onClick={onClose}
          data-ready={landed >= LINES.length ? "true" : undefined}
        >
          Close
        </button>
      </div>
    </div>
  );
}
