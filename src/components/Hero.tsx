import Typed from "./Typed";

const HEADLINE = [{ t: "Timeless pieces for every version of you" }];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <p className="label hero__label">South Africa &middot; Launching 09.12.26</p>

        <Typed
          as="h1"
          className="display"
          segments={HEADLINE}
          speed={34}
          delay={420}
        />

        <div className="hero__rule" aria-hidden="true" />

        <div className="hero__foot">
          <p className="lede">
            Jewellery designed to become part of your story. Thoughtful,
            effortless and made for the way you live.
          </p>

          <div className="hero__actions">
            <a className="btn" href="#notify">
              Be first to know
            </a>
            <a className="textlink" href="#philosophy">
              Discover our philosophy
              <span className="arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
