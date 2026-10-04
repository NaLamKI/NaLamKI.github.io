---
sidebar_position: 4
---

# Representations

A record has one canonical form — **JSON** — and can be read as **RDF** and
checked as a graph. The artefacts below are published for every entity and are
generated from the same attribute list, so the views agree.

## JSON

JSON is the form in which records are stored, exchanged and served. Clause 9
of the Recommendation fixes the essentials; the rest is decided by the
machine-readable specification and is stated here so that clients can rely on
it.

| Question | Decision |
|----------|----------|
| Names | `camelCase` attributes; enumeration values in `UPPER_CASE` |
| Identifiers | UUIDs as strings, **lower case** — upper-case would yield a different IRI in RDF |
| Timestamps | ISO 8601-1 in UTC, ending in `Z` or `+00:00`; the presentation time zone is `Farm.timezone` |
| Geometries | GeoJSON objects ([RFC 7946](https://www.rfc-editor.org/rfc/rfc7946)), WGS 84 |
| An optional attribute not set | omitted — never `null` |
| Decimal numbers | a JSON number |
| Units | a string, [UCUM](https://ucum.org/) recommended (`"L/har"`, `"t/har"`); currencies, countries and languages are checked (ISO 4217, ISO 3166-1, BCP 47) |
| An attribute the model does not have | rejected on write — the schemas are closed (`additionalProperties: false`) |
| A Thing Description | a string with `contentMediaType: application/td+json` |

## JSON Schema

`https://datamodel.agrifooddata.org/v1/schema/<Entity>.json` is a
[JSON Schema 2020-12](https://json-schema.org/draft/2020-12) for one entity,
describing the record **as stored and exchanged**: types, mandatory
attributes, enumerations, formats, and every constraint a single record can
carry — exclusive references (V03), positive quantities (V02), provenance
(V04) and the conditions of clause 8.

```python
import json, urllib.request
from jsonschema import Draft202012Validator
from referencing import Registry, Resource

base = "https://datamodel.agrifooddata.org/v1/schema/"
def fetch(uri):
    return Resource.from_contents(json.load(urllib.request.urlopen(uri)))

registry = Registry(retrieve=fetch)
schema = fetch(base + "Task.json").contents
Draft202012Validator(schema, registry=registry).validate(task)
```

Any validator that implements JSON Schema 2020-12 will do. The OpenAPI
description embeds these very schemas.

## JSON-LD

`https://datamodel.agrifooddata.org/v1/context.jsonld` is a
[JSON-LD 1.1](https://www.w3.org/TR/json-ld11/) context that makes any record
readable as RDF. Asked for `application/ld+json`, the API adds three keywords in
front of an ordinary record and leaves the attributes as they are:

```json
{
  "@context": "https://datamodel.agrifooddata.org/v1/context.jsonld",
  "@id": "urn:uuid:069a9d2c-0d5c-5eda-b447-1eb9d3791f7e",
  "@type": "Task",
  "id": "069a9d2c-0d5c-5eda-b447-1eb9d3791f7e",
  "name": "Fungizidbehandlung Septoria, Nordschlag",
  "farmId": "997142c3-14cf-5cb4-b260-048af4b57a76",
  "status": "COMPLETED",
  "typeUri": "http://aims.fao.org/aos/agrovoc/c_5978",
  "createdAt": "2026-05-10T07:00:00Z",
  "originType": "USER",
  "createdByUserId": "b630da76-9ec3-5faa-a1d7-e66d56bc5db4"
}
```

As Turtle:

```turtle
<urn:uuid:069a9d2c-0d5c-5eda-b447-1eb9d3791f7e> a agfoda:Task ;
    agfoda:id "069a9d2c-0d5c-5eda-b447-1eb9d3791f7e" ;
    agfoda:name "Fungizidbehandlung Septoria, Nordschlag" ;
    agfoda:farmId <urn:uuid:997142c3-14cf-5cb4-b260-048af4b57a76> ;
    agfoda:taskStatus agfoda:TaskStatus_COMPLETED ;
    agfoda:typeUri <http://aims.fao.org/aos/agrovoc/c_5978> ;
    agfoda:createdAt "2026-05-10T07:00:00Z"^^xsd:dateTime ;
    agfoda:originType agfoda:OriginType_USER ;
    agfoda:createdByUser <urn:uuid:b630da76-9ec3-5faa-a1d7-e66d56bc5db4> .
```

What the context does:

- **Records and references meet in one node.** A record's IRI is `urn:uuid:`
  plus its `id`; a foreign key holds a bare UUID, and its term turns it into the
  IRI of the other record. `urn:uuid:` rather than an HTTP address, because the
  model is meant for a **federation of nodes**: the same record may be served by
  several of them and its identity must not depend on which.
- **Every attribute maps onto the ontology's own property** — `agfoda:farmId`,
  not a look-alike from another vocabulary — because those are the properties
  the ontology binds to its classes and [concept schemes](../ontology/concept-schemes.md).
- **Enumerations are individuals.** `"status": "COMPLETED"` on a task becomes
  `agfoda:TaskStatus_COMPLETED`.
- **Where names differ.** `status`, `scopeType` and `validFrom` have one
  property per class in the ontology; `description` on a `Device` is
  `agfoda:thingDescription`; `createdByUserId` is `agfoda:createdByUser`. A
  scoped context resolves this per entity — which is why a JSON-LD
  representation carries `@type`.
- **JSON stays JSON.** Attributes of type JSON, geometries included, become
  `rdf:JSON` literals. Numbers are not typed beyond what JSON-LD derives.
- **Pages read as RDF too.** In a page of a collection, `items` is an alias of
  `@included`.

Read a record as RDF and check it:

```bash
riot --syntax=jsonld task.jsonld > task.ttl
pyshacl -s https://datamodel.agrifooddata.org/v1/shapes.ttl task.ttl
```

## SHACL

Two shape files check RDF, at two scopes:

| File | Checks |
|------|--------|
| `shapes.ttl` | **one record**: types, mandatory attributes, enumerations, exclusive references, positive quantities, provenance, period order |
| `shapes-dataset.ttl` | **a dataset**: that references point at a record of the right entity, that classifications are concepts of the scheme they are bound to, and rules across records (V05, V07, V08, V09) |

A rule expressed with "should" is reported with `sh:severity sh:Warning`.

## OpenAPI

`openapi.yaml` and `openapi.json` describe the [digital farm REST
API](../../api-reference/overview.md): every entity as a collection, offline
synchronisation, OGC API – Features for fields, regions and sites. It loads
into any OpenAPI 3.1 tool — to browse, to generate a client, or to mock.

It is a **reference binding**, not text of the Recommendation. The
Recommendation specifies the data and the requirements of its clauses 9 and 10;
[BINDINGS.md](https://github.com/NaLamKI/datamodel/blob/main/BINDINGS.md) in the
repository says how they became paths, headers and status codes — and why.

## Federation and exchange formats

The model is made for several nodes serving the same records, which is why
identity is a `urn:uuid:` and not a URL. Formats that clause 9 names besides
the model's own JSON — task data conforming to ISO 11783-10, or an export to an
agricultural data exchange profile — are formats of their own. The model
carries what they need: `Activity.isobusTaskRef`, `Machine.isobusDeviceId`, and
the ISOBUS codes bound through `CodeMapping`.

## See it in action

- [Ontology · Using the ontology](../ontology/using-the-ontology.md) — resolving the URIs in a record
- [API conventions](../../api-reference/conventions.md#content-negotiation) — asking for `application/ld+json`
