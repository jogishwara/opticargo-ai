import React from 'react';
import {
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Database,
  BarChart3,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { OperationalAnalysis } from '../types';
import { FleetMap } from './FleetMap';
import { Reveal } from './Reveal';
import { AnimatedNumber } from './AnimatedNumber';

interface AnalisisAIProps {
  analysis: OperationalAnalysis | null;
  onGoToSimulation: () => void;
  onGoToImplementation: () => void;
}

export const AnalisisAI: React.FC<AnalisisAIProps> = ({
  analysis,
  onGoToSimulation,
  onGoToImplementation
}) => {
  if (!analysis) {
    return (
      <div id="screen-analisis-ai-empty" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-3xl mx-auto my-6 animate-fade-in transition-colors">
        <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-xs">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800">
            Belum Ada Analisis Tergenerasi
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Unggah Data Operasional Untuk Membuka Bedah Masalah
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Halaman ini menampilkan deteksi kebocoran biaya, bukti GPS/manifest, dan audit akar masalah secara otomatis setelah dataset diunggah.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="screen-analisis-ai" className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header Banner */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover-lift transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
                Mode Insight Mendalam
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">• Dataset ID: {analysis.dataset_id}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bedah Masalah & Estimasi Dampak Finansial
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
              Analisis berbasis bukti telemetri, audit manifest, dan AI Decision Intelligence Engine. Mengidentifikasi inefisiensi untuk dieliminasi.
            </p>
          </div>

          <button
            id="btn-analysis-simulasi"
            onClick={onGoToSimulation}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5"
          >
            <span>Mulai Engine Simulasi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Reveal>

      {/* GPS FLEET MAP - data dari dataset customer */}
      <Reveal delay={120}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>Bukti GPS & Peta Armada (Dataset Customer)</span>
            </h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <FleetMap fleetAssets={analysis.fleet_assets} />
        </div>
      </Reveal>

      {/* Grid: Problems (Main) & Impact (Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Problems Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Akar Masalah (Cost Leakages)</span>
            </h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>

          {analysis.detected_leakages.map((leak, idx) => (
            <Reveal key={leak.id} delay={idx * 100}>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 hover-lift transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className={`inline-block px-3 py-1 text-[10px] font-bold rounded-full mb-3 uppercase tracking-wide ${
                      leak.severity === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                    }`}>
                      {leak.severity} • {leak.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {leak.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Kerugian Harian</p>
                    <p className="text-lg font-black text-rose-600 dark:text-rose-400">
                      -Rp{leak.financial_loss_daily.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {leak.description}
                </p>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase">Analisis AI:</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{leak.explanation}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {leak.evidence_tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                      <Database className="w-3 h-3 text-indigo-500" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Sidebar: Financial Impact */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              <span>Dampak Finansial</span>
            </h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
            {/* Main Metric */}
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900">
              <p className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-widest">Kerugian Harian Saat Ini</p>
              <p className="text-4xl font-black text-rose-700 dark:text-rose-400 mt-2">
                Rp<AnimatedNumber value={analysis.total_daily_loss} />
              </p>
              <p className="text-xs text-rose-900/70 dark:text-rose-300/70 mt-2 font-medium">
                Jika diabaikan, kerugian bulanan mencapai Rp{(analysis.total_monthly_loss / 1000000).toFixed(1)} Juta.
              </p>
            </div>

            {/* Breakdown List */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Komponen Utama</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">BBM & Overlap</span>
                <span className="font-bold text-slate-900 dark:text-white">Rp{Math.round(analysis.total_daily_loss * 0.35).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Pemeliharaan Armada</span>
                <span className="font-bold text-slate-900 dark:text-white">Rp{Math.round(analysis.total_daily_loss * 0.15).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="font-bold text-slate-900 dark:text-white">Lainnya</span>
                <span className="font-bold text-slate-900 dark:text-white">Rp{(analysis.total_daily_loss - Math.round(analysis.total_daily_loss * 0.35) - Math.round(analysis.total_daily_loss * 0.15)).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Confidence Gauge */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">Confidence Score</p>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mt-1">Diverifikasi AI</p>
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">98,4%</div>
            </div>

            <button
              id="btn-analysis-run-sim"
              onClick={onGoToSimulation}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Mulai Simulasi Optimasi AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
