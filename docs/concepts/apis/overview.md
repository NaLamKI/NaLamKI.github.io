---
sidebar_position: 1
---

# The Digital Farm APIs

The APIs are the integration boundaries the ITU/FAO reference architecture pins
down — every vendor implementation has to honour them. The core of them is the
**digital farm API**, the REST binding of the data model; companion interfaces
cover high-frequency sensor data and raster archives.

| API | Underlying standard | Purpose |
|-----|---------------------|---------|
| [Digital Farm API](./digital-farm-api.md) | the data model of the draft ITU-T Recommendation, OpenAPI 3.1, GeoJSON, OGC API – Features, AGROVOC | master data **and** operations — organisations, users, farms, fields, regions, cultivation, work, products, machines, animals, observations, economics, compliance, processing runs |
| [Sensor Things API](./sensor-things-api.md) | OGC SensorThings API v1.1 | sensor and observation lifecycle, live data ingest. A `Device` of the data model points at its service through `sensorThingsUrl` |
| [Spatio-Temporal API](./spatio-temporal-api.md) | OGC API · STAC | maps, layers, rasters, vectors, AI model outputs |

All of them take tokens from the platform's identity provider — see
[Identity, Authentication & Access](../iam.md).

## Page structure

Every API concept page follows the same substructure:

1. **Purpose** — what the API does
2. **Underlying open standard** — which public spec it implements
3. **Core resources** — the data objects and how they relate
4. **Capabilities** — what you can actually do with it
5. **Code example** — a short end-to-end snippet
6. **Reference link** — to the formal API reference

## Persona → API map

| Persona | Primary APIs | Secondary APIs |
|---------|--------------|----------------|
| AI Service Developer | Digital Farm API (processing runs, results) · Spatio-Temporal | Sensor Things |
| Data App Developer | Digital Farm API | Spatio-Temporal |
| Sensor Integrator | Sensor Things | Digital Farm API (devices, observations) |
| Frontend / Dashboard Developer | Digital Farm API · Spatio-Temporal | Sensor Things |
