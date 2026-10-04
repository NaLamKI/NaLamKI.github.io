---
sidebar_position: 8
---

# Standards & Interoperability

A single reference of every open standard the platform builds on, and what
role each one plays.

| Standard | Role | Where it shows up |
|----------|------|-------------------|
| ITU/FAO Reference Architecture | Overall blueprint | All APIs |
| ITU-T draft Recommendation *Data model for digital agriculture and farm management systems* | The data model | [Data model](./data-model/overview.md), [Digital Farm API](./apis/digital-farm-api.md) |
| AgroVoc | Multilingual agricultural vocabulary | [Ontology](./ontology/overview.md), `typeUri` attributes |
| SKOS · OWL 2 · RDF | Concept schemes, schema, linked data | [Ontology](./ontology/overview.md) |
| SOSA/SSN · PROV-O · GeoSPARQL · QUDT | Observations, provenance, geometry and units in RDF | [Ontology](./ontology/concept-schemes.md#standards-the-ontology-builds-on) |
| EPPO · BBCH · ICAR ADE · ISO 11783 (ISOBUS) | Code lists bound to concepts | [Concept schemes](./ontology/concept-schemes.md#code-lists) |
| GeoJSON (RFC 7946) | Geometry representation | Digital Farm API |
| OpenAPI 3.1 | Machine-readable API description | [API reference](../api-reference/overview.md) |
| JSON Schema 2020-12 · SHACL | Validation of records and datasets | [Representations](./data-model/representations.md) |
| JSON-LD 1.1 | Linked-data serialisation | Digital farm twin payloads |
| HTTP semantics (RFC 9110) · JSON Merge Patch (RFC 7396) · Problem Details (RFC 9457) | Reading, writing, concurrency and errors | [Conventions](../api-reference/conventions.md), [Errors](../api-reference/errors.md) |
| ISO 8601 · UCUM · ISO 4217 · ISO 3166-1 · BCP 47 | Time, units, currencies, countries, languages | [Data model](./data-model/overview.md#conventions-every-record-follows) |
| OGC SensorThings API v1.1 | Sensor & observation model | Sensor Things API |
| OGC API · Features | Vector features — fields, regions, sites; vector layers | [Digital Farm API](../api-reference/geospatial-features.md), Spatio-Temporal API |
| OGC API · Coverages | Raster layer access | Spatio-Temporal API |
| OGC API · Tiles | Map tiles for web clients | Spatio-Temporal API |
| STAC v1.0 | Spatial-temporal asset catalogue | Spatio-Temporal API |
| W3C Web of Things (Thing Description) | Semantic IoT and entity self-description | Sensor and entity metadata |
| OAuth 2.0 · OpenID Connect · PKCE (RFC 7636) | Authentication of people and apps | [Identity & Access](./iam.md) |
| Token Exchange (RFC 8693) · JWT (RFC 7519) · private_key_jwt (RFC 7523) | Tokens cut to one service; app authentication | [Signing in apps](./iam/app-authentication.md) |
| OAuth 2.0 for Native Apps (RFC 8252) · Security BCP (RFC 9700) | Safe sign-in for apps | [Signing in people](./iam/user-authentication.md) |
| OIDC Back-Channel Logout · Device Authorization Grant (RFC 8628) | Logout propagation; command-line sign-in | [SDK](../sdk/overview.md) |
| ODRL · GAIA-X · IDSA | Usage policies and data-space contracts | [Data sovereignty](./data-sovereignty.md) |

## Conformance badges

Every API reference endpoint header carries a conformance badge — e.g.
*"OGC STA v1.1"* or *"STAC v1.0"* — so you can tell at a glance which public
specification a given endpoint follows.

## See also

- [Why · The Open Standards Backbone](../why/open-standards-backbone.md)
