---
sidebar_position: 5
---

# Case Study · Drone-based Weed Detection with John Deere

## Goal

From drone imagery, produce a **weed-detection application map** that a
John Deere sprayer can execute in-field.

## Data flow

1. Drone flight delivers RGB and multispectral tiles.
2. Imagery lands as a **STAC collection** in the
   [Spatio-Temporal API](../api-reference/spatio-temporal.md) — Zarr
   DataCube with `RGB` and band layers.
3. The detection service writes weed polygons as **features** in a feature
   collection (`POST /api/v2/collections/{id}/items`).
4. A second service produces an **application map** raster layer from the
   polygons, formatted for the John Deere Operations Center.
5. The map is pushed to the machine via the
   [John Deere connector](../api-reference/integrations.md).

## APIs used

- [Spatio-Temporal API](../api-reference/spatio-temporal.md) — imagery in (Zarr layers), detections + application map out (features + raster layer)
- [Farm API](../api-reference/farm.md) — field boundaries
- [Activity API](../api-reference/activity.md) — the planned spraying activity, with the application map as an attachment on the record
- [Integrations · John Deere](../api-reference/integrations.md) — pushing the application map
- [Service Registry](../api-reference/service-registry.md) — the chain of two services
