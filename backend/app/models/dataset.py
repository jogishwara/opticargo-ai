from sqlalchemy import Column, String, Integer, DateTime, JSON
from datetime import datetime
from app.database.session import Base

class DatasetModel(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    upload_timestamp = Column(DateTime, default=datetime.utcnow)
    total_records = Column(Integer, default=0)
    valid_records = Column(Integer, default=0)
    invalid_records = Column(Integer, default=0)
    vehicles_count = Column(Integer, default=0)
    routes_count = Column(Integer, default=0)
    validation_issues = Column(JSON, default=list)
