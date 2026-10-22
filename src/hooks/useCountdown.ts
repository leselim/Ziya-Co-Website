import { useEffect, useState } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function remaining(target: Date): TimeLeft {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: false,
  };
}

/** Ticks once a second and stops itself the moment the target passes. */
export function useCountdown(target: Date): TimeLeft {
  const [left, setLeft] = useState<TimeLeft>(() => remaining(target));

  useEffect(() => {
    if (left.done) return;
    const id = window.setInterval(() => {
      const next = remaining(target);
      setLeft(next);
      if (next.done) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, left.done]);

  return left;
}
