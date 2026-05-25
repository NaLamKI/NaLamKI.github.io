---
sidebar_position: 5
---

# Governance & Standards

## Standards body

The architecture is curated by **ITU Study Group 20** in collaboration with
the **FAO**. The reference architecture was adopted in **July 2024**.

## Local governance

- Architecture changes are proposed through the *Architecture & APIs*
  working group.
- A short RFC is filed in the spec repo (`agrifooddata/openapi-specs`).
- After WG approval and a public comment window, the change lands.

## Versioning

- **Reference architecture** — semver-like; current is **v1.4**.
- **APIs** — semver per API. Breaking changes are announced one minor
  version ahead.

## Breaking-change policy

- A **deprecation notice** is published when a breaking change is decided.
- Both the old and new behaviour run in parallel for **at least one minor
  version**.
- Deprecated endpoints are removed only in the *next major* version after
  deprecation.

## Licensing

- Code: **Apache-2.0** (pending final governance approval).
- Documentation: **CC BY 4.0**.
- The ITU/FAO reference architecture itself is published by the ITU and
  the FAO.
