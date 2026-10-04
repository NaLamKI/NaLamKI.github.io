---
sidebar_position: 2
---

# Concept Schemes & Code Lists

Every classification in a record — the type of an activity, the crop of a
cultivation period, the species of an animal — is a **concept of a SKOS
scheme**. Which scheme feeds which attribute is part of the ontology: the
schema binds the classification attributes listed below to their scheme, so an
application knows which picker to offer and a validator knows what to accept.
Some `…Uri` attributes have **no scheme yet** — varieties, breeds, cost
categories and others; they take any dereferenceable URI, AGROVOC first.

## The 17 concept schemes

Each scheme is available at `https://w3id.org/agrifooddata/<scheme>` (see
[content negotiation](./using-the-ontology.md#resolving-an-identifier)).

| Scheme | Holds | Authority | Feeds |
|--------|-------|-----------|-------|
| `crops` | Crops | BVL code list, with own identifiers; mapped onto AGROVOC in part | `CultivationPeriod.typeUri`, `CroppingPlanEntry.cropUri`, `Stand.cropUri` |
| `farm-types` | Farm types | AGROVOC | `Farm.farmTypeUri` |
| `land-use` | Land use | AGROVOC | `Field.landUseUri` |
| `product-classes` | Product classes | AGROVOC | `Product.typeUri`, `InputOutput.typeUri` |
| `activity-types` | Types of activity | AGROVOC | `Activity.typeUri`, `Task.typeUri` |
| `site-types` | Site and storage types | AGROVOC | `Site.siteTypeUri`, `StorageLocation.storageTypeUri` |
| `machine-categories` | Machine categories | AGROVOC | `Machine.categoryUri` |
| `device-types` | Device types | AGROVOC | `Device.deviceTypeUri` |
| `pests` | Pests and disorders | BVL code list; EPPO codes via `CodeMapping` | `Observation.observedPropertyUri` |
| `observed-properties` | Measured quantities | SOSA/SSN, QUDT, AGROVOC | `Observation.observedPropertyUri` |
| `animal-species` | Animal species | AGROVOC | `Animal.speciesUri`, `AnimalGroup.speciesUri` |
| `event-types` | Animal event types | ICAR ADE | `AnimalEvent.eventTypeUri` |
| `phenology` | BBCH growth stages | BBCH / BVL | `Activity.bbchStage` (by notation) |
| `regions` | Region types — so far the default region | agrifooddata (own curation) | `Region.typeUri` |
| `report-types` | Report types | agrifooddata (own curation) | `RegulatoryReport.reportTypeUri` |
| `soil-glosis` | Soil properties | GloSIS, WRB | `Observation.observedPropertyUri` — *scaffold* |
| `environment-envo` | Environmental context | ENVO | — *scaffold* |

Three notes on reading the table:

- `Observation.observedPropertyUri` takes a concept from **any of three**
  schemes: `observed-properties`, `pests` or `soil-glosis`. The ontology states
  this as one restriction over their union.
- Alignments to INSPIRE HILUCS (land use) and SAREF4AGRI (device types) are
  foreseen but not yet substantiated; see
  [Standards the ontology builds on](#standards-the-ontology-builds-on).
- `Activity.bbchStage` is a *code*, not an identifier: it holds the
  `skos:notation` of a concept in `phenology` (`"32"`), bound with
  `agfoda:notationFrom` instead of a value restriction.
- Schemes marked *scaffold* are structure without substance yet. The
  ontology says so rather than inventing content.

## Identifiers and codes

Everything else in the vocabulary hangs on a distinction between two
mechanisms.

| | **Dereferenceable identifier** | **Code list** |
|---|---|---|
| Appears in | `typeUri`, `cropUri`, `speciesUri` … | `externalScheme` + `externalCode` (a `CodeMapping` row) |
| What sits in the data | an IRI | a code **and** the register it came from |
| In RDF | `agfoda:typeUri <IRI>` | `skos:notation` on the concept; a row in the code list |
| Time | holds indefinitely | `validFrom` / `validTo`; one `isPreferred` per pair |
| When the authority changes | nothing — the identifier stays | the row gets a `validTo` |

**The rule in one sentence:** stable, globally unique and resolvable → an
*identifier*. Retired, merged or only valid for a period → a *code*.

### AGROVOC is an identifier

A concept with a verified AGROVOC counterpart carries the AGROVOC IRI as its
own, in a scheme of ours:

```turtle
<http://aims.fao.org/aos/agrovoc/c_10795> a skos:Concept ;
    skos:inScheme <https://w3id.org/agrifooddata/activity-types> ;
    skos:notation "fertilization" ;
    skos:prefLabel "Düngung"@de, "Fertilization"@en .
```

Labels are *not* redistributed from AGROVOC — only a label of the ontology's
own, verified against the AGROVOC service. A client that needs AGROVOC's labels
queries AGROVOC.

### EPPO is a code

EPPO retires codes and merges taxa, while a plant protection record has to be
kept for years. So a crop keeps an identifier of its own, and the EPPO code
hangs off it twice — as `skos:notation` (so it can be searched for) and in the
code list (so the mapping can be dated):

```csv
# codelists/eppo.csv
conceptUri,externalCode,label,validFrom,validTo,isPreferred
https://w3id.org/agrifooddata/crops#TRZAW,TRZAW,Winterweichweizen,,,true
```

A code is only recorded where EPPO's code names the *organism* the BVL names —
a code that merely exists is not enough, because some BVL codes are the EPPO
codes of another taxon.

## Code lists

Five code lists ship with the ontology. Four of them are reached in a record
through the data model's `CodeMapping` entity; the BVL registrations are the
exception.

| Code list | Role | Notes |
|-----------|------|-------|
| **EPPO** | crop and pest codes | mandatory in German plant protection records; checked against the EPPO database |
| **BBCH** | growth stages | the code is also the `skos:notation` of the concept |
| **BVL registrations** | authorised plant protection products (Germany) | with validity period; the one list **without** a concept reference — a registration number denotes a commercial product, and the link is made at the `Product` record (`registrationNumber`) |
| **ICAR ADE** | animal event codes | for `event-types` |
| **ISOBUS DDI** | machine and process quantities of ISO 11783-11 | the DDI rows point at AGROVOC identifiers |

## Named gaps

A named gap beats an invented row. Where a scheme or code list is foreseen but
nothing verifiable exists, the registry says `unsubstantiated` and gives the
reason. Currently so named: KTBL cost categories, the EU variety catalogue
(CPVO), FAO DAD-IS breeds, GS1 GTIN, WRB, Crop Ontology, IPCC/GHG categories and
ESRS data points. Likewise, the mapping of crops and pests onto AGROVOC is
**partial** — the rest, and the growth stages of `phenology`, carry no mapping
yet. The Recommendation asks for it (clause 7.2); the gap is listed in the
data model's
[divergences](https://datamodel.agrifooddata.org/v1/divergences.html).

## Standards the ontology builds on

| Vocabulary | For |
|------------|-----|
| SKOS | the language the concept schemes are written in |
| SOSA/SSN | observation and sensor in RDF |
| UCUM | the unit **as a string in the data** (`"L/har"`) |
| QUDT | the unit **as an IRI in RDF** (`unit:L-PER-HA`) — a different layer; never both in one column |
| GeoSPARQL | geometry in RDF; GeoJSON stays the storage form |
| PROV-O | provenance, of records and of the vocabulary |
| OWL-Time | temporal statements beyond ISO 8601 |
| W3C Org | farm, organisation, roles |
| DCAT-AP | the vocabulary describes itself as a dataset |
| ISO 19156 | the observation model behind SOSA |
| ISO 4217 | currency of every monetary amount |
| ITU-T Y.4000 / Y.2060 | the IoT reference model the classes map onto |

Further alignment targets (ITU-T Y.4417, the domain architecture the schema
implements; SAREF4AGRI, INSPIRE HILUCS, FOODIE, ADAPT, ISO 19115-1, OGC
SensorThings, OGC API – Features, WoT Thing Description) are named with the
concrete artefact they would produce; the ontology distinguishes **compatible**
(data can be exchanged or mapped without loss of meaning) from **aligned**
(conceptual correspondence only). Formal conformance is claimed for neither.
The full reasoning is in
[INTEROP.md](https://github.com/NaLamKI/ontology/blob/main/INTEROP.md)
([as a page](https://ontology.agrifooddata.org/interop.html)).

## See it in action

- [Using the ontology](./using-the-ontology.md) — look a concept up, search, validate
- [Data model · Entities](../data-model/entities.md) — the attributes that take these values
