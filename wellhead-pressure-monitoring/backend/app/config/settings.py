import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    postgres_url: str = os.getenv("POSTGRES_URL", "postgresql://wellhead_user:wellhead_pass@localhost:5432/wellhead")
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    mqtt_broker: str = os.getenv("MQTT_BROKER", "localhost")
    mqtt_port: int = int(os.getenv("MQTT_PORT", "1883"))
    jwt_secret: str = os.getenv("JWT_SECRET", "supersecretkey")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

settings = Settings()
