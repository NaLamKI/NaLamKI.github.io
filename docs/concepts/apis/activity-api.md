---
sidebar_position: 5
---

# Activity API

## Purpose

Manage all **agricultural operations and activities** — planting, plant
protection, fertilisation, irrigation, harvest — with explicit time and
economic context.

## Underlying standards

- Data model based on the **ITU/FAO reference architecture**.
- **AgroVoc** for classifying activity types and inputs (fertilisers, plant
  protection products, crops).

## Core resources

| Resource | Purpose |
|----------|---------|
| **Activity** | A long-running cultivation activity (e.g. a season's plan). Aggregates cultivation periods and input/outputs. |
| **Cultivation Period** | Season-scoped plan bound to a **region**: which crop, time window, method. |
| **Action** | An individual operation on a field or region — sowing, fertilising, plant protection, irrigation, harvest — with planned and actual timestamps. |
| **Record** | A typed measurement data point hung off an action or a region. Type catalogue: `GET /v1/records/types`. |
| **Attachment** | A file bound to a record — photo, lab report, drone tile, application map. |
| **Input / Output** | Resources consumed (seed, fertiliser, plant protection, water) and results produced (yield, quality, losses), recorded against an activity. |

## Capabilities

- **Cultivation periods per region.** Plan crop rotation at the region (ROI)
  level — not just at field level — so trial plots and management zones
  have their own histories.
- **Actions with explicit time.** Every action carries planned, executed,
  and completed timestamps and can be analysed as a time series.
- **Typed records.** Records use a server-managed type catalogue, which
  keeps payloads schema-validated and queryable.
- **Attachments stay with records.** Photos, lab PDFs, drone tiles and
  application maps are first-class — see
  [`/v1/attachments/*`](../../api-reference/activity.md#attachments).
- **Cross-API linking.** Every activity links to the relevant region
  ([Farm API](./farm-api.md)), the sensors used
  ([Sensor Things API](./sensor-things-api.md)), and any resulting raster /
  vector outputs (today via attachments; later via the
  [Spatio-Temporal API](./spatio-temporal-api.md)). This produces a
  complete audit trail.

## Minimal example

```bash
TOKEN="<your access token>"
BASE="https://api.example.com"

# 1. Create a cultivation period on a region
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$BASE/v1/regions/<region-id>/cultivation-periods" \
  -d '{"crop":"agrovoc:c_7156","startsAt":"2026-04-01","endsAt":"2026-10-15"}'

# 2. Plan a fertilisation action on the field
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$BASE/v1/actions" \
  -d '{"fieldId":"<field-id>","type":"fertilisation","plannedAt":"2026-05-15T08:00:00Z"}'

# 3. Record what was actually applied
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$BASE/v1/regions/<region-id>/records" \
  -d '{"type":"application","payload":{"product":"Urea","amount":80,"unit":"kg/ha"}}'
```

## See it in action

- [Build · Data Apps](../../build/data-apps/overview.md) — synchronise activities with an external FMIS
- [API Reference · Activity API](../../api-reference/activity.md)
