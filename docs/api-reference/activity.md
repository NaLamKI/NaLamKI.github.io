---
sidebar_position: 5
---

# Activity API

**Standards:** ITU/FAO data model · AgroVoc
**Transport:** REST · OpenAPI · `/swagger`
**Base URL:** `https://api.<your-deployment>`

The Activity API manages **everything that happens on a field** — from
long-running cultivation periods, through individual operations
(*actions*), down to the measurement records and the files attached to
them.

```
Activity ─┬─ cultivation periods (per region)
          └─ input/outputs (resources consumed, results produced)

Region ─┬─ cultivation periods
        ├─ actions ──────► records ──► attachments
        └─ records (free-standing)
```

## Activities

Long-running activities such as a season's cultivation plan.

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/activities` | List activities |
| `POST` | `/v1/activities` | Create an activity |
| `GET` | `/v1/activities/{id}` | Get one activity |
| `PATCH` | `/v1/activities/{id}` | Update an activity |
| `DELETE` | `/v1/activities/{id}` | Delete an activity |

### Activity → cultivation periods

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/activities/{activityId}/cultivationPeriods` | Cultivation periods linked to this activity |
| `POST` | `/v1/activities/{activityId}/cultivationPeriods` | Link a cultivation period to this activity |

### Activity → input / output

The platform records resources consumed by an activity (seeds, fertiliser,
plant-protection products, water) and the results produced (yield, losses).

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/activities/{activityId}/inputoutputs` | List input/output records |
| `POST` | `/v1/activities/{activityId}/inputoutputs` | Add an input/output record |
| `DELETE` | `/v1/activities/{activityId}/inputoutputs` | Delete all input/output records on this activity |
| `GET` | `/v1/activities/{activityId}/inputoutputs/{id}` | Get one input/output record |
| `PUT` | `/v1/activities/{activityId}/inputoutputs/{id}` | Replace one input/output record |
| `DELETE` | `/v1/activities/{activityId}/inputoutputs/{id}` | Delete one input/output record |

## Cultivation periods

Cultivation periods are season-scoped plans bound to a **region**. The API
exposes them in two equivalent ways:

### Nested under farm / field / region (canonical)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/farms/{farmId}/fields/{fieldId}/regions/{regionId}/cultivationPeriods` | List |
| `POST` | `/v1/farms/{farmId}/fields/{fieldId}/regions/{regionId}/cultivationPeriods` | Create |
| `GET` | `/v1/farms/{farmId}/fields/{fieldId}/regions/{regionId}/cultivationPeriods/{cultivationPeriodId}` | Get one |
| `PATCH` | `/v1/farms/{farmId}/fields/{fieldId}/regions/{regionId}/cultivationPeriods/{cultivationPeriodId}` | Update |
| `DELETE` | `/v1/farms/{farmId}/fields/{fieldId}/regions/{regionId}/cultivationPeriods/{cultivationPeriodId}` | Delete |

### Flat (by region or by ID)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/regions/{regionId}/cultivation-periods` | List for a region |
| `POST` | `/v1/regions/{regionId}/cultivation-periods` | Create for a region |
| `GET` | `/v1/cultivation-periods/{cultivationPeriodId}` | Get one |
| `PATCH` | `/v1/cultivation-periods/{cultivationPeriodId}` | Update |
| `DELETE` | `/v1/cultivation-periods/{cultivationPeriodId}` | Delete |

## Actions

An **action** is an individual operation on a field or region — sowing,
fertilising, plant protection, irrigation, harvest.

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/actions` | Create an action (bound to a field via the body) |
| `DELETE` | `/v1/actions/{actionId}` | Delete an action |
| `GET` | `/v1/farms/{farmId}/fields/{fieldId}/actions` | List actions for a field |
| `GET` | `/v1/regions/{regionId}/actions` | List actions for a region |

## Records

Records are the **measurement data points** that operations and ad-hoc
sampling produce. Each record carries a typed payload (see
`GET /v1/records/types`).

### Listing & creation

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/records/types` | Available record types |
| `GET` | `/v1/farms/{farmId}/fields/{fieldId}/records` | Records for a field |
| `POST` | `/v1/farms/{farmId}/fields/{fieldId}/records` | Create a record under a field |
| `GET` | `/v1/regions/{regionId}/records` | Records for a region |
| `POST` | `/v1/regions/{regionId}/records` | Create a record under a region |

### Mutation

The same record can be addressed either by its action context or directly
by its ID:

| Method | Path | Purpose |
|--------|------|---------|
| `PATCH` | `/v1/farms/{farmId}/fields/{fieldId}/actions/{actionId}/records/{recordId}` | Update a record bound to an action |
| `DELETE` | `/v1/farms/{farmId}/fields/{fieldId}/actions/{actionId}/records/{recordId}` | Delete a record bound to an action |
| `PATCH` | `/v1/records/{recordId}` | Update any record |
| `DELETE` | `/v1/records/{recordId}` | Delete any record |

## Attachments

Files attached to a record — photos, lab reports, drone tiles, application
maps, …

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/records/{recordId}/attachments` | Attach a file to a record |
| `GET` | `/v1/attachments/download/{attachmentId}` | Download as a binary blob |
| `GET` | `/v1/attachments/stream/{attachmentId}` | Stream the file |
| `DELETE` | `/v1/attachments/{attachmentId}` | Delete an attachment |

The endpoints below are the **fully-nested** equivalents (kept for backward
compatibility; prefer the flat ones above):

```
POST   /v1/farms/{farmId}/fields/{fieldId}/actions/{actionId}/record/{recordId}/attachments
GET    /v1/farms/{farmId}/fields/{fieldId}/actions/{actionId}/record/{recordId}/attachments/download/{attachmentId}
GET    /v1/farms/{farmId}/fields/{fieldId}/actions/{actionId}/record/{recordId}/attachments/stream/{attachmentId}
DELETE /v1/farms/{farmId}/fields/{fieldId}/actions/{actionId}/record/{recordId}/attachments/{attachmentId}
GET    /v1/farms/{farmId}/fields/{fieldId}/records/{recordId}/attachments
POST   /v1/farms/{farmId}/fields/{fieldId}/records/{recordId}/attachments
GET    /v1/regions/{regionId}/records/{recordId}/attachments
POST   /v1/regions/{regionId}/records/{recordId}/attachments
```

## Curl example — a full mini-workflow

```bash
TOKEN="<your access token>"
BASE="https://api.example.com"

# 1. Create an action under a field
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$BASE/v1/actions" \
  -d '{"fieldId":"<uuid>","type":"fertilisation","plannedAt":"2026-05-15T08:00:00Z"}'

# 2. Record an observation under a region
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$BASE/v1/regions/<region-uuid>/records" \
  -d '{"type":"soil-sample","payload":{"ph":6.4,"organic_c":1.8}}'

# 3. Attach a lab report to the record
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -F "file=@./lab-report.pdf" \
  "$BASE/v1/records/<record-uuid>/attachments"
```

## Related

- [Concepts · Activity API](../concepts/apis/activity-api.md)
- [Farm API](./farm.md) — regions, fields, farms
