---
sidebar_position: 6
---

# Identity, Roles & Permissions

AgriFoodData uses **Keycloak / OpenID Connect** as its identity layer. Every
API call is authenticated by JWT; every resource carries fine-grained
permissions.

## Roles

Roles are defined per the ITU/FAO reference architecture. Typical roles:

- **Farmer** — owns the farm twin and its operational data.
- **Service Provider** — runs an AI service registered in the catalogue.
- **Sensor / Machinery Vendor** — registers Things and Datastreams.
- **Certification Body** — audits operations against agreed schemes.
- **Operator** — runs a regional deployment of the platform.
- **Developer** — builds against the APIs.

## Permissions

Permissions are **fine-grained, technically enforceable** — not just
contractual. A farmer can grant access to a single field, a single
region, or a single datastream — and revoke it again at any time.

The clearing-house ([Data Sovereignty](./data-sovereignty.md)) records every
grant and revocation for auditability.

## See it in action

- [Quickstart · Run your first AI service](../quickstart/first-ai-service.md) — service-account setup
- [API Reference · IAM endpoints](../api-reference/iam.md)
