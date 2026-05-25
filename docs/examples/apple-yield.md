---
sidebar_position: 4
---

# Case Study · Apple Yield Detection

End-to-end computer-vision example from the NaLamKI validation phase.

## Goal

Detect apples on tree imagery and estimate yield at the orchard level.

## Architecture

A stateless CV service consumes high-resolution images from the
[Spatio-Temporal API](../api-reference/spatio-temporal.md) (drone or
hand-held captures stored as items in a STAC collection), runs detection,
and writes the count + bounding boxes back as **vector features** in a
feature collection on the same API — directly visualisable via MVT vector
tiles.

## APIs used

- [Spatio-Temporal API](../api-reference/spatio-temporal.md) — input
  imagery via STAC; output detections via
  `POST /api/v2/collections/{id}/items` and the `WebMercatorQuad-Vector`
  tileset
- [Farm API](../api-reference/farm.md) — orchard / row / tree regions
- [Service Registry](../api-reference/service-registry.md) — commissioning, results

## Pattern

This is the **Computer Vision pattern** in
[Build · AI Services](../build/ai-services/overview.md). Use it as a
template for any image-in / detections-out service.
