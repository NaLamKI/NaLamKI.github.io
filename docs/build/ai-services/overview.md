---
sidebar_position: 1
---

# Build an AI Service

An AI service in AgriFoodData receives a **commission**, processes data
from the digital farm twin, and returns results that flow back into the
twin. The reference for this lifecycle is the ITU service-registry
specification.

## Decision tree

- Is your model **stateless** (image → result)? → Computer Vision pattern
- Does it consume **time series**? → Sensor analytics pattern
- Does it generate **spatial layers**? → Geospatial AI pattern

## What you need

- Python 3.10+
- Docker
- A registered service account (see [Concepts · IAM](../../concepts/iam.md))
- A self-description for your service (see [Service Registry](../../concepts/service-registry.md))

## Step-by-step

1. **Scaffold from the Starter Kit.** → [Quickstart · Run your first AI service](../../quickstart/first-ai-service.md)
2. **Replace the placeholder model.** Drop in your inference code in `src/service.py`. Keep I/O at the boundaries.
3. **Wire inputs and outputs.** Inputs come from S3 URLs the platform issues; outputs go back to S3 and — for spatial outputs — become **Zarr layers in the [Spatio-Temporal API](../../api-reference/spatio-temporal.md)**. Use the upload pipeline (`POST /api/v2/collections/{id}/zarr/init` → `POST /layers` → `PUT /layers/{name}/data/binary`) or the helper `scripts/upload_local_zarr.py` from the spatio-temporal-api repo, which also auto-derives NDVI / NDMI / NDRE / GNDVI / EVI and the RGB / CIR / Agriculture / SWIR composites for you.
4. **Ship the self-description.** Declare inputs, outputs, resource needs, and (optionally) usage policy.
5. **Containerise.** Build a Docker image, push it to your registry.
6. **Register and test.** Use the [submit-your-service](../../ecosystem/submit-service.md) flow to get a UUID, queues and a JWT.
7. **Commission a test run.** Verify heartbeats and result return.
8. **Publish.** Move the service from *draft* to *catalogued*.

## Common patterns

- **Idempotency keys** for commissions so retries don't double-process.
- **Heartbeats every 5–30 s** with completion-% and a short status string.
- **Result writes as Zarr layers**, not file dumps — keep outputs queryable through `/aggregate/*`, `/tiles/*` and STAC.
- **AgroVoc tagging** of any free-text fields you produce (crop, soil class, …).

## Anti-patterns

- Mutating the input bucket (results belong in the output bucket).
- Returning models inline (only return references / pointers).
- Long-running synchronous calls — use the heartbeat protocol instead.

## Reference implementations

- [AgriFoodData SDK](https://github.com/NaLamKI/SDK)
- [AgriFoodData Starter Kit](https://github.com/NaLamKI/Starterkit)
- [Examples · Apple Yield Detection](../../examples/apple-yield.md)

## Publishing checklist

- [ ] Self-description validates against the schema
- [ ] Container image runs against the test commission
- [ ] Heartbeats observed end-to-end
- [ ] Result Zarr layer appears under `GET /api/v2/collections/{id}/layers`
- [ ] `GET /api/v2/collections/{id}/tiles/WebMercatorQuad/tilejson.json?layers=<name>` returns a valid TileJSON
- [ ] STAC item is generated automatically (`GET /api/v2/stac/collections/{id}/items`)
- [ ] Documentation written for end users
