---
sidebar_position: 5
---

# Fetch Data via REST

For frontend and dashboard developers — pull farm data, observations and
geometries from the digital farm API with plain HTTP, without any SDK.

This page assumes you can already get an API token. If not, do
[Getting started](./getting-started.md) first; it covers registration, sign-in
and token exchange — with the SDK or with any OpenID Connect library.

```bash
API="https://api.example.org/v1"           # the API base URL your platform gave you (the path prefix may differ)
TOKEN="<an access token for the digital farm API>"
AUTH="Authorization: Bearer $TOKEN"
```

## 1 · List the farms you can see

```bash
curl -s -H "$AUTH" "$API/farms"
```

The answer is a page: `items`, `nextCursor`, `hasMore`.

## 2 · Walk the farm's land

```bash
FARM=997142c3-14cf-5cb4-b260-048af4b57a76

curl -s -H "$AUTH" "$API/fields?farmId=$FARM"
curl -s -H "$AUTH" "$API/regions?fieldId=7adcec09-66ff-5ccf-8ef7-e75408287d38"
```

Each collection filters on its reference and enumeration attributes. Regions
nest through `parentRegionId`.

## 3 · Draw it on a map

The same fields, regions and sites are served as **GeoJSON features** through
OGC API – Features, which every map library can read:

```bash
curl -s -H "$AUTH" \
  "$API/features/collections/fields/items?bbox=13.40,52.51,13.41,52.53&limit=100"
```

`bbox` is `min longitude, min latitude, max longitude, max latitude` in WGS 84.
Use the `next` link to continue a long collection. See
[Geospatial features](../api-reference/geospatial-features.md).

## 4 · Read observations

```bash
REGION=fe3bffb7-a21b-5ba6-8ab9-7c699f76b59d

# observations of one region that changed since a date
curl -s -H "$AUTH" "$API/observations?regionId=$REGION&updatedAfter=2026-05-01T00:00:00Z&limit=50"

# only those that passed quality assurance
curl -s -H "$AUTH" "$API/observations?regionId=$REGION&validity=VALID"
```

Lists come back in **ascending** `updatedAt` order and have no sort parameter;
to look at recent measurements, start from a recent `updatedAfter`.

An observation records the value of an observed property for a feature of
interest at a stated time, aligned with ISO 19156 and OGC SensorThings. A
`Device` carries the address of its own SensorThings service in
`sensorThingsUrl` — for **high-frequency** data go there (see
[Sensor Things](../api-reference/sensor-things.md)); the digital farm API holds
the records, not the raw stream.

## 5 · Follow what changed

```bash
curl -s -H "$AUTH" "$API/tasks?farmId=$FARM&updatedAfter=2026-05-01T00:00:00Z&limit=200"
```

Continue with `cursor=<nextCursor>` while `hasMore` is true, and store the last
`nextCursor` for the next poll. Deletions arrive as `DELETE` entries of
`/audit-logs`. See [Synchronization](../api-reference/synchronization.md).

## 6 · Ask for linked data

```bash
curl -s -H "$AUTH" -H "Accept: application/ld+json" "$API/tasks/069a9d2c-0d5c-5eda-b447-1eb9d3791f7e"
```

The same record with `@context`, `@id` and `@type` — readable by any JSON-LD
processor as RDF on the [ontology](../concepts/ontology/overview.md)'s
properties.

## 7 · Derived values

Some values are computed, not stored — ask for them:

```bash
curl -s -H "$AUTH" "$API/stock-levels?productId=<a product id>"
```

## Handling the answers

| Answer | Do |
|--------|----|
| `200` | use `items`; store `nextCursor` |
| `401` | get a fresh token |
| `403` | the person (or your scopes) lacks the permission on that farm — show a message, do not retry |
| `404` | no such record |
| `400` | a malformed request — fix the query |

For a browser app, never put a token in a URL or hold it in the browser at all:
the safest design is the one in
[Signing in apps](../concepts/iam/app-authentication.md#the-backend-for-frontend-pattern),
where the browser holds only a session cookie.

## Next steps

- [Build · Frontend & Dashboards](../build/frontend-dashboards/overview.md) — full dashboard recipes
- [API Reference](../api-reference/overview.md)
- [Spatio-Temporal](../api-reference/spatio-temporal.md) — rasters, STAC items and tiles
- [Concepts · Data model](../concepts/data-model/overview.md)
