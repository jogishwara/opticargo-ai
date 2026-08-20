from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "OptiCargo.ai Backend"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "opticargo_secret_key_super_secret_12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    DATABASE_URL: str = "sqlite:///./opticargo.db"
    REDIS_URL: Optional[str] = "redis://localhost:6379/0"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
