---
sidebar_position: 3
---

# Synchronization

The data model is made for **offline-first** applications: a phone in a field
without coverage, a machine terminal, a service that works in batches. The API
therefore does not hand out "the current state" — it hands out **changes**, in
an order a client can resume.

## What the model guarantees

| Requirement | How the API provides it |
|-------------|-------------------------|
| Records can be created offline without colliding | the **client generates the UUID**; `PUT /{collection}/{id}` stores a record under it |
| A repeated request is harmless | `PUT` with `If-None-Match: *` creates only; a lost response followed by a retry cannot overwrite anything |
| Concurrent edits resolve without losing both | **per-attribute, last write wins**: `PATCH` carries a [merge patch](./conventions.md#change-attributes--patch) naming only the attributes it changes |
| A client can fetch only what changed | every collection lists in the order **`updatedAt`, then `id`** and hands out a **cursor** |
| Withdrawal and deletion reach every client | withdrawal is a status change and arrives with the record; a deletion arrives as a `DELETE` entry of `/audit-logs` |
| Reported documentation stays accountable | changes to it go through the [correction path](./conventions.md#the-correction-path) and are recorded with a reason |

## Reading changes

Each collection is polled independently with its own cursor.

```
GET /fields?limit=500                              first page
GET /fields?limit=500&cursor=<nextCursor>          next page, while hasMore is true
GET /fields?cursor=<stored nextCursor>             a later poll: only what changed since
```

Every page carries three members:

```json
{ "items": [ … ], "nextCursor": "…", "hasMore": true }
```

- `nextCursor` resumes **after the last record of this page** — and it is
  returned on the **last page too**, with `hasMore: false`, so that the next
  poll resumes exactly where this one ended. Store it per collection.
- `hasMore` tells you whether further records follow *now*.
- The order is `updatedAt`, then `id`, so records written in the same instant do
  not fall between pages. Treat the cursor as opaque.

To start from a point in time rather than from the beginning, pass
`updatedAfter=<ISO 8601 UTC timestamp>` on the first request instead of a
cursor — the two are alternatives. A cursor belongs to one collection and one
set of filters. The largest `limit` the API accepts is the deployment's choice
(the specification allows up to 1000); if a request is refused for it, use a
smaller page.

### An algorithm for a client

```text
for each collection C in dependency order:                 # farms before fields before regions …
    cursor = stored cursor for C            (none on first run)
    loop:
        page = GET /C?limit=500 [&cursor=cursor]
        for each record in page.items:      upsert into the local store
        cursor = page.nextCursor ;  store it
        if not page.hasMore: break

deletions:
    page = GET /audit-logs?action=DELETE [&cursor=…]     # same mechanism
    for each entry:   remove the record entry.entityType / entry.entityId locally
```

### How the three kinds of change arrive

| Change | What the client sees |
|--------|----------------------|
| **created or edited** | the record, with a later `updatedAt` |
| **withdrawn from use** | the record itself — with a terminal `status` (`COMPLETED`, `CANCELLED`, `SOLD` …) or an `endsAt` in the past. It is **not** removed; references to it stay valid |
| **deleted** | no record at all — an `AuditLog` entry with `action: DELETE`, `entityType` and `entityId`. Filter `/audit-logs` by `action`, `entityType` or `entityId` |

Because withdrawal is not deletion, a synchronised store must never treat "this
record disappeared from the list" as a deletion: lists do not shrink.

## Writing changes

Work through the outbox in **dependency order** — a reference must point at a
record that exists (`Farm` before `Field` before `Region`, and so on).

| Local change | Request |
|--------------|---------|
| a record created offline | `PUT /{collection}/{id}` with `If-None-Match: *` |
| attributes changed | `PATCH /{collection}/{id}` with a merge patch of only those attributes |
| a record replaced as a whole | `PUT /{collection}/{id}` (with `If-Match` if you want to fail on a newer version) |
| a record deleted | `DELETE /{collection}/{id}` |

How to read the answers:

| Answer | Meaning | The client |
|--------|---------|-----------|
| `200`, `201`, `204` | done | removes the entry from the outbox |
| `412` on a create | the record already exists — usually *your own earlier request* | reads it; if it is yours, the entry is done |
| `409` | an invalid state transition, an immutable record, a business key or a dependency conflict | shows the person; a retry changes nothing |
| `422` | the record is invalid, or violates a rule | shows the person; a retry changes nothing |
| `401` | the token is no longer valid | [refresh the token](../concepts/iam/user-authentication.md#5--refresh) and retry |
| `403` | the person may not do this on this farm | stops; do not retry |
| `5xx`, no network | the cause is outside the record | retry later |

Do not guess from the status code alone — read the
[problem detail](./errors.md): its `type` and `violations` say which rule was
violated.

### Conflicts, in practice

- Two devices change **different attributes** of a record: both changes survive.
- Two devices change **the same attribute**: the later write wins.
- A change to **reported documentation** (referenced by a `SUBMITTED` report)
  needs `Change-Reason`; without it the server refuses.

## Time

`createdAt` and `updatedAt` are set by the server, in UTC. A client that needs
the local time of a record shows it in `Farm.timezone`. A device whose clock is
wrong therefore cannot corrupt the cursor — but it can still write a wrong
*value* into an attribute that holds a time, so keep device clocks honest.

## See it in action

- [Conventions](./conventions.md) — the headers used above
- [Getting started](../quickstart/getting-started.md#7--read-changes-and-write-them-back)
