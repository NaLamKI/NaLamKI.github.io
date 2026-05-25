---
sidebar_position: 1
---

# API Reference

The platform exposes its functionality through **three HTTP surfaces**.
Each is a separate deployable service — operators host them under the
domains they choose. The hostnames below are placeholders; substitute the
URLs of your own deployment.

| Surface | Base URL (per deployment) | What lives here |
|---------|---------------------------|-----------------|
| **Main API** | `https://api.<your-deployment>` | Master data, activities, records, attachments, sensor proxy, vendor integrations |
| **OGC SensorThings** | `https://sta.<your-deployment>` | OGC-conformant SensorThings endpoints — for any STA-capable client |
| **Spatio-Temporal** | `https://spatio-temporal.<your-deployment>` | Collections (Zarr DataCubes + GeoJSON features), tiles, STAC, aggregations |

> **Local development.** Run the full stack via [Operate · Local Development Setup](../operate/local-dev.md). All three services are then reachable at `http://localhost:<port>` — see the compose file for the port mapping.

> **Interactive Swagger.** Each service exposes its own Swagger UI:
> the main API at `/swagger`, the STA service at `/api`, and the
> Spatio-Temporal API at `/docs`. Append these paths to your deployment's
> base URL.

## Surface area

| Section | Standards | Lives on |
|---------|-----------|----------|
| [Farm](./farm.md) — orgs, users, farms, fields, regions | GeoJSON · AgroVoc · ITU/FAO | Main API |
| [Sensor Things](./sensor-things.md) — Things, Sensors, Datastreams, Observations | OGC SensorThings v1.1 | OGC STA service + Main-API proxy |
| [Activity](./activity.md) — activities, actions, cultivation periods, records, attachments | ITU/FAO · AgroVoc | Main API |
| [Spatio-Temporal](./spatio-temporal.md) — collections, layers, features, tiles, STAC, aggregations | STAC 1.0 · OGC API Features/Tiles/Common · TileJSON 3.0 | Spatio-Temporal service |
| [Integrations](./integrations.md) — vendor connectors (John Deere) | OAuth 2.0 vendor flow | Main API |
| [Service Registry](./service-registry.md) | — | *planned / out-of-band* — see notes |
| [IAM](./iam.md) | OpenID Connect (Keycloak) | External identity provider |

## Versioning

The main API namespaces every business endpoint under `/v1/`. Health and the
hello-world root are unversioned.

| Path | Purpose |
|------|---------|
| `GET /` | Service identity (hello world) |
| `GET /health/live` | Liveness probe |
| `GET /health/ready` | Readiness probe (dependencies reachable) |

## Authentication

All `/v1/*` endpoints require a Bearer token issued by the platform's
Keycloak realm. The OGC STA endpoints currently accept the same Bearer token.

See [Concepts · IAM](../concepts/iam.md) for the token flow.
