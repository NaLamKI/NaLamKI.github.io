---
sidebar_position: 1
---

# Frontend & Dashboards

Build a custom UI on top of the platform — a farmer-facing dashboard, an
advisory console, a public-facing map.

## What you need

- An OIDC client registered in IAM.
- A map library — **MapLibre GL JS**, **Leaflet**, or **OpenLayers**.
- A familiarity with [Spatio-Temporal API](../../concepts/apis/spatio-temporal-api.md)
  and [Farm API](../../concepts/apis/farm-api.md).

## API building blocks

| You want… | Use… |
|-----------|------|
| A basemap raster tile layer | [`GET /api/v2/collections/{id}/tiles/WebMercatorQuad/{z}/{x}/{y}`](../../api-reference/spatio-temporal.md#tiles-raster--vector) — PNG |
| TileJSON for the client | [`GET /api/v2/collections/{id}/tiles/WebMercatorQuad/tilejson.json?layers=NDVI`](../../api-reference/spatio-temporal.md#tiles-raster--vector) |
| A vector layer (farms, fields, samples) | [`GET /api/v2/collections/{id}/tiles/WebMercatorQuad-Vector/{z}/{x}/{y}`](../../api-reference/spatio-temporal.md#vector-tiles-mvt) — MVT |
| A queryable feature list | [`GET /api/v2/collections/{id}/items`](../../api-reference/spatio-temporal.md#features-vector-items) — `bbox`, `datetime`, CQL2 `filter`, `sortby`, `facetby` |
| A raster overlay (NDVI, soil parameter) | A Zarr layer rendered as tiles — see TileJSON above |
| A live time-series chart | [Sensor Things API](../../api-reference/sensor-things.md) observations — REST or MQTT |
| A time-series chart over an area | [`/api/v2/collections/{id}/aggregate/time-series`](../../api-reference/spatio-temporal.md#aggregations) |
| A summary statistic over an area | [`/api/v2/collections/{id}/aggregate/summary`](../../api-reference/spatio-temporal.md#aggregations) |
| A STAC browser | [`GET /api/v2/stac/`](../../api-reference/spatio-temporal.md#stac-catalogue) |
| An audit trail of operations | [Activity API](../../api-reference/activity.md) |

## Recommended client libraries

- **MapLibre GL** — the platform auto-generates a MapLibre style per
  collection (`GET /collections/{id}/style`). Drop the TileJSON in as a
  source and you're done.
- **Leaflet** with `leaflet-vector-tile-layer` (MVT) or the raw raster
  TileJSON URL.
- **pystac-client** or **stac-browser** for STAC.
- **chart.js** / **uPlot** for the time-series response from the
  aggregations endpoints.

## Auth in the browser

Use **PKCE** flow with Keycloak. Tokens are short-lived; refresh in the
background. The same Bearer token works against the main API, the OGC STA
service, and the Spatio-Temporal service.

## Reference implementation

The GeoAI Decision Support System (Telangana) is the canonical example:
state-level NDVI overview → mandal-level parameter detail → individual
field detail, with a pin tool, timeline, and AI-output overlays.

→ [Case Study · GeoAI Telangana](../../examples/geoai-telangana.md)
