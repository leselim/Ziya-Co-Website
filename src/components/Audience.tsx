import Reveal from "./Reveal";

/* Drawn from the brand's own FAQ and care notes, with the hedging left
   exactly as written: "made to be resistant", not "will not tarnish". */
const points = [
  {
    num: "01",
    title: "Made for everyday wear",
    body: "Designed with everyday wear in mind, and made to be resistant to tarnishing. Like all jewellery, proper care helps maintain the finish and keeps pieces looking beautiful for longer.",
  },
  {
    num: "02",
    title: "Ready for real life",
    body: "Designed to handle everyday life, including occasional exposure to water. Best kept away from prolonged water, swimming pools, the ocean and harsh chemicals.",
  },
  {
    num: "03",
    title: "Worn, loved, enjoyed",
    body: "Not saved for a special occasion. Pieces are made to be worn, and a little care goes a long way: a soft dry cloth after wearing, stored cool and dry.",
  },
];

export default function Audience() {
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
            A few things worth knowing before the collection opens. Material
            details for each piece will be listed on its own product page.
          </p>
        </Reveal>

        <ul className="profiles">
          {points.map((p, i) => (
            <Reveal as="li" className="profile" key={p.num} delay={i * 110}>
              <span className="profile__num">{p.num}</span>
              <h3 className="display">{p.title}</h3>
              <p>{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
