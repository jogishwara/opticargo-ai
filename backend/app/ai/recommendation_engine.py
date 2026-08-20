from typing import List, Dict, Any


class RecommendationEngine:

    @staticmethod
    def generate_recommendations(
        leakages: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:

        recommendations = []

        rank = 1

        for leakage in sorted(
            leakages,
            key=lambda x: x["financial_loss_daily"],
            reverse=True
        ):

            category = leakage["category"]

            if category == "Route Overlap":

                title = "Optimalkan dan Gabungkan Rute"

                description = (
                    "Gabungkan rute yang saling overlap "
                    "untuk mengurangi konsumsi BBM."
                )

                difficulty = "Sedang"

                eta = 30

            elif category == "Fleet Underutilization":

                title = "Optimasi Kapasitas Armada"

                description = (
                    "Redistribusi muatan agar seluruh armada "
                    "memiliki load factor optimal."
                )

                difficulty = "Mudah"

                eta = 20

            elif category == "Idle Time":

                title = "Kurangi Waktu Idle Gudang"

                description = (
                    "Perbaiki jadwal loading dan unloading "
                    "untuk mengurangi bottleneck."
                )

                difficulty = "Sedang"

                eta = 40

            else:

                title = "Optimasi Operasional"

                description = "AI merekomendasikan optimasi."

                difficulty = "Sedang"

                eta = 30

            daily = leakage["financial_loss_daily"]

            monthly = leakage["financial_loss_monthly"]

            recommendations.append({

                "id": f"REC-{rank:02d}",

                "dataset_id": "DS-AUTO",

                "rank": rank,

                "title": title,

                "description": description,

                "potential_saving_daily": daily,

                "potential_saving_monthly": monthly,

                "confidence_score": leakage["confidence_score"],

                "difficulty": difficulty,

                "estimated_time_minutes": eta,

                "expected_sla_impact": "No Impact",

                "business_reason": leakage["explanation"],

                "priority": leakage["severity"],

                "status": "PENDING"

            })

            rank += 1

        return recommendations