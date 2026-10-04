---
sidebar_position: 2
---

# Digital Farm API

## Purpose

The digital farm API serves the **whole data model** — the agricultural master
data *and* everything that happens on the farm — through one uniform REST
interface: organisations, users and their access, farms, sites, fields and
regions, cropping plans and cultivation periods, tasks and activities, products
and stock, machines, animals, observations, economics, compliance records,
processing runs and results.

Master data and operations are not two APIs. A `Field` and an `Activity` on it
are records of the same model, read and written the same way, linked by foreign
keys.

## Underlying standards

- The **data model** of the draft ITU-T Recommendation *Data model for digital
  agriculture and farm management systems* — see
  [Data Model](../data-model/overview.md).
- **OpenAPI 3.1** for the interface description.
- **JSON** (canonical), **GeoJSON** ([RFC 7946](https://www.rfc-editor.org/rfc/rfc7946))
  for geometry, **JSON-LD 1.1** on request.
- **OGC API – Features** for fields, regions and sites.
- **HTTP semantics** ([RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)),
  **JSON Merge Patch** ([RFC 7396](https://www.rfc-editor.org/rfc/rfc7396)) and
  **Problem Details** ([RFC 9457](https://www.rfc-editor.org/rfc/rfc9457)).
- **OpenID Connect / OAuth 2.0** for authentication — see
  [Identity, Authentication & Access](../iam.md).
- The [ontology](../ontology/overview.md) for the meaning of every `…Uri`
  attribute, with **AGROVOC** as primary vocabulary.

## Core resources

Every entity is a collection. The 47 collections fall into 14 packages:

| Package | Collections (examples) |
|---------|------------------------|
| Party, users and access | `/organizations`, `/users`, `/workers`, `/roles`, `/access-assignments` |
| Farm and sites | `/farms`, `/sites` |
| Fields and geospatial data | `/fields`, `/regions` |
| Cropping planning and cultivation | `/cropping-plans`, `/stands`, `/cultivation-periods` |
| Work and operations | `/tasks`, `/activities`, `/activity-resources`, `/time-records` |
| Products and inventory | `/products`, `/lots`, `/stock-movements` |
| Machinery and equipment | `/machines`, `/maintenance-records` |
| Animal husbandry | `/animals`, `/animal-groups`, `/animal-events`, `/feed-rations` |
| Observations and data | `/devices`, `/observations`, `/data`, `/files` |
| Economics | `/input-outputs`, `/economics`, `/budgets` |
| Compliance and audit | `/regulatory-reports`, `/certifications`, `/audit-logs` |
| Data processing and decision support | `/processing-services`, `/processing-jobs`, `/results` |
| Sustainability | `/sustainability-indicators` |
| Semantics and interoperability | `/code-mappings` |

The hierarchy that matters most is **Organization → Farm → Field → Region**. A
*Region* is the unit work attaches to: cultivation periods, stands, plan
entries, observations and activities all point at regions, and regions nest.
The complete list is in [Resources](../../api-reference/resources.md).

## Capabilities

- **One pattern for everything.** List, read, create-or-replace, patch, delete —
  with the same headers, status codes and errors on every collection.
- **Offline-first by design.** The client generates the UUID; collections list in
  `updatedAt` order with a cursor; per-attribute last-write-wins merging.
  See [Synchronization](../../api-reference/synchronization.md).
- **The model's rules are enforced.** Integrity rules V01–V16, state models and
  business keys come back as problem details naming the rule.
  See [Rules & state models](../data-model/rules-and-states.md).
- **Provenance on every record.** Who or what created it — a person, or a
  processing run — is set by the server from the authenticated caller.
- **Access per farm.** Each operation names the permission it needs; roles and
  access assignments say who holds it on which farm.
- **Geospatial.** Fields, regions and sites are also served as OGC API – Features,
  with bounding-box and time filters.
- **Semantic.** The same record is available as JSON-LD, on the ontology's own
  properties.

## Minimal example

```bash
API="https://api.example.org/v1"
FARM=997142c3-14cf-5cb4-b260-048af4b57a76

# what land does the farm have?
curl -s -H "Authorization: Bearer $TOKEN" "$API/fields?farmId=$FARM"

# plan some work — the client chooses the id; create-only, safe to repeat
curl -s -X PUT "$API/tasks/3f6c1f0e-8a1d-4b52-9d0b-6c7d5a2b1e44" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -H "If-None-Match: *" \
  -d '{ "name": "Fungicide treatment", "farmId": "'"$FARM"'", "status": "PLANNED",
        "typeUri": "http://aims.fao.org/aos/agrovoc/c_5978" }'
```

## See it in action

- [Getting started](../../quickstart/getting-started.md) — from sign-in to a first record
- [API Reference](../../api-reference/overview.md) — conventions, resources, synchronisation, errors
