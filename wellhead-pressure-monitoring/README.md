# Wellhead Pressure Monitoring Dashboard

A complete, production-style Wellhead Pressure Monitoring Dashboard for monitoring oil and gas wells in real-time.

## Architecture

- **Frontend:** React + Vite, TailwindCSS, ECharts, WebSockets.
- **Backend:** FastAPI, Python, Pydantic, SQLAlchemy.
- **Simulator (RTU):** Python, Paho MQTT.
- **Real-Time Delivery:** Redis Pub/Sub, Mosquitto MQTT.
- **Database:** PostgreSQL (with TimescaleDB extension).

## Directory Structure

```text
wellhead-pressure-monitoring/
│
├── frontend/           # React + Vite Application
├── backend/            # FastAPI Backend
├── simulator/          # Python RTU Data Simulator
├── config/             # YAML configurations
├── mosquitto/          # MQTT configurations
├── database/           # Postgres Init scripts
├── docker/             # Nginx, Supervisor, and Entrypoint scripts
├── Dockerfile          # Unified all-in-one container Dockerfile
└── .env.example
```

## Running the Project

Build and run the all-in-one Docker image:

```bash
cd wellhead-pressure-monitoring

# Build the unified single container image
docker build -t wellhead-monitoring:latest .

# Run the single container
docker run -d --name wellhead_app -p 80:80 -p 8000:8000 -p 1883:1883 wellhead-monitoring:latest
```

3. Access the dashboard at `http://localhost:80`
4. Use the demo credentials to login:
   - **Username:** admin
   - **Password:** admin123

## Simulated Data

The simulator automatically generates random values around configured setpoints for tubing, flowline, choke, and annuli. This is pushed through an MQTT broker every 2 seconds, processed by the FastAPI backend, inserted to Redis for live extraction, and passed identically down to connected WebSocket clients for < 100ms lag rendering on the frontend.
