import Reveal from "./Reveal";
import { LAUNCH_DATE } from "../config";
import { useCountdown } from "../hooks/useCountdown";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown() {
  const { days, hours, minutes, seconds, done } = useCountdown(LAUNCH_DATE);

  const units = [
    { label: "Days", value: String(days) },
    { label: "Hours", value: pad(hours) },
    { label: "Minutes", value: pad(minutes) },
    { label: "Seconds", value: pad(seconds) },
  ];

  return (
    <section className="countdown" id="countdown">
      <div className="container countdown__inner">
        <div>
          <p className="label">The countdown</p>
          <h2 className="display">Opening 9 December 2026</h2>
          <p className="countdown__support">
            Be there from the beginning.
          </p>
        </div>

        <Reveal>
          {done ? (
            <p className="countdown__launched">
              ZIYA &amp; CO is open. Thank you for waiting with us.
            </p>
          ) : (
            <ol className="counter" aria-hidden="true">
              {units.map((unit) => (
                <li className="counter__unit" key={unit.label}>
                  <span className="counter__value">{unit.value}</span>
                  <span className="counter__label">{unit.label}</span>
                </li>
              ))}
            </ol>
          )}
          {/* announced once a minute rather than once a second */}
          <p className="sr-only" aria-live="polite">
            {done
              ? "Ziya and Co is open."
              : `${days} days, ${hours} hours and ${minutes} minutes until Ziya and Co opens on 9 December 2026.`}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
