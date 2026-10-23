import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Philosophy from "./components/Philosophy";
import Faq from "./components/Faq";
import Countdown from "./components/Countdown";
import Notify from "./components/Notify";
import SiteFooter from "./components/SiteFooter";

export default function App() {
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
    </>
  );
}
