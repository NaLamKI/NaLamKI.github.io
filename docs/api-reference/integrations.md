---
sidebar_position: 6
---

# Integrations

**Base URL:** `https://api.<your-deployment>`

Endpoints that bridge external systems to the platform. Today this section
exposes the **John Deere Operations Center** connector — the canonical
[Data App](../build/data-apps/overview.md) example.

## John Deere Operations Center

Pulls organisations, farms and fields from John Deere Operations Center
into the digital farm twin. Authentication is an OAuth 2.0 flow against
John Deere's identity provider; the platform stores and refreshes the
access token on the caller's behalf.

### Auth

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/vendors/john-deere/access-token` | Exchange the John Deere OAuth grant for a platform-managed token |

### Read

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/vendors/john-deere/organizations` | List organisations visible to the connected John Deere user |
| `GET` | `/v1/vendors/john-deere/organizations/{organizationId}/farms` | Farms in a John Deere organisation |
| `GET` | `/v1/vendors/john-deere/organizations/{organizationId}/farms/{farmId}/fields` | Fields in a John Deere farm |

### Import

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/vendors/john-deere/import` | Import selected John Deere entities into the digital farm twin |

The import path is **idempotent on John Deere IDs** — re-running the import
updates existing twin records instead of creating duplicates.

### Sequence

```
1. POST /v1/vendors/john-deere/access-token         (one-time per user)
2. GET  /v1/vendors/john-deere/organizations
3. GET  /v1/vendors/john-deere/organizations/{id}/farms
4. GET  /v1/vendors/john-deere/organizations/{id}/farms/{id}/fields
5. POST /v1/vendors/john-deere/import               (select what to import)
```

After step 5, the imported entities are queryable through the normal
[Farm API](./farm.md) — they look like any other farm/field in the
platform, with the John Deere identifiers retained as external IDs.

## Related

- [Build · Data Apps](../build/data-apps/overview.md) — the connector pattern
- [Case Study · Drone-based Weed Detection with John Deere](../examples/drone-john-deere.md) — uses this import path
