# ========================================================
# Stage 1: Build Frontend Assets
# ========================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /build

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ========================================================
# Stage 2: Final All-in-One Image
# ========================================================
FROM timescale/timescaledb:latest-pg16

# Install runtime dependencies: Python, Redis, Mosquitto, Nginx, Supervisor, build tools for python packages
RUN apk update && apk add --no-cache \
    python3 \
    py3-pip \
    py3-virtualenv \
    redis \
    mosquitto \
    nginx \
    supervisor \
    gcc \
    musl-dev \
    python3-dev \
    libffi-dev \
    curl

# Create Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install backend dependencies
WORKDIR /app
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend source
COPY backend/ /app/backend/

# Copy simulator source
COPY simulator/ /app/simulator/

# Copy database initialization SQL
COPY database/init.sql /app/database/init.sql
# Also copy to official postgres entrypoint init folder
COPY database/init.sql /docker-entrypoint-initdb.d/init.sql

# Copy Mosquitto config
COPY mosquitto/mosquitto.conf /etc/mosquitto/mosquitto.conf

# Copy frontend static build from builder stage
COPY --from=frontend-builder /build/dist /var/www/frontend

# Copy Nginx, Supervisord, and Entrypoint configurations
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Environment settings
ENV POSTGRES_DB=wellhead \
    POSTGRES_USER=wellhead_user \
    POSTGRES_PASSWORD=wellhead_pass \
    POSTGRES_URL=postgresql://wellhead_user:wellhead_pass@127.0.0.1:5432/wellhead \
    REDIS_URL=redis://127.0.0.1:6379/0 \
    MQTT_BROKER=127.0.0.1 \
    MQTT_PORT=1883 \
    JWT_SECRET=supersecretkey \
    ENVIRONMENT=production

# Expose HTTP port 80 (Frontend + API reverse proxy), Port 8000 (FastAPI direct), and MQTT 1883
EXPOSE 80 8000 1883

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
