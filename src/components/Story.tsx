import Reveal from "./Reveal";

export default function Story() {
  return (
    <section className="section" id="story">
      <div className="container">
        <Reveal className="section__head">
          <div>
            <p className="label">Our story</p>
            <h2 className="display">
              Why should that feeling be reserved for special occasions?
            </h2>
          </div>
          <p className="prose">
            ZIYA &amp; CO was created from a place of love. A deep, undeniable
            love for jewellery and the way it makes you feel. Jewellery has
            always been more than an accessory. There is something about the
            perfect pair of earrings, a delicate bracelet, a necklace that
            somehow makes you feel a little more beautiful, a little more
            confident, and completely yourself.
          </p>
        </Reveal>

        <div className="story__columns">
          <Reveal>
            <p>
              ZIYA &amp; CO believes jewellery is meant to be lived in. Worn on
              ordinary days and on big ones, on days you are dressed up and
              days you are simply running errands. Because you deserve to feel
              beautiful every day, not only when there is somewhere special to
              go.
            </p>
          </Reveal>
          <Reveal delay={110}>
            <p>
              Every piece is chosen with the intention of adding a little
              something to your day. A little sparkle, a little confidence, a
              little joy.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <p className="story__close">
            Because sometimes, the smallest details make you feel the most
            special
          </p>
        </Reveal>
      </div>
    </section>
  );
}
