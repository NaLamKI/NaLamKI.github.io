---
sidebar_position: 5
---

# Geospatial Features

**Standards:** OGC API – Features (Part 1: Core) · GeoJSON ([RFC 7946](https://www.rfc-editor.org/rfc/rfc7946))
**Base path:** `/features`

Fields, regions and sites carry a GeoJSON geometry. Besides their ordinary
collections (`/fields`, `/regions`, `/sites`), the same records are served as
**feature collections** conforming to
[OGC API – Features](https://ogcapi.ogc.org/features/), so that any
OGC-capable client — a GIS, a map viewer, a Features library — can read them
without knowing the data model.

| Path | Returns |
|------|---------|
| `GET /features` | the landing page |
| `GET /features/conformance` | the conformance classes implemented — at least *Part 1: Core* and *GeoJSON* |
| `GET /features/collections` | the feature collections: `fields`, `regions`, `sites` |
| `GET /features/collections/{collectionId}` | one feature collection |
| `GET /features/collections/fields/items` | `Field` records as GeoJSON features |
| `GET /features/collections/fields/items/{featureId}` | one field |
| `GET /features/collections/regions/items` · `…/{featureId}` | `Region` records |
| `GET /features/collections/sites/items` · `…/{featureId}` | `Site` records |

Each feature's `id` is the record's UUID; its `properties` are the record's
other attributes; its `geometry` is the record's GeoJSON geometry (or `null`
where the entity has none). The items need the permission `field:read`,
`region:read` or `site:read`; the landing page, the conformance declaration and
the collection descriptions need no entity permission — but, like everything
else, they need a valid token.

## Query parameters

| Parameter | Meaning |
|-----------|---------|
| `limit` | features per page, 1 – 10 000, default 10 |
| `bbox` | only features intersecting a bounding box in WGS 84: `min longitude, min latitude, max longitude, max latitude` |
| `datetime` | only features valid at an instant or within an interval (the record's `startsAt` and `endsAt`) |

A response carries `links`; a **`next` link** continues a collection that has
more features than `limit`. Responses have the media type `application/geo+json`.

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://<host>/v1/features/collections/fields/items?bbox=13.40,52.51,13.41,52.53&limit=50"
```

```json
{
  "type": "FeatureCollection",
  "numberReturned": 1,
  "features": [
    {
      "type": "Feature",
      "id": "7adcec09-66ff-5ccf-8ef7-e75408287d38",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[13.4032, 52.5188], [13.4091, 52.5188], [13.4091, 52.5214],
                         [13.4032, 52.5214], [13.4032, 52.5188]]]
      },
      "properties": { "name": "Nordschlag", "farmId": "997142c3-14cf-5cb4-b260-048af4b57a76", "area": 11.8, "areaUnit": "har" }
    }
  ],
  "links": []
}
```

## Features or records?

| Use | When |
|-----|------|
| **`/features/…`** | you want to *display* or *query by place* — a map, a GIS, a bounding-box search |
| **`/fields`, `/regions`, `/sites`** | you want to *synchronise*, *write*, or read every attribute with the cursor protocol |

The feature endpoints are **read-only**. Geometries are written through the
ordinary collections — `PUT` or `PATCH` a `Field` with a GeoJSON `geometry`.

Remember rule V05: every field has exactly one **default region** whose
geometry corresponds to the field's.

## See it in action

- [Spatio-Temporal](./spatio-temporal.md) — rasters, tiles and model outputs
- [Data model · Entities](../concepts/data-model/entities.md) — fields, regions and sites
