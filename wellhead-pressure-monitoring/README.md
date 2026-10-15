# 🛢️ Wellhead Pressure Monitoring Application

This directory contains the complete source code for the **Wellhead Pressure Monitoring Application**, including the backend services, frontend dashboard, RTU telemetry simulator, container configurations, and database initialization.

For full project documentation, architectural diagrams, API references, and technical reports, please see the [Root README.md](../README.md).

---

## Quick Navigation

- [`backend/`](./backend/) - FastAPI application (Python 3.12, SQLAlchemy, Pydantic, WebSockets)
- [`frontend/`](./frontend/) - React 18 single page application (Vite, TailwindCSS, Apache ECharts)
- [`simulator/`](./simulator/) - Multi-well RTU telemetry simulator (Python, Paho MQTT)
- [`config/`](./config/) - Wellhead setpoint configurations (`WELL-001.yaml` with MAOP/MAASP)
- [`database/`](./database/) - PostgreSQL + TimescaleDB initialization script (`init.sql`)
- [`docker/`](./docker/) - Supervisord, Nginx, and Entrypoint scripts for unified container deployment
- [`mosquitto/`](./mosquitto/) - Eclipse Mosquitto MQTT broker configuration

---

## Quick Docker Deployment

To build and run the unified container:

```bash
# Build the unified single container image
docker build -t wellhead-monitoring:latest .

# Run the single container
docker run -d --name wellhead_app -p 80:80 -p 8000:8000 -p 1883:1883 wellhead-monitoring:latest
```

- **Dashboard UI**: `http://localhost:80`
- **Default Login**: `admin` / `admin123`
- **API Documentation**: `http://localhost:8000/docs`
