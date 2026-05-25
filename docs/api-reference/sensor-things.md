---
sidebar_position: 3
---

# Sensor Things API

**Standard:** OGC SensorThings API v1.1
**Two surfaces:**

| Surface | Base URL | When to use |
|---------|----------------|-------------|
| **OGC STA** | `https://sta.<your-deployment>` | Any **STA-conformant client** (FROST, QGIS, custom OGC tooling). Standards-pure. |
| **Main API proxy** | `https://api.<your-deployment>` | When you are already calling the main API and want **region-scoped convenience** (sensors for a region, observations for a region). |

Both surfaces sit in front of the same data store. Pick the one closer to
your call-site.

---

## OGC STA surface

Swagger UI: `/api` (append to your STA base URL).

All endpoints support the standard OGC STA query parameters:
**`$filter`**, **`$orderby`**, **`$select`**, **`$expand`**, **`$top`**, **`$skip`**.

### Things

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/Things` | List Things |
| `POST` | `/Things` | Create a Thing |
| `GET` | `/Things/{id}` | Get one Thing |
| `PUT` | `/Things/{id}` | Update a Thing |
| `DELETE` | `/Things/{id}` | Delete a Thing |
| `GET` | `/Things/{id}/Datastreams` | Datastreams of a Thing |
| `GET` | `/Things/{id}/Locations` | Current Locations of a Thing |
| `GET` | `/Things/{id}/HistoricalLocations` | HistoricalLocations of a Thing |

### Sensors

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/Sensors` | List Sensors |
| `POST` | `/Sensors` | Create a Sensor |
| `GET` | `/Sensors/{id}` | Get one Sensor |
| `PUT` | `/Sensors/{id}` | Update a Sensor |
| `DELETE` | `/Sensors/{id}` | Delete a Sensor |
| `GET` | `/Sensors/{id}/Datastreams` | Datastreams of a Sensor |

### Observed properties

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/ObservedProperties` | List |
| `POST` | `/ObservedProperties` | Create |
| `GET` | `/ObservedProperties/{id}` | Get one |
| `PUT` | `/ObservedProperties/{id}` | Update |
| `DELETE` | `/ObservedProperties/{id}` | Delete |
| `GET` | `/ObservedProperties/{id}/Datastreams` | Datastreams using this property |

### Datastreams

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/Datastreams` | List |
| `POST` | `/Datastreams` | Create |
| `GET` | `/Datastreams/{id}` | Get one |
| `PUT` | `/Datastreams/{id}` | Update |
| `DELETE` | `/Datastreams/{id}` | Delete |
| `GET` | `/Datastreams/{id}/Observations` | Observations for this datastream |

### Observations

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/Observations` | List |
| `POST` | `/Observations` | Create |
| `GET` | `/Observations/{id}` | Get one |
| `PUT` | `/Observations/{id}` | Update |
| `DELETE` | `/Observations/{id}` | Delete |

### Locations & history

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/Locations` | List Locations |
| `POST` | `/Locations` | Create |
| `GET` | `/Locations/{id}` | Get one |
| `PUT` | `/Locations/{id}` | Update |
| `DELETE` | `/Locations/{id}` | Delete |
| `GET` | `/HistoricalLocations` | List historical locations |
| `POST` | `/HistoricalLocations` | Create |
| `GET` | `/HistoricalLocations/{id}` | Get one |
| `PUT` | `/HistoricalLocations/{id}` | Update |
| `DELETE` | `/HistoricalLocations/{id}` | Delete |

### Features of Interest

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/FeaturesOfInterest` | List |
| `POST` | `/FeaturesOfInterest` | Create |
| `GET` | `/FeaturesOfInterest/{id}` | Get one |
| `PUT` | `/FeaturesOfInterest/{id}` | Update |
| `DELETE` | `/FeaturesOfInterest/{id}` | Delete |
| `GET` | `/FeaturesOfInterest/{id}/Observations` | Observations on this feature |

### Composite (non-OGC convenience)

These are **AgriFoodData-specific** helpers on the STA service that bundle
several STA calls into one. They are not part of the OGC standard — use the
plain endpoints above if portability matters.

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/composite` | Create a Thing, Sensor, ObservedProperty and Datastream in one call |
| `POST` | `/composite/datastream` | Create a Datastream linked to a Sensor and a Field |
| `GET` | `/composite/field/{fieldId}/datastreams` | Datastreams for a field |
| `GET` | `/composite/field/{fieldId}/sensors` | Sensors observing a field |
| `GET` | `/composite/field/{fieldId}/observations` | Observations on a field |

### Health

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | Liveness |
| `GET` | `/rabbitmq-test/{datastreamId}` | Internal RabbitMQ probe (dev / debug only) |

---

## Main-API proxy surface

Swagger UI: `/swagger` (append to your main API base URL).

Use these when you already hold a main-API Bearer token and want
region-scoped helpers without switching base URLs.

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/sensors` | All sensors visible to the caller, optionally filtered by region |
| `GET` | `/v1/regions/{regionId}/sensors` | Sensors on a region |
| `GET` | `/v1/regions/{regionId}/sensors/datastreams` | Datastreams on a region |
| `GET` | `/v1/regions/{regionId}/sensors/observations` | Observations on a region |
| `POST` | `/v1/sensors/composite` | Create a sensor via the STA composite endpoint |
| `POST` | `/v1/sensors/composite/datastream` | Create a datastream via the STA composite endpoint |
| `GET` | `/v1/sensors/datastreams/{datastreamId}/observations` | Observations on a datastream |

> Under the hood, the main API forwards these to the OGC STA service and
> joins them with the region tree from the Farm API. There is **no separate
> data store**.

---

## MQTT

Sensor live-data ingest follows the standard OGC STA MQTT topics:

```
v1.1/Datastreams({id})/Observations
```

See [Concepts · Sensor Things API](../concepts/apis/sensor-things-api.md)
and [Quickstart · Push a sensor reading via MQTT](../quickstart/push-sensor-reading.md).

## Related

- [Concepts · Sensor Things API](../concepts/apis/sensor-things-api.md)
- [Build · Sensor Integration](../build/sensor-integration/overview.md)
- [Case Study · Soil Moisture & Irrigation Control](../examples/soil-moisture.md)
