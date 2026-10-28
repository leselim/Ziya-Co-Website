import Typed from "./Typed";

const HEADLINE = [{ t: "Jewellery for every version of you" }];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <Typed
          as="h1"
          className="display"
          segments={HEADLINE}
          speed={46}
          delay={400}
        />

        <div className="hero__rule" aria-hidden="true" />

        <div className="hero__foot">
          <div className="hero__actions">
            <a className="btn" href="#notify">
              Be first to know
            </a>
            <a className="textlink" href="#story">
              Read the story
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
