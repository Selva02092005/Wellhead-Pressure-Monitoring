from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    role: str
    model_config = ConfigDict(from_attributes=True)

class WellBase(BaseModel):
    well_id: str
    name: str
    location: Optional[str]
    completion_type: Optional[str]
    status: str

class WellOut(WellBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AlarmOut(BaseModel):
    id: int
    well_id: str
    alarm_type: str
    severity: str
    sensor: Optional[str]
    value: Optional[float]
    threshold: Optional[float]
    message: str
    status: str
    created_at: datetime
    acknowledged_at: Optional[datetime]
    acknowledged_by: Optional[str]
    model_config = ConfigDict(from_attributes=True)
    
class PressureReadingOut(BaseModel):
    well_id: str
    sensor: str
    timestamp: datetime
    pressure: float
    unit: str = "psi"
    quality: str = "GOOD"

class SensorHealthOut(BaseModel):
    id: int
    well_id: str
    sensor: str
    status: str
    last_valid_value: Optional[float]
    last_update: datetime
    fault_type: Optional[str]
    model_config = ConfigDict(from_attributes=True)
