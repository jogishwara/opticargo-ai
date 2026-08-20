from sqlalchemy import Column, String, Integer, Float, DateTime, JSON
from datetime import datetime
from app.database.session import Base

class RecommendationModel(Base):
    __tablename__ = "recommendations"

    id = Column(String, primary_key=True, index=True)
    dataset_id = Column(String, index=True, nullable=False)
    rank = Column(Integer, default=1)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    potential_saving_daily = Column(Float, default=0.0)
    potential_saving_monthly = Column(Float, default=0.0)
    confidence_score = Column(Float, default=95.0)
    difficulty = Column(String, default="Mudah")
    estimated_time_minutes = Column(Integer, default=15)
    expected_sla_impact = Column(String, default="Tidak ada")
    business_reason = Column(String, nullable=False)
    priority = Column(String, default="HIGH")
    created_at = Column(DateTime, default=datetime.utcnow)
