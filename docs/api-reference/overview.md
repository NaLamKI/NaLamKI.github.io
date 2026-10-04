---
sidebar_position: 1
---

# API Reference

The **digital farm API** is the REST binding of the
[AgriFoodData data model](../concepts/data-model/overview.md): every one of its
47 entities is a collection you can list, read, create, change and — where the
model allows — delete, all in the same way (only the audit log is read-only).
Fields, regions and sites are also served as OGC API – Features.

The API is described in **OpenAPI 3.1**, published with the data model:

| | |
|---|---|
| **Description** | [`openapi.yaml`](https://datamodel.agrifooddata.org/v1/openapi.yaml) · [`openapi.json`](https://datamodel.agrifooddata.org/v1/openapi.json) |
| **Reference pages** | [API](https://datamodel.agrifooddata.org/v1/api.html) · [one page per entity](https://datamodel.agrifooddata.org/v1/) |
| **Schemas** | `https://datamodel.agrifooddata.org/v1/schema/<Entity>.json` |
| **How the model became HTTP** | [BINDINGS.md](https://github.com/NaLamKI/datamodel/blob/main/BINDINGS.md) |

:::note A reference binding
The Recommendation specifies the data and the requirements of its clauses 9 and
10 — it does not specify a REST interface. The paths, headers and status codes
documented here are the *reference binding* published with the data model. If
this documentation and the OpenAPI description ever differ, the OpenAPI
description is right — please tell us. The base path and the limits a
deployment sets (for example the largest page size) are the deployment's own;
its operator tells you.
:::

## Where it lives

The API is served by each deployment of the platform. The OpenAPI description
models the address as

```
https://{host}/v1
```

where `{host}` is the host of the deployment — your platform operator tells you
which. Every path in this reference is relative to that base. The same
deployment's identity provider issues the tokens the API accepts; its address
is the *issuer URL* (see [Authentication](./iam.md)).

## What you can do

| Section | What it covers |
|---------|----------------|
| [Conventions](./conventions.md) | representations, identifiers, create / replace / patch / delete, concurrency, provenance, permissions |
| [Resources](./resources.md) | every collection, grouped by package, with the permission each needs |
| [Synchronization](./synchronization.md) | reading changes by cursor, offline writes, conflicts, how deletions arrive |
| [Errors](./errors.md) | status codes, problem details, integrity-rule violations |
| [Geospatial features](./geospatial-features.md) | fields, regions and sites as OGC API – Features |
| [Authentication](./iam.md) | the identity provider's endpoints, tokens and claims |

## Companion interfaces

The digital farm API holds records, not high-frequency data or raster
archives. For those the model *points* at other interfaces — a `Device` carries
the address of its SensorThings service in `sensorThingsUrl` — and the
platform's companion interfaces are documented on their own pages. They are
specified separately; each page says how its interface is authenticated.

| Interface | Standards | Purpose |
|-----------|-----------|---------|
| [Sensor Things](./sensor-things.md) | OGC SensorThings API v1.1 | sensor management and observation streams |
| [Spatio-Temporal](./spatio-temporal.md) | STAC 1.0 · OGC API (Features, Tiles, Common) · TileJSON 3.0 | rasters, vectors, tiles, model outputs |
| [Integrations](./integrations.md) | OAuth 2.0 | connectors to vendor systems |
| [Service Registry](./service-registry.md) | — | registering and commissioning services |

## Media types

| Media type | Used for |
|------------|----------|
| `application/json` | records and pages — the canonical form |
| `application/ld+json` | the same, with `@context`, `@id` and `@type` added |
| `application/merge-patch+json` | `PATCH` bodies ([RFC 7396](https://www.rfc-editor.org/rfc/rfc7396)) |
| `application/problem+json` | every error ([RFC 9457](https://www.rfc-editor.org/rfc/rfc9457)) |
| `application/geo+json` | feature collections ([RFC 7946](https://www.rfc-editor.org/rfc/rfc7946)) |

## Versioning

The path carries the **major version** (`/v1`). Within a major version changes
are additive — a new optional attribute, a new enumeration value — so a client
that ignores what it does not know keeps working. A breaking change is a new
major version served next to the old one. Until the Recommendation is approved
the version carries its draft revision (currently `1.0.0-draft.3`), and `v1`
may still follow the text.

## Authentication

Every request carries an access token issued by the platform's identity
provider:

```
Authorization: Bearer <access token>
```

The API verifies it and authorises the operation against the
permission it declares (`x-agfoda-permission`) on the farm concerned. A
missing or invalid token is `401`; a valid token without the right is `403`.

- [Concepts · Identity, Authentication & Access](../concepts/iam.md)
- [Getting started](../quickstart/getting-started.md) — from sign-in to a first record
