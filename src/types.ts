export interface DatasetSummary {
  dataset_id: string;
  filename: string;
  upload_timestamp: string;
  total_records: number;
  valid_records: number;
  invalid_records: number;
  duplicate_rows: number;
  date_range: { start: string; end: string };
  vehicles_count: number;
  routes_count: number;
  warehouses_count: number;
  validation_issues: string[];
}

export interface CostLeakageItem {
  id: string;
  category: string; // e.g. "Underutilized Fleet", "Route Overlap", "Idle Loading Time"
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  financial_loss_daily: number;
  financial_loss_monthly: number;
  confidence_score: number; // 0 - 100%
  affected_assets: string[];
  explanation: string;
  evidence_tags: string[];
}

export interface FleetAsset {
  id: string;
  vehicle_id: string;
  driver_name: string;
  route_id: string;
  status: 'MOVING' | 'IDLE' | 'OVERLAP' | 'STOPPED';
  lat: number;
  lng: number;
  origin_name: string;
  origin_lat: number;
  origin_lng: number;
  destination_name: string;
  destination_lat: number;
  destination_lng: number;
  speed_kmh: number;
  heading: number;
  cargo_weight_kg: number;
  max_capacity_kg: number;
  utilization_percent: number;
  fuel_consumed_liters: number;
  idle_time_hours: number;
}

export interface OperationalAnalysis {
  dataset_id: string;
  analyzed_at: string;
  overall_health_score: number;
  total_daily_loss: number;
  total_monthly_loss: number;
  detected_leakages: CostLeakageItem[];
  fleet_assets?: FleetAsset[];
  key_metrics: {
    avg_fleet_utilization: number;
    avg_idle_hours: number;
    total_fuel_cost_daily: number;
    sla_fulfillment_rate: number;
  };
}

export interface Recommendation {
  id: string;
  dataset_id: string;
  rank: number;
  title: string;
  description: string;
  potential_saving_daily: number;
  potential_saving_monthly: number;
  confidence_score: number; // e.g. 97
  difficulty: "Mudah" | "Sedang" | "Sangat Sulit" | "Easy" | "Medium" | "Hard";
  estimated_time_minutes: number;
  expected_sla_impact: string;
  business_reason: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "SIMULATED" | "DEPLOYED";
}

export interface SimulationParams {
  recommendation_id?: string;
  dataset_id?: string;
  fleet_reduction_percent?: number;
  route_consolidation_rate?: number;
  speed_optimization_factor?: number;
}

export interface SimulationResult {
  simulation_id: string;
  recommendation_id: string;
  simulated_at: string;
  before: {
    fuel_cost_daily: number;
    fleet_utilization_percent: number;
    idle_time_hours: number;
    delivery_success_percent: number;
    transportation_cost_daily: number;
  };
  after: {
    fuel_cost_daily: number;
    fleet_utilization_percent: number;
    idle_time_hours: number;
    delivery_success_percent: number;
    transportation_cost_daily: number;
  };
  metrics_delta: {
    fuel_saving_percent: number;
    utilization_increase_percent: number;
    idle_reduction_percent: number;
    estimated_daily_saving: number;
    estimated_monthly_saving: number;
    route_efficiency_km_saved: number;
    carbon_footprint_ton_reduced: number;
    avg_delivery_time_min_faster: number;
  };
  sla_status: string;
}

export interface ExecutiveReportData {
  id: string;
  title: string;
  strategic_cycle: string;
  generated_at: string;
  executive_summary: string;
  today_saving: number;
  monthly_projection: number;
  confidence_score: number;
  problems_solved: Array<{
    title: string;
    description: string;
    impact_level: string;
    metrics: string[];
  }>;
  recommendation: {
    title: string;
    description: string;
    expected_roi: number;
    execution_time_hours: number;
    readiness_status: string;
  };
  financial_impact: {
    daily_saving: number;
    monthly_saving: number;
    annual_saving_projection: number;
  };
  operational_impact: {
    fuel_reduction_percent: number;
    fleet_efficiency_increase_percent: number;
    sla_protection_level: string;
  };
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
  metadata: {
    timestamp: string;
    version: string;
    engine_mode: string;
  };
  processing_time_ms: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "opti";
  text: string;
  timestamp: string;
}
