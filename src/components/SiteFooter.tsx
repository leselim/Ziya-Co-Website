import Wordmark from "./Wordmark";
import { CONTACT_EMAIL, LAUNCH_LABEL } from "../config";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <Wordmark />
          <p className="site-footer__tagline">Jewellery for the way you live</p>
          <p className="site-footer__contact">
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </div>
        <div className="site-footer__base">
          <span>Est. 2026 &middot; South Africa</span>
          <span>Launching {LAUNCH_LABEL}</span>
        </div>
      </div>
    </footer>
  );
}
