from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config.settings import settings
import redis.asyncio as aioredis
from typing import AsyncGenerator

SQLALCHEMY_DATABASE_URL = settings.postgres_url.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

redis_client = aioredis.from_url(settings.redis_url, decode_responses=True)

async def get_redis():
    return redis_client
