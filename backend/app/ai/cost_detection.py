from typing import Dict, Any, List
from app.ai.business_rules import (
    MIN_CAPACITY_UTILIZATION_THRESHOLD,
    MAX_ALLOWABLE_IDLE_HOURS,
    FUEL_COST_PER_LITER_IDR,
    DRIVER_SHIFT_DAILY_COST_IDR,
    VEHICLE_MAINTENANCE_PRORATED_IDR
)


class CostLeakageDetector:

    @staticmethod
    def detect_leakages(features: Dict[str, Any]) -> List[Dict[str, Any]]:

        leakages = []

        utilization = features.get("avg_utilization_percent", 0)
        idle = features.get("avg_idle_hours", 0)
        overlap = features.get("route_overlap_index", 0)
        fleet = features.get("total_fleet_units", 0)
        fuel = features.get("fuel_consumption_daily_liters", 0)

        # ==============================
        # Route Overlap
        # ==============================

        if overlap >= 0.50:

            daily_loss = int(
                fuel * FUEL_COST_PER_LITER_IDR * overlap * 0.10
            )

            leakages.append({

                "id": "LEAK-01",

                "category": "Route Overlap",

                "title": "Duplicate Distribution Route",

                "description": "AI menemukan beberapa armada melewati koridor yang sama.",

                "severity": "CRITICAL" if overlap > 0.80 else "HIGH",

                "financial_loss_daily": daily_loss,

                "financial_loss_monthly": daily_loss * 20,

                "confidence_score": round(overlap * 100,1),

                "affected_assets": fleet,

                "explanation": "Overlap rute menyebabkan konsumsi BBM dan biaya operasional meningkat.",

                "evidence_tags": [

                    "GPS",

                    "Route",

                    "Overlap"

                ]

            })

        # ==============================
        # Under Utilization
        # ==============================

        if utilization < MIN_CAPACITY_UTILIZATION_THRESHOLD * 100:

            gap = (MIN_CAPACITY_UTILIZATION_THRESHOLD*100) - utilization

            daily_loss = int(

                DRIVER_SHIFT_DAILY_COST_IDR *

                (gap/100)

            )

            leakages.append({

                "id":"LEAK-02",

                "category":"Fleet Underutilization",

                "title":"Truck Capacity Underused",

                "description":"AI mendeteksi utilisasi armada masih rendah.",

                "severity":"HIGH",

                "financial_loss_daily":daily_loss,

                "financial_loss_monthly":daily_loss*20,

                "confidence_score":95,

                "affected_assets":features["underutilized_units_count"],

                "explanation":"Masih terdapat kapasitas kosong pada armada.",

                "evidence_tags":[

                    "Load Factor",

                    "Capacity"

                ]

            })

        # ==============================
        # Idle Time
        # ==============================

        if idle > MAX_ALLOWABLE_IDLE_HOURS:

            idle_loss = int(

                VEHICLE_MAINTENANCE_PRORATED_IDR *

                idle *

                fleet

            )

            leakages.append({

                "id":"LEAK-03",

                "category":"Idle Time",

                "title":"Warehouse Bottleneck",

                "description":"Armada terlalu lama menunggu loading.",

                "severity":"MEDIUM",

                "financial_loss_daily":idle_loss,

                "financial_loss_monthly":idle_loss*20,

                "confidence_score":92,

                "affected_assets":fleet,

                "explanation":"Idle time tinggi menyebabkan biaya operasional meningkat.",

                "evidence_tags":[

                    "Idle",

                    "Warehouse"

                ]

            })

        return leakages