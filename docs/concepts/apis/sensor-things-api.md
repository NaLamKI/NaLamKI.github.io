---
sidebar_position: 3
---

# Sensor Things API

## Purpose

The Sensor Things API connects IoT devices to AgriFoodData and manages
continuous measurements in real time.

## Underlying standard

**OGC SensorThings API v1.1** — an open, widely adopted standard of the
Open Geospatial Consortium for the management of sensors and their
observations. The platform implements an OGC-STA-conformant endpoint, so any
STA-capable client can talk to it directly.

## Core resources

| Resource | Purpose |
|----------|---------|
| **Thing** | A physical object — e.g. a sensor box at the edge of a field |
| **Sensor** | A single measurement device with its properties (vendor, model, range, unit) |
| **Datastream** | A logical channel: sensor + observed property + unit + a series of observations |
| **Observation** | A single timestamped measurement |
| **Location** | The geographic position of a Thing |
| **FeatureOfInterest** | What is being observed (often linked to a Field or Region from the Farm API) |

## Capabilities

- **Register and manage sensors** — onboarding, metadata, lifecycle (active,
  in service, retired).
- **Define datastreams** per sensor and observed property.
- **Live data ingest** — high-frequency streams via **MQTT**; batch and manual
  updates via **REST**.
- **OGC-STA queries** — filter, order, paging — for time-series analysis.
- **Spatial context** — link a Datastream to a **Region** in the Farm API
  so every measurement is grounded on a real piece of land. The main API
  also exposes region-scoped helpers (`/v1/regions/{id}/sensors`,
  `…/datastreams`, `…/observations`) and **composite** endpoints that
  create a Thing + Sensor + ObservedProperty + Datastream in a single call.

## Minimal example

```python
client = AgriFoodData(token=...)

thing = client.sensor_things.things.create({
    "name": "SoilBox-42",
    "location": {"type": "Point", "coordinates": [78.49, 17.39]},
})

sensor = client.sensor_things.sensors.create({
    "name": "TDR-100",
    "encodingType": "application/pdf",
    "metadata": "https://example.com/datasheet.pdf",
})

stream = client.sensor_things.datastreams.create({
    "thing": thing.id,
    "sensor": sensor.id,
    "observedProperty": "soil-moisture-10cm",
    "unitOfMeasurement": {
        "name": "Volumetric Water Content",
        "symbol": "m³/m³",
    },
})

client.sensor_things.observations.publish(
    datastream=stream.id,
    result=0.27,
    phenomenonTime="2026-05-25T10:00:00Z",
)
```

## See it in action

- [Quickstart · Push a sensor reading via MQTT](../../quickstart/push-sensor-reading.md)
- [Case Study · Soil Moisture & Irrigation Control](../../examples/soil-moisture.md)
- [API Reference · Sensor Things](../../api-reference/sensor-things.md)
