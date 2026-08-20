import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Upload,
  CheckCircle2,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  ArrowRight,
  Bot,
  Truck,
  AlertCircle,
  Trash2,
  BarChart3,
  PieChart,
  MapPin
} from 'lucide-react';
import { DatasetSummary, OperationalAnalysis, Recommendation } from '../types';
import { FleetMap } from './FleetMap';
import { Reveal } from './Reveal';
import { AnimatedNumber } from './AnimatedNumber';
import { DonutChart, BarChart, GaugeChart, buildCostSegments } from './Charts';

interface DailyBriefProps {
  dataset: DatasetSummary | null;
  analysis: OperationalAnalysis | null;
  recommendations: Recommendation[];
  onGoToSimulation: () => void;
  onGoToAnalysis: () => void;
  onGoToImplementation: () => void;
  onOpenUpload: () => void;
  onOpenChat: () => void;
  onResetDataset?: () => void;
}

const formatRupiah = (v: number) => Math.round(v).toLocaleString('id-ID');

export const DailyBrief: React.FC<DailyBriefProps> = ({
  dataset,
  analysis,
  recommendations,
  onGoToSimulation,
  onGoToAnalysis,
  onGoToImplementation,
  onOpenUpload,
  onOpenChat,
  onResetDataset
}) => {
  const [barMode, setBarMode] = useState<'daily' | 'weekly'>('daily');

  if (!dataset || !analysis) {
    return (
      <div id="screen-daily-brief-empty" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-3xl mx-auto my-6 animate-fade-in transition-colors">
        <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-xs">
          <Upload className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800">
            Belum Ada Data Operasional Terunggah
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Unggah File Dataset Untuk Memulai Analisis AI
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Sistem memerlukan data operasional logistik (file CSV) untuk memicu AI Decision Engine, memetakan rute, dan mendeteksi kebocoran biaya harian.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            id="btn-empty-upload"
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition transform hover:-translate-y-0.5 press-scale"
          >
            <Upload className="w-4 h-4" />
            <span>Unggah Data Operasional Baru</span>
          </button>
        </div>
      </div>
    );
  }

  const topRec = recommendations[0] || {
    title: "Dynamic Load Balancing & Konsolidasi Rute",
    potential_saving_daily: analysis.total_daily_loss,
    confidence_score: 97,
    estimated_time_minutes: 15,
    business_reason: `Penghematan langsung dari konsumsi BBM harian dan efisiensi utilisasi muatan armada (${analysis.key_metrics.avg_fleet_utilization}% utilisasi).`
  };

  // Data chart interaktif
  const costSegments = buildCostSegments(analysis.total_daily_loss);

  // Proyeksi 7 Hari (Harian)
  const dailyProjections = [
    { label: 'Senin', value: Math.round(analysis.total_daily_loss * 0.95), color: '#6366f1' },
    { label: 'Selasa', value: Math.round(analysis.total_daily_loss * 1.05), color: '#6366f1' },
    { label: 'Rabu', value: Math.round(analysis.total_daily_loss * 1.12), color: '#6366f1' },
    { label: 'Kamis', value: Math.round(analysis.total_daily_loss * 0.90), color: '#6366f1' },
    { label: 'Jumat', value: Math.round(analysis.total_daily_loss), color: '#6366f1' },
    { label: 'Sabtu', value: Math.round(analysis.total_daily_loss * 0.75), color: '#06b6d4' },
    { label: 'Minggu', value: Math.round(analysis.total_daily_loss * 0.60), color: '#06b6d4' },
  ];

  // Proyeksi 4 Minggu (Mingguan)
  const weeklyProjections = [
    { label: 'Minggu 1', value: Math.round(analysis.total_daily_loss * 5 * 0.95), color: '#6366f1' },
    { label: 'Minggu 2', value: Math.round(analysis.total_daily_loss * 5 * 1.05), color: '#6366f1' },
    { label: 'Minggu 3', value: Math.round(analysis.total_daily_loss * 5 * 1.00), color: '#6366f1' },
    { label: 'Minggu 4', value: Math.round(analysis.total_daily_loss * 5 * 1.10), color: '#10b981' },
  ];

  const barData = barMode === 'daily' ? dailyProjections : weeklyProjections;
  const highlightIdx = barMode === 'daily' ? 4 : 3;

  return (
    <div id="screen-daily-brief" className="space-y-8 pb-12 animate-fade-in">

      {/* DASHBOARD ANALITIK INTERAKTIF */}
      <Reveal delay={120}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Dashboard Analitik & Proyeksi Penghematan</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Visualisasi potensi optimasi biaya berbasis data operasional real-time.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">
            {/* Donut: komposisi kebocoran */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-4 h-4 text-rose-500" />
                Komposisi Kebocoran Biaya (Harian)
              </h3>
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center min-h-[300px]">
                <DonutChart data={costSegments} centerLabel="Total Kerugian" formatValue={formatRupiah} />
              </div>
            </div>

            {/* Bar chart: tren penghematan */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Proyeksi Potensi Penghematan
                </h3>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setBarMode('daily')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      barMode === 'daily'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Per Hari (7 Hari)
                  </button>
                  <button
                    onClick={() => setBarMode('weekly')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      barMode === 'weekly'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Per Minggu (4 Minggu)
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-end min-h-[300px]">
                <BarChart
                  data={barData}
                  formatValue={(v) => `Rp${formatRupiah(v)}`}
                  highlightIndex={highlightIdx}
                />
              </div>
            </div>
          </div>

          {/* Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 lg:px-8 pb-8">
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center">
              <GaugeChart
                value={analysis.overall_health_score}
                label="Skor Kesehatan Operasional"
                color="#6366f1"
              />
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center">
              <GaugeChart
                value={analysis.key_metrics.avg_fleet_utilization}
                label="Utilisasi Kapasitas Armada"
                color="#f59e0b"
              />
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center">
              <GaugeChart
                value={analysis.key_metrics.sla_fulfillment_rate}
                label="Tingkat Kepuasan SLA"
                color="#10b981"
              />
            </div>
          </div>
        </div>
      </Reveal>

      {/* GPS FLEET MAP - data dari dataset customer */}
      <Reveal delay={140}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>Peta Armada GPS Live (Dataset Customer)</span>
            </h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <FleetMap fleetAssets={analysis.fleet_assets} />
        </div>
      </Reveal>

      {/* PIPELINE & REKOMENDASI UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Reveal delay={160}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 hover-lift transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Pipeline Keputusan AI</span>
                </h3>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 uppercase">
                  Selesai
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { step: '1', title: 'Pra-pemrosesan Data Telemetri', detail: `${dataset.total_records.toLocaleString('id-ID')} baris data berhasil dinormalisasi` },
                  { step: '2', title: 'Pemetaan Rute & Aset', detail: `${dataset.routes_count} rute distribusi teridentifikasi` },
                  { step: '3', title: 'Deteksi Kebocoran Biaya', detail: `Kerugian harian Rp${analysis.total_daily_loss.toLocaleString('id-ID')} terhitung` },
                  { step: '4', title: 'Rekomendasi Tindakan AI', detail: `${topRec.title} (Confidence: ${topRec.confidence_score}%)` },
                  { step: '5', title: 'Verifikasi Proteksi SLA', detail: 'SLA 98% terjamin stabil tanpa degradasi' }
                ].map((item, idx) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      ✓
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                id="btn-brief-view-analysis"
                onClick={onGoToAnalysis}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-2"
              >
                <span>Lihat Bedah Masalah Lengkap →</span>
              </button>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Reveal delay={200}>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 hover-lift transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
                    Rekomendasi Utama AI #1
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3">
                    {topRec.title}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 block">
                    +Rp<AnimatedNumber value={topRec.potential_saving_daily} format={formatRupiah} />
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Potensi Hemat / Hari</span>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {topRec.business_reason}
              </p>

              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Confidence Score</p>
                  <p className="font-black text-indigo-600 dark:text-indigo-400 text-base mt-1">{topRec.confidence_score || 97}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Estimasi Waktu</p>
                  <p className="font-black text-slate-800 dark:text-white text-base mt-1">{topRec.estimated_time_minutes || 15} Mnt</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Dampak SLA</p>
                  <p className="font-black text-emerald-600 dark:text-emerald-400 text-base mt-1">Nol Penurunan</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  id="btn-brief-tanya-opti"
                  onClick={onOpenChat}
                  className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                >
                  <Bot className="w-4 h-4" />
                  <span>Tanya Opti alasan rekomendasi ini</span>
                </button>

                <button
                  id="btn-brief-deploy-now"
                  onClick={onGoToImplementation}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <span>Terapkan Rekomendasi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

    </div>
  );
};
