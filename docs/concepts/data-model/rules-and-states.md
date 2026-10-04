---
sidebar_position: 3
---

# Rules & State Models

The model does not only list attributes; it states what must hold between
them. Those statements are **integrity rules** (V01 – V16), **state models**
for the status attributes, and **derived views** that are computed rather than
stored. They come from clauses 12 and 13 and Table 4 of the Recommendation.

A *shall* rule is an error when violated, a *should* rule only a warning
(clause 12 of the Recommendation).

## Where a rule is checked

A rule is checked where it can be checked. A single record can be validated
by its JSON Schema; a rule across records needs the dataset or the interface.

| Check | JSON Schema | SHACL, record | SHACL, dataset | Interface |
|-------|:-----------:|:-------------:|:--------------:|:---------:|
| Types, mandatory attributes, enumerations, formats | ✓ | ✓ | | |
| Exclusive references (V03), positive quantities (V02), provenance (V04) | ✓ | ✓ | | |
| Period order (V01), stand dates (V08) | | ✓ | | ✓ |
| References point at a record of the right entity | | | ✓ | ✓ |
| Classifications are concepts of the bound scheme | | | ✓ | ✓ |
| One default region per field (V05), stand on the same region (V08), planned crop (V07), plant protection product behind an application (V09) | | | ✓ | ✓ |
| Business keys, state models, withdrawal periods (V11), stock levels (V12), immutability (V15), overlapping assignments (V16) | | | | ✓ |

A *should* rule is left out of the JSON Schemas; the shapes report it with
severity `Warning`. Over HTTP a violation is reported as a
[problem detail](../../api-reference/errors.md) whose `violations` name the rule
and the attribute.

## The integrity rules

| Rule | Level | Statement |
|------|-------|-----------|
| **V01** | shall | For every period, the closing value (`endsAt`, `validTo`, `periodEnd`) is greater than or equal to the opening value where both are set. |
| **V02** | shall | Quantities (`amount`, `quantity`, `dosage`, `area`, `capacity`, `headCount`) are greater than zero. `Economics.value` may be negative, to permit credits and corrections. |
| **V03** | shall | Exclusive references set exactly one of the permitted references — `InputOutput`, `Observation`, `Data`, `Economics`, `AnimalEvent`, `ActivityResource`, `ProcessingJobInput`. |
| **V04** | shall | Where `originType` is `USER`, `createdByUserId` is set; where it is `SERVICE`, `createdByJobId` is set. |
| **V05** | shall | Every `Field` has exactly one default `Region`, whose geometry corresponds to `Field.geometry`. |
| **V06** | should | `Region.geometry` lies within `Field.geometry` (within a tolerance); `Activity.geometry` lies within the geometry of the spatial unit it references. |
| **V07** | should | Several `CultivationPeriod` records may exist in parallel for one `Region` (mixed cropping, undersowing, agroforestry). Where `planEntryId` is set, `typeUri` corresponds to `CroppingPlanEntry.cropUri`. |
| **V08** | shall | `Stand.clearingDate` ≥ `Stand.plantingDate`, and `CultivationPeriod.standId` references a `Stand` of the same `Region`. |
| **V09** | shall / should | An `Activity` that applies a plant protection product has at least one `InputOutput` referencing a `Product` of category `PLANT_PROTECTION`. `bbchStage` should be set, and the person recorded through `ActivityResource` should hold a valid certificate in `Worker.certifications`. |
| **V10** | shall | An `InputOutput` referencing a `PLANT_PROTECTION` or `VETERINARY_MEDICINE` product sets `productId`, so that authorisation number and withdrawal period are resolvable. |
| **V11** | shall | For a treatment `AnimalEvent` with a product whose `withdrawalPeriodDays` is set, `withdrawalUntilMilk` and `withdrawalUntilMeat` are calculated and stored; a departure or delivery before the period ends raises a blocking warning. |
| **V12** | should | A `StockMovement` should not make a derived stock level negative; `ADJUSTMENT` movements are exempt. |
| **V13** | shall | A `Lot` sets at most one own-production origin (`originCultivationPeriodId` or `originAnimalGroupId`); purchased lots set `supplierOrganizationId`. |
| **V14** | should | New references to records withdrawn from use (terminal status or past `endsAt`) are prevented; existing references stay valid. |
| **V15** | shall | A `RegulatoryReport` is immutable from `SUBMITTED` onwards. Corrections go through a new report referencing the earlier one via `supersedesReportId`. |
| **V16** | shall | Validity periods of `AccessAssignment` records do not overlap for the same `userId`, `farmId` and `roleId`. |

The authoritative wording is on the
[rules page](https://datamodel.agrifooddata.org/v1/rules.html).

## State models

A status attribute may only change along the transitions below. Any other
change is refused with `409` and the problem type `invalid-transition`. A
**terminal** state is not left: a record in a terminal state is corrected
through the `AuditLog`, and a submitted regulatory report through a new report.
The value a record is *created* with is not a transition.

| Entity | Transitions | Terminal |
|--------|-------------|----------|
| `Task` | `PLANNED → ASSIGNED → IN_PROGRESS → COMPLETED`; `ASSIGNED → PLANNED` (assignment withdrawn); `PLANNED`, `ASSIGNED`, `IN_PROGRESS → CANCELLED` | `COMPLETED`, `CANCELLED` |
| `CultivationPeriod` | `PLANNED → ACTIVE → COMPLETED`; `PLANNED`, `ACTIVE → ABORTED` | `COMPLETED`, `ABORTED` |
| `Activity` | `IN_PROGRESS → COMPLETED`; `IN_PROGRESS → ABORTED` | `COMPLETED`, `ABORTED` |
| `ProcessingJob` | `PENDING → RUNNING → SUCCEEDED`; `RUNNING → FAILED`; `PENDING`, `RUNNING → CANCELLED` | `SUCCEEDED`, `FAILED`, `CANCELLED` |
| `RegulatoryReport` | `DRAFT → GENERATED → SUBMITTED → ACCEPTED`; `SUBMITTED → REJECTED`; `REJECTED → GENERATED` (regenerated); `GENERATED → DRAFT` (artefact discarded) | `ACCEPTED` |
| `CroppingPlan` | `DRAFT → ACTIVE → ARCHIVED`; `DRAFT → ARCHIVED` | `ARCHIVED` |
| `Animal` | `ACTIVE → SOLD`, `SLAUGHTERED`, `DEAD`, `TRANSFERRED` | all but `ACTIVE` |
| `User` | `INVITED → ACTIVE → DEACTIVATED`; `DEACTIVATED → ACTIVE` (reactivated) | — |
| `Machine` | `ACTIVE ⇄ INACTIVE`; `ACTIVE`, `INACTIVE → SOLD` | `SOLD` |
| `Device` | `ACTIVE ⇄ INACTIVE`; `ACTIVE ⇄ FAULTY` | — |

A rejected `RegulatoryReport` is either regenerated, or corrected by a new
report that references the earlier one; from `SUBMITTED` onwards a report is
otherwise immutable (V15).

The values of every enumeration are listed on the
[enumerations page](https://datamodel.agrifooddata.org/v1/enumerations.html);
each is a class of the ontology and each value one of its named individuals.

## Derived views

Some quantities are **derived** from stored records and never stored
themselves.

| View | Derived from | Over HTTP |
|------|--------------|-----------|
| **Stock level** | `StockMovement`: a movement adds its quantity at `toStorageLocationId` and subtracts it at `fromStorageLocationId`, per product, lot and unit. Levels in different units are not added up. | `GET /stock-levels` |
| **Gross margin** | `Economics`, `InputOutput`, `ActivityResource`, `Machine`, `Worker`: outputs less inputs and the machine and labour deployed; where an `Economics` record is absent, `Machine.costRatePerHour` and `Worker.costRatePerHour` times the recorded duration. | an application concern |
| **Nutrient balance** | `InputOutput` together with `Product.composition` | an application concern |
| **Animal performance** | `AnimalEvent` and `Observation`: lactation yield, calving interval, daily weight gain, replacement rate … | an application concern |
| **Crop rotation** | the sequence of `CroppingPlanEntry` and `CultivationPeriod` for a region across harvest years; rules on the sequence are validation logic, not model structure | an application concern |

## What deliberately does not live in the model

- **Usage policies.** They belong to the data-space or identity layer,
  expressed in a policy language such as [ODRL](https://www.w3.org/TR/odrl-model/).
  The model only records the resource identifiers (`iamResourceId`) they are
  bound through. See [Identity & Access](../iam.md).
- **Time series.** High-frequency data stays in a time-series or SensorThings
  service; `Device.sensorThingsUrl` points there.
- **The vocabulary.** Concepts and code lists live in the
  [ontology](../ontology/overview.md) and are referenced by identifier, never
  copied into the schemas.
- **A provenance export.** The provenance attributes map onto properties that
  are sub-properties of [PROV-O](https://www.w3.org/TR/prov-o/); the export
  endpoint itself is an implementation matter.

## See it in action

- [Errors](../../api-reference/errors.md) — how violations are reported over HTTP
- [Synchronization](../../api-reference/synchronization.md) — how retention and deletion reach offline clients
