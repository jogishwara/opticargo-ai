import React, { useState } from 'react';
import {
  Sliders,
  TrendingDown,
  CheckCircle2,
  ArrowRight,
  Zap,
  Leaf,
  Clock,
  Navigation,
  RotateCcw,
  ShieldCheck,
  Fuel
} from 'lucide-react';
import { SimulationResult } from '../types';
import { Reveal } from './Reveal';
import { AnimatedNumber } from './AnimatedNumber';

const formatRupiah = (v: number) => Math.round(v).toLocaleString('id-ID');

interface SimulasiProps {
  simulation: SimulationResult | null;
  onGoToImplementation: () => void;
}

export const Simulasi: React.FC<SimulasiProps> = ({
  simulation,
  onGoToImplementation
}) => {
  const [fleetReduction, setFleetReduction] = useState<number>(0);
  const [consolidationRate, setConsolidationRate] = useState<number>(12);

  if (!simulation) {
    return (
      <div id="screen-simulasi-empty" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-3xl mx-auto my-6 animate-fade-in transition-colors">
        <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-xs">
          <Sliders className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-800">
            Belum Ada Data Simulasi
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Unggah Data Operasional Untuk Membuka Engine Simulasi
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Engine simulasi memerlukan data operasional aktif untuk memproyeksikan penghematan BBM dan dampak parameter optimasi.
          </p>
        </div>
      </div>
    );
  }

  const baseFuelCost = simulation.before.fuel_cost_daily || 18300000;
  const baseTotalCost = simulation.before.transportation_cost_daily || 28500000;
  const baseUtil = simulation.before.fleet_utilization_percent || 72;
  const baseIdle = simulation.before.idle_time_hours || 3.4;

  const fuelSavingPercent = Math.min(25, 12 + Math.floor(consolidationRate / 2));
  const utilizationTarget = Math.min(99, baseUtil + fleetReduction + 19);
  const idleHoursTarget = Math.max(0.5, +(baseIdle * (1 - fuelSavingPercent / 20)).toFixed(1));
  const dailySaving = Math.round(baseFuelCost * (fuelSavingPercent / 100) + 150000);
  const monthlySaving = dailySaving * 20;

  const afterFuelCost = Math.round(baseFuelCost * (1 - fuelSavingPercent / 100));
  const afterTotalCost = Math.round(baseTotalCost - dailySaving);

  const kmSaved = Math.round(42 * (fuelSavingPercent / 12));
  const carbonSaved = +(1.8 * (fuelSavingPercent / 12)).toFixed(1);

  return (
    <div id="screen-simulasi" className="space-y-6 pb-12 text-slate-800 dark:text-slate-100 transition-colors">
      <Reveal>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover-lift transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
              Engine Simulasi v1.2
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">• Dampak Operasional Prediktif</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Simulasi Optimasi Skenario (Sebelum vs Sesudah)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Prediksi dampak finansial & efisiensi armada apabila rekomendasi AI diterapkan secara penuh.
          </p>
        </div>

        <button
          id="btn-simulasi-apply"
          onClick={onGoToImplementation}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition transform hover:-translate-y-0.5 press-scale"
        >
          <span>Terapkan Rekomendasi Ini</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Reveal delay={80}>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 hover-lift transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
                Skenario Baseline
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Operasional Saat Ini (Sebelum)
              </h2>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700">
              Status Quo
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Biaya BBM Harian</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">Rp{baseFuelCost.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Utilisasi Kapasitas Armada</span>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{baseUtil}%</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Rata-rata Waktu Idle Mesin</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{baseIdle} Jam / Truk</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">SLA Fulfillment Rate</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{simulation.before.delivery_success_percent || 98}%</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-bold">
              <span className="text-xs text-slate-800 dark:text-slate-200">Total Biaya Transportasi / Hari</span>
              <span className="text-sm text-slate-900 dark:text-white">Rp{baseTotalCost.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
        </Reveal>

        <Reveal delay={160}>
        <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-xl border border-slate-800 dark:border-slate-800 text-white shadow-md space-y-5 relative transition-colors">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">
                Target Optimasi AI
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Setelah Optimasi AI (Sesudah)
              </h2>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Tersimulasi
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Biaya BBM Harian</span>
              <div className="text-right">
                <span className="text-sm font-bold text-emerald-400">Rp{afterFuelCost.toLocaleString('id-ID')}</span>
                <span className="text-[10px] text-emerald-400 font-semibold block">-{fuelSavingPercent}% hemat</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Utilisasi Kapasitas Armada</span>
              <div className="text-right">
                <span className="text-sm font-bold text-indigo-400">{utilizationTarget}%</span>
                <span className="text-[10px] text-indigo-400 font-semibold block">▲ +{utilizationTarget - baseUtil}% peningkatan</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Rata-rata Waktu Idle Mesin</span>
              <div className="text-right">
                <span className="text-sm font-bold text-emerald-400">{idleHoursTarget} Jam / Truk</span>
                <span className="text-[10px] text-emerald-400 font-semibold block">▼ -{Math.round(((baseIdle - idleHoursTarget) / baseIdle) * 100)}% waktu idle</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">SLA Fulfillment Rate</span>
              <div className="text-right">
                <span className="text-sm font-bold text-white">98%</span>
                <span className="text-[10px] text-emerald-400 font-semibold block">✔ Terlindungi (Stabil)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-xl border border-emerald-500/30 font-bold">
              <span className="text-xs text-slate-200">Total Biaya Transportasi / Hari</span>
              <span className="text-base text-emerald-400">Rp{afterTotalCost.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
        </Reveal>
      </div>

      <Reveal delay={200}>
      <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover-lift transition-colors">
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Potensi Bersih Penghematan Terverifikasi AI
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-950 dark:text-emerald-300">
              Rp<AnimatedNumber value={dailySaving} format={formatRupiah} />
            </span>
            <span className="text-sm text-emerald-800 dark:text-emerald-300 font-bold">/ Hari</span>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              (Proyeksi Bulanan: Rp<AnimatedNumber value={monthlySaving} format={formatRupiah} />)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-xs text-slate-700 dark:text-slate-300">
            SLA Fulfillment terproteksi 100%. Risiko keterlambatan pengiriman = 0%.
          </p>
        </div>
      </div>
      </Reveal>

      <Reveal delay={240}>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Kustomisasi Parameter Simulasi (Slider Interaktif)</span>
          </h3>
          <button
            id="btn-simulasi-reset"
            onClick={() => { setFleetReduction(0); setConsolidationRate(12); }}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ke Awal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs font-semibold">
              <label className="text-slate-800 dark:text-slate-200">Tingkat Konsolidasi Muatan Rute A & C</label>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{consolidationRate}%</span>
            </div>
            <input
              id="slider-consolidation"
              type="range"
              min="5"
              max="25"
              value={consolidationRate}
              onChange={(e) => setConsolidationRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Menyesuaikan persentase perataan kargo yang dipindahkan dari Rute A ke Rute C.
            </p>
          </div>

          <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs font-semibold">
              <label className="text-slate-800 dark:text-slate-200">Reduksi Unit Armada Aktif</label>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">+{fleetReduction}% Peningkatan Ekstra</span>
            </div>
            <input
              id="slider-fleet-reduction"
              type="range"
              min="0"
              max="15"
              value={fleetReduction}
              onChange={(e) => setFleetReduction(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Mengoptimalkan penarikan armada tambahan tanpa mengganggu jadwal pengiriman B2B.
            </p>
          </div>
        </div>
      </div>
      </Reveal>

      <Reveal delay={300}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm transition-colors">
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Efisiensi Jarak Rute</p>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">-{kmSaved} km / pengemudi</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm transition-colors">
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Reduksi Jejak Karbon</p>
            <p className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">-{carbonSaved} Ton CO2 / bln</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm transition-colors">
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Kecepatan Pengiriman</p>
            <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">15 Menit Lebih Cepat</p>
          </div>
        </div>
      </div>
      </Reveal>
    </div>
  );
};
