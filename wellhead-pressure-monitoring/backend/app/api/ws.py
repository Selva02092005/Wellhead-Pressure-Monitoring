import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.connection import get_redis

router = APIRouter(prefix="/ws", tags=["websocket"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()
websocket_task = None

async def redis_listener():
    redis = await get_redis()
    pubsub = redis.pubsub()
    await pubsub.subscribe("live_data_stream")
    try:
        async for message in pubsub.listen():
            if message['type'] == 'message':
                data = message['data']
                await manager.broadcast(data)
    except Exception as e:
        print(f"Redis listener error: {e}")

@router.websocket("/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    global websocket_task
    if websocket_task is None or websocket_task.done():
        websocket_task = asyncio.create_task(redis_listener())
    try:
        while True:
            # Keep alive and receive any client messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
