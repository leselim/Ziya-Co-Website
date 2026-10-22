import { useEffect, useRef, useState } from "react";
import Wordmark from "./Wordmark";

const links = [
  { href: "#story", label: "Our Story" },
  { href: "#philosophy", label: "The Philosophy" },
  { href: "#notify", label: "Early Access" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#top" aria-label="Ziya and Co, home">
          <Wordmark />
        </a>

        <button
          ref={toggleRef}
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span className="sr-only">Menu</span>
        </button>

        <nav
          className="nav"
          id="primary-nav"
          aria-label="Primary"
          data-open={open ? "true" : "false"}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) setOpen(false);
          }}
        >
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a className="btn" href="#notify">
            Notify me
          </a>
        </nav>

        <a className="btn" href="#notify">
          Notify me
        </a>
      </div>
    </header>
  );
}
