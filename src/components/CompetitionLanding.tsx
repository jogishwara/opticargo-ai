import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Bot, Database } from "lucide-react";

interface CompetitionLandingProps {
  onStartDemo: () => void;
  onOpenUpload: () => void;
  onOpenChat: () => void;
  hasDataset: boolean;
}

const features = [
  {
    icon: <Bot className="w-5 h-5" />,
    title: "AI Decision Engine",
    desc: "Pipeline cerdas mendeteksi kebocoran biaya dan menyusun rekomendasi otomatis.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "SLA Terproteksi",
    desc: "Setiap optimasi divalidasi agar tingkat layanan pengiriman tetap 98%.",
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "Telemetri Real-Time",
    desc: "Pantau armada, rute, dan efisiensi langsung dari dashboard tunggal.",
  },
];

export const CompetitionLanding: React.FC<CompetitionLandingProps> = ({
  onStartDemo,
  onOpenUpload,
  onOpenChat,
  hasDataset,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center px-6 py-16 transition-colors duration-300">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold tracking-wide mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Platform Intelijen Keputusan Logistik AI
        </span>

        <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight">
          OptiCargo<span className="text-indigo-600 dark:text-indigo-400">.ai</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Ubah telemetri logistik mentah menjadi penghematan nyata. Deteksi
          kebocoran biaya, simulasikan skenario, dan hasilkan laporan eksekutif
          — semua dalam satu platform.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            id="btn-landing-demo"
            onClick={onStartDemo}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition"
          >
            {hasDataset ? "Buka Dashboard" : "Mulai Demo Sekarang"}
          </button>
          <button
            id="btn-landing-upload"
            onClick={onOpenUpload}
            className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Unggah Dataset Sendiri
          </button>
          <button
            id="btn-landing-chat"
            onClick={onOpenChat}
            className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Tanya Opti AI
          </button>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full"
      >
        {features.map((f) => (
          <div
            key={f.title}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              {f.icon}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">
              {f.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </motion.div>

      <p className="mt-12 text-xs text-slate-400 dark:text-slate-500 text-center max-w-xl">
        Dibangun untuk kompetisi nasional — OptiCargo.ai menggabungkan analitik
        data, AI generatif, dan simulasi operasional dalam antarmuka profesional.
      </p>
    </div>
  );
};
