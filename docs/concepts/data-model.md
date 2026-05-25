---
sidebar_position: 4
---

# Data Model & Ontology

AgriFoodData serialises the digital farm twin as **JSON-LD**, with semantic
anchoring in **AgroVoc** (FAO) and the **Web of Things** vocabularies.

## Why JSON-LD

- It is plain JSON — every existing client library reads it.
- It carries an explicit `@context`, so any field name maps unambiguously to
  a URI in an open vocabulary. This makes data **interpretable across
  systems and languages**.

## Example payload — Field with AgroVoc tags

```json
{
  "@context": "https://agrifooddata.org/contexts/farm-v1.jsonld",
  "@type": "Field",
  "id": "fld-0042",
  "name": "North field",
  "farm": "farm-0001",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[78.49, 17.39], [78.50, 17.39],
                     [78.50, 17.40], [78.49, 17.40],
                     [78.49, 17.39]]]
  },
  "agrovoc": [
    "http://aims.fao.org/aos/agrovoc/c_7156",   // maize
    "http://aims.fao.org/aos/agrovoc/c_7156-soil-clay"
  ]
}
```

## AgroVoc in practice

- Use AgroVoc URIs for **crops, soils, management practices, inputs and
  outputs** wherever a free-text field would otherwise drift.
- The Farm API exposes `/agrovoc/lookup` so you can resolve labels in any
  AgroVoc-supported language without bundling the full vocabulary.

## See it in action

- [Farm API](./apis/farm-api.md) — where the AgroVoc tagging is exposed
- [API Reference · Farm](../api-reference/farm.md) — `/agrovoc/lookup`
