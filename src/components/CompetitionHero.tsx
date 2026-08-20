import React from "react";
import {
  Building2,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Zap,
  TrendingUp,
  Bot,
  FileText,
  Clock,
  Database,
} from "lucide-react";
import { DatasetSummary, OperationalAnalysis } from "../types";

interface InsightCard {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: "indigo" | "emerald" | "amber" | "rose" | "cyan";
}

const toneStyles: Record<InsightCard["tone"], string> = {
  indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
};

interface CompetitionHeroProps {
  onOpenUpload: () => void;
  onOpenChat: () => void;
  onGoToAnalysis: () => void;
  onGoToReport: () => void;
  dataset: DatasetSummary | null;
  analysis: OperationalAnalysis | null;
}

export const CompetitionHero: React.FC<CompetitionHeroProps> = ({
  onOpenUpload,
  onOpenChat,
  onGoToAnalysis,
  onGoToReport,
  dataset,
  analysis,
}) => {
  const heroStats: InsightCard[] = [
    {
      label: "Armada Terpantau",
      value: dataset ? `${dataset.vehicles_count} Unit` : "0 Unit",
      icon: <Truck className="w-4 h-4" />,
      tone: "indigo",
    },
    {
      label: "Potensi Hemat Harian",
      value: analysis ? `Rp${Math.round(analysis.total_daily_loss / 1000).toLocaleString('id-ID')} Jt` : "Rp0",
      icon: <TrendingUp className="w-4 h-4" />,
      tone: "emerald",
    },
    {
      label: "Skor Kesehatan",
      value: analysis ? `${analysis.overall_health_score} / 100` : "0 / 100",
      icon: <ShieldCheck className="w-4 h-4" />,
      tone: "amber",
    },
    {
      label: "Deteksi Kebocoran",
      value: analysis ? `${analysis.detected_leakages?.length ?? 0} Aktif` : "0 Aktif",
      icon: <Zap className="w-4 h-4" />,
      tone: "rose",
    },
  ];

  return (
    <section
      id="competition-hero"
      className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl"
    >
      <div className="pointer-events-none absolute -top-24 -right-24 w-[26rem] h-[26rem] rounded-full bg-indigo-600/30 blur-3xl animate-glow-soft" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl animate-glow-soft" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 text-[11px] font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Sistem Intelijen Keputusan Logistik — AI Decision Pipeline
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            LIVE — Telemetri Real-Time
          </span>
        </div>

        <div className="mt-8 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-black leading-[1.1] tracking-tight">
            Optimasi Armada Logistik dengan{" "}
            <span className="animated-gradient-text">Kecerdasan AI</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            OptiCargo.ai menganalisis telemetri GPS, mendeteksi kebocoran biaya
            operasional, menyimulasikan skenario perbaikan, dan menghasilkan
            rekomendasi eksekusi — semuanya dalam satu platform intelijen
            keputusan untuk kompetisi nasional.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className={`flex items-center gap-3 rounded-xl border p-3.5 ${toneStyles[stat.tone]}`}
            >
              <div className="shrink-0">{stat.icon}</div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  {stat.label}
                </p>
                <p className="text-sm font-extrabold text-white truncate">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button
            id="btn-hero-upload"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-900/40 transition transform hover:-translate-y-0.5 press-scale"
          >
            <Database className="w-4 h-4 text-indigo-200" />
            {dataset ? "Ganti Dataset" : "Unggah Data Operasional"}
          </button>

          <button
            id="btn-hero-chat"
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-3 text-xs font-bold text-slate-100 border border-slate-700 transition press-scale"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            Tanya Opti AI
          </button>

          {dataset && (
            <>
              <button
                id="btn-hero-analysis"
                onClick={onGoToAnalysis}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 px-4 py-3 text-xs font-semibold text-slate-300 border border-slate-700 transition press-scale"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                Analisis AI
              </button>
              <button
                id="btn-hero-report"
                onClick={onGoToReport}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 px-4 py-3 text-xs font-semibold text-slate-300 border border-slate-700 transition press-scale"
              >
                <Clock className="w-4 h-4 text-emerald-400" />
                Laporan Eksekutif
              </button>
            </>
          )}
        </div>

        <div className="mt-9 grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]">
          {[
            "1. Upload Data",
            "2. Analisis AI",
            "3. Rekomendasi",
            "4. Simulasi",
            "5. Laporan",
          ].map((step, idx) => (
            <div
              key={step}
              className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-slate-300 font-semibold"
            >
              <span className="w-5 h-5 rounded-md bg-indigo-500/30 text-indigo-300 text-[10px] font-black flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              {step}
              {idx < 4 && (
                <ArrowRight className="w-3 h-3 text-slate-600 ml-auto shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500" />
    </section>
  );
};
