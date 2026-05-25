---
sidebar_position: 2
---

# Case Study · GeoAI Telangana

A production deployment serving the entire Indian state of Telangana.

## Goal

Predict **ten soil parameters** from Sentinel-2 satellite data and deliver
soil advisories to **government, agricultural officers, and farmers** —
through one technical foundation.

## Stakeholders

- Government of Telangana
- Mandal Agricultural Officers (MAOs)
- PJTSAU (agricultural university)
- GIZ (international cooperation)
- Indian AgriTech start-ups (BharatRohan, Carbonmint, Transity)
- Farmers (notified via WhatsApp)

## Architecture

Three audiences, one digital farm twin:

- **State.** District NDVI overview for programme oversight and policy
  targeting.
- **Mandal.** Ten soil and crop parameters per mandal for MAO advisory.
- **Field.** Time-series at the field level, available through the farmer's
  existing FMIS or the platform's farmer-facing front-end.

## APIs used

- **[Spatio-Temporal API](../api-reference/spatio-temporal.md)** —
  Sentinel-2 ingest as Zarr DataCubes, model outputs as additional Zarr
  layers in the same collection, STAC items per time slice.
  - Uploads via `POST /api/v2/collections/{id}/zarr/init` → `POST /layers` → `PUT /layers/{name}/data/binary`.
  - Frontend reads layers via TileJSON: `GET /api/v2/collections/{id}/tiles/WebMercatorQuad/tilejson.json?layers=NDVI`.
  - State / mandal / field views all use the **aggregations** endpoints
    (`/aggregate/time-series`, `/aggregate/summary`) with per-region bboxes.
- **[Activity API](../api-reference/activity.md)** — advisory delivery,
  attached to fields and regions as typed Records.
- **[Farm API](../api-reference/farm.md)** — region hierarchy: state →
  district → mandal → field, modelled as nested Regions.

## Data flow

1. New Sentinel-2 scene becomes available.
2. The GeoAI service is commissioned for all of Telangana.
3. AI outputs are written back as **Zarr layers** in the
   *Soil monitoring Telangana* collection. The platform automatically
   indexes them as STAC items and exposes them via TileJSON + WebMercator
   tiles.
4. Subscribed farmers are notified via WhatsApp.
5. Soil report and decision support are available in the dashboard —
   driven by the **MapLibre style** the API generates for the collection.

## Outcome

- Ten trained models in production
- Four currently cross **R² > 0.55**
- Trained on **43,000+** cleaned soil samples plus 600 GIZ AgriFabriX samples
- Rolled out state-wide across all 33 districts in March 2026

See the GeoAI workshop report for detailed performance metrics.
