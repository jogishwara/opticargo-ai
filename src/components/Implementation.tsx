import React, { useState } from 'react';
import {
  PlayCircle,
  CheckCircle2,
  Clock,
  Send,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Reveal } from './Reveal';

interface ImplementationProps {
  onGoToReport: () => void;
}

export const Implementation: React.FC<ImplementationProps> = ({ onGoToReport }) => {
  const [deployed, setDeployed] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const handleDeploy = () => {
    setDeployed(true);
    setActiveStep(4);
  };

  return (
    <div id="screen-implementation" className="space-y-6 pb-12 text-slate-800 dark:text-slate-100 transition-colors">
      <Reveal>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover-lift transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              Siap Eksekusi Dispatch
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">• Alur Kerja Dispatch Otomatis</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Rencana Eksekusi & Alur Implementasi Operasional
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Panduan 4-langkah otomatis untuk mengintegrasikan rekomendasi AI langsung ke tablet pengemudi & sistem TMS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!deployed ? (
            <button
              id="btn-deploy-operational-plan"
              onClick={handleDeploy}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition transform hover:-translate-y-0.5"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Eksekusi Rencana Operasional</span>
            </button>
          ) : (
            <button
              id="btn-view-executive-report"
              onClick={onGoToReport}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition transform hover:-translate-y-0.5"
            >
              <span>Lihat Laporan Eksekutif</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      </Reveal>

      {deployed && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100 flex items-center justify-between shadow-sm animate-fade-in transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-emerald-950 dark:text-emerald-200">Rencana Operasional Berhasil Dideploy!</p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Instruksi rute baru telah dikirim ke 12 tablet armada pengemudi & TMS Dispatch.
              </p>
            </div>
          </div>
          <button
            onClick={onGoToReport}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-sm"
          >
            Buka Laporan Eksekutif →
          </button>
        </div>
      )}

      <Reveal delay={100}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Alur Eksekusi 4-Langkah (Dispatch Berurutan)</span>
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Estimasi Durasi: 15 Menit</span>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 before:z-0">
              <div className="relative z-10 flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                  activeStep >= 1 ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                }`}>
                  1
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Gabungkan Rute A + Rute C</h3>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 font-bold rounded-md border border-emerald-200 dark:border-emerald-800">
                      Siap Eksekusi (5 Mnt)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Konsolidasi manifest kargo Rute A (456kg) ke dalam muatan Rute C (Truk-04). Alokasi slot muat di Dermaga Gudang Barat.
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                  activeStep >= 2 ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                }`}>
                  2
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Alihkan Truk 04 (B 9122 UXX)</h3>
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 font-bold rounded-md border border-indigo-200 dark:border-indigo-800">
                      Reposisi Armada (5 Mnt)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Reposisi Truk 04 dari Gudang Barat ke Central Hub untuk mengambil muatan tambahan sore hari tanpa unit pihak ketiga.
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                  activeStep >= 3 ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                }`}>
                  3
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sesuaikan Jadwal Loading Bay Dermaga 4-6</h3>
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 font-bold rounded-md border border-indigo-200 dark:border-indigo-800">
                      Penjadwalan Bertahap (3 Mnt)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Perbarui slot waktu kedatangan truk di Gudang B untuk menghilangkan antrean waktu idle 3,4 jam.
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                  activeStep >= 4 ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                }`}>
                  4
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kirim Notifikasi Push & Sinkronisasi Tablet Pengemudi</h3>
                    <span className={`text-[10px] px-2 py-0.5 font-bold rounded-md border ${
                      deployed
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    }`}>
                      {deployed ? 'Tersinkronisasi & Terkirim' : 'Menunggu Eksekusi (2 Mnt)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Sistem akan mengirim peta rute baru, titik koordinat, dan manifest kargo terintegrasi ke aplikasi pengemudi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm transition-colors">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Ringkasan Eksekusi
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Total Durasi Eksekusi</span>
                <span className="font-bold text-slate-900 dark:text-white">15 Menit</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Peningkatan Efisiensi Total</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+22%</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Jumlah Armada Terlibat</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">12 Unit</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Mode Notifikasi Pengemudi</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Notifikasi Push TMS</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-2 text-xs transition-colors">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Dispatch Tanpa Waktu Henti (Zero Downtime)</span>
              </div>
              <p className="text-emerald-900 dark:text-emerald-200 text-[11px] leading-relaxed">
                Pengalihan rute dilakukan secara real-time tanpa menghentikan armada yang sedang beroperasi di lapangan.
              </p>
            </div>

            {!deployed ? (
              <button
                id="btn-trigger-deploy"
                onClick={handleDeploy}
                className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Buat Rencana Operasional & Eksekusi</span>
              </button>
            ) : (
              <button
                id="btn-goto-report-final"
                onClick={onGoToReport}
                className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
              >
                <span>Buka Laporan Intelijen Eksekutif →</span>
              </button>
            )}
          </div>
        </div>
      </div>
      </Reveal>
    </div>
  );
};
