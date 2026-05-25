---
sidebar_position: 5
---

# Service Registry & Lifecycle

The **service registry** is how third-party services become first-class
citizens of the platform. It is the structural answer to the chicken-and-egg
dilemma: any vendor can publish a service against the documented contract,
and any operator can subscribe to it.

## Lifecycle

```
1. Self-description  →  the service describes its inputs/outputs and resource needs
2. Registration       →  the platform issues a UUID, queues and a JWT/certificate
3. Discovery          →  the service appears in the catalogue, browsable per role
4. Commissioning      →  a user (or another service) commissions a run
5. Heartbeat          →  the worker emits progress, ETA, and errors
6. Result return      →  outputs are written back (often as Spatio-Temporal layers)
7. Audit              →  every step is recorded in the activity / audit log
```

## What "self-description" means

A service ships a small manifest that declares:

- **Inputs** — what kind of data the service expects (image, time series,
  raster layer, a region of interest, …).
- **Outputs** — what it produces and where it should land (a Layer in a
  given Map, an Activity result, a JSON record, …).
- **Resource needs** — GPU/CPU, expected runtime, batch vs. real-time.
- **Pricing / policy** (optional) — billing model and any usage policy
  (linked into the clearing-house — see [Data Sovereignty](./data-sovereignty.md)).

## Messaging

Commissioning and heartbeats use **RabbitMQ** queues. Each service has its
own UUID-identified queue; workers consume from it and acknowledge messages.
JWT/certificate-based authentication gates queue access.

## See it in action

- [Build · AI Services](../build/ai-services/overview.md)
- [Ecosystem · Submit Your Service](../ecosystem/submit-service.md)
- [API Reference · Service Registry](../api-reference/service-registry.md)
