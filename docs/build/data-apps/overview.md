---
sidebar_position: 1
---

# Build a Data App

A *data app* connects an **external data source** to the platform — a
machinery FMIS, a regional data catalogue, a weather service, a soil
database. The job is to map the external schema onto the AgriFoodData
data model and to keep them in sync.

## Decision tree

- One-way **read** of an external system? → Connector pattern.
- **Bidirectional** sync (writes back to the FMIS)? → Adapter pattern with a clearing-house contract.
- Bulk **historical import**? → ETL pattern, runs once or on a schedule.

## What you need

- Read access to the external system (API key, OAuth client, etc.).
- A target organisation in AgriFoodData.
- Knowledge of [Farm](../../concepts/apis/farm-api.md) and
  [Activity](../../concepts/apis/activity-api.md) APIs.

## Step-by-step (read path)

1. **Map fields.** Match the external system's `field` / `parcel` /
   `crop` notion to the Farm API's Field + AgroVoc tags.
2. **Pull boundaries.** Translate geometries to GeoJSON (RFC 7946).
3. **Sync activities.** For every operation in the external system, write
   an Activity (with timestamps, inputs, outputs).
4. **Run on a schedule.** Use the Service Registry's scheduling primitives.

## Reference implementations

The concept paper points to three real-world examples that should land here
as full tutorials in later phases:

- **John Deere Operations Center** read path (delivered by the NaLamKI consortium)
- **Agri-Gaia EDC** connector (Gaia-X data space)
- **ADEX** in Telangana

## Common patterns

- **AgroVoc translation table** committed to the connector repo — make the
  mapping inspectable.
- **Watermarks** for incremental sync (last-seen timestamps per resource).
- **Idempotent writes** — re-running an import does not duplicate.
