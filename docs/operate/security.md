---
sidebar_position: 5
---

# Security & Hardening

## Identity

- An OpenID Connect identity provider with strict client policies: authorization
  code flow with PKCE only — no implicit flow, no password grant, consent
  required for apps, exact redirect-URI matching.
- Short-lived access tokens (minutes) with refresh tokens; APIs verify them
  locally and refuse tokens that do not name them (`aud`).
- Apps reach services through **token exchange** (a token per service and
  scope set); background work uses `client_credentials` with mTLS where
  available.
- Apps are **registered and reviewed** before they get a client; see
  [SDK · Publishing](../sdk/app-store.md).

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
