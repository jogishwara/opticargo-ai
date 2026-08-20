import React from "react";
import {
  Building2,
  RefreshCw,
  Gauge,
  Bell,
  Upload,
  Trash2,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { DatasetSummary } from "../types";
import { AnimatedNumber } from "./AnimatedNumber";

interface CompetitionStatusBarProps {
  dataset: DatasetSummary | null;
  onOpenUpload: () => void;
  onResetDataset: () => void;
  onGoToReport: () => void;
}

const formatRupiah = (v: number) => Math.round(v).toLocaleString("id-ID");

export const CompetitionStatusBar: React.FC<CompetitionStatusBarProps> = ({
  dataset,
  onOpenUpload,
  onResetDataset,
  onGoToReport,
}) => {
  const records = dataset?.total_records ?? 0;

  return (
    <div
      id="competition-status-bar"
      className="rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-xl"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 px-5 py-4">
        {/* Left: system identity + live status */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Kompetisi Nasional — Sistem Intelijen OptiCargo
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                Sistem Online
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
                <Gauge className="w-3 h-3" />
                AI Pipeline v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Middle: dataset summary / empty state */}
        <div className="flex-1 min-w-0">
          {dataset ? (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              <span className="inline-flex items-center gap-1.5 text-slate-300 font-medium truncate">
                <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate font-semibold text-white">
                  {dataset.filename}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <AnimatedNumber value={records} format={formatRupiah} /> data
              </span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                {dataset.vehicles_count} armada
              </span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {dataset.valid_records} valid
              </span>
              {dataset.invalid_records > 0 && (
                <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {dataset.invalid_records} dibersihkan
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Belum ada dataset customer terunggah — mulai dengan file CSV
                customer Anda.
              </span>
            </div>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-status-upload"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition press-scale"
          >
            <Upload className="w-3.5 h-3.5" />
            {dataset ? "Ganti Data" : "Unggah Data"}
          </button>

          {dataset && (
            <button
              id="btn-status-report"
              onClick={onGoToReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition press-scale"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Laporan
            </button>
          )}

          {dataset && (
            <button
              id="btn-status-reset"
              onClick={onResetDataset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-bold border border-rose-800/60 transition press-scale"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
