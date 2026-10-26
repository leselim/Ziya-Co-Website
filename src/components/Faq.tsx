import Reveal from "./Reveal";

/* The brand document's FAQ and care notes, word for word. The hedging is kept
   exactly as written: "made to be resistant to tarnishing", never "will not
   tarnish". Only the em dashes and one double space are changed. */
const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "Are ZIYA & CO pieces tarnish-resistant?",
    a: (
      <p>
        Our jewellery is designed with everyday wear in mind and is made to be
        resistant to tarnishing. However, like all jewellery, proper care will
        help maintain its finish and keep your pieces looking beautiful for
        longer.
      </p>
    ),
  },
  {
    q: "Is ZIYA & CO jewellery waterproof?",
    a: (
      <p>
        Our pieces are designed to handle everyday life, including occasional
        exposure to water. However, we recommend keeping your jewellery away
        from prolonged exposure to water, swimming pools, the ocean and harsh
        chemicals to preserve its finish.
      </p>
    ),
  },
  {
    q: "Can I wear my jewellery every day?",
    a: (
      <p>
        Absolutely. That&rsquo;s what ZIYA &amp; CO is all about. Our jewellery
        is designed to be worn, loved and enjoyed every day, not saved for a
        special occasion.
      </p>
    ),
  },
  {
    q: "Will my jewellery change colour?",
    a: (
      <p>
        With proper care, your jewellery should maintain its beautiful finish.
        However, exposure to perfume, lotions, sweat, chemicals, chlorine and
        moisture over time can affect the appearance of any jewellery.
      </p>
    ),
  },
  {
    q: "Is your jewellery suitable for sensitive skin?",
    a: (
      <p>
        We aim to offer pieces that are comfortable for everyday wear. Please
        refer to the material information provided on each product page before
        purchasing. If you have particularly sensitive skin or known metal
        allergies, we recommend checking the listed materials carefully.
      </p>
    ),
  },
  {
    q: "How should I care for my ZIYA & CO jewellery?",
    a: (
      <>
        <p>To keep your pieces looking their best:</p>
        <ul className="acc__list">
          <li>Avoid direct contact with perfume, lotions and beauty products.</li>
          <li>Remove jewellery before swimming, bathing or exercising.</li>
          <li>Keep pieces away from chlorine, salt water and harsh chemicals.</li>
          <li>
            Store your jewellery in a cool, dry place when you&rsquo;re not
            wearing it.
          </li>
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
        We recommend storing each piece separately in its ZIYA &amp; CO
        packaging or jewellery pouch to prevent scratching, tangling and
        unnecessary exposure to moisture.
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
              Our jewellery is made to be worn, not saved
            </h2>
          </div>
          <p className="prose">
            A few things worth knowing before we open.
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
