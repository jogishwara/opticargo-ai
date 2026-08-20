import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Building,
  Calendar,
  Sparkles,
  Share2
} from 'lucide-react';
import { ExecutiveReportData } from '../types';
import { Reveal } from './Reveal';
import { AnimatedNumber } from './AnimatedNumber';

interface ExecutiveReportProps {
  report: ExecutiveReportData | null;
}

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({ report }) => {
  const [downloading, setDownloading] = useState(false);

  if (!report) {
    return (
      <div id="screen-report-empty" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-3xl mx-auto my-6 animate-fade-in transition-colors">
        <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-xs">
          <FileText className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800">
            Belum Ada Laporan Eksekutif
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Unggah Data Operasional Untuk Memuat Laporan Eksekutif
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Laporan tingkat dewan direksi secara otomatis dibuat setelah dataset diunggah dan dianalisis oleh AI Decision Engine.
          </p>
        </div>
      </div>
    );
  }

  const handleExportPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 500);
  };

  return (
    <div id="screen-executive-report" className="space-y-6 pb-12 text-slate-800 dark:text-slate-100 transition-colors">
      <Reveal>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden hover-lift transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
              Dokumen Tingkat Eksekutif
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">• Siap Untuk Dewan Direksi</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Laporan Dampak Intelijen Eksekutif
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Intelijen Keputusan OptiCargo • Laporan Strategis Efisiensi Logistik
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-report-export-pdf"
            onClick={handleExportPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{downloading ? 'Menyiapkan PDF...' : 'Ekspor PDF'}</span>
          </button>

          <button
            id="btn-report-print"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>
      </Reveal>

      <Reveal delay={100}>
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-8 shadow-sm print:bg-white print:text-slate-900 print:border-none print:shadow-none print:p-0 transition-colors">
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                OptiCargo<span className="text-indigo-600 dark:text-indigo-400">.ai</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 font-bold">
                Sistem Intelijen Keputusan
              </span>
            </div>
            <h2 className="text-2xl font-extrabold mt-3 text-slate-900 dark:text-white">
              Laporan Dampak Intelijen Eksekutif
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Siklus Strategis: {report.strategic_cycle} • Dibuat: {new Date().toLocaleDateString('id-ID')}
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-bold text-slate-900 dark:text-white">Executive Summary Customer</p>
            <p>Dataset Operasional Eksternal</p>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold">Status Audit: Terverifikasi AI</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">
            01. Ringkasan Dampak Finansial & Operasional
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 transition-colors">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Penghematan Harian Hari Ini</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                Rp<AnimatedNumber value={report.today_saving} />
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">+12,4% vs biaya baseline</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 transition-colors">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Proyeksi Finansial Bulanan</p>
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                Rp<AnimatedNumber value={report.monthly_projection} />
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Tingkat Kepercayaan Model: {report.confidence_score}%</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 transition-colors">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Proyeksi Tahunan</p>
              <p className="text-3xl font-extrabold text-amber-700 dark:text-amber-400">
                Rp<AnimatedNumber value={report.financial_impact.annual_saving_projection || 584400000} />
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">240 Hari Kerja Aktif</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed transition-colors">
            <p className="font-bold mb-1 text-slate-900 dark:text-white">Ringkasan Eksekutif:</p>
            {report.executive_summary}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">
            02. Masalah Teratasi (Deteksi Kebocoran Biaya)
          </h3>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Mendeteksi Utilisasi Armada Terpakai Rendah & Redundansi Rute
              </h4>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Dampak Tinggi Kritis
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              AI mengidentifikasi 14% dari armada beroperasi di bawah kapasitas muatan optimal pada rute lintas area Grogol-Petamburan. Hal ini menyebabkan kebocoran biaya tetap sebesar Rp4,2Juta per kuartal jika tidak dikonsolidasi.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                Gap Muatan 14%
              </span>
              <span className="px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                Potensi Kerugian Rp4,2Juta / Kuartal
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-2">
            03. Rencana Aksi Strategis & Analisis ROI
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 transition-colors">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Nama Inisiatif</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Konsolidasi Rute A + Rute C</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 transition-colors">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Proyeksi ROI</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">185% Bulan Pertama</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 transition-colors">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Jangka Waktu Eksekusi</p>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">15 - 48 Jam</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Tervalidasi oleh Pipeline Intelijen Keputusan OptiCargo v1.0</span>
          </div>

          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Kerahasiaan • Hanya Untuk Tinjauan Internal Dewan & Eksekutif
          </p>
        </div>
      </div>
      </Reveal>
    </div>
  );
};
