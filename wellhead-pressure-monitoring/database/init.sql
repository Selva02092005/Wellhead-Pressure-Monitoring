-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wells table
CREATE TABLE wells (
    id SERIAL PRIMARY KEY,
    well_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    completion_type VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'UNKNOWN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pressure readings hypertable
CREATE TABLE pressure_readings (
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    well_id VARCHAR(50) NOT NULL,
    sensor VARCHAR(50) NOT NULL,
    pressure DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) DEFAULT 'psi',
    quality VARCHAR(20) DEFAULT 'GOOD'
);
-- Turn pressure_readings into a hypertable
SELECT create_hypertable('pressure_readings', 'time', if_not_exists => TRUE);
-- Create an index to quickly lookup by well_id and sensor
CREATE INDEX ix_pressure_readings_well_id_sensor_time ON pressure_readings (well_id, sensor, time DESC);

-- Alarms table
CREATE TABLE alarms (
    id SERIAL PRIMARY KEY,
    well_id VARCHAR(50) NOT NULL,
    alarm_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    sensor VARCHAR(50),
    value DOUBLE PRECISION,
    threshold DOUBLE PRECISION,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by VARCHAR(50)
);
CREATE INDEX ix_alarms_well_id ON alarms(well_id);
CREATE INDEX ix_alarms_status ON alarms(status);

-- Well events table
CREATE TABLE well_events (
    id SERIAL PRIMARY KEY,
    well_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    operator VARCHAR(50)
);
CREATE INDEX ix_well_events_well_id ON well_events(well_id);

-- Sensor health table
CREATE TABLE sensor_health (
    id SERIAL PRIMARY KEY,
    well_id VARCHAR(50) NOT NULL,
    sensor VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    last_valid_value DOUBLE PRECISION,
    last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fault_type VARCHAR(100)
);
CREATE UNIQUE INDEX ix_sensor_health_well_id_sensor ON sensor_health(well_id, sensor);

-- Operator actions table
CREATE TABLE operator_actions (
    id SERIAL PRIMARY KEY,
    well_id VARCHAR(50) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "user" VARCHAR(50) NOT NULL
);

-- Note: we skip data insertion here because the backend will handle creating demo accounts.
