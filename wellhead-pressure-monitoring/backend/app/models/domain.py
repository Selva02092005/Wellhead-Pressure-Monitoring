from sqlalchemy import Column, Integer, String, Float, DateTime, Index
from sqlalchemy.sql import func
from app.database.connection import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Well(Base):
    __tablename__ = "wells"
    id = Column(Integer, primary_key=True, index=True)
    well_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    location = Column(String(100))
    completion_type = Column(String(100))
    status = Column(String(50), nullable=False, default="UNKNOWN")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Alarm(Base):
    __tablename__ = "alarms"
    id = Column(Integer, primary_key=True, index=True)
    well_id = Column(String(50), index=True, nullable=False)
    alarm_type = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False)
    sensor = Column(String(50))
    value = Column(Float)
    threshold = Column(Float)
    message = Column(String, nullable=False)
    status = Column(String(50), default='ACTIVE', index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    acknowledged_at = Column(DateTime(timezone=True), nullable=True)
    acknowledged_by = Column(String(50), nullable=True)

class SensorHealth(Base):
    __tablename__ = "sensor_health"
    id = Column(Integer, primary_key=True, index=True)
    well_id = Column(String(50), nullable=False)
    sensor = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False)
    last_valid_value = Column(Float, nullable=True)
    last_update = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    fault_type = Column(String(100), nullable=True)
    __table_args__ = (
        Index('ix_sensor_health_well_id_sensor', 'well_id', 'sensor', unique=True),
    )

class WellEvent(Base):
    __tablename__ = "well_events"
    id = Column(Integer, primary_key=True, index=True)
    well_id = Column(String(50), index=True, nullable=False)
    event_type = Column(String(100), nullable=False)
    description = Column(String)
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    operator = Column(String(50), nullable=True)

class OperatorAction(Base):
    __tablename__ = "operator_actions"
    id = Column(Integer, primary_key=True, index=True)
    well_id = Column(String(50), nullable=False)
    action_type = Column(String(100), nullable=False)
    description = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user = Column(String(50), nullable=False)
