---
sidebar_position: 3
---

# Digital Farm Twin

The **digital farm twin** is the canonical object at the centre of the
platform. It is the virtual representation of all physical and operational
entities of a farm — and the contract the digital farm APIs cooperate around.

## Entities

| Entity | Source |
|--------|--------|
| **Organization**, **Farm**, **Site** | Digital Farm API |
| **Field**, **Region (ROI)** | Digital Farm API |
| **CultivationPeriod**, **Stand**, **CroppingPlan** | Digital Farm API |
| **Task**, **Activity** | Digital Farm API |
| **Product**, **Lot**, **StockMovement**, **Machine**, **Animal** … | Digital Farm API |
| **Device** and **Observation** records | Digital Farm API |
| **Sensor & Datastream** (high-frequency series) | Sensor Things — referenced by `Device.sensorThingsUrl` |
| **Map & Layer** | Spatio-Temporal |
| **ProcessingService**, **ProcessingJob**, **Result** | Digital Farm API |

The digital farm API serves 47 entities in 14 packages; see
[Packages & Entities](./data-model/entities.md).

## Properties

- **Spatial.** Fields, regions, sites and activities carry a GeoJSON geometry;
  other locatable entities — devices, machines, observations — point at a region
  or a site (or, for sensors, at a STA Location).
- **Temporal.** Every observation, activity and layer carries a timestamp;
  history is queryable.
- **Semantic.** Classifications are concepts of the [ontology](./ontology/overview.md),
  with [AGROVOC](../why/open-standards-backbone.md) as primary vocabulary, for
  cross-language and cross-platform interpretability.
- **Relational.** Every record links back to its parents by foreign key
  (e.g. an Activity references the Region it was carried out on, the Task it
  fulfils and the CultivationPeriod it belongs to; the machines and people
  deployed and the inputs and outputs are records of their own that point back
  at it).

## See it in action

- [Data Model](./data-model/overview.md) — the entities, conventions and an example payload
- [Ontology](./ontology/overview.md) — the vocabulary behind every `…Uri` attribute
- [Concepts · Architecture Overview](./architecture-overview.md) — where the twin sits in the stack
