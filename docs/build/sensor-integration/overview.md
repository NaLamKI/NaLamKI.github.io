---
sidebar_position: 1
---

# Sensor Integration

Bring an IoT device — soil moisture probe, weather station, gateway, edge
camera — onto the platform via the **OGC SensorThings API**.

## What you need

- A working device that emits measurements.
- A service account JWT (see [Concepts · IAM](../../concepts/iam.md)).
- An MQTT client for live streams; HTTP for batch / manual uploads.

## The full lifecycle

1. **Register a Thing.** Describe the physical device with a name and a
   `Location` (GeoJSON Point).
2. **Add Sensors.** Each Sensor declares its model and metadata.
3. **Define Datastreams.** A Datastream binds a Sensor to an
   ObservedProperty and a unit of measurement. *Optional but recommended:*
   link the Datastream to a Region in the Farm API so observations are
   spatially grounded.
4. **Send Observations.**
   - **MQTT** for high-frequency streams.
   - **REST** for batch updates and manual edits.
5. **Query.** Use OGC-STA query syntax (`$filter`, `$orderby`, `$top`,
   `$expand`) for time-series analysis.

## Payload conventions

- Use **JSON-LD** with an explicit `@context` for any metadata that should
  be cross-platform-readable.
- Use **AgroVoc** URIs for `ObservedProperty` whenever a vocabulary entry
  exists.

## Batch vs. streaming

- **Streaming** (MQTT) — sub-minute cadence; appropriate for live dashboards.
- **Batch** (REST) — bulk uploads or manual edits; cheaper for low-cadence
  loggers.

## Edge deployment

The platform supports an *edge agent* pattern: a small process on a gateway
that buffers observations during connectivity gaps and replays them once a
link is available. Buffer is durable and uses the same JWT.

## Reference implementations

- **NaLamKI consortium** — Raspberry-Pi-based soil-moisture sensors
- **BharatRohan** drone telemetry (Telangana)

## See it in action

- [Quickstart · Push a sensor reading via MQTT](../../quickstart/push-sensor-reading.md)
- [Case Study · Soil Moisture & Irrigation Control](../../examples/soil-moisture.md)
- [Concepts · Sensor Things API](../../concepts/apis/sensor-things-api.md)
