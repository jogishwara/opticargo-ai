from typing import Dict, Any

from app.ai.business_rules import (
    DEFAULT_FUEL_COST,
    DEFAULT_TRANSPORT_COST,
    DEFAULT_UTILIZATION,
    DEFAULT_IDLE_TIME,
    DEFAULT_DELIVERY_SLA,
    MAX_FUEL_SAVING_PERCENT,
    MIN_FUEL_SAVING_PERCENT,
    REPORT_WORKING_DAYS
)


class ScenarioSimulationEngine:
    """
    AI Scenario Simulation Engine
    Simulates operational improvements after recommendations.
    """

    @staticmethod
    def run_simulation(
        recommendation_id: str,
        fleet_reduction_percent: float = 0,
        route_consolidation_rate: float = 10
    ) -> Dict[str, Any]:

        fuel_before = DEFAULT_FUEL_COST
        transport_before = DEFAULT_TRANSPORT_COST
        utilization_before = DEFAULT_UTILIZATION
        idle_before = DEFAULT_IDLE_TIME
        sla_before = DEFAULT_DELIVERY_SLA

        fuel_saving_percent = min(
            MAX_FUEL_SAVING_PERCENT,
            max(
                MIN_FUEL_SAVING_PERCENT,
                10 + route_consolidation_rate * 0.6
            )
        )

        fuel_after = int(
            fuel_before * (1 - fuel_saving_percent / 100)
        )

        transport_after = int(
            transport_before * (1 - fuel_saving_percent / 120)
        )

        utilization_after = min(
            99.0,
            utilization_before +
            fleet_reduction_percent +
            10
        )

        idle_after = max(
            0.5,
            round(
                idle_before *
                (1 - fuel_saving_percent / 100),
                2
            )
        )

        daily_saving = transport_before - transport_after

        monthly_saving = (
            daily_saving *
            REPORT_WORKING_DAYS
        )

        return {

            "simulation_id": f"SIM-{recommendation_id}",

            "recommendation_id": recommendation_id,

            "before": {

                "fuel_cost_daily": fuel_before,

                "fleet_utilization_percent": utilization_before,

                "idle_time_hours": idle_before,

                "delivery_success_percent": sla_before,

                "transportation_cost_daily": transport_before

            },

            "after": {

                "fuel_cost_daily": fuel_after,

                "fleet_utilization_percent": round(
                    utilization_after,
                    1
                ),

                "idle_time_hours": idle_after,

                "delivery_success_percent": sla_before,

                "transportation_cost_daily": transport_after

            },

            "metrics_delta": {

                "fuel_saving_percent":
                    round(
                        fuel_saving_percent,
                        1
                    ),

                "utilization_increase_percent":
                    round(
                        utilization_after -
                        utilization_before,
                        1
                    ),

                "idle_reduction_percent":
                    round(
                        (
                            (idle_before - idle_after)
                            / idle_before
                        ) * 100,
                        1
                    ),

                "estimated_daily_saving":
                    daily_saving,

                "estimated_monthly_saving":
                    monthly_saving,

                "route_efficiency_km_saved":
                    int(
                        42 *
                        fuel_saving_percent /
                        10
                    ),

                "carbon_footprint_ton_reduced":
                    round(
                        1.8 *
                        fuel_saving_percent /
                        10,
                        2
                    ),

                "avg_delivery_time_min_faster":
                    int(
                        fuel_saving_percent *
                        1.5
                    )

            },

            "sla_status": "Stable"

        }