from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database.connection import get_db
from app.models.domain import Alarm
from app.schemas.dto import AlarmOut
from app.auth.security import get_current_user
import datetime

router = APIRouter(prefix="/api/alarms", tags=["alarms"])

@router.get("", response_model=List[AlarmOut])
async def get_alarms(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(Alarm).order_by(Alarm.created_at.desc()))
    return result.scalars().all()

@router.get("/active", response_model=List[AlarmOut])
async def get_active_alarms(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(Alarm).where(Alarm.status == 'ACTIVE').order_by(Alarm.created_at.desc()))
    return result.scalars().all()

@router.post("/{alarm_id}/acknowledge")
async def acknowledge_alarm(alarm_id: int, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(Alarm).where(Alarm.id == alarm_id))
    alarm = result.scalars().first()
    if alarm:
        alarm.status = 'ACKNOWLEDGED'
        alarm.acknowledged_by = current_user.username
        alarm.acknowledged_at = datetime.datetime.utcnow()
        await db.commit()
        return {"message": "Alarm acknowledged"}
    return {"error": "Alarm not found"}
