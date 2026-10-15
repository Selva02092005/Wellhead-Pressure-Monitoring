from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.database.connection import get_db
from app.models.domain import User
from app.schemas.dto import UserOut

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("", response_model=List[UserOut])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    return result.scalars().all()
