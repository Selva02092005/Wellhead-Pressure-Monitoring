import os
import json
import asyncio
import paho.mqtt.client as mqtt_client
from app.config.settings import settings
import redis.asyncio as aioredis
from datetime import datetime

redis_pool = aioredis.from_url(settings.redis_url, decode_responses=True)

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("Connected to MQTT Broker!")
        client.subscribe("wells/#")
    else:
        print(f"Failed to connect, return code {rc}")

async def process_message(topic, payload):
    try:
        data = json.loads(payload)
        well_id = data.get("well_id")
        sensor = data.get("sensor")
        pressure = data.get("pressure")
        
        if well_id and sensor and pressure is not None:
            # Save to redis latest value
            redis_key = f"latest:{well_id}:{sensor}"
            await redis_pool.set(redis_key, str(pressure))
            
            # Publish to pubsub for websocket
            ws_msg = json.dumps({
                "well_id": well_id,
                "sensor": sensor, 
                "pressure": pressure, 
                "timestamp": data.get("timestamp")
            })
            await redis_pool.publish("live_data_stream", ws_msg)
            
    except Exception as e:
        print(f"Error processing message: {e}")

def on_message(client, userdata, msg):
    payload = msg.payload.decode()
    topic = msg.topic
    
    loop = userdata.get('loop')
    if loop and loop.is_running():
        asyncio.run_coroutine_threadsafe(process_message(topic, payload), loop)

def start_mqtt(loop):
    import time
    client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION2, "backend_client")
    client.user_data_set({'loop': loop})
    client.on_connect = on_connect
    client.on_message = on_message
    
    for _ in range(15):
        try:
            client.connect(settings.mqtt_broker, settings.mqtt_port)
            client.loop_start()
            return client
        except Exception as e:
            print(f"MQTT connection attempt failed: {e}, retrying in 1s...")
            time.sleep(1)
    print("Could not connect to MQTT broker after retries.")
    return None
