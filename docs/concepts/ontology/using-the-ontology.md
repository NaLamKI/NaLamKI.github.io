---
sidebar_position: 3
---

# Using the Ontology

Practical recipes for applications: how to pick a value for a `…Uri`
attribute, how to resolve what you find in somebody else's record, and how to
keep your own code in step with the vocabulary.

## Choosing a value for a classification

1. **Find the scheme the attribute is bound to** — see
   [Concept schemes](./concept-schemes.md#the-17-concept-schemes), or the
   attribute's row on its
   [reference page](https://datamodel.agrifooddata.org/v1/) (it names the
   schemes, where there is one).
2. **Let the person pick a concept** — from your own copy of the scheme or by
   browsing `https://w3id.org/agrifooddata/<scheme>`.
3. **Store the concept's IRI** in the attribute — exactly as the scheme gives it.
   Some concepts carry an AGROVOC IRI (`http://aims.fao.org/aos/agrovoc/c_…`),
   others one under `https://w3id.org/agrifooddata/…`. Both are correct; the
   scheme decides which.

```json
{
  "id": "5dda887f-7b91-5007-916a-e571436175a1",
  "regionId": "fe3bffb7-a21b-5ba6-8ab9-7c699f76b59d",
  "typeUri": "https://w3id.org/agrifooddata/crops#TRZAW",
  "…": "…"
}
```

(A cultivation period, abridged to the attributes that matter here.)

Do not invent identifiers and do not store free text where a concept exists.
If the scheme has no concept you need, that is a gap in the vocabulary — see
[contributing](#extending-and-contributing) — not a reason to bypass it.

### Codes live next to concepts

Where a regulation or a machine wants a *code* — an EPPO code, a BBCH stage, an
ISOBUS data dictionary identifier — the code is not the identifier. Bind it
with a `CodeMapping` record (`conceptUri`, `externalScheme`, `externalCode`,
validity period, `isPreferred`), or, for growth stages, store the notation in
`bbchStage`. Where an authorisation number is involved,
`Product.registrationNumber` carries it and the register is the BVL's code list.

## Resolving an identifier

One identifier, four answers. Ask for the representation you need:

```bash
curl -sIL -H 'Accept: text/turtle'         https://w3id.org/agrifooddata/crops
curl -sIL -H 'Accept: application/ld+json' https://w3id.org/agrifooddata/crops
curl -sIL -H 'Accept: text/html'           https://w3id.org/agrifooddata/crops

# A class or property of the schema: Turtle for a client, its row for a browser
curl -sIL -H 'Accept: text/turtle' https://w3id.org/agrifooddata/term/Task
```

An explicit suffix (`crops.ttl`, `crops.jsonld`, `crops.rdf`, `crops.html`)
takes precedence over `Accept`. A fragment (`#TRZAW`) never reaches a server,
so redirection happens per scheme, not per concept.

For an **AGROVOC** IRI, ask AGROVOC. Its REST interface returns labels and
relations in the languages AGROVOC supports:

```bash
curl -s "https://agrovoc.fao.org/browse/rest/v1/agrovoc/data?uri=http://aims.fao.org/aos/agrovoc/c_10795&format=application/json"
curl -s "https://agrovoc.fao.org/browse/rest/v1/search?query=Winterweizen*&lang=de&vocab=agrovoc"
```

## Querying

The ontology is plain RDF, so any SPARQL engine can query it. The entry file
(`https://w3id.org/agrifooddata/agrifooddata.ttl`) lists every scheme with its
provenance and links. Which concepts carry an external identifier?

```sparql
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT ?scheme (COUNT(?c) AS ?external) WHERE {
  ?c skos:inScheme ?scheme .
  FILTER(STRSTARTS(STR(?c), "http://aims.fao.org/aos/agrovoc/"))
} GROUP BY ?scheme
```

Which AGROVOC concept stands behind a crop? (This needs
`links/agrovoc.ttl` loaded — the links are not in the schemes themselves.)

```sparql
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT ?relation ?agrovoc WHERE {
  VALUES ?relation { skos:closeMatch skos:broadMatch }
  <https://w3id.org/agrifooddata/crops#SOLTU> ?relation ?agrovoc .
}
```

`skos:closeMatch` means AGROVOC's label equals the ontology's; `skos:broadMatch`
means AGROVOC names the genus where the ontology names a species. A crop is
never mapped onto AGROVOC with `skos:exactMatch` — that is the claim that turns
an AGROVOC IRI into the identifier itself. (The EPPO link set does use
`skos:exactMatch`, to the EPPO taxon.)

## Validating records

The data model binds records to the ontology, and the binding is checked:

- every attribute of a record maps onto a property the ontology declares, whose
  domain and range fit;
- a mandatory attribute is mandatory exactly where the ontology states a
  minimum cardinality;
- the values of every enumeration are the ontology's named individuals;
- a classification is a concept of the scheme the attribute is bound to.

The last point is a *dataset* rule: it needs the schemes loaded, so it is in
`shapes-dataset.ttl`, not in the single-record JSON Schema. See
[Representations](../data-model/representations.md#shacl).

## Keeping your code in step

The registry lists **pinned identifiers** — the ones program code relies on
(`activity-types#fertilization`, `activity-types#sowing`,
`activity-types#harvest`, `activity-types#plant-protection`,
`product-classes#seed` …). An application that branches on such a concept
should generate constants from this list and **fail its build** when one no
longer appears in any scheme: a renamed concept ought to break the build, not
silently leave a mapping pointing nowhere.

## Extending and contributing

- **An application's own fields** do not belong in the model or the vocabulary.
  They belong in the application's own namespace; reach for an established
  vocabulary first (SOSA/SSN for observations, QUDT for units, GeoSPARQL for
  geometry, PROV-O for provenance).
- **A concept, a code or a scheme that is missing** is added to the vocabulary
  through the repository's
  [contributing guide](https://github.com/NaLamKI/ontology/blob/main/CONTRIBUTING.md).
  `crops` and `pests` are the exception: they are generated from the BVL
  extract and are not edited by hand.
- **A published identifier does not change.** It sits in records that must be
  kept for years. A concept that is no longer needed is marked
  `owl:deprecated true` and keeps its label — it disappears from the pickers,
  not from the vocabulary. Code lists work the same way: a code that lapses gets
  a `validTo`; it is not deleted.
- **Mappings** onto AGROVOC are checked against the label on both sides, and a
  difference in wording is recorded with its reason rather than ticked off
  silently.

## See it in action

- [Getting started](../../quickstart/getting-started.md) — a record with a `typeUri`
- [Standards & Interoperability](../standards-interoperability.md) — the whole list of standards
