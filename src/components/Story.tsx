import Reveal from "./Reveal";

export default function Story() {
  return (
    <section className="section" id="story">
      <div className="container">
        <Reveal className="section__head">
          <div>
            <p className="label">Our story</p>
            <h2 className="display">
              Jewellery that carries meaning. Beauty that begins within
            </h2>
          </div>
          <p className="prose">
            Inspired by the meaning associated with light, radiance and
            brilliance, <em>Ziya</em> &amp; Co. was created around a simple
            belief: jewellery is more than something we wear. It reflects who
            we are, what we cherish and the moments that shape our lives.
          </p>
        </Reveal>

        <div className="story__columns">
          <Reveal>
            <p>
              We believe the most meaningful pieces become part of our stories.
              They celebrate becoming, hold memories close and remind us of the
              beauty found in life&rsquo;s everyday moments.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <p>
              So we begin quietly. With considered design, restraint, and an
              eye for the detail that only shows itself once a piece has been
              worn for a while.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <p className="story__close">Light, worn close</p>
        </Reveal>
      </div>
    </section>
  );
}
