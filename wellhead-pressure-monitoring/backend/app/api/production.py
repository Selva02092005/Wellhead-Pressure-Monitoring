from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database.connection import get_db
from app.models.domain import Well
from pydantic import BaseModel
import random
from datetime import datetime

router = APIRouter(prefix="/api/production", tags=["production"])

class ProductionReportOut(BaseModel):
    well_id: str
    target_oil_bbl: float
    actual_oil_bbl: float
    target_gas_mcf: float
    actual_gas_mcf: float
    uptime_percentage: float
    report_date: str

@router.get("/daily-report", response_model=List[ProductionReportOut])
async def get_daily_production_report(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Well))
    wells = result.scalars().all()
    
    report = []
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    
    # Use deterministic seeded fake data so refreshing the page yields stable data
    for well in wells:
        seed_str = f"{today_str}_{well.well_id}"
        random.seed(seed_str)
        
        target_oil = random.uniform(2000, 5000)
        efficiency = random.uniform(0.85, 1.0)
        actual_oil = target_oil * efficiency
        
        target_gas = target_oil * random.uniform(1.5, 3.0)
        actual_gas = target_gas * (efficiency - random.uniform(0.01, 0.05))
        
        uptime = efficiency * 100.0
        
        report.append(ProductionReportOut(
            well_id=well.well_id,
            target_oil_bbl=round(target_oil, 1),
            actual_oil_bbl=round(actual_oil, 1),
            target_gas_mcf=round(target_gas, 1),
            actual_gas_mcf=round(actual_gas, 1),
            uptime_percentage=round(uptime, 1),
            report_date=today_str
        ))
    
    random.seed()
    return report
