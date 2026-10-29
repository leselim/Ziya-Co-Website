import Wordmark from "./Wordmark";
import { CONTACT_EMAIL, CONTACT_CELL, LAUNCH_LABEL } from "../config";
import { LEGAL_DOCS } from "../legalDocs";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <Wordmark />
          <p className="site-footer__tagline">
            Jewellery for every version of you
          </p>
          <p className="site-footer__contact">
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a href={`tel:${CONTACT_CELL.replace(/\s/g, "")}`}>{CONTACT_CELL}</a>
          </p>
        </div>
        <div className="site-footer__base">
          <p className="site-footer__meta">
            <span>South Africa</span>
            <span>Launching {LAUNCH_LABEL}</span>
          </p>

          {/* ordinary anchors: each opens off its own hash, so it can be
              copied, shared and opened in a new tab like any link */}
          <nav className="site-footer__legals" aria-label="Policies">
            {LEGAL_DOCS.map((d) => (
              <a className="site-footer__legal" href={`#${d.hash}`} key={d.hash}>
                {d.linkText}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
