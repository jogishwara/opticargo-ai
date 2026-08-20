import React, { useEffect, useState } from "react";

// =====================================================
// HERO TICKER (berita real-time gaya dashboard)
// =====================================================

const defaultTickerItems = [
  "AI Pipeline mendeteksi overlap rute koridor Grogol-Petamburan",
  "Potensi penghematan Rp2,35 juta per hari teridentifikasi",
  "Utilisasi armada dapat ditingkatkan dari 62% menuju 91%",
  "Rekomendasi #1: Konsolidasi Rute A + Rute C (conf. 97%)",
  "Simulasi menunjukkan pengurangan idle time hingga 64%",
];

interface TickerStripProps {
  items?: string[];
}

export const TickerStrip: React.FC<TickerStripProps> = ({
  items = defaultTickerItems,
}) => {
  const row = items.length > 0 ? items : defaultTickerItems;
  const doubled = [...row, ...row];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 text-white shadow-lg">
      <div className="flex items-stretch">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          Live AI
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-marquee flex whitespace-nowrap py-2.5">
            {doubled.map((item, i) => (
              <span
                key={i}
                className="mx-6 inline-flex items-center gap-2 text-xs text-slate-300 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// AUTO-TYPING TEXT (efek mengetik seperti AI)
// =====================================================

interface TypewriterTextProps {
  phrases: string[];
  typeSpeed?: number;
  pauseMs?: number;
  className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  phrases,
  typeSpeed = 45,
  pauseMs = 1900,
  className = "",
}) => {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;
    const current = phrases[phraseIdx % phrases.length];

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(t);
    }

    if (deleting && text === "") {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
      return;
    }

    const t = setTimeout(
      () => {
        setText(
          deleting
            ? current.slice(0, text.length - 1)
            : current.slice(0, text.length + 1)
        );
      },
      deleting ? typeSpeed / 2 : typeSpeed
    );
    return () => clearTimeout(t);
  }, [text, deleting, phraseIdx, phrases, typeSpeed, pauseMs]);

  return (
    <span className={className}>
      {text}
      <span className="typing-caret" />
    </span>
  );
};

// =====================================================
// ANIMATED COUNTER (KPI count-up yang memicu saat scroll)
// =====================================================

interface CounterStatProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  format?: (v: number) => string;
}

export const CounterStat: React.FC<CounterStatProps> = ({
  value,
  suffix = "",
  prefix = "",
  label,
  duration = 1200,
  format,
}) => {
  const [display, setDisplay] = useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const started = React.useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const progress = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(value * eased);
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  const rendered = format
    ? format(display)
    : `${prefix}${Math.round(display).toLocaleString("id-ID")}${suffix}`;

  return (
    <div ref={ref} className="text-center">
      <p className="text-2xl sm:text-3xl font-black text-white tabular-nums">
        {rendered}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
        {label}
      </p>
    </div>
  );
};
