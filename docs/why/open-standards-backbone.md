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
| **AgroVoc** | FAO-maintained, multilingual controlled vocabulary for agriculture | [Digital Farm API](../concepts/apis/digital-farm-api.md), [Ontology](../concepts/ontology/overview.md) |
| **GeoJSON** (RFC 7946) | Geometry representation for fields, regions, sites | [Digital Farm API](../concepts/apis/digital-farm-api.md) |
| **OGC SensorThings API** | Open OGC standard for sensor management & observations | [Sensor Things API](../concepts/apis/sensor-things-api.md) |
| **OGC API** (Features, Coverages, Tiles) | Modern OGC web-service stack for spatial data | [Digital Farm API](../api-reference/geospatial-features.md), [Spatio-Temporal API](../concepts/apis/spatio-temporal-api.md) |
| **STAC** — SpatioTemporal Asset Catalog | Catalogue format used by Copernicus, NASA Earthdata, etc. | [Spatio-Temporal API](../concepts/apis/spatio-temporal-api.md) |
| **JSON-LD**, **SKOS**, **OWL**, **SHACL** | Linked-data serialisation, vocabularies, schema and validation of the digital farm twin | [Data model](../concepts/data-model/representations.md), [Ontology](../concepts/ontology/overview.md) |
| **OpenAPI 3.1**, **JSON Schema** | Machine-readable description of the API and of every record | [API reference](../api-reference/overview.md) |
| **Web of Things** vocabularies | Semantic descriptions for IoT capabilities | Sensor integrations |
| **GAIA-X** | European data-space framework for sovereign exchange | [Data sovereignty](../concepts/data-sovereignty.md) |
| **IDSA** — International Data Spaces | Usage policies and clearing-house contracts for data exchange | [Data sovereignty](../concepts/data-sovereignty.md) |
| **OAuth 2.0 / OpenID Connect** (PKCE, token exchange, JWT) | Authentication of people and apps; consent; access tokens for the APIs | [Identity, Authentication & Access](../concepts/iam.md) |

## Why we list standards prominently

Every API page and every reference endpoint carries a **standard-conformance
badge** (e.g. *OGC STA v1.1*, *STAC v1.0*). The badge tells you exactly which
public specification a contract follows, so you can plug in any client library
that already speaks it — `pystac`, `frost-server` consumers, QGIS, MapLibre,
ArcGIS, and so on.
