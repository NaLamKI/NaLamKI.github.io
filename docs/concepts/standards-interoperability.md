---
sidebar_position: 8
---

# Standards & Interoperability

A single reference of every open standard the platform builds on, and what
role each one plays.

| Standard | Role | Where it shows up |
|----------|------|-------------------|
| ITU/FAO Reference Architecture | Overall blueprint | All APIs |
| AgroVoc | Multilingual agricultural vocabulary | Farm API, Activity API |
| GeoJSON (RFC 7946) | Geometry representation | Farm API |
| OGC SensorThings API v1.1 | Sensor & observation model | Sensor Things API |
| OGC API · Features | Vector layer access | Spatio-Temporal API |
| OGC API · Coverages | Raster layer access | Spatio-Temporal API |
| OGC API · Tiles | Map tiles for web clients | Spatio-Temporal API |
| STAC v1.0 | Spatial-temporal asset catalogue | Spatio-Temporal API |
| JSON-LD | Linked-data serialisation | Digital farm twin payloads |
| Web of Things | Semantic IoT descriptions | Sensor metadata |
| OpenID Connect | Authentication | IAM endpoints |
| GAIA-X · IDSA | Data-space contracts | Clearing house |

## Conformance badges

Every API reference endpoint header carries a conformance badge — e.g.
*"OGC STA v1.1"* or *"STAC v1.0"* — so you can tell at a glance which public
specification a given endpoint follows.

## See also

- [Why · The Open Standards Backbone](../why/open-standards-backbone.md)
