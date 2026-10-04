---
sidebar_position: 2
---

# Packages & Entities

The model has **47 entities in 14 packages**. Each package corresponds to a
clause of the Recommendation (8.1 – 8.14), and each entity to an entry of its
Annex A. Every entity page of the
[reference](https://datamodel.agrifooddata.org/v1/) lists the attributes with
their types, the property of the [ontology](../ontology/overview.md) each one is
bound to, the constraints and an example.

## How the entities relate

Foreign keys are named `<entity>Id`. The main containment structure:

```
Organization
 ├─ User ── AccessAssignment ── Role     access per farm, optionally time-limited
 ├─ Worker                               a person who works, with or without an account
 └─ Farm
     ├─ Site                             barns, silos, farmyards …
     ├─ Field ── Region                  GeoJSON boundaries; regions nest
     │            ├─ CultivationPeriod ── Activity ── ActivityResource, InputOutput
     │            ├─ Stand               perennial plantings
     │            └─ CroppingPlanEntry ── CroppingPlan
     ├─ Task ─────────────▶ Activity     planned work → work carried out
     ├─ Machine ── MaintenanceRecord
     ├─ AnimalGroup ── Animal, AnimalEvent, FeedRation
     ├─ Device ── Observation            sensors; Data ── File for datasets
     ├─ StorageLocation ── StockMovement ── Lot ── Product
     └─ Budget, Certification, RegulatoryReport
```

Across the whole model:

- `ProcessingService → ProcessingJob → Result` — the provenance of automatic work
- `AuditLog` — the append-only record of changes
- `CodeMapping` — canonical concept ↔ code of an external scheme

A few structural ideas are worth knowing before reading the tables:

- **Regions are the unit of work.** A `Field` always has exactly one *default
  region* whose geometry corresponds to the field (rule V05). Cultivation
  periods, stands, plan entries, observations and activities attach to regions,
  and regions may nest through `parentRegionId`.
- **Planning and execution are separate.** `CroppingPlanEntry` and `Task` say
  what is intended; `CultivationPeriod` and `Activity` say what happened. The
  `ValueType` enumeration (`PLANNED`, `ACTUAL`, `ESTIMATION`, `PREDICTION`) does the
  same for individual values.
- **Polymorphic references are exclusive.** `Observation`, `Data`, `InputOutput`,
  `Economics`, `AnimalEvent`, `ActivityResource` and `ProcessingJobInput` can attach
  to several kinds of parent; exactly one reference is set (rule V03).
- **Automatic work is accountable.** Every run of a service is a `ProcessingJob`.
  Records the run creates are marked `SERVICE`, `DEVICE` or `IMPORT` in
  `originType` and carry `createdByJobId`, so the service responsible follows from
  the job (`ProcessingJob.serviceId`).
- **Time series stay outside.** High-frequency data lives in a time-series or
  SensorThings service; a `Device` points there with `sensorThingsUrl`.
- **Derived views are computed, never stored** — stock levels, gross margin,
  nutrient balance, animal performance indicators, crop rotation (see
  [Rules & state models](./rules-and-states.md#derived-views)).

## The packages

### P1 · Party, Users and Access

*Clause 8.1 of the Recommendation.* Multi-tenancy, roles and access, personnel master data.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `Organization` | A legal entity: farm business, cooperative, contractor, adviser, laboratory, authority … — the top-level container within a deployment | [Organization](https://datamodel.agrifooddata.org/v1/Organization.html) |
| `User` | A person with an account; the e-mail address is the login identity | [User](https://datamodel.agrifooddata.org/v1/User.html) |
| `Worker` | A person who works on the holding, with or without a system account | [Worker](https://datamodel.agrifooddata.org/v1/Worker.html) |
| `Address` | The postal address of an organization or a farm | [Address](https://datamodel.agrifooddata.org/v1/Address.html) |
| `Role` | A named set of permissions for role-based access control | [Role](https://datamodel.agrifooddata.org/v1/Role.html) |
| `AccessAssignment` | Grants a role to a user for one farm, optionally limited in time | [AccessAssignment](https://datamodel.agrifooddata.org/v1/AccessAssignment.html) |

### P2 · Farm and Sites

*Clause 8.2 of the Recommendation.* Holding structure, built and technical locations.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `Farm` | An agricultural operation; the main container and the unit access rights are assigned to | [Farm](https://datamodel.agrifooddata.org/v1/Farm.html) |
| `Site` | A built or technical location: barn, greenhouse, silo, farmyard, shed … | [Site](https://datamodel.agrifooddata.org/v1/Site.html) |

### P3 · Fields and Geospatial Data

*Clause 8.3 of the Recommendation.* Field boundaries, management zones, spatial reference.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `Field` | A contiguous parcel of land with a GeoJSON boundary | [Field](https://datamodel.agrifooddata.org/v1/Field.html) |
| `Region` | A defined area within a field — the default region, management zones, experimental plots or areas with particular characteristics | [Region](https://datamodel.agrifooddata.org/v1/Region.html) |

### P4 · Cropping Planning and Cultivation

*Clause 8.4 of the Recommendation.* Crop planning, crop rotation, perennial plantings, cultivation cycles.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `CroppingPlan` | A versioned cropping plan for a harvest year | [CroppingPlan](https://datamodel.agrifooddata.org/v1/CroppingPlan.html) |
| `CroppingPlanEntry` | The crop intended on a region | [CroppingPlanEntry](https://datamodel.agrifooddata.org/v1/CroppingPlanEntry.html) |
| `Stand` | A perennial planting such as an orchard or a vineyard | [Stand](https://datamodel.agrifooddata.org/v1/Stand.html) |
| `CultivationPeriod` | The cultivation of a crop on a region over a period of time | [CultivationPeriod](https://datamodel.agrifooddata.org/v1/CultivationPeriod.html) |

### P5 · Work and Operations Management

*Clause 8.5 of the Recommendation.* Work orders, field record keeping, resource deployment, working time.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `Task` | Work that is planned or ordered and not yet carried out | [Task](https://datamodel.agrifooddata.org/v1/Task.html) |
| `Activity` | An operation that has been carried out: tillage, sowing, application, harvest … | [Activity](https://datamodel.agrifooddata.org/v1/Activity.html) |
| `ActivityResource` | A machine or a person deployed in an activity | [ActivityResource](https://datamodel.agrifooddata.org/v1/ActivityResource.html) |
| `TimeRecord` | Working time, including absence and leave | [TimeRecord](https://datamodel.agrifooddata.org/v1/TimeRecord.html) |

### P6 · Products and Inventory

*Clause 8.6 of the Recommendation.* Inputs and produce, lots, stock movements, traceability.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `Product` | Master data of an input or of produce | [Product](https://datamodel.agrifooddata.org/v1/Product.html) |
| `StorageLocation` | A place at which products are held | [StorageLocation](https://datamodel.agrifooddata.org/v1/StorageLocation.html) |
| `Lot` | A quantity of a product treated as one traceable unit | [Lot](https://datamodel.agrifooddata.org/v1/Lot.html) |
| `StockMovement` | A movement of stock; stock levels are derived from it | [StockMovement](https://datamodel.agrifooddata.org/v1/StockMovement.html) |

### P7 · Machinery and Equipment

*Clause 8.7 of the Recommendation.* Fleet management, machine identity, maintenance.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `Machine` | A machine or an implement | [Machine](https://datamodel.agrifooddata.org/v1/Machine.html) |
| `MaintenanceRecord` | Maintenance, inspection or repair of a machine | [MaintenanceRecord](https://datamodel.agrifooddata.org/v1/MaintenanceRecord.html) |

### P8 · Animal Husbandry

*Clause 8.8 of the Recommendation.* Herd and animal management, animal events, feeding.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `Animal` | An individual animal | [Animal](https://datamodel.agrifooddata.org/v1/Animal.html) |
| `AnimalGroup` | A herd, a group or the occupancy of a pen | [AnimalGroup](https://datamodel.agrifooddata.org/v1/AnimalGroup.html) |
| `AnimalEvent` | An occurrence relating to an animal or a group | [AnimalEvent](https://datamodel.agrifooddata.org/v1/AnimalEvent.html) |
| `FeedRation` | A planned ration for a group of animals | [FeedRation](https://datamodel.agrifooddata.org/v1/FeedRation.html) |
| `FeedRationComponent` | One component of a ration | [FeedRationComponent](https://datamodel.agrifooddata.org/v1/FeedRationComponent.html) |

### P9 · Observations and Data

*Clause 8.9 of the Recommendation.* Sensors, weather, measurements, datasets and files.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `Device` | A sensor, equipment or a station, described as a Thing (W3C WoT) | [Device](https://datamodel.agrifooddata.org/v1/Device.html) |
| `Observation` | The value of an observed property for a feature of interest at a stated time | [Observation](https://datamodel.agrifooddata.org/v1/Observation.html) |
| `Data` | A container for a dataset or a data stream — imagery, laboratory reports, yield maps … | [Data](https://datamodel.agrifooddata.org/v1/Data.html) |
| `DataType` | An extensible categorization of datasets | [DataType](https://datamodel.agrifooddata.org/v1/DataType.html) |
| `File` | A single file belonging to a dataset | [File](https://datamodel.agrifooddata.org/v1/File.html) |

### P10 · Economics

*Clause 8.10 of the Recommendation.* Quantities, monetary valuation, budgets, gross margin.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `InputOutput` | A quantity consumed or produced | [InputOutput](https://datamodel.agrifooddata.org/v1/InputOutput.html) |
| `Economics` | A monetary value attached to a quantity, a stock movement or a deployed resource | [Economics](https://datamodel.agrifooddata.org/v1/Economics.html) |
| `Budget` | Planned values for a scope and a period | [Budget](https://datamodel.agrifooddata.org/v1/Budget.html) |

### P11 · Compliance and Audit

*Clause 8.11 of the Recommendation.* Regulatory reporting, certification, change history.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `RegulatoryReport` | A versioned report generated from operational data for an authority or certification body | [RegulatoryReport](https://datamodel.agrifooddata.org/v1/RegulatoryReport.html) |
| `Certification` | A certification held by the holding | [Certification](https://datamodel.agrifooddata.org/v1/Certification.html) |
| `AuditLog` | Append-only record of changes to records — read-only through the API | [AuditLog](https://datamodel.agrifooddata.org/v1/AuditLog.html) |

### P12 · Data Processing and Decision Support

*Clause 8.12 of the Recommendation.* Processing services and runs, analytics, decision support, provenance anchor.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `ServiceCatalogue` | A registry of available processing services | [ServiceCatalogue](https://datamodel.agrifooddata.org/v1/ServiceCatalogue.html) |
| `ProcessingService` | A service that can be invoked to process data | [ProcessingService](https://datamodel.agrifooddata.org/v1/ProcessingService.html) |
| `ProcessingJob` | One run of a service — the reference point of provenance | [ProcessingJob](https://datamodel.agrifooddata.org/v1/ProcessingJob.html) |
| `ProcessingJobInput` | The data processed by a run | [ProcessingJobInput](https://datamodel.agrifooddata.org/v1/ProcessingJobInput.html) |
| `Result` | The output of a run | [Result](https://datamodel.agrifooddata.org/v1/Result.html) |

### P13 · Sustainability

*Clause 8.13 of the Recommendation.* Environmental and sustainability indicators, monitoring, reporting and verification.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `SustainabilityIndicator` | A sustainability indicator for a farm, field, region, cultivation period, animal group or product lot | [SustainabilityIndicator](https://datamodel.agrifooddata.org/v1/SustainabilityIndicator.html) |

### P14 · Semantics and Interoperability

*Clause 8.14 of the Recommendation.* Binding of canonical concepts to external code systems.

| Entity | Represents | Reference page |
|--------|------------|----------------|
| `CodeMapping` | The correspondence between a canonical concept and a code of an external scheme | [CodeMapping](https://datamodel.agrifooddata.org/v1/CodeMapping.html) |

## Keys that identify a record in the real world

Besides the UUID, some entities have a **business key** that must be unique
(violations are refused as `duplicate-key`, see [Errors](../../api-reference/errors.md)).

| Entity | Unique | Scope |
|--------|--------|-------|
| `User` | `email` | the deployment |
| `Farm` | `farmNumber` | the deployment, where set |
| `Field` | `name` | within `farmId` |
| `Region` | exactly one default region | per `fieldId` (rule V05) |
| `Animal` | `officialId` | within `externalProvider`, i.e. the official numbering scheme |
| `Lot` | `lotNumber` | within `productId`, together with the origin reference for own production |
| `Product` | `registrationNumber` | the authorisation scheme concerned |
| `CodeMapping` | `conceptUri`, `externalScheme`, `externalCode` | the deployment; at most one mapping per concept and scheme is `isPreferred` |

## See it in action

- [Resources](../../api-reference/resources.md) — every entity as an HTTP collection
- [Digital Farm Twin](../digital-farm-twin.md) — the twin as seen by its consumers
