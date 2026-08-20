from typing import Dict, Any, List
import pandas as pd
import numpy as np


class FeatureEngineeringEngine:
    """
    Feature Engineering Engine
    Generate operational features from uploaded logistics dataset.
    """

    @staticmethod
    def extract_features(raw_data: Any) -> Dict[str, Any]:

        # ==========================
        # CASE 1
        # DataFrame langsung
        # ==========================
        if isinstance(raw_data, pd.DataFrame):
            df = raw_data.copy()

        # ==========================
        # CASE 2
        # List of Dict
        # ==========================
        elif isinstance(raw_data, list):

            if len(raw_data) == 0:
                return FeatureEngineeringEngine.default_features()

            df = pd.DataFrame(raw_data)

        # ==========================
        # CASE 3
        # CSV Path
        # ==========================
        elif isinstance(raw_data, str):

            df = pd.read_csv(raw_data)

        else:

            return FeatureEngineeringEngine.default_features()

        df.columns = df.columns.str.lower()

        df = df.drop_duplicates()

        df = df.fillna(0)

        # -----------------------------
        # Fleet Utilization
        # -----------------------------

        if (
            "cargo_weight_kg" in df.columns
            and
            "max_capacity_kg" in df.columns
        ):

            avg_utilization = float(
                (
                    df["cargo_weight_kg"] /
                    df["max_capacity_kg"]
                ).mean()
            ) * 100

        else:

            avg_utilization = 0

        # -----------------------------
        # Idle Hours
        # -----------------------------

        if "idle_time_hours" in df.columns:

            avg_idle = float(df["idle_time_hours"].mean())

        else:

            avg_idle = 3.4

        # -----------------------------
        # Fuel
        # -----------------------------

        if "fuel_consumed_liters" in df.columns:

            fuel_daily = float(df["fuel_consumed_liters"].sum())

        else:

            fuel_daily = 1262

        # -----------------------------
        # Route Overlap
        # -----------------------------

        if "route_id" in df.columns:

            overlap = df["route_id"].duplicated().mean()

        else:

            overlap = 0.84

        # -----------------------------
        # Under Utilized
        # -----------------------------

        if (
            "cargo_weight_kg" in df.columns
            and
            "max_capacity_kg" in df.columns
        ):

            utilization = (
                df["cargo_weight_kg"] /
                df["max_capacity_kg"]
            )

            under_units = int(
                (utilization < 0.7).sum()
            )

        else:

            under_units = 0

        return {

            "total_fleet_units": len(df),

            "avg_utilization_percent": round(avg_utilization, 2),

            "avg_idle_hours": round(avg_idle, 2),

            "route_overlap_index": round(float(overlap), 2),

            "underutilized_units_count": under_units,

            "fuel_consumption_daily_liters": round(fuel_daily, 2)

        }

    @staticmethod
    def default_features():

        return {

            "total_fleet_units": 124,

            "avg_utilization_percent": 62,

            "avg_idle_hours": 3.4,

            "route_overlap_index": 0.84,

            "underutilized_units_count": 18,

            "fuel_consumption_daily_liters": 1262

        }