import { useEffect, useRef, useState } from "react";
import Wordmark from "./Wordmark";
import {
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  PRIVACY_UPDATED,
  type PolicyBlock,
} from "../privacy";

/** The document sets its headings in full caps; Ziyanda reads them better
 *  in sentence case, and casing is presentation rather than wording. */
function sentence(s: string) {
  const lower = s.toLocaleLowerCase();
  return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
}

function Block({ block }: { block: PolicyBlock }) {
  if (block.kind === "ul") {
    return (
      <ul className="pp__list">
        {(block.items ?? []).map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    );
  }
  return <p>{block.text}</p>;
}

export default function Privacy({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [here, setHere] = useState(PRIVACY_SECTIONS[0]?.id ?? "");

  /* scroll lock, focus in, Escape out, and a Tab that cannot wander off */
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;

      const stops = Array.from(
        panel.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        )
      ).filter((el) => el.offsetParent !== null);
      if (!stops.length) return;

      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panel.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  /* which section the reader is in, for the contents list beside it */
  useEffect(() => {
    if (!open || typeof IntersectionObserver === "undefined") return;
    const root = scroller.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (seen?.target.id) setHere(seen.target.id);
      },
      { root, rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );

    root.querySelectorAll("section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [open]);

  if (!open) return null;

  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = scroller.current?.querySelector<HTMLElement>(`#${id}`);
    if (!target) return;
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
    setHere(id);
  };

  return (
    <div
      className="pp"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pp-title"
      ref={panel}
      tabIndex={-1}
    >
      <header className="pp__bar">
        <Wordmark className="pp__mark" />
        <button type="button" className="btn btn--line pp__close" onClick={onClose}>
          Close
        </button>
      </header>

      <div className="pp__scroll" ref={scroller}>
        <div className="pp__inner">
          <div className="pp__head">
            <p className="label">Privacy</p>
            <h2 id="pp-title" className="display">
              Privacy policy
            </h2>
            <p className="pp__meta">Last updated {PRIVACY_UPDATED}</p>
            {PRIVACY_INTRO.map((t) => (
              <p className="pp__lede" key={t}>
                {t}
              </p>
            ))}
          </div>

          <div className="pp__body">
            <nav className="pp__toc" aria-label="Privacy policy sections">
              <ol>
                {PRIVACY_SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => goTo(e, s.id)}
                      aria-current={here === s.id ? "true" : undefined}
                    >
                      <span className="pp__toc-n">{s.n}</span>
                      {sentence(s.title)}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="pp__doc">
              {PRIVACY_SECTIONS.map((s) => (
                <section id={s.id} key={s.id}>
                  <h3>
                    <span className="pp__n" aria-hidden="true">
                      {s.n}
                    </span>
                    {sentence(s.title)}
                  </h3>
                  {s.blocks.map((b, i) => (
                    <Block block={b} key={i} />
                  ))}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
