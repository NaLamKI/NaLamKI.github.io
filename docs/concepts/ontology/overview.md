---
sidebar_position: 1
---

# Ontology

The **agrifooddata ontology** is the shared vocabulary behind the
[data model](../data-model/overview.md). It tells a program — without asking
anybody — what an identifier in a record means and where it comes from.

It is published under permanent identifiers at
**[w3id.org/agrifooddata](https://w3id.org/agrifooddata)**, which resolves to
**[ontology.agrifooddata.org](https://ontology.agrifooddata.org)**
([source repository](https://github.com/NaLamKI/ontology)).

```turtle
<https://w3id.org/agrifooddata/crops#TRZAW> a skos:Concept ;
    skos:inScheme <https://w3id.org/agrifooddata/crops> ;
    skos:notation "TRZAW" ;                    # the EPPO code
    skos:prefLabel "Winterweichweizen"@de .
```

## Two layers that fit together

| | **Schema** | **Concept schemes** |
|---|---|---|
| Answers | what a farm, a field, an activity *is* | what its classifications may *be* |
| Holds | the entity classes, enumerations and properties of the data model, in 14 packages | 17 curated concept schemes and a handful of code lists |
| In RDF | [OWL 2 DL](https://www.w3.org/TR/owl2-overview/) | [SKOS](https://www.w3.org/TR/skos-reference/) |
| Namespace | `https://w3id.org/agrifooddata/term/` (prefix `agfoda`) | `https://w3id.org/agrifooddata/<scheme>#<concept>` |
| Example | `agfoda:CultivationPeriod` has one `agfoda:typeUri` | `crops#TRZAW` is such a value |

The schema is aligned to
[SOSA/SSN](https://www.w3.org/TR/vocab-ssn/) (observations and sensors),
[PROV-O](https://www.w3.org/TR/prov-o/) (provenance) and
[GeoSPARQL](https://www.ogc.org/standards/geosparql/) (geometry). The concept
schemes are written in SKOS and take their identifiers from established
authorities wherever one exists.

### The two are bound to each other

`agfoda:typeUri` declares `rdfs:range skos:Concept` — true, and unhelpful,
because it does not say *which* concepts. The schema therefore carries, per
class, an OWL restriction generated from the registry: a cultivation period's
type is a concept **from the `crops` scheme**.

```turtle
agfoda:CultivationPeriod rdfs:subClassOf [
    a owl:Restriction ; owl:onProperty agfoda:typeUri ;
    owl:allValuesFrom [ a owl:Restriction ;
        owl:onProperty skos:inScheme ;
        owl:hasValue <https://w3id.org/agrifooddata/crops> ] ] .
```

A reasoner can check this, a form can build its picker from it, and a slot
that names a class or property that does not exist breaks a test instead of
nothing at all. Where several schemes supply one property, the restriction is
over their union — an observation's observed property is a measured quantity,
a pest or a soil property.

## Every term has an address

The schema is a *slash namespace*, so each term is a request of its own:

| Request | Answer |
|---------|--------|
| `https://w3id.org/agrifooddata/term/Task` in a browser | the class's row on the [schema page](https://ontology.agrifooddata.org/term.html) |
| the same with `Accept: text/turtle` | the Turtle for an RDF client |
| `https://w3id.org/agrifooddata/crops` | the scheme, as Turtle, JSON-LD, RDF/XML or HTML according to `Accept` |

The schema ships as Turtle (`term.ttl`) and a page. The concept schemes ship in
four files each, under the identifier of the scheme: `<scheme>.ttl` (the
source), `.jsonld`, `.rdf` and `.html`.

Alongside them:

| File | Purpose |
|------|---------|
| [`agrifooddata.ttl`](https://ontology.agrifooddata.org/agrifooddata.ttl) | the entry file (VoID/DCAT): every scheme, its provenance, its links |
| [`crosswalk.csv`](https://ontology.agrifooddata.org/crosswalk.csv) | the mapping table |
| [`links/agrovoc.ttl`](https://ontology.agrifooddata.org/links/agrovoc.ttl), [`links/eppo.ttl`](https://ontology.agrifooddata.org/links/eppo.ttl) | link sets onto AGROVOC and EPPO, kept apart so nobody pulls them in unasked |
| [`context.jsonld`](https://ontology.agrifooddata.org/context.jsonld) | a JSON-LD context that refers to the data model's |

## The context is the data model's

Names in a record are the data model's to give, so the JSON-LD context lives
in one place: the data model's
[`context.jsonld`](https://datamodel.agrifooddata.org/v1/context.jsonld). It
maps every attribute onto the property declared in the ontology schema —
`typeUri` onto `agfoda:typeUri`, `createdAt` onto `agfoda:createdAt`. The
ontology's own `context.jsonld` refers to it.

## Authorities, not replacements

The vocabulary replaces none of the authorities it names; it **connects**
them. Only what does not exist dereferenceably elsewhere gets an identifier
here.

- **[AGROVOC](https://www.fao.org/agrovoc/)** (FAO) is the backbone. Where a
  concept has a verified AGROVOC counterpart, the *AGROVOC identifier itself*
  is the concept's identifier (`http://aims.fao.org/aos/agrovoc/c_…`); it
  appears in no second address.
- **Crops, pests and growth stages** have no dereferenceable authority. They
  keep identifiers of their own at the granularity of the code list of the
  German Federal Office of Consumer Protection and Food Safety (BVL), and are
  mapped onto AGROVOC where AGROVOC names them as the ontology does.
- **Codes of other systems** — EPPO, BBCH, ICAR, ISOBUS — travel as code lists
  bound to concepts, not as identifiers. See
  [Concept schemes](./concept-schemes.md#identifiers-and-codes).

## Language and licence

The curated schemes are bilingual (German and English). `crops`, `pests` and
`phenology` carry **German labels only**: they come from the German BVL code
list, and inventing English labels would be worse than the gap. Everything
about the vocabulary itself — documentation, field names, code — is in English.

The vocabularies are published under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), the tooling under
MIT. Crops, pests, growth stages and registrations come from the BVL's plant
protection product interface and are free to use under § 10 of the German Data
Use Act; the prescribed attribution sits in every affected scheme.

## See it in action

- [Concept schemes](./concept-schemes.md) — the 17 schemes and the attributes they feed
- [Using the ontology](./using-the-ontology.md) — resolving, searching and validating
- [Data model · Representations](../data-model/representations.md#json-ld) — how a record becomes RDF
