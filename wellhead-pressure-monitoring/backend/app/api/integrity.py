from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database.connection import get_db
from app.models.domain import SensorHealth
from app.schemas.dto import SensorHealthOut

router = APIRouter(prefix="/api/integrity", tags=["integrity"])

@router.get("", response_model=List[SensorHealthOut])
async def get_sensor_health(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SensorHealth).order_by(SensorHealth.last_update.desc()))
    return result.scalars().all()
