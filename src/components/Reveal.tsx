import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "../hooks/useReveal";

interface Props {
  /** Rendered element. Kept to a small, explicit set so the ref stays typed. */
  as?: "div" | "li";
  className?: string;
  delay?: number;
  children: ReactNode;
}

export default function Reveal({
  as = "div",
  className = "",
  delay = 0,
  children,
}: Props) {
  const { ref, shown } = useReveal();

  const style: CSSProperties | undefined = delay
    ? { transitionDelay: `${delay}ms` }
    : undefined;
  const classes = `reveal ${className}`.trim();
  const shownAttr = shown ? "true" : "false";

  if (as === "li") {
    return (
      <li ref={ref} className={classes} data-shown={shownAttr} style={style}>
        {children}
      </li>
    );
  }
  return (
    <div ref={ref} className={classes} data-shown={shownAttr} style={style}>
      {children}
    </div>
  );
}
