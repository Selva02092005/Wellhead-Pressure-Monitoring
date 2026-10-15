import os
import time
import json
import random
import paho.mqtt.client as mqtt_client
from datetime import datetime, timezone

BROKER = os.getenv("MQTT_BROKER", "localhost")
PORT = int(os.getenv("MQTT_PORT", 1883))
TOPIC_PREFIX = "wells"

wells = [f"WELL-{i:03d}" for i in range(1, 11)]
sensors = ["tubing", "annulus_a", "annulus_b", "annulus_c", "flowline", "choke"]

def connect_mqtt():
    client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION2, "simulator_client")
    while True:
        try:
            client.connect(BROKER, PORT)
            return client
        except Exception as e:
            print(f"Waiting for MQTT broker at {BROKER}:{PORT}... ({e})")
            time.sleep(2)

def run_simulation(client):
    while True:
        for well in wells:
            for sensor in sensors:
                # Generate realistic random pressure based on sensor type
                if sensor == "tubing":
                    base = 1850
                elif sensor == "flowline":
                    base = 1450
                elif sensor == "choke":
                    base = 850
                elif sensor == "annulus_a":
                    base = 900
                elif sensor == "annulus_b":
                    base = 1200
                else:
                    base = 700
                    
                pressure = base + random.uniform(-5, 5)
                
                payload = {
                    "well_id": well,
                    "sensor": sensor,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "pressure": round(pressure, 2)
                }
                topic = f"{TOPIC_PREFIX}/{well}/{sensor}"
                client.publish(topic, json.dumps(payload))
        
        time.sleep(2) # 2 seconds interval as specified

if __name__ == '__main__':
    try:
        client = connect_mqtt()
        client.loop_start()
        print(f"Simulator started, publishing data to {BROKER}:{PORT}...")
        run_simulation(client)
    except Exception as e:
        print(f"Simulator failed: {e}")
