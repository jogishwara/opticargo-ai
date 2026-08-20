# OptiCargo.ai Backend Architecture

OptiCargo.ai is an AI-powered Decision Intelligence platform for logistics companies that converts raw operational datasets into actionable, cost-saving recommendations and executive reports.

## Architecture Highlights
- **Clean Architecture & AI Pipeline Pattern**: Decoupled AI processing engine located in `app/ai/` separated from API endpoints.
- **Rule-Based Explainable AI**: Deterministic cost leakage detection based on operational thresholds, telemetry, and business rules (with zero black-box hallucination).
- **FastAPI & Pydantic v2**: High performance, type-safe API schemas and auto-generated OpenAPI docs (`/docs`).
- **SQLAlchemy 2.0 & PostgreSQL**: Clean data persistence and repository patterns.
- **Scenario Simulation Engine**: Interactive before-and-after operational metrics calculation (BBM, Fleet Utilization, Idle Time, SLA Impact).

## Operational AI Pipeline Flow
1. **Upload Dataset** (`POST /upload`): Validates missing records, duplicate rows, timestamp consistency, and fleet capacity limits.
2. **Cost Leakage Detection** (`GET /analysis/{dataset_id}`): Runs feature engineering & rule-based algorithms to detect Fleet Underutilization, Route Overlap, Idle Loading Time, and Fuel Waste.
3. **Recommendation Engine** (`GET /recommendation/{dataset_id}`): Ranks and prioritizes recommendations based on financial impact, difficulty, and SLA protection.
4. **Scenario Simulation** (`POST /simulation`): Simulates operational impacts (Fuel cost reduction %, utilization gains, CO2 savings) under selected parameters.
5. **Executive Intelligence Report** (`POST /generate-report`): Generates structured JSON, HTML, and printable PDF-ready reports.

## Getting Started

### Local Docker Run
```bash
docker-compose up --build
```
API will be live at `http://localhost:8000`. Access Swagger UI at `http://localhost:8000/docs`.

### Local Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
