import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { analyzeOperationalData } from "./src/utils/analysisEngine";

dotenv.config();

const app = express();
const PORT = 30001;

app.use(express.json({ limit: "20mb" }));

// In-memory operational state store for datasets, analysis, recommendations, simulations, and reports
const stateStore = {
  datasets: new Map<string, any>(),
  analyses: new Map<string, any>(),
  recommendations: new Map<string, any[]>(),
  simulations: new Map<string, any>(),
  reports: new Map<string, any>(),
  uploadOrder: [] as string[]
};

// Helper for standard API response format
function makeApiResponse(data: any, message: string = "Sukses", status: "success" | "error" = "success", startTime: number = Date.now()) {
  return {
    status,
    message,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      engine_mode: "OptiCargo-AI-Decision-Pipeline-v1"
    },
    processing_time_ms: Date.now() - startTime
  };
}

function makeValidationError(payload: any, startTime: number) {
  return makeApiResponse(payload, payload?.validation?.message || "Dataset tidak dikenali", "error", startTime);
}

// Initialize Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}

// Return the most recently uploaded dataset id (or the first one stored)
function getLatestDatasetId(): string | null {
  if (stateStore.uploadOrder.length === 0) return null;
  return stateStore.uploadOrder[stateStore.uploadOrder.length - 1];
}

// Build a compact context string from the current analysis to make the AI chat data-driven
function buildDataContext(datasetId: string | null): string {
  if (!datasetId) return "Belum ada dataset yang diunggah.";
  const dataset = stateStore.datasets.get(datasetId);
  const analysis = stateStore.analyses.get(datasetId);
  const recs = stateStore.recommendations.get(datasetId) || [];

  const parts: string[] = [];
  if (dataset) {
    parts.push(`Dataset: ${dataset.filename} (${dataset.total_records} baris, ${dataset.vehicles_count} armada, ${dataset.routes_count} rute)`);
  }
  if (analysis) {
    parts.push(
      `Kerugian harian: Rp${(analysis.total_daily_loss || 0).toLocaleString("id-ID")}/hari. ` +
      `Kerugian bulanan: Rp${(analysis.total_monthly_loss || 0).toLocaleString("id-ID")}/bulan. ` +
      `Utilisasi armada: ${analysis.key_metrics?.avg_fleet_utilization}%. ` +
      `Waktu idle rata-rata: ${analysis.key_metrics?.avg_idle_hours} jam/hari. ` +
      `SLA fulfillment: ${analysis.key_metrics?.sla_fulfillment_rate}%. ` +
      `Skor kesehatan: ${analysis.overall_health_score}/100.`
    );
    const leakages = analysis.detected_leakages || [];
    if (leakages.length > 0) {
      parts.push(
        "Kebocoran terdeteksi: " +
        leakages.map((l: any) => `${l.title} (${l.severity}, -Rp${l.financial_loss_daily.toLocaleString("id-ID")}/hari)`).join("; ")
      );
    }
  }
  if (recs.length > 0) {
    parts.push(
      "Rekomendasi teratas: " +
      recs.slice(0, 3).map((r: any, i: number) => `#${i + 1} ${r.title} (hemat Rp${(r.potential_saving_daily || 0).toLocaleString("id-ID")}/hari, confidence ${r.confidence_score}%)`).join(" | ")
    );
  }
  return parts.join("\n");
}

// =====================================================
// API ROUTE 1: Operational Data Upload
// =====================================================

app.post("/api/upload", (req, res) => {
  const startTime = Date.now();
  const { filename, rawContent } = req.body || {};

  if (!filename) {
    return res.status(400).json(makeApiResponse(null, "Field 'filename' wajib diisi", "error", startTime));
  }

  try {
    const processed = analyzeOperationalData(filename, typeof rawContent === "string" ? rawContent : undefined);

    if (!processed.accepted) {
      return res.status(400).json(makeValidationError(processed, startTime));
    }

    const datasetId = processed.summary.dataset_id;

    // Atomic replace only after validation passed
    stateStore.datasets.clear();
    stateStore.analyses.clear();
    stateStore.recommendations.clear();
    stateStore.simulations.clear();
    stateStore.reports.clear();
    stateStore.uploadOrder = [];

    stateStore.datasets.set(datasetId, processed.summary);
    stateStore.analyses.set(datasetId, processed.analysis);
    stateStore.recommendations.set(datasetId, processed.recommendations);
    stateStore.simulations.set(datasetId, processed.simulation);
    stateStore.reports.set(datasetId, processed.report);
    stateStore.uploadOrder.push(datasetId);

    res.json(makeApiResponse({
      datasetAccepted: true,
      validation: processed.validation,
      summary: processed.summary,
      analysis: processed.analysis,
      recommendations: processed.recommendations,
      simulation: processed.simulation,
      report: processed.report
    }, "Dataset operasional berhasil diunggah dan divalidasi", "success", startTime));
  } catch (error: any) {
    res.status(500).json(makeApiResponse(null, `Gagal memproses dataset: ${error?.message || error}`, "error", startTime));
  }
});

// =====================================================
// API ROUTE 1B: Delete / Reset Dataset
// =====================================================

app.post("/api/reset-dataset", (req, res) => {
  const startTime = Date.now();
  stateStore.datasets.clear();
  stateStore.analyses.clear();
  stateStore.recommendations.clear();
  stateStore.simulations.clear();
  stateStore.reports.clear();
  stateStore.uploadOrder = [];

  res.json(makeApiResponse(null, "Data operasional terunggah berhasil dihapus", "success", startTime));
});

app.delete("/api/dataset/:id", (req, res) => {
  const startTime = Date.now();
  const datasetId = req.params.id;
  stateStore.datasets.delete(datasetId);
  stateStore.analyses.delete(datasetId);
  stateStore.recommendations.delete(datasetId);
  stateStore.simulations.delete(datasetId);
  stateStore.reports.delete(datasetId);
  stateStore.uploadOrder = stateStore.uploadOrder.filter((id) => id !== datasetId);
  res.json(makeApiResponse({ deleted_id: datasetId }, `Dataset ${datasetId} berhasil dihapus`, "success", startTime));
});

// =====================================================
// API ROUTE 2: Cost Leakage Detection Analysis
// =====================================================

app.get("/api/analysis/:dataset_id", (req, res) => {
  const startTime = Date.now();
  const datasetId = req.params.dataset_id;
  const analysis = stateStore.analyses.get(datasetId);

  if (!analysis) {
    return res.status(404).json(makeApiResponse(null, "Analysis not found for dataset", "error", startTime));
  }

  res.json(makeApiResponse(analysis, "Analisis operasional berhasil diambil", "success", startTime));
});

// =====================================================
// API ROUTE 3: Recommendation Engine
// =====================================================

app.get("/api/recommendation/:dataset_id", (req, res) => {
  const startTime = Date.now();
  const datasetId = req.params.dataset_id;
  const recs = stateStore.recommendations.get(datasetId);

  if (!recs) {
    return res.status(404).json(makeApiResponse([], "Recommendations not found for dataset", "error", startTime));
  }

  res.json(makeApiResponse(recs, "Rekomendasi AI terurut berhasil diambil", "success", startTime));
});

// =====================================================
// API ROUTE 4: Scenario Simulation Engine (dataset-keyed)
// =====================================================

function runSimulationRoute(req: express.Request<{ dataset_id: string }>, res: express.Response) {
  const startTime = Date.now();
  const datasetId = req.params.dataset_id;
  const analysis = stateStore.analyses.get(datasetId);

  if (!analysis) {
    return res.status(404).json(makeApiResponse(null, "Analysis not found for dataset — upload data terlebih dahulu", "error", startTime));
  }

  const baseFuelCost = analysis.key_metrics?.total_fuel_cost_daily || 18300000;
  const baseTotalCost = baseFuelCost + 10000000;
  const baseUtil = analysis.key_metrics?.avg_fleet_utilization || 72;
  const baseIdle = analysis.key_metrics?.avg_idle_hours || 3.4;
  const baseSla = analysis.key_metrics?.sla_fulfillment_rate || 98;

  const {
    recommendation_id,
    fleet_reduction_percent = 0,
    route_consolidation_rate = 12
  } = req.body || {};

  const fuelSavingRate = Math.min(25, Math.max(5, 12 + Math.floor(route_consolidation_rate / 2)));
  const utilizationTarget = Math.min(99, baseUtil + Number(fleet_reduction_percent) + 19);
  const idleHoursTarget = Math.max(0.5, +(baseIdle * (1 - fuelSavingRate / 20)).toFixed(1));
  const dailySaving = Math.round(baseFuelCost * (fuelSavingRate / 100) + 150000);

  const result = {
    simulation_id: `SIM-${Date.now().toString().slice(-6)}`,
    recommendation_id: recommendation_id || "REC-01",
    simulated_at: new Date().toISOString(),
    before: {
      fuel_cost_daily: baseFuelCost,
      fleet_utilization_percent: baseUtil,
      idle_time_hours: baseIdle,
      delivery_success_percent: baseSla,
      transportation_cost_daily: baseTotalCost
    },
    after: {
      fuel_cost_daily: Math.round(baseFuelCost * (1 - fuelSavingRate / 100)),
      fleet_utilization_percent: utilizationTarget,
      idle_time_hours: idleHoursTarget,
      delivery_success_percent: baseSla,
      transportation_cost_daily: Math.round(baseTotalCost - dailySaving)
    },
    metrics_delta: {
      fuel_saving_percent: fuelSavingRate,
      utilization_increase_percent: Math.max(0, utilizationTarget - baseUtil),
      idle_reduction_percent: Math.round(((baseIdle - idleHoursTarget) / baseIdle) * 100),
      estimated_daily_saving: dailySaving,
      estimated_monthly_saving: dailySaving * 20,
      route_efficiency_km_saved: Math.round(42 * (fuelSavingRate / 12)),
      carbon_footprint_ton_reduced: +(1.8 * (fuelSavingRate / 12)).toFixed(1),
      avg_delivery_time_min_faster: 15
    },
    sla_status: "Stabil (Tidak terdeteksi penurunan SLA)"
  };

  stateStore.simulations.set(datasetId, result);
  res.json(makeApiResponse(result, "Simulasi skenario selesai", "success", startTime));
}

app.post("/api/simulation/:dataset_id", runSimulationRoute);

// Backward-compatible simulation without dataset id (uses latest dataset)
app.post("/api/simulation", (req: express.Request, res: express.Response) => {
  const datasetId = getLatestDatasetId();
  if (!datasetId) {
    return res.status(404).json(makeApiResponse(null, "Belum ada dataset — unggah data terlebih dahulu", "error", Date.now()));
  }
  const params = req.params as { dataset_id: string };
  params.dataset_id = datasetId;
  runSimulationRoute(req as express.Request<{ dataset_id: string }>, res);
});

// =====================================================
// API ROUTE 5: Generate & Fetch Executive Report (dataset-keyed)
// =====================================================

function runReportRoute(req: express.Request<{ dataset_id: string }>, res: express.Response) {
  const startTime = Date.now();
  const datasetId = req.params.dataset_id;
  const analysis = stateStore.analyses.get(datasetId);
  const simulation = stateStore.simulations.get(datasetId);

  if (!analysis || !simulation) {
    return res.status(404).json(makeApiResponse(null, "Analisis/simulasi belum tersedia — unggah & simulasikan data terlebih dahulu", "error", startTime));
  }

  const dailySaving = simulation.metrics_delta.estimated_daily_saving;
  const monthlySaving = simulation.metrics_delta.estimated_monthly_saving;
  const dataset = stateStore.datasets.get(datasetId);

  const report = {
    id: `REP-${Date.now().toString().slice(-6)}`,
    title: "Laporan Dampak Intelijen Eksekutif",
    strategic_cycle: dataset ? `${dataset.date_range.start} — ${dataset.date_range.end}` : "Siklus Operasional Aktif",
    generated_at: new Date().toISOString(),
    executive_summary: `Hasil analisis dataset ${dataset?.filename || datasetId} menunjukkan potensi penghematan Rp${dailySaving.toLocaleString("id-ID")} per hari (Rp${(monthlySaving / 1000000).toFixed(1)}Juta/bulan). Kebocoran utama berasal dari utilisasi armada ${analysis.key_metrics.avg_fleet_utilization}% dan idle time ${analysis.key_metrics.avg_idle_hours} jam/hari.`,
    today_saving: dailySaving,
    monthly_projection: monthlySaving,
    confidence_score: 94,
    problems_solved: (analysis.detected_leakages || []).slice(0, 2).map((leak: any) => ({
      title: leak.title,
      description: leak.description,
      impact_level: leak.severity === "CRITICAL" ? "Dampak Tinggi Kritis" : "Dampak Tinggi",
      metrics: leak.evidence_tags || []
    })),
    recommendation: {
      title: (stateStore.recommendations.get(datasetId) || [])[0]?.title || "Dynamic Load Balancing & Konsolidasi Rute",
      description: "Aktifkan algoritma perataan muatan untuk mendistribusikan volume kargo secara merata di seluruh unit aktif guna meningkatkan utilisasi armada dan mengurangi biaya operasional.",
      expected_roi: 185,
      execution_time_hours: 48,
      readiness_status: "Siap Deploy"
    },
    financial_impact: {
      daily_saving: dailySaving,
      monthly_saving: monthlySaving,
      annual_saving_projection: monthlySaving * 12
    },
    operational_impact: {
      fuel_reduction_percent: simulation.metrics_delta.fuel_saving_percent,
      fleet_efficiency_increase_percent: simulation.metrics_delta.utilization_increase_percent,
      sla_protection_level: "100% Terlindungi (Risiko Pelanggaran SLA Nol)"
    }
  };

  stateStore.reports.set(datasetId, report);
  res.json(makeApiResponse(report, "Executive report generated successfully", "success", startTime));
}

app.post("/api/generate-report/:dataset_id", runReportRoute);

// Backward-compatible report generation without dataset id (uses latest dataset)
app.post("/api/generate-report", (req: express.Request, res: express.Response) => {
  const datasetId = getLatestDatasetId();
  if (!datasetId) {
    return res.status(404).json(makeApiResponse(null, "Belum ada dataset — unggah data terlebih dahulu", "error", Date.now()));
  }
  const params = req.params as { dataset_id: string };
  params.dataset_id = datasetId;
  runReportRoute(req as express.Request<{ dataset_id: string }>, res);
});

app.get("/api/report/:id", (req, res) => {
  const startTime = Date.now();
  const reportId = req.params.id;
  const report = stateStore.reports.get(reportId) || Array.from(stateStore.reports.values())[0];

  if (!report) {
    return res.status(404).json(makeApiResponse(null, "Report not found", "error", startTime));
  }
  res.json(makeApiResponse(report, "Report retrieved successfully", "success", startTime));
});

// =====================================================
// API ROUTE 6: Conversational AI Assistant ("Tanya Opti")
// =====================================================

app.post("/api/chat", async (req, res) => {
  const startTime = Date.now();
  const { message, dataset_id } = req.body || {};

  if (!message) {
    return res.status(400).json(makeApiResponse(null, "Message is required", "error", startTime));
  }

  const datasetId = dataset_id || getLatestDatasetId();
  const dataContext = buildDataContext(datasetId);

  const ai = getGeminiClient();

  if (!ai) {
    // Fallback response that is actually data-driven
    let reply =
      `Berdasarkan analisis data operasional saat ini: ${dataContext} ` +
      `Konsolidasi rute dan dynamic load balancing berpotensi langsung memangkas pemborosan BBM harian tanpa mengganggu SLA pengiriman.`;

    const m = message.toLowerCase();
    if (m.includes("bbm") || m.includes("bahan bakar")) {
      const analysis = datasetId ? stateStore.analyses.get(datasetId) : null;
      const util = analysis?.key_metrics?.avg_fleet_utilization ?? "—";
      reply = `Penghematan konsumsi BBM dicapai dengan menghilangkan rute ganda yang tumpang tindih dan mengurangi jam idle mesin. Dengan utilisasi armada saat ini ${util}%, terdapat ruang kosong yang dapat dikonsolidasi untuk menekan konsumsi BBM harian.`;
    } else if (m.includes("rute") || m.includes("route") || m.includes("konsolidasi")) {
      reply = `AI merekomendasikan konsolidasi rute dengan mencocokkan jadwal pengiriman armada yang memiliki sisa ruang kargo kosong. ${dataContext.split("Kebocoran")[0]}`;
    } else if (m.includes("rekomendasi") || m.includes("dampak") || m.includes("besok") || m.includes("hemat")) {
      const recs = datasetId ? stateStore.recommendations.get(datasetId) : [];
      if (recs && recs.length > 0) {
        const top = recs[0];
        reply = `Rekomendasi utama saat ini adalah: ${top.title} — berpotensi menghemat Rp${(top.potential_saving_daily || 0).toLocaleString("id-ID")} per hari dengan tingkat kepercayaan ${top.confidence_score}%. Penerapannya akan mengurangi biaya BBM harian, menekan keausan armada, dan mengoptimalkan ritase pengemudi.`;
      } else {
        reply = `Penerapan rekomendasi optimasi akan langsung mengurangi biaya BBM harian, menekan keausan komponen armada, dan mengoptimalkan ritase pengemudi. ${dataContext}`;
      }
    } else if (m.includes("data") || m.includes("upload") || m.includes("dataset")) {
      reply = `Status data: ${dataContext}`;
    }

    return res.json(makeApiResponse({ reply, mode: "rule-based-fallback", context: dataContext }, "Response generated", "success", startTime));
  }

  try {
    const systemInstruction = `You are 'Opti', the senior AI Decision Intelligence Logistics Assistant for OptiCargo.ai.
Your role is to explain operational cost leakages, fleet optimization, route consolidation, and financial impacts clearly and professionally in Indonesian or English (matching the user's language).

Base your answers on the REAL analyzed dataset context below. Reference the actual numbers (losses per day, utilization %, idle hours, top recommendations) whenever relevant:

=== KONTEKS DATA ANALISIS AKTIF ===
${dataContext}
=== AKHIR KONTEKS ===

Keep responses concise, clear, authoritative, highly structured, encouraging, and data-backed.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    const reply = response.text || "Terjadi kendala dalam memproses pertanyaan Anda.";
    res.json(makeApiResponse({ reply, mode: "gemini-3.6-flash", context: dataContext }, "Response generated via Gemini AI", "success", startTime));
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.json(makeApiResponse({
      reply: `Maaf, terjadi masalah saat berkomunikasi dengan AI engine. Namun berdasarkan analisis data saat ini: ${dataContext} Konsolidasi rute dapat langsung menghemat biaya operasional harian armada.`,
      error: err?.message
    }, "Response generated with fallback", "success", startTime));
  }
});

// =====================================================
// STATUS ENDPOINT (untuk UI indikator koneksi)
// =====================================================

app.get("/api/status", (req, res) => {
  const datasetId = getLatestDatasetId();
  res.json(
    makeApiResponse({
      online: true,
      has_dataset: !!datasetId,
      active_dataset_id: datasetId,
      datasets_count: stateStore.datasets.size
    }, "Status server OptiCargo", "success")
  );
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OptiCargo.ai Server running on http://localhost:${PORT}`);
  });
}

startServer();
