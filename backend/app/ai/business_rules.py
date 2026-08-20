"""
==========================================================
OptiCargo AI - Business Rules & Operational Configuration
==========================================================

Seluruh threshold, konstanta, dan parameter AI disimpan di sini
agar mudah diubah tanpa mengubah engine.
"""

# ==========================================================
# Fleet Utilization
# ==========================================================

# Minimal utilisasi armada (70%)
MIN_CAPACITY_UTILIZATION_THRESHOLD = 0.70

# Target utilisasi armada
TARGET_CAPACITY_UTILIZATION = 0.90

# ==========================================================
# Idle Time
# ==========================================================

# Maksimal idle time yang masih dianggap normal
MAX_ALLOWABLE_IDLE_HOURS = 1.5

# Target idle time
TARGET_IDLE_HOURS = 0.5

# ==========================================================
# Route Optimization
# ==========================================================

# Jika armada melewati koridor sama dalam rentang ini
ROUTE_OVERLAP_TIME_WINDOW_MINUTES = 15

# ==========================================================
# Fuel Cost
# ==========================================================

FUEL_COST_PER_LITER_IDR = 14500

# ==========================================================
# Driver Cost
# ==========================================================

DRIVER_SHIFT_DAILY_COST_IDR = 1715000

# ==========================================================
# Maintenance
# ==========================================================

VEHICLE_MAINTENANCE_PRORATED_IDR = 185000

# ==========================================================
# Toll Cost
# ==========================================================

AVERAGE_TOLL_COST_IDR = 350000

# ==========================================================
# Environmental
# ==========================================================

CO2_PER_LITER_DIESEL = 2.68

# ==========================================================
# Severity Threshold
# ==========================================================

SEVERITY_THRESHOLDS_MONTHLY_LOSS = {
    "CRITICAL": 20_000_000,
    "HIGH": 10_000_000,
    "MEDIUM": 5_000_000,
    "LOW": 0
}

# ==========================================================
# AI Recommendation Priority
# ==========================================================

PRIORITY_SCORE = {
    "CRITICAL": 100,
    "HIGH": 80,
    "MEDIUM": 60,
    "LOW": 40
}

# ==========================================================
# AI Confidence
# ==========================================================

MIN_CONFIDENCE_SCORE = 70
HIGH_CONFIDENCE_SCORE = 90

# ==========================================================
# Simulation
# ==========================================================

MAX_FUEL_SAVING_PERCENT = 30
MIN_FUEL_SAVING_PERCENT = 5

DEFAULT_DELIVERY_SLA = 98.0

DEFAULT_TRANSPORT_COST = 28_500_000

DEFAULT_FUEL_COST = 18_300_000

DEFAULT_IDLE_TIME = 3.4

DEFAULT_UTILIZATION = 72.0

# ==========================================================
# Recommendation Execution
# ==========================================================

DEFAULT_EXECUTION_TIME_MINUTES = 30

DEFAULT_IMPLEMENTATION_DIFFICULTY = "Sedang"

# ==========================================================
# Report
# ==========================================================

REPORT_WORKING_DAYS = 20

REPORT_MONTHS = 12