import { useEffect, useState } from "react";
import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Philosophy from "./components/Philosophy";
import Faq from "./components/Faq";
import Countdown from "./components/Countdown";
import Notify from "./components/Notify";
import SiteFooter from "./components/SiteFooter";
import LegalPanel from "./components/LegalPanel";
import { docForHash, type LegalDoc } from "./legalDocs";

export default function App() {
  const [legal, setLegal] = useState<LegalDoc | null>(null);

  /* The legal documents are opened by the hash rather than by a handler, so
     the links that reach them are ordinary anchors: they can be copied,
     shared and opened in a new tab, and the address bar says where you are. */
  useEffect(() => {
    const check = () => setLegal(docForHash(window.location.hash));
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  const closeLegal = () => {
    setLegal(null);
    if (docForHash(window.location.hash)) {
      /* replace rather than push, so Back does not walk through reopenings */
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Story />
        <Philosophy />
        <Faq />
        <Countdown />
        <Notify />
      </main>
      <SiteFooter />
      <LegalPanel doc={legal} onClose={closeLegal} />
    </>
  );
}
