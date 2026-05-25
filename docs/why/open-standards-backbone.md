---
sidebar_position: 4
---

# The Open Standards Backbone

AgriFoodData is not a new silo. It is built on a stack of **open, widely
adopted standards** — so the platform can speak to existing GIS tools,
sensor stacks, and FMIS without proprietary glue.

| Standard | What it contributes | Used by |
|----------|---------------------|---------|
| **ITU/FAO Reference Architecture** | The overall blueprint and contracts at integration boundaries | The whole platform |
| **AgroVoc** | FAO-maintained, multilingual controlled vocabulary for agriculture | [Farm API](../concepts/apis/farm-api.md), [Activity API](../concepts/apis/activity-api.md) |
| **GeoJSON** (RFC 7946) | Geometry representation for farms, fields, ROIs | [Farm API](../concepts/apis/farm-api.md) |
| **OGC SensorThings API** | Open OGC standard for sensor management & observations | [Sensor Things API](../concepts/apis/sensor-things-api.md) |
| **OGC API** (Features, Coverages, Tiles) | Modern OGC web-service stack for spatial data | [Spatio-Temporal API](../concepts/apis/spatio-temporal-api.md) |
| **STAC** — SpatioTemporal Asset Catalog | Catalogue format used by Copernicus, NASA Earthdata, etc. | [Spatio-Temporal API](../concepts/apis/spatio-temporal-api.md) |
| **JSON-LD** | Linked-data serialisation for the digital farm twin | [Data model](../concepts/data-model.md) |
| **Web of Things** vocabularies | Semantic descriptions for IoT capabilities | Sensor integrations |
| **GAIA-X** | European data-space framework for sovereign exchange | [Data sovereignty](../concepts/data-sovereignty.md) |
| **IDSA** — International Data Spaces | Usage policies and clearing-house contracts for data exchange | [Data sovereignty](../concepts/data-sovereignty.md) |
| **Keycloak / OpenID Connect** | Identity, access, role and permission management | [IAM](../concepts/iam.md) |

## Why we list standards prominently

Every API page and every reference endpoint carries a **standard-conformance
badge** (e.g. *OGC STA v1.1*, *STAC v1.0*). The badge tells you exactly which
public specification a contract follows, so you can plug in any client library
that already speaks it — `pystac`, `frost-server` consumers, QGIS, MapLibre,
ArcGIS, and so on.
