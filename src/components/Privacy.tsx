import { useEffect, useRef, useState } from "react";
import Wordmark from "./Wordmark";
import {
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  type PolicyBlock,
  type PolicySection,
} from "../privacy";
import {
  LAUNCH_ONLY_ITEMS,
  LAUNCH_ONLY_LINES,
  LAUNCH_ONLY_SECTIONS,
  SCOPE_NOTE,
  SHOP_OPEN,
} from "../privacyScope";

/* The policy, narrowed to what Ziya & Co is actually doing today. See
   privacyScope.ts: on 9 December SHOP_OPEN goes true and all of this
   returns untouched. Sections are numbered as they appear rather than by
   the document's own numbering, so a reader never sees a gap where a
   withheld section used to be. */
function inScope(): PolicySection[] {
  if (SHOP_OPEN) return PRIVACY_SECTIONS;

  return PRIVACY_SECTIONS.filter(
    (s) => !LAUNCH_ONLY_SECTIONS.includes(s.n)
  ).map((s) => ({
    ...s,
    blocks: s.blocks
      .map((b) =>
        b.kind === "ul"
          ? {
              ...b,
              items: (b.items ?? []).filter(
                (it) => !LAUNCH_ONLY_ITEMS.includes(it)
              ),
            }
          : b
      )
      .filter((b) =>
        b.kind === "ul"
          ? (b.items ?? []).length > 0
          : !LAUNCH_ONLY_LINES.includes(b.text ?? "")
      ),
  }));
}

/* Plain fact rather than legal wording, and the only thing on this panel
   that is not the brand document's own text. The policy is written for the
   open store; until 9 December the site takes an email address and nothing
   else, and saying so is more honest than leaving a reader to assume the
   payment and delivery clauses are already in play.

   PRIVACY_UPDATED is deliberately not rendered: Ziyanda asked for the "last
   updated" line to come off. It stays in privacy.ts as part of the record. */

/** The document closes with a heart after the last sentence. Ziyanda does
 *  not want it on the page, so any trailing pictograph is dropped at render.
 *  The wording itself is untouched and privacy.ts still holds the document
 *  exactly as written. */
function plain(s: string) {
  return s.replace(/[\s\u{FE0F}\u{2600}-\u{27BF}\u{1F000}-\u{1FAFF}]+$/u, "");
}

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
          <li key={it}>{plain(it)}</li>
        ))}
      </ul>
    );
  }
  return <p>{plain(block.text ?? "")}</p>;
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
  const sections = inScope();
  const [here, setHere] = useState(sections[0]?.id ?? "");

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
            {!SHOP_OPEN && <p className="pp__note">{SCOPE_NOTE}</p>}
            {PRIVACY_INTRO.filter(
              (t) => SHOP_OPEN || !LAUNCH_ONLY_LINES.includes(t)
            ).map((t) => (
              <p className="pp__lede" key={t}>
                {t}
              </p>
            ))}
          </div>

          <div className="pp__body">
            <nav className="pp__toc" aria-label="Privacy policy sections">
              <ol>
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => goTo(e, s.id)}
                      aria-current={here === s.id ? "true" : undefined}
                    >
                      <span className="pp__toc-n">{i + 1}</span>
                      {sentence(s.title)}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="pp__doc">
              {sections.map((s, i) => (
                <section id={s.id} key={s.id}>
                  <h3>
                    <span className="pp__n" aria-hidden="true">
                      {i + 1}
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
