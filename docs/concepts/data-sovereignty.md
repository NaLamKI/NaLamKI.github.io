---
sidebar_position: 7
---

# Data Sovereignty in Practice

Data sovereignty is the principal adoption barrier in digital agriculture.
AgriFoodData treats it as a **technical** problem — not a contractual one.

## Three guarantees

1. **Fine-grained, technically enforceable access control.** Farmers grant
   access at the level of a field, a region, or a datastream — not the
   whole farm.
2. **Audit log.** Every grant, revocation, read and write is recorded. The
   farmer can inspect the log at any time.
3. **Revocability.** Access can be withdrawn at any time. Once revoked, a
   service can no longer read the data or produce new outputs against it.

## Mechanism — the clearing house

The clearing-house ties usage policies to data exchange:

- **Usage policies** are expressed in IDSA terms — what may a service do
  with the data, for how long, for which purpose.
- **Contracts** are issued when a farmer grants access; they reference both
  the data resource and the policy.
- **Enforcement** happens at the integration boundaries — the data
  connector refuses to deliver data to a service that does not present a
  valid contract.

## Data spaces

AgriFoodData participates in **GAIA-X** and **IDSA**-aligned data spaces, so
data exchange outside a single deployment uses existing data-space contracts
rather than ad-hoc data dumps.
