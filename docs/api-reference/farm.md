---
sidebar_position: 2
---

# Farm API

**Standards:** GeoJSON · AgroVoc · ITU/FAO data model
**Transport:** REST · OpenAPI · `/swagger`
**Base URL:** `https://api.<your-deployment>`

The Farm API manages the **master-data hierarchy**:

```
Organization → Farm → Field → Region (ROI) → cultivation periods · actions · records · sensors
```

A *Region* is the ITU/FAO **Region of Interest** — a freely nestable
sub-division of a field. Regions are the unit at which sensors, activities
and AgroVoc tagging attach.

## Users & Organizations

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/users` | List users |
| `GET` | `/v1/users/{id}` | Get one user |
| `PATCH` | `/v1/users/{id}` | Update a user |
| `DELETE` | `/v1/users/{id}` | Delete a user |
| `GET` | `/v1/organizations` | List organizations |
| `POST` | `/v1/organizations` | Create an organization |
| `GET` | `/v1/organizations/{id}` | Get one organization |
| `PATCH` | `/v1/organizations/{id}` | Update an organization |
| `DELETE` | `/v1/organizations/{id}` | Delete an organization |

> User accounts are provisioned via Keycloak ([IAM](./iam.md)). The endpoints
> above operate on the **platform-side** user records that bind a Keycloak
> identity to roles and organisations.

## Farms

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/farms` | List farms visible to the caller |
| `POST` | `/v1/farms` | Create a farm |
| `GET` | `/v1/farms/{farmId}` | Get one farm |
| `PATCH` | `/v1/farms/{farmId}` | Update a farm |
| `DELETE` | `/v1/farms/{farmId}` | Delete a farm |
| `POST` | `/v1/farms/{farmId}/users` | Add a user to a farm with a role |

## Fields

Fields live under a farm. Every field carries a GeoJSON geometry.

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/farms/{farmId}/fields` | Create a field |
| `PATCH` | `/v1/farms/{farmId}/fields/{fieldId}` | Update a field |
| `DELETE` | `/v1/farms/{farmId}/fields/{fieldId}` | Delete a field |

> `GET` listings of fields are returned as part of the nested farm /
> region responses below — there is no flat `GET /v1/farms/{farmId}/fields`
> collection endpoint in the current build.

## Regions (ROIs)

Regions are the recursively nestable subdivision of a field. They are the
**primary attachment point** for sensors, activities and AgroVoc tags.

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/regions` | All regions, returned as a nested tree |
| `POST` | `/v1/regions` | Create a region (optionally as a child of another) |
| `GET` | `/v1/regions/{regionId}` | Get one region with its nested children |
| `PATCH` | `/v1/regions/{regionId}` | Update a region |
| `DELETE` | `/v1/regions/{regionId}` | Delete a region |

## AgroVoc tagging

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/regions/agrovoc-labels` | All AgroVoc labels in use across the platform |
| `GET` | `/v1/regions/{regionId}/agrovoc-labels` | AgroVoc labels for one region and its children |

The `POST/PATCH` endpoints on a region accept AgroVoc IRIs as part of the
payload — see the Swagger schemas for the exact field name.

## Curl example

```bash
TOKEN="<your access token>"
BASE="https://api.example.com"

# List the user's farms
curl -H "Authorization: Bearer $TOKEN" "$BASE/v1/farms"

# Pull the full region tree
curl -H "Authorization: Bearer $TOKEN" "$BASE/v1/regions"

# Tags in use
curl -H "Authorization: Bearer $TOKEN" "$BASE/v1/regions/agrovoc-labels"
```

## Related

- [Concepts · Farm API](../concepts/apis/farm-api.md) — the data model
- [Activity API](./activity.md) — operations on a region
- [Sensor Things](./sensor-things.md) — sensors on a region
