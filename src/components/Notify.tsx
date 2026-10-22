import { useRef, useState, type FormEvent } from "react";
import { CONTACT_EMAIL, LAUNCH_LABEL, SIGNUP_ENDPOINT } from "../config";

type Tone = "info" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Hands the address to the mailbox while no endpoint is configured. */
function mailtoFor(email: string) {
  return (
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent("Early access")}` +
    `&body=${encodeURIComponent(
      `Please add this address to the Ziya & Co. list: ${email}`
    )}`
  );
}

export default function Notify() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [tone, setTone] = useState<Tone>("info");
  const [busy, setBusy] = useState(false);
  /* Robots fill in every field they find. A human never sees this one, so
     anything in it means the submission is not a person. */
  const trap = useRef<HTMLInputElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return; // no double submissions while one is in flight

    if (trap.current?.value) {
      /* Answer a bot exactly as we answer a person, and send nothing. */
      setTone("info");
      setStatus("Thank you. We will write to you on 9 December.");
      setEmail("");
      return;
    }

    const value = email.trim();
    if (!EMAIL.test(value)) {
      setTone("error");
      setStatus("Please check that email address.");
      return;
    }

    if (!SIGNUP_ENDPOINT) {
      window.location.href = mailtoFor(value);
      setTone("info");
      setStatus(
        "Almost there. We have opened an email for you, ready to send. " +
          `If nothing appeared, write to ${CONTACT_EMAIL}.`
      );
      return;
    }

    setBusy(true);
    setTone("info");
    setStatus("Sending…");
    try {
      const res = await fetch(SIGNUP_ENDPOINT, {
        method: "POST",
        /* text/plain keeps this a "simple request". Apps Script does not
           answer a CORS preflight, so an application/json body would be
           blocked before it was ever sent. The script reads the JSON out of
           e.postData.contents. */
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ email: value }),
        redirect: "follow",
      });
      if (!res.ok) throw new Error(String(res.status));

      /* Apps Script answers 200 even when it refused the row, so the body is
         read rather than thanking someone who was never added. */
      const text = await res.text();
      let payload: { ok?: boolean; error?: string } | null = null;
      try {
        payload = JSON.parse(text);
      } catch {
        /* not JSON: the 200 is taken at face value */
      }
      if (payload && payload.ok === false) {
        throw new Error(payload.error || "rejected");
      }

      setEmail("");
      setStatus("Thank you. We will write to you on 9 December.");
    } catch {
      setTone("error");
      setStatus(
        "Something went wrong on our side. Please try again, or write to " +
          `${CONTACT_EMAIL}.`
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section" id="notify">
      <div className="container notify__inner">
        <div className="notify__copy">
          <p className="label">Early access</p>
          <h2 className="display">Be first to wear it</h2>
          <p>
            Join us at the beginning. Leave your email and receive one note
            when the Ziya &amp; Co. collection launches on {LAUNCH_LABEL}.
          </p>
        </div>

        <form className="signup" id="signup" onSubmit={onSubmit} noValidate>
          <label className="signup__label" htmlFor="email">
            Email address
          </label>

          <div className="signup__row">
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              required
              aria-describedby="signup-note signup-privacy"
            />
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Sending" : "Notify me"}
            </button>
          </div>

          {/* honeypot: hidden from sight, from tab order and from assistive tech */}
          <div className="signup__trap" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input
              ref={trap}
              id="company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <p
            className="signup__status"
            id="signup-status"
            role="status"
            aria-live="polite"
            data-tone={tone === "error" ? "error" : undefined}
          >
            {status}
          </p>

          <p className="signup__note" id="signup-note">
            One email on launch day. No unnecessary messages. Unsubscribe at
            any time.
          </p>

          <p className="signup__privacy" id="signup-privacy">
            We use your address for the launch note and nothing else. We do not
            sell it or pass it on. Write to {CONTACT_EMAIL} at any time to be
            removed.
          </p>
        </form>
      </div>
    </section>
  );
}
