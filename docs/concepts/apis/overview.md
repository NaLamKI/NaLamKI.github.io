---
sidebar_position: 1
---

# APIs at a glance

The four APIs are the actual backbone of the platform. They are the
integration boundaries the ITU/FAO reference architecture pins down — every
vendor implementation has to honour them.

| API | Underlying standard | Purpose |
|-----|---------------------|---------|
| [Farm API](./farm-api.md) | GeoJSON, AgroVoc, ITU/FAO data model | Master data — orgs, users, farms, fields, regions |
| [Sensor Things API](./sensor-things-api.md) | OGC SensorThings API v1.1 | Sensor & observation lifecycle, live data ingest |
| [Spatio-Temporal API](./spatio-temporal-api.md) | OGC API · STAC | Maps, layers, rasters, vectors, AI model outputs |
| [Activity API](./activity-api.md) | ITU/FAO data model, AgroVoc | Plantings, operations, inputs, outputs, economics |

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
| AI Service Developer | Service Registry · Spatio-Temporal | Farm · Sensor Things · Activity |
| Data App Developer | Farm · Activity | Spatio-Temporal · Service Registry |
| Sensor Integrator | Sensor Things | Farm |
| Frontend / Dashboard Developer | Spatio-Temporal · Farm | Activity · Sensor Things |
