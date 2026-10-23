import Reveal from "./Reveal";
import Typed from "./Typed";

const LINE = [{ t: "Jewellery is meant to be lived in" }];

export default function Philosophy() {
  return (
    <section className="philosophy" id="philosophy">
      <div className="container philosophy__inner">
        <Reveal>
          <p className="label">The philosophy</p>
          <Typed className="philosophy__line" segments={LINE} onView speed={58} />
          <p className="philosophy__support">
            The hope is simple. That when you put on your ZIYA &amp; CO
            jewellery, you feel amazing. You feel beautiful. You feel like you,
            just a little more elevated.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
