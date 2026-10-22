import { useCallback, useRef, useState } from "react";

/**
 * A quiet entrance: the element fades up once, the first time it is seen.
 * Anyone who has asked for reduced motion simply gets the final state.
 *
 * Uses a callback ref so the same hook can be attached to any element type.
 */
export function useReveal() {
  const [shown, setShown] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!node) return;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  return { ref, shown } as const;
}
