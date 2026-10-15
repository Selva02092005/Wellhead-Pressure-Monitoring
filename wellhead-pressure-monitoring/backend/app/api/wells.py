from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database.connection import get_db, get_redis
from app.models.domain import Well
from app.schemas.dto import WellOut
from app.auth.security import get_current_user

router = APIRouter(prefix="/api/wells", tags=["wells"])

@router.get("", response_model=List[WellOut])
async def get_wells(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(Well))
    return result.scalars().all()

@router.get("/{well_id}/live")
async def get_live_pressure(well_id: str, redis = Depends(get_redis)):
    # Fetch latest pressure values from redis
    tubing = await redis.get(f"latest:{well_id}:tubing")
    annulus_a = await redis.get(f"latest:{well_id}:annulus_a")
    annulus_b = await redis.get(f"latest:{well_id}:annulus_b")
    annulus_c = await redis.get(f"latest:{well_id}:annulus_c")
    flowline = await redis.get(f"latest:{well_id}:flowline")
    choke = await redis.get(f"latest:{well_id}:choke")
    
    return {
        "tubing": float(tubing) if tubing else None,
        "annulus_a": float(annulus_a) if annulus_a else None,
        "annulus_b": float(annulus_b) if annulus_b else None,
        "annulus_c": float(annulus_c) if annulus_c else None,
        "flowline": float(flowline) if flowline else None,
        "choke": float(choke) if choke else None,
    }
