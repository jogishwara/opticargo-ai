import React, { useEffect, useState, useCallback } from "react";
import {
  Truck,
  Sparkles,
  Database,
  Bot,
  Upload,
  Bell,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";

import { TopNavBar } from "./components/TopNavBar";
import { SideNavBar } from "./components/SideNavBar";
import { DailyBrief } from "./components/DailyBrief";
import { AnalisisAI } from "./components/AnalisisAI";
import { Simulasi } from "./components/Simulasi";
import { Implementation } from "./components/Implementation";
import { ExecutiveReport } from "./components/ExecutiveReport";
import { UploadModal } from "./components/UploadModal";
import { TanyaOptiChat } from "./components/TanyaOptiChat";
import { FleetMap } from "./components/FleetMap";
import { CompetitionHero } from "./components/CompetitionHero";
import { CompetitionStatusBar } from "./components/CompetitionStatusBar";
import { AiToastCenter, useAiToast } from "./components/AiToastCenter";
import { TickerStrip, TypewriterText, CounterStat } from "./components/motionWidgets";

import type {
  DatasetSummary,
  OperationalAnalysis,
  Recommendation,
  SimulationResult,
  ExecutiveReportData,
} from "./types";

export function App() {
  const [activeTab, setActiveTab] = useState("brief");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [dataset, setDataset] = useState<DatasetSummary | null>(null);
  const [analysis, setAnalysis] = useState<OperationalAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [report, setReport] = useState<ExecutiveReportData | null>(null);
  const [serverStatus, setServerStatus] = useState<{
    online?: boolean;
    has_dataset?: boolean;
    datasets_count?: number;
  } | null>(null);

  const { toasts, push: pushToast, dismiss: dismissToast } = useAiToast();

  useEffect(() => {
    let cancelled = false;
    const ping = async () => {
      try {
        const res = await fetch("/api/status", { cache: "no-store" });
        if (!res.ok) throw new Error("status endpoint unavailable");
        const json = await res.json();
        if (!cancelled) {
          setServerStatus({
            online: json?.data?.online,
            has_dataset: json?.data?.has_dataset,
            datasets_count: json?.data?.datasets_count,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setServerStatus({ online: false, has_dataset: !!dataset });
        }
      }
    };
    ping();
    const interval = setInterval(ping, 12000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // UPLOAD SUCCESS
  // =====================================================

  const handleUploadSuccess = (
    newSummary: DatasetSummary,
    newAnalysis: OperationalAnalysis,
    newRecommendations: Recommendation[],
    newSimulation: SimulationResult,
    newReport: ExecutiveReportData
  ) => {
    setDataset(newSummary);
    setAnalysis(newAnalysis);
    setRecommendations(newRecommendations);
    setSimulation(newSimulation);
    setReport(newReport);

    setActiveTab("brief");
    setIsUploadOpen(false);
    pushToast(
      "Dataset berhasil diproses — analisis AI, rekomendasi, simulasi, dan laporan siap dilihat.",
      "success"
    );
  };

  // =====================================================
  // RESET DATASET
  // =====================================================

  const handleResetDataset = useCallback(async () => {
    try {
      await fetch("/api/reset-dataset", { method: "POST" });
      pushToast("Dataset operasional berhasil dihapus dari memori server.", "success");
    } catch (error) {
      console.warn("Backend reset tidak tersedia:", error);
      pushToast(
        "Backend tidak merespons reset — kami tetap menghapus tampilan lokal.",
        "error"
      );
    }

    setDataset(null);
    setAnalysis(null);
    setRecommendations([]);
    setSimulation(null);
    setReport(null);
    setServerStatus((s) => (s ? { ...s, has_dataset: false, datasets_count: 0 } : s));
  }, [pushToast]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* =================================================
          TOP NAVIGATION
      ================================================= */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        hasDataset={!!dataset}
      />

      {/* =================================================
          STATUS BAR (kompetisi)
      ================================================= */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <CompetitionStatusBar
          dataset={dataset}
          onOpenUpload={() => setIsUploadOpen(true)}
          onResetDataset={handleResetDataset}
          onGoToReport={() => {
            setActiveTab("report");
            pushToast("Membuka laporan eksekutif.", "info");
          }}
        />
      </div>

      {/* =================================================
          LIVE AI TICKER
      ================================================= */}
      {dataset && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-3">
          <TickerStrip />
        </div>
      )}

      {/* =================================================
          MAIN LAYOUT
      ================================================= */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-5 flex gap-6 items-start">
        {/* SIDEBAR */}
        <SideNavBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* CONTENT */}
        <main className="flex-1 min-w-0">
          {activeTab === "brief" && (
            <div className="space-y-8">
              {!dataset && (
                <div className="animate-fade-in">
                  <CompetitionHero
                    onOpenUpload={() => setIsUploadOpen(true)}
                    onOpenChat={() => setIsChatOpen(true)}
                    onGoToAnalysis={() => setActiveTab("analysis")}
                    onGoToReport={() => setActiveTab("report")}
                    dataset={dataset}
                    analysis={analysis}
                  />
                </div>
              )}

              {dataset && analysis && (
                <>
                  {/* Hero ringkasan singkat */}
                  <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl animate-fade-in">
                    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl animate-glow-soft" />
                    <div className="relative z-10 p-6 sm:p-8">
                      <div className="max-w-3xl">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                          Optimasi Logistik dengan{" "}
                          <span className="animated-gradient-text">
                            Kecerdasan AI
                          </span>
                        </h1>
                        <p className="mt-3 text-sm text-slate-300 max-w-xl">
                          <TypewriterText
                            phrases={[
                              `AI Decision Pipeline mendeteksi potensi penghematan Rp${Math.round(analysis.total_daily_loss / 1000000)} juta per hari dari ${dataset.total_records} baris telemetri (${dataset.vehicles_count} armada).`,
                              "Rekomendasi teratas: Konsolidasi Rute A + Rute C — conf. 97%, hemat Rp2.350.000/hari.",
                              "Skor kesehatan operasional: 78/100. SLA fulfillment 98% terverifikasi.",
                            ]}
                            typeSpeed={42}
                            className="text-emerald-400 font-semibold"
                          />
                        </p>
                      </div>

                      {/* KPI counters */}
                      <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <CounterStat
                          value={analysis.total_daily_loss}
                          suffix="/hari"
                          prefix="Rp"
                          label="Hemat/Hari"
                          duration={1400}
                          format={(v) => `Rp${Math.round(v).toLocaleString("id-ID")}`}
                        />
                        <CounterStat
                          value={analysis.total_monthly_loss / 1000000}
                          suffix="M"
                          prefix="Rp"
                          label="Proyeksi/Bulan"
                        />
                        <CounterStat
                          value={analysis.key_metrics.avg_fleet_utilization}
                          suffix="%"
                          label="Utilisasi Armada"
                        />
                        <CounterStat
                          value={analysis.key_metrics.sla_fulfillment_rate}
                          suffix="%"
                          label="SLA Terpenuhi"
                        />
                      </div>
                    </div>
                  </section>

                  <DailyBrief
                    dataset={dataset}
                    analysis={analysis}
                    recommendations={recommendations}
                    onGoToSimulation={() => setActiveTab("simulation")}
                    onGoToAnalysis={() => setActiveTab("analysis")}
                    onGoToImplementation={() => setActiveTab("implementation")}
                    onOpenUpload={() => setIsUploadOpen(true)}
                    onOpenChat={() => setIsChatOpen(true)}
                    onResetDataset={handleResetDataset}
                  />
                </>
              )}
            </div>
          )}

          {activeTab === "analysis" && (
            <AnalisisAI
              analysis={analysis}
              onGoToSimulation={() => setActiveTab("simulation")}
              onGoToImplementation={() => setActiveTab("implementation")}
            />
          )}

          {activeTab === "simulation" && (
            <Simulasi
              simulation={simulation}
              onGoToImplementation={() => setActiveTab("implementation")}
            />
          )}

          {activeTab === "implementation" && (
            <Implementation
              onGoToReport={() => setActiveTab("report")}
            />
          )}

          {activeTab === "report" && (
            <ExecutiveReport report={report} />
          )}
        </main>
      </div>

      {/* =================================================
          UPLOAD MODAL
      ================================================= */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        currentDataset={dataset}
        onResetDataset={handleResetDataset}
      />

      {/* =================================================
          TANYA OPTI AI
      ================================================= */}
      <TanyaOptiChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        dataset={dataset}
        analysis={analysis}
        recommendations={recommendations}
      />

      {/* =================================================
          AI TOAST NOTIFICATIONS
      ================================================= */}
      <AiToastCenter messages={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
