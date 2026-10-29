import { useEffect, useRef, useState } from "react";
import Wordmark from "./Wordmark";
import type { PolicyBlock, PolicySection } from "../privacy";
import { SHOP_OPEN } from "../privacyScope";
import type { LegalDoc } from "../legalDocs";

/**
 * A full-screen reading panel for one of the legal documents.
 *
 * Generic on purpose: the privacy policy and the returns policy are the same
 * kind of thing, and the terms and conditions will be a third once they are
 * written. Everything particular to a document lives in legalDocs.ts.
 */

/** The documents are drafted in the plural; the site speaks as one woman.
 *  Each document's voice map holds her wording line by line, and anything
 *  not listed there is the document unchanged. Applied after the launch
 *  filter, which matches on the document's own text. */
function voiced(doc: LegalDoc, s: string) {
  return doc.voiceLines[s] ?? s;
}

/** Trailing pictographs are dropped: the brand document signs off with a
 *  heart and Ziyanda does not want it on the page. The wording itself is
 *  untouched, and the generated files still hold the document as written. */
function plain(doc: LegalDoc, s: string) {
  return voiced(
    doc,
    s.replace(/[\s\u{FE0F}\u{2600}-\u{27BF}\u{1F000}-\u{1FAFF}]+$/u, "")
  );
}

/** The documents set their headings in full caps; Ziyanda reads them better
 *  in sentence case, and casing is presentation rather than wording. */
function sentence(doc: LegalDoc, s: string) {
  /* headings carry the plural too, so hers wins where one is given */
  const hers = doc.voiceTitles[s];
  if (hers) return hers;
  const lower = s.toLocaleLowerCase();
  return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
}

/** What of a document applies before the shop opens. Sections are numbered
 *  as they appear rather than by the document's own numbering, so a reader
 *  never sees a gap where a withheld section used to be. */
function inScope(doc: LegalDoc): PolicySection[] {
  if (SHOP_OPEN) return doc.sections;

  return doc.sections
    .filter((s) => !doc.launchOnlySections.includes(s.n))
    .map((s) => ({
      ...s,
      blocks: s.blocks
        .map((b) =>
          b.kind === "ul"
            ? {
                ...b,
                items: (b.items ?? []).filter(
                  (it) => !doc.launchOnlyItems.includes(it)
                ),
              }
            : b
        )
        .filter((b) =>
          b.kind === "ul"
            ? (b.items ?? []).length > 0
            : !doc.launchOnlyLines.includes(b.text ?? "")
        ),
    }));
}

function Block({ doc, block }: { doc: LegalDoc; block: PolicyBlock }) {
  if (block.kind === "ul") {
    return (
      <ul className="pp__list">
        {(block.items ?? []).map((it) => (
          <li key={it}>{plain(doc, it)}</li>
        ))}
      </ul>
    );
  }
  return <p>{plain(doc, block.text ?? "")}</p>;
}

export default function LegalPanel({
  doc,
  onClose,
}: {
  doc: LegalDoc | null;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const sections = doc ? inScope(doc) : [];
  const [here, setHere] = useState("");

  /* a different document starts at its own first section */
  useEffect(() => {
    if (doc) setHere(inScope(doc)[0]?.id ?? "");
  }, [doc]);

  /* scroll lock, focus in, Escape out, and a Tab that cannot wander off */
  useEffect(() => {
    if (!doc) return;

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
          "a[href], button:not([disabled])"
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
  }, [doc, onClose]);

  /* which section the reader is in, for the contents list beside it */
  useEffect(() => {
    if (!doc || typeof IntersectionObserver === "undefined") return;
    const root = scroller.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
        if (seen?.target.id) setHere(seen.target.id);
      },
      { root, rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );

    root.querySelectorAll("section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [doc]);

  if (!doc) return null;

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
        <button
          type="button"
          className="btn btn--line pp__close"
          onClick={onClose}
        >
          Close
        </button>
      </header>

      <div className="pp__scroll" ref={scroller}>
        <div className="pp__inner">
          <div className="pp__head">
            <p className="label">{doc.label}</p>
            <h2 id="pp-title" className="display">
              {doc.title}
            </h2>
            {!SHOP_OPEN && doc.note && <p className="pp__note">{doc.note}</p>}
            {doc.intro
              .filter((t) => SHOP_OPEN || !doc.launchOnlyLines.includes(t))
              .map((t) => (
                <p className="pp__lede" key={t}>
                  {plain(doc, t)}
                </p>
              ))}
          </div>

          <div className="pp__body">
            <nav className="pp__toc" aria-label={`${doc.title} sections`}>
              <ol>
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => goTo(e, s.id)}
                      aria-current={here === s.id ? "true" : undefined}
                    >
                      <span className="pp__toc-n">{i + 1}</span>
                      {sentence(doc, s.title)}
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
                    {sentence(doc, s.title)}
                  </h3>
                  {s.blocks.map((b, bi) => (
                    <Block doc={doc} block={b} key={bi} />
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
