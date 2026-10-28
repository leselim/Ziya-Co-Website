import Reveal from "./Reveal";

/* The brand document's "About ZIYA & CO", word for word, em dashes included.
   The only edit is the pronouns: the document's plural first person ("We
   believe", "Our hope") is singular here, because the voice is Ziyanda
   speaking rather than a company. Everything else is as written. */
export default function Story() {
  return (
    <section className="section" id="story">
      <div className="container">
        <Reveal className="section__head">
          <div>
            <p className="label">My story</p>
            <h2 className="display">
              Why should that feeling be reserved for special occasions?
            </h2>
          </div>
          <p className="prose">
            ZIYA &amp; CO was created from a place of love &mdash; a deep,
            undeniable love for jewellery and the way it makes you feel. For
            me, jewellery has always been more than just an accessory.
            There&rsquo;s something about putting on that perfect pair of
            earrings, slipping on a delicate bracelet or adding a necklace that
            somehow makes you feel a little more beautiful, a little more
            confident, and completely yourself. And I wanted to share that
            feeling.
          </p>
        </Reveal>

        <div className="story__columns">
          <Reveal>
            <p>
              I believe jewellery is meant to be lived in. To be worn on
              ordinary days, on big days, on days when you&rsquo;re dressed up
              and days when you&rsquo;re simply running errands. Because you
              deserve to feel beautiful every day &mdash; not just when
              there&rsquo;s somewhere special to go.
            </p>
          </Reveal>
          <Reveal delay={110}>
            <p>
              Every piece is chosen with the intention of adding a little
              something to your day &mdash; a little sparkle, a little
              confidence, a little joy.
            </p>
          </Reveal>
        </div>

        <Reveal className="story__closer">
          <p className="story__close">
            Because sometimes, the smallest details can make you feel the most
            special
          </p>
        </Reveal>
      </div>
    </section>
  );
}
