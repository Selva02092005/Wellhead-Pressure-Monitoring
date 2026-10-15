import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.api import auth, wells

app = FastAPI(title="Wellhead Pressure Monitoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(wells.router)
from app.api import alarms, ws, integrity, production, users
app.include_router(alarms.router)
app.include_router(ws.router)
app.include_router(integrity.router)
app.include_router(production.router)
app.include_router(users.router)


from app.mqtt.client import start_mqtt
import asyncio
from app.database.connection import AsyncSessionLocal
from app.models.domain import User, Well, Alarm, SensorHealth
from app.auth.security import get_password_hash
from sqlalchemy.future import select

mqtt_client_instance = None

async def seed_demo_accounts():
    try:
        async with AsyncSessionLocal() as db:
            result = await db.execute(select(User).where(User.username == "admin"))
            user = result.scalars().first()
            if not user:
                print("Seeding admin account...")
                hashed_pass = get_password_hash("admin123")
                admin_user = User(username="admin", password_hash=hashed_pass, role="ADMIN")
                db.add(admin_user)
                await db.commit()
                
            # Seed demo wells if empty
            result_wells = await db.execute(select(Well))
            if not result_wells.scalars().first():
                print("Seeding dummy wells...")
                for i in range(1, 11):
                    well = Well(
                        well_id=f"WELL-{i:03d}",
                        name=f"Offshore Platform Alpha - Well {i}",
                        location="North Sea Field Block A",
                        completion_type="Multilateral",
                        status="ACTIVE"
                    )
                    db.add(well)
                await db.commit()
                
            # Seed demo alarms if empty
            result_alarms = await db.execute(select(Alarm))
            if not result_alarms.scalars().first():
                print("Seeding dummy alarms...")
                alarms = [
                    Alarm(well_id="WELL-001", alarm_type="HIGH_PRESSURE", severity="CRITICAL", sensor="tubing", value=1950.5, threshold=1900.0, message="Tubing pressure exceeded critical threshold", status="ACTIVE"),
                    Alarm(well_id="WELL-007", alarm_type="SENSOR_FAULT", severity="WARNING", sensor="annulus_a", message="Intermittent signal loss from Annulus A sensor", status="ACTIVE"),
                    Alarm(well_id="WELL-003", alarm_type="LOW_FLOW", severity="WARNING", sensor="flowline", value=1300.2, threshold=1400.0, message="Flowline pressure dropping below warning threshold", status="ACTIVE")
                ]
                db.add_all(alarms)
                await db.commit()
                
            # Seed demo sensor health if empty
            result_health = await db.execute(select(SensorHealth))
            if not result_health.scalars().first():
                print("Seeding dummy sensor health faults...")
                health_data = [
                    SensorHealth(well_id="WELL-002", sensor="tubing", status="OFFLINE", last_valid_value=1850.3, fault_type="POWER_LOSS"),
                    SensorHealth(well_id="WELL-005", sensor="annulus_a", status="DEGRADED", last_valid_value=912.4, fault_type="CALIBRATION_ERROR"),
                    SensorHealth(well_id="WELL-009", sensor="choke", status="MAINTENANCE", last_valid_value=845.0, fault_type="SCHEDULED_REPAIR")
                ]
                db.add_all(health_data)
                await db.commit()
    except Exception as e:
        print(f"Error seeding demo account: {e}")

@app.on_event("startup")
async def startup_event():
    print("Starting up Wellhead Pressure Monitoring API...")
    asyncio.create_task(seed_demo_accounts())
    
    global mqtt_client_instance
    mqtt_client_instance = start_mqtt(asyncio.get_running_loop())

@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down...")
    if mqtt_client_instance:
        mqtt_client_instance.loop_stop()
        mqtt_client_instance.disconnect()


@app.get("/")
async def root():
    return {"status": "ok", "message": "Wellhead API is running"}

