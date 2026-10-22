import Reveal from "./Reveal";

const profiles = [
  {
    num: "01",
    title: "The Everyday Wearer",
    body: "Moves through life on her own terms. She values effortless pieces that fit naturally into her everyday rituals.",
  },
  {
    num: "02",
    title: "The Thoughtful Gifter",
    body: "Chooses with intention. She looks for meaningful gifts that make the people she loves feel remembered.",
  },
  {
    num: "03",
    title: "The Collector of Essentials",
    body: "Appreciates the foundations of a considered wardrobe. She values versatile pieces that bring everything together.",
  },
];

export default function Audience() {
  return (
    <section className="section" id="pieces">
      <div className="container">
        <Reveal className="section__head">
          <div>
            <p className="label">Who it&rsquo;s for</p>
            <h2 className="display">
              Nothing precious, nothing saved for later
            </h2>
          </div>
          <p className="prose">
            We are not building a weekly drop. We are building the pieces
            everything else is worn around, for three women who already know
            what they reach for.
          </p>
        </Reveal>

        <ul className="profiles">
          {profiles.map((p, i) => (
            <Reveal as="li" className="profile" key={p.num} delay={i * 80}>
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
