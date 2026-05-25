---
sidebar_position: 4
---

# Spatio-Temporal API

**Standards:** STAC 1.0.0 · OGC API · Features 1.0 · OGC API · Tiles 1.0 · OGC API · Common 1.0 · TileJSON 3.0 · GeoJSON (RFC 7946)
**Transport:** REST · OpenAPI
**Source:** [`AgriFoodData / spatio-temporal-api`](https://github.com/NaLamKI/spatio-temporal-api)

The Spatio-Temporal API serves **rasters and vectors through one collection
model**. Zarr DataCubes (multi-dimensional rasters with per-band *layers*),
GeoJSON Feature Collections (vectors with CQL2 filtering), and hybrid
datasets all live under the same `/collections` namespace.

> The API has two surfaces:
>
> | Surface | Status | Use when |
> |---------|--------|----------|
> | **V2** (`/api/v2/*`) | **Recommended** | New code. Stable coordinate handling, TileJSON 3.0, CQL2, aggregations, faceting. |
> | **Legacy** (`/*`) | Maintained | Existing integrations. Same shape, narrower feature set. |
>
> Both surfaces are documented below. Prefer V2 unless you have a specific
> reason not to.

**Base URLs**

| Env | URL |
|-----|-----|
| Local dev | `http://localhost:8080` (default Docker Compose port) |
| Deployment | configured via `PUBLIC_URL` env, e.g. `https://spatio-temporal.<your-deployment>` |

**Auth:** Bearer token (`Authorization: Bearer <token>`). In dev,
`Bearer dev-token` works. In prod, OIDC/JWT or a hashed UUID token — see
[Concepts · IAM](../concepts/iam.md) and the API's `docs/AUTHENTICATION.md`.

---

## Collections

A collection is the top-level object — it can hold Zarr raster layers,
vector features, or both.

### V2 (recommended)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v2/collections` | List collections (filter by `bbox`, `datetime`, CQL2 `filter`) |
| `GET` | `/api/v2/collections/{collection_id}` | Get a collection |
| `GET` | `/api/v2/collections/{collection_id}/capabilities` | Capabilities of a collection (layers, time coords, …) |
| `GET` | `/api/v2/collections/{collection_id}/time` | Time coordinate vector for a Zarr collection |

### Legacy

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/collections` | List |
| `POST` | `/collections` | Create |
| `GET` | `/collections/{collection_id}` | Get |
| `PUT` | `/collections/{collection_id}` | Update |
| `DELETE` | `/collections/{collection_id}` | Delete |
| `GET` | `/collections/{collection_id}/capabilities` | Capabilities |

---

## Layers (raster bands inside a Zarr collection)

A *layer* is a band or composite within a Zarr DataCube — `NDVI`, `RGB`,
`B8`, `CIR`, `AGRICULTURE`, `SWIR`, …

### V2

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/v2/collections/{collection_id}/zarr/init` | Initialise an empty Zarr dataset (V2 pipeline) |
| `POST` | `/api/v2/collections/{collection_id}/layers` | Create a layer |
| `GET` | `/api/v2/collections/{collection_id}/layers` | List layers |
| `GET` | `/api/v2/collections/{collection_id}/layers/{layer_name}` | Get layer metadata |
| `PUT` | `/api/v2/collections/{collection_id}/layers/{layer_name}/data/binary` | Upload binary data into the layer |

### Legacy (tile-management)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/collections/{collection_id}/zarr/init` | Init empty Zarr dataset |
| `POST` | `/collections/{collection_id}/layers` | Create layer |
| `GET` | `/collections/{collection_id}/layers` | List layers |
| `GET` | `/collections/{collection_id}/layers/{layer_name}` | Get layer |
| `DELETE` | `/collections/{collection_id}/layers/{layer_name}` | Delete layer |
| `PUT` | `/collections/{collection_id}/layers/{layer_name}/metadata` | Update layer metadata |
| `POST` | `/collections/{collection_id}/layers/{layer_name}/data` | Append / update layer data |
| `PUT` | `/collections/{collection_id}/layers/{layer_name}/data/binary` | Binary upload |

> **Upload helpers.** The repo ships a Python script
> `scripts/upload_local_zarr.py` that bundles all of this (auto-CRS,
> multi-layer, automatic vegetation indices, RGB composites). See
> [Build · AI Services](../build/ai-services/overview.md) for the
> recommended publishing pipeline.

---

## Features (vector items)

OGC API · Features 1.0. CQL2 filtering, sortby, faceting, MVT tiles.

### V2

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v2/collections/{collection_id}/items` | List features. Supports `bbox`, `datetime`, `filter` (CQL2), `sortby`, `facetby` |
| `POST` | `/api/v2/collections/{collection_id}/items` | Create a feature |
| `GET` | `/api/v2/collections/{collection_id}/items/{feature_id}` | Get one |
| `PUT` | `/api/v2/collections/{collection_id}/items/{feature_id}` | Update |
| `DELETE` | `/api/v2/collections/{collection_id}/items/{feature_id}` | Delete |

### Legacy

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/collections/{collection_id}/items` | List |
| `POST` | `/collections/{collection_id}/items` | Create |
| `GET` | `/collections/{collection_id}/items/{feature_id}` | Get |
| `PUT` | `/collections/{collection_id}/items/{feature_id}` | Update |
| `DELETE` | `/collections/{collection_id}/items/{feature_id}` | Delete |

### CQL2 filter syntax (selection)

```
crop = 'wheat' AND area > 100
crop IN ('wheat','corn','barley')
name ILIKE '%farm%'
sortby=-valid_from,+crop
facetby=crop,farmer
```

---

## Tiles (raster + vector)

OGC API · Tiles 1.0. Standard XYZ scheme over WebMercatorQuad. Raster
tiles are PNG; vector tiles are MVT.

### V2

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v2/collections/{collection_id}/tiles` | Tilesets available on this collection |
| `GET` | `/api/v2/collections/{collection_id}/tiles/{tms_id}/tilejson.json` | TileJSON 3.0 for the tileset (optionally per `layers`) |
| `GET` | `/api/v2/collections/{collection_id}/tiles/{tms_id}/{z}/{x}/{y}` | A single tile (raster or vector) |

### Legacy

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/collections/{collection_id}/tiles/{tms_id}` | Tileset metadata |
| `GET` | `/collections/{collection_id}/tiles/{tms_id}/tilejson.json` | TileJSON (optionally per `layer`) |
| `GET` | `/collections/{collection_id}/tiles/{tms_id}/{z}/{x}/{y}` | A single tile |
| `GET` | `/collections/{collection_id}/tiles/{tileMatrixSetId}/{tileMatrix}/{tileRow}/{tileCol}` | WebMercator tile (alternate path style) |
| `GET` | `/collections/{collection_id}/tiles/{tileMatrixSetId}` | WebMercator tile-matrix-set metadata |
| `GET` | `/collections/{collection_id}/tiles` | Tiles capabilities |
| `GET` | `/collections/tileMatrixSets` | List tile matrix sets (collection-scoped) |
| `GET` | `/collections/tileMatrixSets/{tms_id}` | One tile matrix set |

### Vector tiles (MVT)

The `WebMercatorQuad-Vector` tile-matrix-set serves Mapbox Vector Tiles
straight from PostGIS via `ST_AsMVT`. Standard XYZ; dynamic filters on
status, datetime, farmer, state, district, village, crop, survey_number.

---

## Maps (rendering & styles)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/collections/{collection_id}/map` | Map capabilities |
| `GET` | `/collections/{collection_id}/map/render` | Render an image of the collection (style + bbox) |
| `GET` | `/collections/{collection_id}/style` | Get the MapLibre style for this collection |
| `PUT` | `/collections/{collection_id}/style` | Update the style |

> The API generates a MapLibre-compatible style for every collection,
> with auto-handling of composite layers (RGB, CIR, AGRICULTURE, SWIR).

---

## Tile Matrix Sets

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/tileMatrixSets` | List tile matrix sets supported globally |
| `GET` | `/tileMatrixSets/WebMercatorQuad` | The WebMercatorQuad definition |

---

## Tileset management

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/collections/{collection_id}/tilesets` | Create a tileset |
| `GET` | `/collections/{collection_id}/tilesets` | List tilesets |
| `GET` | `/collections/{collection_id}/tilesets/{tileset_id}` | Get a tileset |
| `PUT` | `/collections/{collection_id}/tilesets/{tileset_id}` | Replace |
| `PATCH` | `/collections/{collection_id}/tilesets/{tileset_id}` | Partial update |
| `DELETE` | `/collections/{collection_id}/tilesets/{tileset_id}` | Delete |
| `POST` | `/collections/bulk-operations` | Submit a bulk tile job |
| `GET` | `/collections/jobs/{job_id}` | Poll a bulk-job status |

---

## STAC catalogue

STAC 1.0.0. Browse the platform's data as a STAC root catalogue.

### V2

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v2/stac/` | STAC root catalogue |
| `GET` | `/api/v2/stac/collections` | List STAC collections |
| `GET` | `/api/v2/stac/collections/{collection_id}` | One STAC collection |
| `GET` | `/api/v2/stac/collections/{collection_id}/items` | List items in a STAC collection |
| `GET` | `/api/v2/stac/collections/{collection_id}/items/{item_id}` | One STAC item |

### Legacy

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/stac/` | Root |
| `GET` | `/stac/collections` | List |
| `GET` | `/stac/collections/{collection_id}` | One |
| `GET` | `/stac/collections/{collection_id}/items` | Items |
| `GET` | `/stac/collections/{collection_id}/items/{item_id}` | Item |

### STAC metadata on a collection

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/collections/{collection_id}/stac-metadata` | Get STAC metadata for a collection |
| `PATCH` | `/collections/{collection_id}/stac-metadata` | Update |
| `DELETE` | `/collections/{collection_id}/stac-metadata` | Delete |
| `GET` | `/collections/stac/collections` | List collections in STAC form |
| `GET` | `/collections/stac/collections/{collection_id}` | One collection in STAC form |

---

## Aggregations

Statistical aggregation across Zarr layers and feature properties.

### V2

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v2/collections/{collection_id}/aggregate/time-series` | Time-series aggregation. Params: `bbox`, `datetime`, `layers`, `aggregation` (`mean`/`min`/`max`/`sum`/`count`), `resolution` (`P1D`/`P1W`/`P1M`) |
| `GET` | `/api/v2/collections/{collection_id}/aggregate/summary` | Summary statistics. Params: `bbox`, `datetime`, `layers`, `statistics`, `percentiles` |

### Legacy

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/collections/{collection_id}/aggregate/time-series` | As above |
| `GET` | `/collections/{collection_id}/aggregate/summary` | As above |

---

## Service plumbing

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/` | Service identity |
| `GET` | `/health` | Liveness |
| `GET` | `/metrics` | Prometheus metrics |
| `GET` | `/conformance` | OGC conformance classes |

---

## Curl examples

```bash
TOKEN="dev-token"                            # any valid Bearer; "dev-token" works against a local dev stack
BASE="https://spatio-temporal.example.com"   # replace with your deployment

# 1. List collections — only those overlapping a bbox
curl -H "Authorization: Bearer $TOKEN" \
  "$BASE/api/v2/collections?bbox=78.0,17.0,79.0,18.0"

# 2. Capabilities (which layers / time index)
curl -H "Authorization: Bearer $TOKEN" \
  "$BASE/api/v2/collections/telangana-ndvi-2025/capabilities"

# 3. TileJSON for a Leaflet / MapLibre client
curl -H "Authorization: Bearer $TOKEN" \
  "$BASE/api/v2/collections/telangana-ndvi-2025/tiles/WebMercatorQuad/tilejson.json?layers=NDVI"

# 4. Time-series aggregation over a bbox
curl -H "Authorization: Bearer $TOKEN" \
  "$BASE/api/v2/collections/telangana-ndvi-2025/aggregate/time-series?\
bbox=78.0,17.0,79.0,18.0&layers=NDVI&aggregation=mean&resolution=P1W"

# 5. CQL2-filtered features with sort + facets
curl -H "Authorization: Bearer $TOKEN" \
  "$BASE/api/v2/collections/soil-samples-2025/items?\
filter=crop%3D%27wheat%27%20AND%20area%20%3E%20100&sortby=-valid_from&facetby=crop,farmer"

# 6. STAC item
curl -H "Authorization: Bearer $TOKEN" \
  "$BASE/api/v2/stac/collections/telangana-ndvi-2025/items/2026-05-25"
```

## Related

- [Concepts · Spatio-Temporal API](../concepts/apis/spatio-temporal-api.md)
- [Build · Frontend & Dashboards](../build/frontend-dashboards/overview.md) — Tile / TileJSON / MVT recipes
- [Build · AI Services](../build/ai-services/overview.md) — publishing AI outputs as Zarr layers
- [Case Study · GeoAI Telangana](../examples/geoai-telangana.md)
