const API_URL = "/api";

async function readJsonOrText(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function requestJson(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, init);
  const body = await readJsonOrText(res);
  if (!res.ok) {
    const message = body?.message || body?.data?.validation?.message || body?.data?.validation?.reasons?.[0] || `HTTP ${res.status}`;
    const error: any = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }
  return body;
}

// Reads a text file (CSV / JSON / TXT) into a string. XLSX (binary) is not
// supported by the browser-side parser and will be rejected with a clear message.
export async function readFileAsText(file: File): Promise<string> {
  const name = (file.name || "").toLowerCase();
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    throw new Error("Format XLSX belum didukung. Silakan ekspor file Anda ke CSV lalu unggah kembali.");
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsText(file);
  });
}

export async function uploadDataset(file: File) {
  const rawContent = await readFileAsText(file);

  return requestJson(`${API_URL}/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      rawContent,
    }),
  });
}

export async function getAnalysis(datasetId: string) {
  return requestJson(`${API_URL}/analysis/${datasetId}`);
}

export async function getRecommendations(datasetId: string) {
  return requestJson(`${API_URL}/recommendation/${datasetId}`);
}

export async function runSimulation(datasetId: string, params?: {
  fleet_reduction_percent?: number;
  route_consolidation_rate?: number;
}) {
  return requestJson(`${API_URL}/simulation/${datasetId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params || {}),
  });
}

export async function generateReport(datasetId: string) {
  return requestJson(`${API_URL}/generate-report/${datasetId}`, {
    method: "POST",
  });
}

export async function getServerStatus() {
  try {
    const res = await fetch(`${API_URL}/status`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
