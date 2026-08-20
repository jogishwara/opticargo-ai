import React, { useState } from "react";
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Database,
  Sparkles,
  RefreshCw,
  Trash2,
  ShieldCheck,
  FileCheck2,
  Workflow,
} from "lucide-react";

import {
  DatasetSummary,
  OperationalAnalysis,
  Recommendation,
  SimulationResult,
  ExecutiveReportData,
} from "../types";

import {
  uploadDataset,
} from "../services/api";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (
    summary: DatasetSummary,
    analysis: OperationalAnalysis,
    recommendations: Recommendation[],
    simulation: SimulationResult,
    report: ExecutiveReportData,
  ) => void;
  currentDataset?: DatasetSummary | null;
  onResetDataset?: () => void;
}

const pipelineSteps = [
  "Validasi file customer",
  "Analisis operasional",
  "Rekomendasi AI",
  "Simulasi & laporan",
];

function formatFileSize(file: File) {
  const kb = file.size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  currentDataset,
  onResetDataset,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [resetNotification, setResetNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const openFilePicker = () => {
    const input = document.getElementById("input-file-select") as HTMLInputElement;
    input?.click();
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcessUpload = async () => {
    if (!selectedFile) {
      alert("Silakan pilih dataset customer terlebih dahulu.");
      return;
    }

    setIsProcessing(true);

    try {
      const uploadResponse = await uploadDataset(selectedFile);
      const payload = uploadResponse.data;

      if (!payload?.datasetAccepted) {
        const reasons = payload?.validation?.reasons || [];
        const missing = payload?.validation?.missing_columns || [];
        const validRows = payload?.validation?.valid_records ?? 0;
        const totalRows = payload?.validation?.total_records ?? 0;
        const message = [
          payload?.validation?.message || "Dataset tidak dikenali.",
          missing.length ? `Kolom kurang: ${missing.join(", ")}.` : null,
          `Baris total: ${totalRows}, valid: ${validRows}.`,
          reasons.length ? `Alasan: ${reasons.join(" ")}` : null,
        ].filter(Boolean).join(" ");
        alert(message || "Dataset tidak dikenali.");
        return;
      }

      const dataset = payload.summary;
      const datasetId = dataset.dataset_id;

      const analysisResponse = await fetch(`/api/analysis/${datasetId}`);
      const recommendationResponse = await fetch(`/api/recommendation/${datasetId}`);
      const simulationResponse = await fetch(`/api/simulation/${datasetId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const reportResponse = await fetch(`/api/generate-report/${datasetId}`, { method: "POST" });

      const analysisJson = await analysisResponse.json();
      const recommendationJson = await recommendationResponse.json();
      const simulationJson = await simulationResponse.json();
      const reportJson = await reportResponse.json();

      if (!analysisJson?.data || !recommendationJson?.data || !simulationJson?.data || !reportJson?.data) {
        throw new Error("Dataset diterima tapi pipeline analisis tidak lengkap.");
      }

      onUploadSuccess(
        dataset,
        analysisJson.data,
        recommendationJson.data,
        simulationJson.data,
        reportJson.data,
      );

      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error("Upload pipeline error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Gagal memproses dataset customer. Pastikan file CSV/JSON valid. Jika file masih XLSX, ekspor ke CSV terlebih dahulu.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (!onResetDataset) return;

    onResetDataset();
    setSelectedFile(null);
    setResetNotification("Dataset customer aktif berhasil dihapus.");

    setTimeout(() => {
      setResetNotification(null);
    }, 3000);
  };

  return (
    <div
      id="modal-upload"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl transition-colors">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 px-6 py-5 sm:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm">
                <Upload className="h-5 w-5" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                    Upload Dataset Customer
                  </h3>
                  <span className="rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    External Data Ready
                  </span>
                </div>
                <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Masukkan file operasional milik customer. OptiCargo akan menjalankan validasi, analisis biaya, rekomendasi, simulasi, dan laporan secara otomatis.
                </p>
              </div>
            </div>

            <button
              id="btn-close-modal"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-900 dark:hover:text-white"
              aria-label="Tutup upload modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-5 px-6 py-6 sm:px-8">
            {currentDataset && (
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 p-4 text-xs transition-colors">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                    <Database className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-extrabold text-slate-900 dark:text-white">
                      Dataset aktif: {currentDataset.filename}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {currentDataset.total_records.toLocaleString("id-ID")} baris data customer • ID {currentDataset.dataset_id}
                    </p>
                  </div>
                </div>

                {onResetDataset && (
                  <button
                    id="btn-reset-dataset-modal"
                    onClick={handleReset}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-3 py-2 text-[11px] font-bold text-rose-700 dark:text-rose-300 transition hover:bg-rose-100 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </button>
                )}
              </div>
            )}

            {resetNotification && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 animate-fade-in">
                <CheckCircle2 className="h-4 w-4" />
                <span>{resetNotification}</span>
              </div>
            )}

            <input
              id="input-file-select"
              type="file"
              accept=".csv,.xlsx,.json"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div
              onClick={openFilePicker}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
              className={`group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-lg shadow-indigo-500/10"
                  : selectedFile
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-lg shadow-emerald-500/10"
                    : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-white dark:hover:bg-slate-900"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-indigo-500/5 dark:from-slate-900/40 dark:to-indigo-500/10" />

              <div className="relative z-10 mx-auto flex max-w-md flex-col items-center">
                <div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border shadow-sm transition ${
                  selectedFile
                    ? "border-emerald-200 dark:border-emerald-800 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    : "border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 group-hover:scale-105"
                }`}>
                  {selectedFile ? <FileCheck2 className="h-9 w-9" /> : <FileSpreadsheet className="h-9 w-9" />}
                </div>

                <p className="text-lg font-black text-slate-950 dark:text-white">
                  {selectedFile ? selectedFile.name : "Drop dataset customer di sini"}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {selectedFile
                    ? `${formatFileSize(selectedFile)} • file siap dianalisis oleh AI pipeline`
                    : "Tarik file ke area ini, atau klik untuk memilih dari perangkat Anda."}
                </p>

                {!selectedFile ? (
                  <span className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-5 py-2.5 text-xs font-extrabold text-slate-800 dark:text-slate-200 shadow-sm transition group-hover:border-indigo-300 dark:group-hover:border-indigo-700">
                    <Upload className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Pilih Dataset Customer
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="mt-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Ganti File
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 p-4 transition-colors">
                <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Privasi Dataset
                </div>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Dataset yang diunggah diproses sebagai data customer eksternal dan tidak digabungkan dengan data contoh dari sistem.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 p-4 transition-colors">
                <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  <Workflow className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Format Dibaca
                </div>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  CSV dan JSON dapat langsung dianalisis. Untuk XLSX, ekspor ke CSV agar struktur data terbaca optimal.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 transition-colors">
              <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Pipeline Analisis Otomatis
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {pipelineSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-center"
                  >
                    <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-black text-white">
                      {index + 1}
                    </div>
                    <p className="text-[10px] font-bold leading-snug text-slate-600 dark:text-slate-300">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 dark:border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-end">
              <button
                id="btn-cancel-upload"
                onClick={onClose}
                disabled={isProcessing}
                className="rounded-xl bg-slate-100 dark:bg-slate-900 px-5 py-3 text-xs font-extrabold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                id="btn-start-ai-analysis"
                onClick={handleProcessUpload}
                disabled={isProcessing || !selectedFile}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none dark:disabled:bg-slate-700"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Memproses Dataset Customer...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analisis Dataset Customer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
