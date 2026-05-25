---
sidebar_position: 5
---

# Security & Hardening

## Identity

- Keycloak with strict client policies — no implicit flow in production.
- Short-lived access tokens (~5 min) with refresh-token rotation.
- Service-to-service flows use `client_credentials` with mTLS where
  available.

## Transport

- TLS everywhere — internal traffic terminated at the service mesh, external
  traffic via the gateway.

## Data at rest

- Encrypted volumes for Postgres and object storage.
- Object-store policies deny public access by default.

## Secrets

- Use a secrets manager (Vault, AWS/GCP secrets, Sealed Secrets) — never
  bake credentials into images.

## Permissions

- Default deny. Grant per resource (field, region, datastream) — never at
  the whole-farm level unless explicitly contracted.

## Audit

- The clearing-house audit log captures every data delivery and policy
  decision — make it tamper-evident (append-only with periodic hash
  checkpoints).
