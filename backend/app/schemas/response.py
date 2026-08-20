from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, Any, List
from datetime import datetime

T = TypeVar("T")

class ResponseMetadata(BaseModel):
    timestamp: str = datetime.utcnow().isoformat()
    version: str = "1.0.0"
    engine_mode: str = "OptiCargo-AI-Pipeline"

class StandardResponse(BaseModel, Generic[T]):
    status: str = "success"
    message: str = "Operation completed successfully"
    data: T
    metadata: ResponseMetadata = ResponseMetadata()
    processing_time_ms: float = 0.0
