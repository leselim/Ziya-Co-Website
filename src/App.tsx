import { useEffect, useState } from "react";
import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Philosophy from "./components/Philosophy";
import Faq from "./components/Faq";
import Countdown from "./components/Countdown";
import Notify from "./components/Notify";
import SiteFooter from "./components/SiteFooter";
import Privacy from "./components/Privacy";

export default function App() {
  const [privacy, setPrivacy] = useState(false);

  /* The policy is opened by the hash rather than by a handler, so the links
     that reach it are ordinary anchors: they can be copied, shared and
     opened in a new tab, and the address bar says where you are. */
  useEffect(() => {
    const check = () => setPrivacy(window.location.hash === "#privacy");
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  const closePrivacy = () => {
    setPrivacy(false);
    if (window.location.hash === "#privacy") {
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
      <Privacy open={privacy} onClose={closePrivacy} />
    </>
  );
}
