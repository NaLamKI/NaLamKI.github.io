---
sidebar_position: 2
---

# Architecture Overview

AgriFoodData is structured along **three pillars** — *data acquisition*,
*data management*, and *data sharing* — wrapped around a single canonical
object, the **digital farm twin**.

The architecture functions as an **integration layer**. It does not replace
existing FMIS, sensor stacks or AI services; it gives them a common contract.

## The integration layer

```
        Edge devices       Machinery            Services
        Sensors & IoT      FMIS & tractors      GeoAI providers
              │                │                    │
              ▼                ▼                    ▼
       ┌─────────────┐  ┌────────────┐    ┌────────────────┐
       │ Data        │  │ Service    │    │ Scheduling     │
       │ connector   │  │ connector  │    │ connector      │
       └─────────────┘  └────────────┘    └────────────────┘
                          │  │  │
                          ▼  ▼  ▼
       ┌──────────────────────────────────────────────────┐
       │     Digital farm twin · JSON-LD / WoT            │
       └──────────────────────────────────────────────────┘
                          ▲  ▲  ▲
       ┌─────────────┐  ┌────────────┐    ┌────────────────┐
       │ IAM &       │  │ App /      │    │ Clearing       │
       │ consent     │  │ service    │    │ house          │
       │             │  │ store      │    │                │
       └─────────────┘  └────────────┘    └────────────────┘
                                │
                                ▼
       ┌──────────────────────────────────────────────────┐
       │ Data spaces · Gaia-X · IDSA · external catalogues │
       └──────────────────────────────────────────────────┘
```

> The blueprint **does not replace** existing FMIS, sensor stacks or AI
> services — it gives them a common contract.

## The six consented building blocks

| # | Block | Status |
|---|-------|--------|
| 01 | Actor roles | Consented |
| 02 | Core system components | Consented |
| 03 | Data models | Consented |
| 04 | API interfaces | Consented |
| 05 | Service registry | Consented |
| 06 | Data spaces (Gaia-X / IDSA) | Draft |

## The digital farm APIs

| API | Role |
|-----|------|
| [Digital Farm API](./apis/digital-farm-api.md) | The REST binding of the data model — master data and operations: organisations, users, farms, fields, regions, cultivation, work, products, machines, animals, observations, economics, compliance, processing runs |
| [Sensor Things API](./apis/sensor-things-api.md) | IoT sensor management & real-time observations |
| [Spatio-Temporal API](./apis/spatio-temporal-api.md) | Maps, layers, rasters, vectors, AI outputs |

## See it in action

- [Quickstart](../quickstart/overview.md) — first running service in under 30 minutes
- [Case Study · GeoAI Telangana](../examples/geoai-telangana.md) — full architecture in production
