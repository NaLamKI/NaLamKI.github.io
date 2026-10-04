---
sidebar_position: 3
---

# Resources

Every entity of the [data model](../concepts/data-model/entities.md) is a
collection at `/{collection}` below the API base (`https://{host}/v1`).
Collections follow the same [conventions](./conventions.md): list, read,
create-or-replace, patch, delete — each needing a permission of the form
`<entity>:<action>`.

- **Operations:** *list* `GET /{collection}`, *get* `GET /{collection}/{id}`,
  *create/replace* `PUT /{collection}/{id}`, *patch* `PATCH /{collection}/{id}`,
  *delete* `DELETE /{collection}/{id}`.
- **Permission prefix:** the entity name in `camelCase`, followed by the
  action — `read`, `create`, `update` or `delete`. For `/fields` that is
  `field:read`, `field:create`, `field:update`, `field:delete`.
- **Filters:** each collection filters on its reference and enumeration
  attributes and on `originType`. The exact list per collection is in the
  [OpenAPI description](https://datamodel.agrifooddata.org/v1/openapi.yaml); each
  entity's [reference page](https://datamodel.agrifooddata.org/v1/) lists its
  attributes, constraints and state model.

The 47 collections, by package:

### P1 · Party, Users and Access

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/organizations` | `Organization` | list, get, create/replace, patch, delete | `organization:` |
| `/users` | `User` | list, get, create/replace, patch, delete | `user:` |
| `/workers` | `Worker` | list, get, create/replace, patch, delete | `worker:` |
| `/addresses` | `Address` | list, get, create/replace, patch, delete | `address:` |
| `/roles` | `Role` | list, get, create/replace, patch, delete | `role:` |
| `/access-assignments` | `AccessAssignment` | list, get, create/replace, patch, delete | `accessAssignment:` |

### P2 · Farm and Sites

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/farms` | `Farm` | list, get, create/replace, patch, delete | `farm:` |
| `/sites` | `Site` | list, get, create/replace, patch, delete | `site:` |

### P3 · Fields and Geospatial Data

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/fields` | `Field` | list, get, create/replace, patch, delete | `field:` |
| `/regions` | `Region` | list, get, create/replace, patch, delete | `region:` |

### P4 · Cropping Planning and Cultivation

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/cropping-plans` | `CroppingPlan` | list, get, create/replace, patch, delete | `croppingPlan:` |
| `/cropping-plan-entries` | `CroppingPlanEntry` | list, get, create/replace, patch, delete | `croppingPlanEntry:` |
| `/stands` | `Stand` | list, get, create/replace, patch, delete | `stand:` |
| `/cultivation-periods` | `CultivationPeriod` | list, get, create/replace, patch, delete | `cultivationPeriod:` |

### P5 · Work and Operations Management

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/tasks` | `Task` | list, get, create/replace, patch, delete | `task:` |
| `/activities` | `Activity` | list, get, create/replace, patch, delete | `activity:` |
| `/activity-resources` | `ActivityResource` | list, get, create/replace, patch, delete | `activityResource:` |
| `/time-records` | `TimeRecord` | list, get, create/replace, patch, delete | `timeRecord:` |

### P6 · Products and Inventory

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/products` | `Product` | list, get, create/replace, patch, delete | `product:` |
| `/storage-locations` | `StorageLocation` | list, get, create/replace, patch, delete | `storageLocation:` |
| `/lots` | `Lot` | list, get, create/replace, patch, delete | `lot:` |
| `/stock-movements` | `StockMovement` | list, get, create/replace, patch, delete | `stockMovement:` |

### P7 · Machinery and Equipment

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/machines` | `Machine` | list, get, create/replace, patch, delete | `machine:` |
| `/maintenance-records` | `MaintenanceRecord` | list, get, create/replace, patch, delete | `maintenanceRecord:` |

### P8 · Animal Husbandry

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/animals` | `Animal` | list, get, create/replace, patch, delete | `animal:` |
| `/animal-groups` | `AnimalGroup` | list, get, create/replace, patch, delete | `animalGroup:` |
| `/animal-events` | `AnimalEvent` | list, get, create/replace, patch, delete | `animalEvent:` |
| `/feed-rations` | `FeedRation` | list, get, create/replace, patch, delete | `feedRation:` |
| `/feed-ration-components` | `FeedRationComponent` | list, get, create/replace, patch, delete | `feedRationComponent:` |

### P9 · Observations and Data

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/devices` | `Device` | list, get, create/replace, patch, delete | `device:` |
| `/observations` | `Observation` | list, get, create/replace, patch, delete | `observation:` |
| `/data` | `Data` | list, get, create/replace, patch, delete | `data:` |
| `/data-types` | `DataType` | list, get, create/replace, patch, delete | `dataType:` |
| `/files` | `File` | list, get, create/replace, patch, delete | `file:` |

### P10 · Economics

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/input-outputs` | `InputOutput` | list, get, create/replace, patch, delete | `inputOutput:` |
| `/economics` | `Economics` | list, get, create/replace, patch, delete | `economics:` |
| `/budgets` | `Budget` | list, get, create/replace, patch, delete | `budget:` |

### P11 · Compliance and Audit

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/regulatory-reports` | `RegulatoryReport` | list, get, create/replace, patch, delete | `regulatoryReport:` |
| `/certifications` | `Certification` | list, get, create/replace, patch, delete | `certification:` |
| `/audit-logs` | `AuditLog` | list, get | `auditLog:` |

### P12 · Data Processing and Decision Support

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/service-catalogues` | `ServiceCatalogue` | list, get, create/replace, patch, delete | `serviceCatalogue:` |
| `/processing-services` | `ProcessingService` | list, get, create/replace, patch, delete | `processingService:` |
| `/processing-jobs` | `ProcessingJob` | list, get, create/replace, patch, delete | `processingJob:` |
| `/processing-job-inputs` | `ProcessingJobInput` | list, get, create/replace, patch, delete | `processingJobInput:` |
| `/results` | `Result` | list, get, create/replace, patch, delete | `result:` |

### P13 · Sustainability

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/sustainability-indicators` | `SustainabilityIndicator` | list, get, create/replace, patch, delete | `sustainabilityIndicator:` |

### P14 · Semantics and Interoperability

| Resource | Entity | Operations | Permission prefix |
|----------|--------|------------|-------------------|
| `/code-mappings` | `CodeMapping` | list, get, create/replace, patch, delete | `codeMapping:` |

## Beyond the collections

| Path | What it is | Permission |
|------|------------|------------|
| `GET /stock-levels` | **derived** stock levels, computed from the stock movements and never stored; filters `productId`, `lotId`, `storageLocationId` | `stockMovement:read` |
| `GET /features` and below | fields, regions and sites as [OGC API – Features](./geospatial-features.md) | `field:read`, `region:read`, `site:read` |

## A few resources worth knowing

**`/audit-logs`** is read-only. It is where synchronising clients learn of
**deletions** (`action=DELETE`) and where the reasons for corrections are
recorded (`reason`). Filters: `entityType`, `entityId`, `action`,
`changedByUserId`, `changedByJobId`, `originType`.

**`/processing-jobs`** is how automatic work becomes accountable: create a job
before a run writes data, send its id as `Processing-Job-Id` on the writes, and
every record the run creates names the job in `createdByJobId`. The job names
its `ProcessingService` (`serviceId`), which names its provider.

**`/roles` and `/access-assignments`** hold the data model's own access
control — see [Identity, Authentication & Access](../concepts/iam.md#roles-and-access-in-the-data-model).

**`/code-mappings`** binds canonical concepts to codes of external schemes
(EPPO, BBCH, ISOBUS …) — see the [ontology](../concepts/ontology/concept-schemes.md#code-lists).

**`/files`** holds the *record* of a file (name, type, size, checksum, `storageUrl`),
not its bytes; transferring contents is not part of the binding.

## See it in action

- [Getting started](../quickstart/getting-started.md) — create a farm, a field and a task
- [Data model · Entities](../concepts/data-model/entities.md) — what each resource represents
