import Reveal from "./Reveal";
import Typed from "./Typed";

const LINE = [
  { t: "Ziya " },
  { t: "&", cls: "amp" },
  { t: " Co. is more than jewellery. It is light, made tangible" },
];

export default function Philosophy() {
  return (
    <section className="philosophy" id="philosophy">
      <div className="container philosophy__inner">
        <Reveal>
          <p className="label">The philosophy</p>
          <Typed className="philosophy__line" segments={LINE} onView speed={22} />
          <p className="philosophy__support">
            Your story. Your light. Your lasting expression.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
