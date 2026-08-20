import React, { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: (v: number) => string;
  className?: string;
  id?: string;
}

/**
 * Angka yang menghitung naik (count-up) dari 0 menuju `value`
 * dengan easing, cocok untuk metrik KPI dashboard.
 */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  format,
  className,
  id,
}) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  const rendered = format
    ? format(display)
    : Math.round(display).toLocaleString("id-ID");

  return (
    <span id={id} className={className}>
      {rendered}
    </span>
  );
};
