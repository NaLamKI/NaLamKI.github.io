---
sidebar_position: 4
---

# Spatio-Temporal API

## Purpose

Serve **rasters and vectors through one collection model** — Zarr DataCubes
(multi-dimensional rasters with per-band layers), GeoJSON Feature
Collections (vectors with CQL2 filtering), and hybrid datasets, all under
one `/collections` namespace.

This is where Sentinel-2 imagery, AI-model outputs (NDVI, soil parameter
predictions), drone tiles, and vector annotations live.

## Underlying standards

- **STAC 1.0.0** — root catalogue, collections, items
- **OGC API · Features 1.0** — feature collections, filtering, sortby
- **OGC API · Tiles 1.0** — XYZ tiles over WebMercatorQuad
- **OGC API · Common 1.0** — conformance, root
- **TileJSON 3.0** — client-side tile descriptors (Leaflet, MapLibre)
- **GeoJSON** (RFC 7946) — feature geometries
- **Mapbox Vector Tiles (MVT)** — performant vector visualisation

## Core resources

| Resource | Purpose |
|----------|---------|
| **Collection** | The top-level object. Can hold Zarr raster layers, GeoJSON features, or both. Indexed in STAC. |
| **Layer** (raster) | A band or composite inside a Zarr collection — `NDVI`, `RGB`, `B8`, `CIR`, `AGRICULTURE`, `SWIR`, … |
| **Feature** (vector) | A GeoJSON feature inside a feature collection. Carries arbitrary properties (crop, farmer, ph, …). |
| **STAC Item** | A single time-stamped asset bundle. Items belong to a STAC collection. |
| **Tileset** | A tile-matrix-set scoped to a collection (e.g. `WebMercatorQuad`, `WebMercatorQuad-Vector`). |
| **Style** | A MapLibre style automatically generated per collection. Drives `/map/render` and the tile clients. |

## Capabilities

- **Collections with bbox / datetime / CQL2 filtering** so a frontend can
  query *"all collections that overlap Telangana between June and
  September 2025"* in one call.
- **Zarr layers with auto-derived indices.** Upload Sentinel-2 bands once;
  the platform computes NDVI, NDMI, NDRE, GNDVI, EVI plus RGB/CIR/AGRI/SWIR
  composites for free.
- **WebMercator tiles.** Both raster (PNG) tiles for Zarr layers and
  vector (MVT) tiles for feature collections — straight from PostGIS via
  `ST_AsMVT`.
- **TileJSON 3.0.0** for both surfaces — Leaflet and MapLibre clients work
  with one JSON descriptor.
- **CQL2 filters** on features: comparison operators (`>`, `<`, `>=`,
  `<=`, `!=`), logical (`AND`, `OR`, `NOT`), `LIKE` / `ILIKE`, `IN`.
- **Sortby and facetby** on features (OGC-API-Features-conformant
  `sortby=+a,-b`; `facetby=crop,farmer` for value counts).
- **Aggregations.** Time-series and summary statistics on Zarr layers, and
  property aggregations on features. Optional bbox / datetime / layer
  filters; configurable temporal resolution (`P1D` / `P1W` / `P1M`).
- **STAC root catalogue.** Every collection appears as a STAC collection;
  every Zarr time slice appears as a STAC item. Plug `pystac-client` /
  QGIS STAC plugin / `stac-browser` directly at the root URL.
- **Automatic CRS handling.** Uploads in EPSG:7755, UTM, etc. are
  reprojected to WGS84 / WebMercator on the way in.
- **Two surfaces.** Use `/api/v2/*` for new work — stable coordinate
  handling, TileJSON 3.0, CQL2, aggregations, faceting. The bare `/*`
  paths remain for legacy clients.

## Minimal example — publish, then consume

```bash
TOKEN="dev-token"
BASE="https://spatio-temporal.example.com"   # or http://localhost:8080 for the local stack

# A) Publish — upload a Zarr DataCube via the helper script
AUTH_TOKEN=$TOKEN python scripts/upload_local_zarr.py \
  beispiel_zarrs/ACRAT-FR-010_s2.zarr \
  --collection-id telangana-ndvi-2025 \
  --all-layers --use-v2 --force --rebuild-rgb-composites

# B) Inspect — which layers and which time coordinates?
curl -H "Authorization: Bearer $TOKEN" \
  "$BASE/api/v2/collections/telangana-ndvi-2025/capabilities"

# C) Get a TileJSON for the NDVI layer
curl -H "Authorization: Bearer $TOKEN" \
  "$BASE/api/v2/collections/telangana-ndvi-2025/tiles/WebMercatorQuad/tilejson.json?layers=NDVI"

# D) Aggregate over an area
curl -H "Authorization: Bearer $TOKEN" \
  "$BASE/api/v2/collections/telangana-ndvi-2025/aggregate/time-series?\
bbox=78.0,17.0,79.0,18.0&layers=NDVI&aggregation=mean&resolution=P1W"
```

## See it in action

- [Quickstart · Fetch data via REST](../../quickstart/fetch-data-rest.md)
- [Build · Frontend & Dashboards](../../build/frontend-dashboards/overview.md) — Tile / TileJSON / MVT recipes
- [Build · AI Services](../../build/ai-services/overview.md) — publishing model outputs as Zarr layers
- [Case Study · GeoAI Telangana](../../examples/geoai-telangana.md) — the canonical deployment
- [API Reference · Spatio-Temporal](../../api-reference/spatio-temporal.md) — every endpoint
