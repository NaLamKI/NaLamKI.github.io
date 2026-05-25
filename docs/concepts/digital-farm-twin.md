---
sidebar_position: 3
---

# Digital Farm Twin

The **digital farm twin** is the canonical object at the centre of the
platform. It is the virtual representation of all physical and operational
entities of a farm — and the contract the four APIs cooperate around.

## Entities

| Entity | Source API |
|--------|------------|
| **Organisation** | Farm |
| **Farm** | Farm |
| **Field** | Farm |
| **Region (ROI)** | Farm |
| **Sensor & Datastream** | Sensor Things |
| **Map & Layer** | Spatio-Temporal |
| **Activity** | Activity |
| **Service & Result** | Service Registry |

## Properties

- **Spatial.** Every locatable entity carries a GeoJSON geometry or a STA
  Location.
- **Temporal.** Every observation, activity and layer carries a timestamp;
  history is queryable.
- **Semantic.** Entities can be tagged with [AgroVoc](../why/open-standards-backbone.md)
  concepts for cross-language and cross-platform interpretability.
- **Relational.** Every record links back to its parents and to the records
  of other APIs (e.g. an Activity references a Field, the Sensors used and
  the Layers produced).

## See it in action

- [Data Model & Ontology](./data-model.md) — JSON-LD shape and an example payload
- [Concepts · Architecture Overview](./architecture-overview.md) — where the twin sits in the stack
