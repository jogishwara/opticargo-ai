from fastapi import (
    FastAPI,
    HTTPException,
    UploadFile,
    File,
    WebSocket,
    WebSocketDisconnect,
    Body
)

from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
from datetime import datetime
import time
import asyncio
import pandas as pd

from app.core.config import settings
from app.schemas.response import StandardResponse
from app.schemas.dataset import DatasetSummarySchema

from app.ai.feature_engineering import FeatureEngineeringEngine
from app.ai.cost_detection import CostLeakageDetector
from app.ai.recommendation_engine import RecommendationEngine
from app.ai.simulation_engine import ScenarioSimulationEngine


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="""
    OptiCargo.ai Decision Intelligence Backend Engine.

    Features:
    - Dataset upload
    - Operational analysis
    - AI recommendation
    - Scenario simulation
    - Executive report
    - Real-time driver GPS telemetry
    """
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:30001",
        "http://127.0.0.1:30001",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# EXISTING STORAGE
# ============================================================

DATASETS_STORE: Dict[str, Any] = {}
ANALYSES_STORE: Dict[str, Any] = {}
SIMULATION_STORE: Dict[str, Any] = {}
REPORTS_STORE: Dict[str, Any] = {}


# ============================================================
# REAL-TIME DRIVER STORAGE
# ============================================================

DRIVERS_STORE: Dict[str, Dict[str, Any]] = {}

CONNECTED_CLIENTS: List[WebSocket] = []


# ============================================================
# DEFAULT DATASET — intentionally empty; user uploads at runtime
# ============================================================


# ============================================================
# DEFAULT DRIVER DATA
# ============================================================

DRIVERS_STORE = {

    "DRV-001": {
        "driver_id": "DRV-001",
        "driver_name": "Budi Santoso",
        "vehicle_id": "TRK-001",
        "vehicle_type": "Truck",
        "status": "moving",

        "latitude": -6.175110,
        "longitude": 106.865036,

        "speed": 42,
        "heading": 90,

        "route_id": "R-JKT-001",
        "warehouse": "WH-Jakarta",

        "fuel_level": 78,
        "load_percentage": 72,

        "last_update": datetime.utcnow().isoformat()
    },

    "DRV-002": {
        "driver_id": "DRV-002",
        "driver_name": "Andi Wijaya",
        "vehicle_id": "TRK-002",
        "vehicle_type": "Truck",
        "status": "moving",

        "latitude": -6.208763,
        "longitude": 106.845599,

        "speed": 35,
        "heading": 180,

        "route_id": "R-JKT-002",
        "warehouse": "WH-Jakarta",

        "fuel_level": 65,
        "load_percentage": 84,

        "last_update": datetime.utcnow().isoformat()
    },

    "DRV-003": {
        "driver_id": "DRV-003",
        "driver_name": "Rizky Pratama",
        "vehicle_id": "TRK-003",
        "vehicle_type": "Van",
        "status": "idle",

        "latitude": -6.229728,
        "longitude": 106.689431,

        "speed": 0,
        "heading": 0,

        "route_id": "R-JKT-003",
        "warehouse": "WH-Tangerang",

        "fuel_level": 91,
        "load_percentage": 45,

        "last_update": datetime.utcnow().isoformat()
    },

    "DRV-004": {
        "driver_id": "DRV-004",
        "driver_name": "Fajar Hidayat",
        "vehicle_id": "TRK-004",
        "vehicle_type": "Truck",

        "status": "moving",

        "latitude": -6.238270,
        "longitude": 106.975570,

        "speed": 48,
        "heading": 270,

        "route_id": "R-BKS-001",
        "warehouse": "WH-Bekasi",

        "fuel_level": 54,
        "load_percentage": 91,

        "last_update": datetime.utcnow().isoformat()
    },

    "DRV-005": {
        "driver_id": "DRV-005",
        "driver_name": "Dimas Saputra",
        "vehicle_id": "TRK-005",
        "vehicle_type": "Van",

        "status": "moving",

        "latitude": -6.402484,
        "longitude": 106.794243,

        "speed": 30,
        "heading": 45,

        "route_id": "R-DEP-001",
        "warehouse": "WH-Depok",

        "fuel_level": 69,
        "load_percentage": 63,

        "last_update": datetime.utcnow().isoformat()
    }
}


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "status": "online",
        "service": "OptiCargo.ai Decision Intelligence API",
        "docs": "/docs",
        "version": "1.0.0",
        "realtime_driver_tracking": True
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "OptiCargo.ai",
        "drivers_online": len(DRIVERS_STORE),
        "websocket_clients": len(CONNECTED_CLIENTS),
        "timestamp": datetime.utcnow().isoformat()
    }


# ============================================================
# DATASET UPLOAD
# ============================================================

@app.post(
    "/upload",
    response_model=StandardResponse[DatasetSummarySchema]
)
async def upload_dataset(file: UploadFile = File(...)):

    start_time = time.time()

    try:

        df = pd.read_csv(file.file)

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=f"Failed to read CSV file: {str(e)}"
        )

    filename = file.filename or "dataset.csv"

    dataset_id = f"DS-{int(time.time())}"

    required_columns = [
        "vehicle_id",
        "route_id",
        "warehouse",
        "timestamp"
    ]

    missing_columns = [
        col for col in required_columns
        if col not in df.columns
    ]

    if missing_columns:

        raise HTTPException(
            status_code=400,
            detail={
                "message": "Dataset columns are incomplete",
                "missing_columns": missing_columns
            }
        )

    summary = {

        "dataset_id": dataset_id,

        "filename": filename,

        "upload_timestamp":
            datetime.utcnow().isoformat(),

        "total_records":
            int(len(df)),

        "valid_records":
            int(len(df.dropna())),

        "invalid_records":
            int(len(df) - len(df.dropna())),

        "duplicate_rows":
            int(df.duplicated().sum()),

        "vehicles_count":
            int(df["vehicle_id"].nunique()),

        "routes_count":
            int(df["route_id"].nunique()),

        "warehouses_count":
            int(df["warehouse"].nunique()),

        "date_range": {

            "start":
                str(df["timestamp"].min()),

            "end":
                str(df["timestamp"].max())
        },

        "validation_issues": [
            "Dataset loaded successfully"
        ]
    }

    # Reset: new upload replaces, not stacks — clear all previously uploaded data
    DATASETS_STORE.clear()
    ANALYSES_STORE.clear()
    SIMULATION_STORE.clear()
    REPORTS_STORE.clear()

    DATASETS_STORE[dataset_id] = {

        "summary": summary,

        "dataframe": df
    }

    return StandardResponse(

        status="success",

        message=
            "Operational dataset uploaded and validated successfully",

        data=summary,

        processing_time_ms=
            round(
                (time.time() - start_time) * 1000,
                2
            )
    )


# ============================================================
# ANALYSIS
# ============================================================

@app.get(
    "/analysis/{dataset_id}",
    response_model=StandardResponse[Dict[str, Any]]
)
def get_analysis(dataset_id: str):

    start_time = time.time()

    stored = DATASETS_STORE.get(dataset_id)

    if stored is None:

        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    dataset = stored["summary"]

    df = stored["dataframe"]

    features = FeatureEngineeringEngine.extract_features(df)

    leakages = CostLeakageDetector.detect_leakages(
        features
    )

    analysis_data = {

        "dataset_id":
            dataset["dataset_id"],

        "analyzed_at":
            datetime.utcnow().isoformat(),

        "overall_health_score":
            78,

        "total_daily_loss":
            2350000,

        "total_monthly_loss":
            47000000,

        "key_metrics": {

            "avg_fleet_utilization":
                features["avg_utilization_percent"],

            "avg_idle_hours":
                features["avg_idle_hours"],

            "total_fuel_cost_daily":
                18300000,

            "sla_fulfillment_rate":
                98
        },

        "detected_leakages":
            leakages
    }

    return StandardResponse(

        status="success",

        message=
            "Operational analysis & cost leakage detection complete",

        data=analysis_data,

        processing_time_ms=
            round(
                (time.time() - start_time) * 1000,
                2
            )
    )


# ============================================================
# RECOMMENDATION
# ============================================================

@app.get(
    "/recommendation/{dataset_id}",
    response_model=StandardResponse[Any]
)
def get_recommendations(dataset_id: str):

    start_time = time.time()

    stored = DATASETS_STORE.get(dataset_id)

    if stored is None:

        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    df = stored["dataframe"]

    features = FeatureEngineeringEngine.extract_features(df)

    leakages = CostLeakageDetector.detect_leakages(
        features
    )

    recommendations = RecommendationEngine.generate_recommendations(
        leakages
    )

    ANALYSES_STORE[dataset_id] = recommendations

    return StandardResponse(

        status="success",

        message="Ranked AI recommendations generated",

        data=recommendations,

        processing_time_ms=
            round(
                (time.time() - start_time) * 1000,
                2
            )
    )


# ============================================================
# SIMULATION
# ============================================================

@app.post("/simulation/{dataset_id}")
def run_scenario_simulation(dataset_id: str):

    recommendations = ANALYSES_STORE.get(
        dataset_id
    )

    if recommendations is None:

        raise HTTPException(
            status_code=404,
            detail="Recommendation not found"
        )

    best_rec = recommendations[0]

    result = ScenarioSimulationEngine.run_simulation(

        recommendation_id=
            best_rec["id"],

        fleet_reduction_percent=10,

        route_consolidation_rate=15
    )

    SIMULATION_STORE[dataset_id] = result

    return StandardResponse(

        status="success",

        message="Scenario simulation completed",

        data=result,

        processing_time_ms=0
    )


# ============================================================
# REPORT
# ============================================================

@app.post(
    "/generate-report/{dataset_id}",
    response_model=StandardResponse[Dict[str, Any]]
)
def generate_report(dataset_id: str):

    start_time = time.time()

    analysis = ANALYSES_STORE.get(
        dataset_id
    )

    simulation = SIMULATION_STORE.get(
        dataset_id
    )

    if analysis is None:

        raise HTTPException(
            status_code=404,
            detail="Recommendation not found"
        )

    if simulation is None:

        raise HTTPException(
            status_code=404,
            detail="Simulation not found"
        )

    best_rec = analysis[0]

    report_id = f"REP-{int(time.time())}"

    report = {

        "id":
            report_id,

        "title":
            "Executive Intelligence Impact Report",

        "strategic_cycle":
            "01 — 31 Oktober 2023 / Ags 2026",

        "generated_at":
            datetime.utcnow().isoformat(),

        "executive_summary":
            "Hasil analisis menunjukkan bahwa pemborosan terbesar berasal dari armada yang beroperasi hanya pada rata-rata kapasitas 58% - 62% di wilayah Jakarta Barat. AI memperkirakan perusahaan dapat menghemat Rp2.350.000 hari ini dan Rp48.7M per bulan.",

        "today_saving":
            simulation["metrics_delta"]["estimated_daily_saving"],

        "monthly_projection":
            simulation["metrics_delta"]["estimated_monthly_saving"],

        "confidence_score":
            best_rec["confidence_score"],

        "problems_solved": [

            {
                "title":
                    "Mendeteksi Fleet Underutilization",

                "description":
                    "AI mengidentifikasi 14% dari armada beroperasi di bawah kapasitas muatan optimal (under-load).",

                "impact_level":
                    "High Impact Critical",

                "metrics": [
                    "14% Load Gap",
                    "Rp4.2M Potential Loss"
                ]
            }
        ],

        "recommendation": {

            "title":
                best_rec["title"],

            "description":
                best_rec["description"],

            "expected_roi":
                185,

            "execution_time_hours":
                round(
                    best_rec["estimated_time_minutes"] / 60,
                    2
                ),

            "readiness_status":
                "Ready"
        },

        "financial_impact": {

            "daily_saving":
                simulation["metrics_delta"]
                ["estimated_daily_saving"],

            "monthly_saving":
                simulation["metrics_delta"]
                ["estimated_monthly_saving"],

            "annual_saving_projection":
                simulation["metrics_delta"]
                ["estimated_monthly_saving"] * 12
        }
    }

    REPORTS_STORE[report_id] = report

    return StandardResponse(

        status="success",

        message="Executive report generated",

        data=report,

        processing_time_ms=
            round(
                (time.time() - start_time) * 1000,
                2
            )
    )


# ============================================================
# GET REPORT
# ============================================================

@app.get(
    "/report/{id}",
    response_model=StandardResponse[Dict[str, Any]]
)
def get_report(id: str):

    start_time = time.time()

    report = REPORTS_STORE.get(id)

    if not report:

        if REPORTS_STORE:

            report = list(
                REPORTS_STORE.values()
            )[0]

        else:

            raise HTTPException(
                status_code=404,
                detail="Report not found"
            )

    return StandardResponse(

        status="success",

        message="Report retrieved",

        data=report,

        processing_time_ms=
            round(
                (time.time() - start_time) * 1000,
                2
            )
    )


# ============================================================
# ============================================================
# REAL-TIME DRIVER API
# ============================================================
# ============================================================


# ============================================================
# GET ALL DRIVERS
# ============================================================

@app.get("/drivers")
def get_drivers():

    return {

        "status": "success",

        "count":
            len(DRIVERS_STORE),

        "drivers":
            list(DRIVERS_STORE.values())
    }


# ============================================================
# GET SINGLE DRIVER
# ============================================================

@app.get("/drivers/{driver_id}")
def get_driver(driver_id: str):

    driver = DRIVERS_STORE.get(
        driver_id
    )

    if driver is None:

        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    return {

        "status": "success",

        "data": driver
    }


# ============================================================
# UPDATE DRIVER GPS
# ============================================================

@app.post("/drivers/location")
async def update_driver_location(
    payload: Dict[str, Any] = Body(...)
):

    required_fields = [
        "driver_id",
        "latitude",
        "longitude"
    ]

    missing = [
        field
        for field in required_fields
        if field not in payload
    ]

    if missing:

        raise HTTPException(

            status_code=400,

            detail={
                "message":
                    "Missing required fields",

                "missing":
                    missing
            }
        )

    driver_id = str(
        payload["driver_id"]
    )

    latitude = float(
        payload["latitude"]
    )

    longitude = float(
        payload["longitude"]
    )

    # Validate latitude
    if not -90 <= latitude <= 90:

        raise HTTPException(
            status_code=400,
            detail="Invalid latitude"
        )

    # Validate longitude
    if not -180 <= longitude <= 180:

        raise HTTPException(
            status_code=400,
            detail="Invalid longitude"
        )

    # Create driver if not existing
    if driver_id not in DRIVERS_STORE:

        DRIVERS_STORE[driver_id] = {

            "driver_id":
                driver_id,

            "driver_name":
                payload.get(
                    "driver_name",
                    "Unknown Driver"
                ),

            "vehicle_id":
                payload.get(
                    "vehicle_id",
                    "Unknown Vehicle"
                ),

            "vehicle_type":
                payload.get(
                    "vehicle_type",
                    "Truck"
                ),

            "status":
                payload.get(
                    "status",
                    "moving"
                )
        }

    # Update GPS
    DRIVERS_STORE[driver_id].update({

        "latitude":
            latitude,

        "longitude":
            longitude,

        "speed":
            float(
                payload.get(
                    "speed",
                    DRIVERS_STORE[driver_id].get(
                        "speed",
                        0
                    )
                )
            ),

        "heading":
            float(
                payload.get(
                    "heading",
                    DRIVERS_STORE[driver_id].get(
                        "heading",
                        0
                    )
                )
            ),

        "status":
            payload.get(
                "status",
                DRIVERS_STORE[driver_id].get(
                    "status",
                    "moving"
                )
            ),

        "fuel_level":
            payload.get(
                "fuel_level",
                DRIVERS_STORE[driver_id].get(
                    "fuel_level",
                    0
                )
            ),

        "load_percentage":
            payload.get(
                "load_percentage",
                DRIVERS_STORE[driver_id].get(
                    "load_percentage",
                    

                )
            ),

        "last_update":
            datetime.utcnow().isoformat()
    })


    driver_data = DRIVERS_STORE[driver_id]

    # Broadcast update to frontend
    await broadcast_driver_update(
        driver_data
    )

    return {

        "status":
            "success",

        "message":
            "Driver location updated",

        "data":
            driver_data
    }


# ============================================================
# WEBSOCKET CONNECTION
# ============================================================

@app.websocket("/ws/drivers")
async def driver_websocket(
    websocket: WebSocket
):

    await websocket.accept()

    CONNECTED_CLIENTS.append(
        websocket
    )

    try:

        # Send initial driver data
        await websocket.send_json({

            "type":
                "initial_drivers",

            "drivers":
                list(
                    DRIVERS_STORE.values()
                )
        })

        while True:

            # Keep connection alive
            await websocket.receive_text()

    except WebSocketDisconnect:

        if websocket in CONNECTED_CLIENTS:

            CONNECTED_CLIENTS.remove(
                websocket
            )

    except Exception:

        if websocket in CONNECTED_CLIENTS:

            CONNECTED_CLIENTS.remove(
                websocket
            )


# ============================================================
# BROADCAST DRIVER UPDATE
# ============================================================

async def broadcast_driver_update(
    driver: Dict[str, Any]
):

    disconnected = []

    message = {

        "type":
            "driver_location",

        "driver":
            driver
    }

    for websocket in CONNECTED_CLIENTS:

        try:

            await websocket.send_json(
                message
            )

        except Exception:

            disconnected.append(
                websocket
            )

    for websocket in disconnected:

        if websocket in CONNECTED_CLIENTS:

            CONNECTED_CLIENTS.remove(
                websocket
            )


# ============================================================
# SIMULATE DRIVER MOVEMENT
# ============================================================

@app.post("/drivers/simulate")
async def simulate_driver_movement():

    """
    Endpoint sederhana untuk testing.

    Menggeser posisi driver sedikit sehingga
    frontend dapat melihat pergerakan marker.
    """

    for driver in DRIVERS_STORE.values():

        if driver.get("status") == "moving":

            driver["longitude"] += 0.0001

            driver["latitude"] += 0.00005

            driver["last_update"] = (
                datetime.utcnow().isoformat()
            )

            await broadcast_driver_update(
                driver
            )

    return {

        "status":
            "success",

        "message":
            "Driver movement simulated",

        "drivers":
            list(
                DRIVERS_STORE.values()
            )
    }


# ============================================================
# DRIVER STATISTICS
# ============================================================

@app.get("/drivers/stats/summary")
def driver_statistics():

    drivers = list(
        DRIVERS_STORE.values()
    )

    total = len(drivers)

    moving = len([
        d for d in drivers
        if d.get("status") == "moving"
    ])

    idle = len([
        d for d in drivers
        if d.get("status") == "idle"
    ])

    offline = len([
        d for d in drivers
        if d.get("status") == "offline"
    ])

    return {

        "status":
            "success",

        "data": {

            "total_drivers":
                total,

            "moving":
                moving,

            "idle":
                idle,

            "offline":
                offline
        }
    }
