import Reveal from "./Reveal";

/* Straight from the brand's FAQ and care notes, with the hedging kept as
   written: "made to be resistant to tarnishing", never "will not tarnish". */
const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "Are ZIYA & CO pieces tarnish-resistant?",
    a: (
      <p>
        ZIYA &amp; CO jewellery is designed with everyday wear in mind and made
        to be resistant to tarnishing. Like all jewellery, proper care helps
        maintain the finish and keeps pieces looking beautiful for longer.
      </p>
    ),
  },
  {
    q: "Is ZIYA & CO jewellery waterproof?",
    a: (
      <p>
        Pieces are designed to handle everyday life, including occasional
        exposure to water. Keeping jewellery away from prolonged exposure to
        water, swimming pools, the ocean and harsh chemicals will preserve the
        finish.
      </p>
    ),
  },
  {
    q: "Can I wear my jewellery every day?",
    a: (
      <p>
        Absolutely. That is what ZIYA &amp; CO is all about. The jewellery is
        designed to be worn, loved and enjoyed every day, not saved for a
        special occasion.
      </p>
    ),
  },
  {
    q: "Will my jewellery change colour?",
    a: (
      <p>
        With proper care, your jewellery should maintain its finish. Exposure
        to perfume, lotions, sweat, chemicals, chlorine and moisture over time
        can affect the appearance of any jewellery.
      </p>
    ),
  },
  {
    q: "Is the jewellery suitable for sensitive skin?",
    a: (
      <p>
        ZIYA &amp; CO aims to offer pieces that are comfortable for everyday
        wear. Material information will be listed on each product page. If you
        have particularly sensitive skin or known metal allergies, check the
        listed materials carefully.
      </p>
    ),
  },
  {
    q: "How should I care for my jewellery?",
    a: (
      <>
        <ul className="acc__list">
          <li>Avoid direct contact with perfume, lotions and beauty products.</li>
          <li>Remove jewellery before swimming, bathing or exercising.</li>
          <li>Keep pieces away from chlorine, salt water and harsh chemicals.</li>
          <li>Store jewellery in a cool, dry place when it is not being worn.</li>
          <li>Wipe gently with a soft, dry cloth after wearing.</li>
        </ul>
        <p className="acc__aside">A little care goes a long way.</p>
      </>
    ),
  },
  {
    q: "How should I store my jewellery?",
    a: (
      <p>
        Store each piece separately in its ZIYA &amp; CO packaging or jewellery
        pouch, to prevent scratching, tangling and unnecessary exposure to
        moisture.
      </p>
    ),
  },
];

export default function Faq() {
  return (
    <section className="section" id="pieces">
      <div className="container">
        <Reveal className="section__head">
          <div>
            <p className="label">Good to know</p>
            <h2 className="display">
              Jewellery meant to be worn, not put away
            </h2>
          </div>
          <p className="prose">
            A few things worth knowing before the collection opens.
          </p>
        </Reveal>

        <div className="acc">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              {/* a native disclosure: keyboard and screen readers get it for
                  free, and it still opens with JavaScript switched off.
                  The shared name lets one answer close as the next opens. */}
              <details className="acc__item" name="ziya-faq">
                <summary className="acc__q">
                  <span>{f.q}</span>
                  <span className="acc__mark" aria-hidden="true" />
                </summary>
                <div className="acc__wrap">
                  <div className="acc__body">{f.a}</div>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
