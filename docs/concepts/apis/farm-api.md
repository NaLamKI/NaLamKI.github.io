---
sidebar_position: 2
---

# Farm API

## Purpose

The Farm API manages the **agricultural master-data world** — organisations,
users, farms, fields, and regions (ROIs).

## Underlying standards

- **GeoJSON (RFC 7946)** for all geometries.
- **AgroVoc** as the FAO-maintained, multilingual controlled vocabulary for
  agricultural concepts.
- Data model conformant to the **ITU/FAO reference architecture**.

## Core resources

- **User & Organization Management** — create users, assign them to
  organisations, manage roles and permissions. Multi-tenant by design.
- **Farm** — an agricultural operation, the top-level management unit.
  Linked to an organisation and to master-data attributes (address, area,
  operating model).
- **Field** — a managed plot within a farm. Always carries a GeoJSON geometry.
- **Region** — the ITU/FAO **Region of Interest (ROI)**, a recursively
  nestable subdivision of a field (e.g. a planting bed, a sampling site, a
  trial plot). Regions are the primary attachment point for cultivation
  periods, actions, records and sensors — see the
  [Activity API](./activity-api.md) and the
  [Sensor Things API](./sensor-things-api.md).

## Capabilities

- **Hierarchical, nestable GeoJSON entities.** Fields and regions are
  arbitrarily deep — a field may contain several regions, and a region may
  itself contain further regions. Every level is an independently
  addressable unit with its own geometry, permissions, and activities.
- **AgroVoc classification.** Any entity (farm, field, region) can be
  tagged with AgroVoc concepts — soil type, crop, management method. This
  makes data interpretable across languages and platforms. The API exposes
  `/v1/regions/agrovoc-labels` and `/v1/regions/{id}/agrovoc-labels` to
  inspect the tagging in use.
- **CRUD on every entity** with fine-grained permissions.
- **Geometric operations** — intersection, union, area computation,
  point-in-polygon.
- **Import / export** as GeoJSON; optionally Shapefile.

## Minimal example

```python
client = AgriFoodData(token=...)

farm = client.farms.create({
    "name": "Demo Farm",
    "address": "Telangana, India",
})

field = client.farms.fields.create(farm.id, {
    "name": "North field",
    "geometry": {
        "type": "Polygon",
        "coordinates": [[[78.49, 17.39], [78.50, 17.39],
                         [78.50, 17.40], [78.49, 17.40],
                         [78.49, 17.39]]],
    },
    "agrovoc_tags": ["c_7156"],  # 'maize' in AgroVoc
})
```

## See it in action

- [Quickstart · Fetch data via REST](../../quickstart/fetch-data-rest.md)
- [API Reference · Farm API](../../api-reference/farm.md)
