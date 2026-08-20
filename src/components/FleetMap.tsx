import React, { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  MapPin,
  Truck,
  Navigation,
  Search,
  Pause,
  LocateFixed,
} from "lucide-react";

import { FleetAsset } from "../types";

// ======================================================
// TYPE
// ======================================================

type FleetStatus = "moving" | "idle" | "critical";

interface FleetVehicle {
  id: string;
  driver: string;
  origin: string;
  destination: string;
  lat: number;
  lng: number;
  status: FleetStatus;
  speed: number;
  fuel: number;
  route: string;
}

// ======================================================
// FALLBACK DATA (hanya dipakai bila tidak ada fleet_assets)
// ======================================================

const fallbackFleet: FleetVehicle[] = [
  {
    id: "B 9122 UXX",
    driver: "Andi",
    origin: "Gudang West",
    destination: "Grogol",
    lat: -6.166,
    lng: 106.79,
    status: "moving",
    speed: 42,
    fuel: 76,
    route: "Route A",
  },
  {
    id: "B 8211 PAA",
    driver: "Budi",
    origin: "Gudang West",
    destination: "Petamburan",
    lat: -6.201,
    lng: 106.814,
    status: "moving",
    speed: 35,
    fuel: 61,
    route: "Route A",
  },
  {
    id: "B 7720 KKA",
    driver: "Candra",
    origin: "Gudang Central",
    destination: "Grogol",
    lat: -6.176,
    lng: 106.825,
    status: "idle",
    speed: 0,
    fuel: 48,
    route: "Route C",
  },
  {
    id: "Truck-04",
    driver: "Dedi",
    origin: "Warehouse West",
    destination: "Central Hub",
    lat: -6.229,
    lng: 106.797,
    status: "critical",
    speed: 12,
    fuel: 27,
    route: "Route C",
  },
  {
    id: "Truck-02",
    driver: "Eko",
    origin: "Gudang West",
    destination: "Bekasi",
    lat: -6.238,
    lng: 106.991,
    status: "moving",
    speed: 51,
    fuel: 84,
    route: "Route A",
  },
];

// ======================================================
// HELPERS: ubah FleetAsset (dataset customer) -> FleetVehicle
// ======================================================

function mapStatus(status: FleetAsset["status"]): FleetStatus {
  if (status === "OVERLAP") return "critical";
  if (status === "IDLE" || status === "STOPPED") return "idle";
  return "moving";
}

function estimateFuelPercent(asset: FleetAsset): number {
  // Estimasi sisa BBM dari konsumsi liter (heuristik visual)
  return Math.max(15, Math.min(95, Math.round(100 - asset.fuel_consumed_liters * 2)));
}

function assetToVehicle(asset: FleetAsset): FleetVehicle {
  return {
    id: asset.vehicle_id,
    driver: asset.driver_name,
    origin: asset.origin_name,
    destination: asset.destination_name,
    lat: asset.lat,
    lng: asset.lng,
    status: mapStatus(asset.status),
    speed: asset.speed_kmh,
    fuel: estimateFuelPercent(asset),
    route: asset.route_id,
  };
}

// ======================================================
// MARKER ICON
// ======================================================

const createTruckIcon = (status: FleetStatus) => {
  let background = "#22c55e";

  if (status === "idle") {
    background = "#f59e0b";
  }

  if (status === "critical") {
    background = "#ef4444";
  }

  return L.divIcon({
    className: "custom-truck-marker",
    html: `
      <div
        style="
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: ${background};
          border: 4px solid white;
          box-shadow: 0 4px 14px rgba(0,0,0,.35);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:20px;
        "
      >
        🚚
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -20],
  });
};

// ======================================================
// CENTER MAP
// ======================================================

const MapController = ({ vehicle }: { vehicle: FleetVehicle | null }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!vehicle) return;

    map.flyTo([vehicle.lat, vehicle.lng], 13, {
      duration: 1.2,
    });
  }, [vehicle, map]);

  return null;
};

// ======================================================
// STATUS HELPERS
// ======================================================

const getStatusLabel = (status: FleetStatus) => {
  if (status === "moving") return "Bergerak";
  if (status === "idle") return "Idle";
  return "Overlap Kritis";
};

const getStatusColor = (status: FleetStatus) => {
  if (status === "moving") return "#22c55e";
  if (status === "idle") return "#f59e0b";
  return "#ef4444";
};

// ======================================================
// MAIN COMPONENT
// ======================================================

interface FleetMapProps {
  fleetAssets?: FleetAsset[] | null;
}

export const FleetMap: React.FC<FleetMapProps> = ({ fleetAssets }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | FleetStatus>("all");

  const fleetData = useMemo<FleetVehicle[]>(() => {
    if (fleetAssets && fleetAssets.length > 0) {
      return fleetAssets.map(assetToVehicle);
    }
    return fallbackFleet;
  }, [fleetAssets]);

  const filteredFleet = useMemo(() => {
    return fleetData.filter((vehicle) => {
      const matchesFilter = filter === "all" || vehicle.status === filter;

      const matchesSearch =
        vehicle.id.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.driver.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.destination.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [filter, search, fleetData]);

  const movingCount = fleetData.filter((v) => v.status === "moving").length;
  const idleCount = fleetData.filter((v) => v.status === "idle").length;
  const criticalCount = fleetData.filter((v) => v.status === "critical").length;

  // Simpel polyline: rute dari asal ke tujuan untuk armada terpilih
  const selectedRoutePositions = useMemo(() => {
    if (!selectedVehicle) return null;

    const asset = fleetAssets?.find((a) => a.vehicle_id === selectedVehicle.id);

    if (asset) {
      return [
        [asset.origin_lat, asset.origin_lng] as [number, number],
        [asset.lat, asset.lng] as [number, number],
        [asset.destination_lat, asset.destination_lng] as [number, number],
      ];
    }

    return [
      [selectedVehicle.lat, selectedVehicle.lng] as [number, number],
      [selectedVehicle.lat + 0.02, selectedVehicle.lng + 0.02] as [number, number],
    ];
  }, [selectedVehicle, fleetAssets]);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#050816] shadow-2xl">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="border-b border-slate-800 px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-600/20">
              <Navigation className="h-6 w-6 text-indigo-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Visualisasi Telemetri Armada GPS Live
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {fleetAssets && fleetAssets.length > 0
                  ? "Posisi armada dari dataset customer (koordinat GPS telemetri)"
                  : "Tampilan peta & visualisasi rute GPS customer eksternal"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">Satelit Real-Time</span>
            </div>

            <div className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white">
              🗺 OpenStreetMap
            </div>
          </div>
        </div>

        {/* SEARCH */}

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nopol / driver / tujuan..."
              className="w-full rounded-lg border border-slate-700 bg-[#0d1426] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          <button
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 text-slate-300 transition hover:bg-slate-700"
            onClick={() => setSelectedVehicle(null)}
            title="Kembali ke tampilan penuh"
          >
            <Pause size={18} />
          </button>
        </div>

        {/* FILTER */}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
              filter === "all"
                ? "border-indigo-500 bg-indigo-600 text-white"
                : "border-slate-700 bg-slate-900 text-slate-400"
            }`}
          >
            Semua ({fleetData.length})
          </button>

          <button
            onClick={() => setFilter("moving")}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
              filter === "moving"
                ? "border-green-500 bg-green-600 text-white"
                : "border-slate-700 bg-slate-900 text-slate-400"
            }`}
          >
            🟢 Bergerak ({movingCount})
          </button>

          <button
            onClick={() => setFilter("idle")}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
              filter === "idle"
                ? "border-yellow-500 bg-yellow-600 text-white"
                : "border-slate-700 bg-slate-900 text-slate-400"
            }`}
          >
            🟡 Idle ({idleCount})
          </button>

          <button
            onClick={() => setFilter("critical")}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
              filter === "critical"
                ? "border-red-500 bg-red-600 text-white"
                : "border-slate-700 bg-slate-900 text-slate-400"
            }`}
          >
            🔴 Overlap Kritis ({criticalCount})
          </button>
        </div>
      </div>

      {/* ==================================================
          MAP + SIDEBAR
      ================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_330px]">
        {/* MAP */}

        <div className="relative h-[600px]">
          <MapContainer
            center={[-6.2, 106.82]}
            zoom={11}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController vehicle={selectedVehicle} />

            {/* ROUTE LINE untuk armada terpilih */}

            {selectedRoutePositions && (
              <Polyline
                positions={selectedRoutePositions}
                pathOptions={{
                  color: "#6366f1",
                  weight: 4,
                  opacity: 0.7,
                  dashArray: "8 8",
                }}
              />
            )}

            {/* VEHICLE MARKERS */}

            {filteredFleet.map((vehicle) => (
              <Marker
                key={vehicle.id}
                position={[vehicle.lat, vehicle.lng]}
                icon={createTruckIcon(vehicle.status)}
                eventHandlers={{
                  click: () => setSelectedVehicle(vehicle),
                }}
              >
                <Popup>
                  <div className="min-w-[220px]">
                    <h3 className="text-lg font-bold">{vehicle.id}</h3>
                    <p>Driver: {vehicle.driver}</p>
                    <p>Tujuan: {vehicle.destination}</p>
                    <p>Kecepatan: {vehicle.speed} km/h</p>
                    <p>BBM: {vehicle.fuel}%</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* LEGEND */}

          <div className="absolute bottom-5 left-5 z-[1000] rounded-xl border border-slate-700 bg-[#080d1c]/95 px-4 py-3 shadow-xl">
            <div className="flex gap-4 text-xs text-slate-300">
              <span>🟢 Moving</span>
              <span>🟡 Idle</span>
              <span>🔴 Critical</span>
            </div>
          </div>

          {/* CENTER BUTTON */}

          <button
            onClick={() => setSelectedVehicle(null)}
            className="absolute top-5 right-5 z-[1000] rounded-xl border border-slate-700 bg-[#080d1c]/95 p-3 text-white transition hover:bg-indigo-600"
            title="Reset peta"
          >
            <LocateFixed size={18} />
          </button>
        </div>

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <div className="border-l border-slate-800 bg-[#060b18] p-5">
          {selectedVehicle ? (
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{ background: getStatusColor(selectedVehicle.status) }}
                >
                  <Truck className="text-white" size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-white">{selectedVehicle.id}</h3>
                  <p className="text-xs text-slate-500">{selectedVehicle.driver}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Info label="Status" value={getStatusLabel(selectedVehicle.status)} />
                <Info label="Rute" value={selectedVehicle.route} />
                <Info label="Asal" value={selectedVehicle.origin} />
                <Info label="Tujuan" value={selectedVehicle.destination} />
                <Info label="Kecepatan" value={`${selectedVehicle.speed} km/h`} />
                <Info label="BBM" value={`${selectedVehicle.fuel}%`} />
              </div>
            </div>
          ) : (
            <div>
              <div className="py-8 text-center">
                <MapPin className="mx-auto mb-3 text-slate-600" size={35} />
                <p className="text-sm text-slate-400">Pilih salah satu marker truk di peta</p>
                <p className="mt-1 text-xs text-slate-600">untuk melihat detail telemetri armada</p>
              </div>
            </div>
          )}

          {/* FLEET LIST */}

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase text-slate-300">Daftar Armada Aktif</h3>
              <span className="text-xs text-slate-500">{filteredFleet.length}</span>
            </div>

            <div className="space-y-2">
              {filteredFleet.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="w-full rounded-xl border border-slate-800 bg-[#0d1426] p-3 text-left transition hover:border-indigo-500"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{vehicle.id}</p>
                      <p className="text-[11px] text-slate-500">{vehicle.destination}</p>
                    </div>

                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: getStatusColor(vehicle.status) }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// INFO COMPONENT
// ======================================================

const Info = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-800 pb-2">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-right text-xs font-bold text-slate-200">{value}</span>
    </div>
  );
};

export default FleetMap;