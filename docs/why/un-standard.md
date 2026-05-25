---
sidebar_position: 3
---

# The UN Standard

The AgriFoodData architecture is the reference implementation of the
**ITU/FAO Reference Architecture for Data-Driven Applications in
Agriculture**, adopted by **ITU Study Group 20 in July 2024**. It was
developed by the ITU Focus Group on AI and IoT for Digital Agriculture
(FG-AI4A) in partnership with the FAO.

## Why this matters

- It is a **globally agreed reference**, not a single vendor's blueprint.
- It promotes **interoperability without displacement** — existing FMIS,
  sensor stacks and AI services keep working; they only need to honour the
  integration boundaries.
- It is **publicly documented**, so any party — vendor, government, research
  lab — can implement against it.

## Core principles

1. **Data sovereignty** — farmers retain control over their operational data.
2. **Interoperability** — standardised contracts at the integration boundaries.
3. **Scalability** — handles growing data volumes and a growing service catalogue.
4. **Standardisation** — common interfaces and data models across systems.
5. **Security & privacy** — robust protection for sensitive farm data.
6. **Modularity** — components can be developed and updated independently.
7. **Sustainability** — supports data-driven decisions with environmental impact in view.
8. **Inclusivity** — accessible to farmers of all sizes and technical capabilities.

## What the architecture defines

The architecture specifies **six conceptual building blocks** and **four
OpenAPI interfaces** around **one canonical object** — the *digital farm twin*.

| # | Block | What it defines |
|---|-------|-----------------|
| 01 | **Roles** | Actor roles — farmers, services, sensors, machinery, certification, developers |
| 02 | **System** | Core components — digital farm twin, registry, IAM, app store, dashboard |
| 03 | **Data** | Data models — JSON-LD and Web of Things vocabularies |
| 04 | **API** | Interfaces — data, service, scheduling, clearing-house connectors |
| 05 | **Services** | Service registry — REST API and SDK-based deployment |
| 06 | **Spaces** | Data spaces — Gaia-X and IDSA, controlled exchange, no islands |

See [Concepts → Architecture Overview](../concepts/architecture-overview.md)
for the full breakdown and the integration-layer diagram.

## Further reading

- [ITU Focus Group on AI and IoT for Digital Agriculture](https://www.itu.int/en/ITU-T/focusgroups/ai4a/Pages/default.aspx)
- [ITU Focus Group Deliverable FGAI4A-04](https://www.itu.int/en/ITU-T/focusgroups/ai4a/Documents/Deliverables/FGAI4A-04.pdf)
- [FAO digital agriculture programme](https://www.fao.org/digital-agriculture/)
