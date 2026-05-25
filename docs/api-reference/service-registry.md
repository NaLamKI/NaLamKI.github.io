---
sidebar_position: 7
---

# Service Registry API

**Status:** **out-of-band today** — service onboarding is handled by the
maintainers; a self-service REST surface is on the [Roadmap](../ecosystem/roadmap.md).

## How it works right now

1. You build your service against the [SDK](../build/ai-services/overview.md) and the [Starter Kit](../quickstart/first-ai-service.md).
2. You open a request via the [Submit Your Service](../ecosystem/submit-service.md) workflow.
3. The maintainers provision a **UUID**, dedicated **RabbitMQ queues**, and a **JWT/certificate** bound to the service.
4. The service consumes commissions from its queue and writes results back through the existing platform APIs:
   - record / attachment payloads via the [Activity API](./activity.md)
   - sensor outputs (e.g. inferred soil moisture) via the [Sensor Things API](./sensor-things.md)

## What the future API will expose

Once self-service registration ships, this page will document:

```
GET  /services
POST /services
GET  /services/{id}
PUT  /services/{id}
GET  /services/{id}/commissions
POST /services/{id}/commissions
GET  /services/{id}/results
```

— with the **self-description schema** (inputs, outputs, resource needs)
defined alongside.

See [Concepts · Service Registry & Lifecycle](../concepts/service-registry.md) for the
target lifecycle.
