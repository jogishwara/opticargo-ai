from pydantic import BaseModel
from typing import List, Optional, Dict

class DatasetSummarySchema(BaseModel):
    dataset_id: str
    filename: str
    upload_timestamp: str
    total_records: int
    valid_records: int
    invalid_records: int
    duplicate_rows: int
    date_range: Dict[str, str]
    vehicles_count: int
    routes_count: int
    warehouses_count: int
    validation_issues: List[str]
