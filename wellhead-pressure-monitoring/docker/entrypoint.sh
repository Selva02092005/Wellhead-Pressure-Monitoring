#!/bin/sh
set -e

# Default environment variables
export POSTGRES_DB=${POSTGRES_DB:-wellhead}
export POSTGRES_USER=${POSTGRES_USER:-wellhead_user}
export POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-wellhead_pass}
export POSTGRES_URL=${POSTGRES_URL:-postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@127.0.0.1:5432/${POSTGRES_DB}}
export REDIS_URL=${REDIS_URL:-redis://127.0.0.1:6379/0}
export MQTT_BROKER=${MQTT_BROKER:-127.0.0.1}
export MQTT_PORT=${MQTT_PORT:-1883}
export JWT_SECRET=${JWT_SECRET:-supersecretkey}
export ENVIRONMENT=${ENVIRONMENT:-production}

echo "=================================================="
echo "Starting Wellhead Pressure Monitoring System..."
echo "=================================================="

# Ensure directories exist
mkdir -p /etc/mosquitto /var/log/mosquitto /run/nginx /run/postgresql /var/log
chown -R postgres:postgres /run/postgresql

# Ensure mosquitto configuration
if [ ! -f /etc/mosquitto/mosquitto.conf ]; then
    echo "listener 1883 0.0.0.0" > /etc/mosquitto/mosquitto.conf
    echo "allow_anonymous true" >> /etc/mosquitto/mosquitto.conf
fi

# Start PostgreSQL via official docker-entrypoint in background
echo "Starting PostgreSQL with TimescaleDB..."
docker-entrypoint.sh postgres &
POSTGRES_PID=$!

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h 127.0.0.1 -p 5432 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" > /dev/null 2>&1; do
    sleep 1
done
echo "PostgreSQL is online and ready."

# Run database init script if needed
psql -h 127.0.0.1 -p 5432 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -f /app/database/init.sql > /dev/null 2>&1 || true

# Trap signals for graceful shutdown
shutdown() {
    echo "Stopping all services..."
    kill -TERM "$SUPERVISOR_PID" 2>/dev/null || true
    kill -TERM "$POSTGRES_PID" 2>/dev/null || true
    wait "$SUPERVISOR_PID" 2>/dev/null || true
    wait "$POSTGRES_PID" 2>/dev/null || true
    exit 0
}
trap shutdown SIGTERM SIGINT

echo "Starting Supervisor (Redis, Mosquitto, Backend, Simulator, Nginx)..."
supervisord -c /etc/supervisor/supervisord.conf &
SUPERVISOR_PID=$!

wait -n "$SUPERVISOR_PID" "$POSTGRES_PID"
