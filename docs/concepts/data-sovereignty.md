---
sidebar_position: 7
---

# Data Sovereignty in Practice

Data sovereignty is the principal adoption barrier in digital agriculture.
AgriFoodData treats it as a **technical** problem — not a contractual one.

## Three guarantees

1. **Fine-grained, technically enforceable access control.** Access is granted
   per farm, to a person, with a role, for a period (`AccessAssignment`); an
   individual dataset can be registered as a protected resource of its own
   (`iamResourceId`) for finer policies in the identity layer. An app reaches
   only what a person has **consented** to, in the words of each scope's consent
   text — see [Scopes, audiences & permissions](./iam/authorization.md).
2. **Audit log.** Every change to a record is written to the append-only
   `AuditLog`: what changed, when, by which person or processing run, and — for
   corrections of reported documentation — why. The farmer can inspect the log
   at any time.
3. **Revocability.** Access can be withdrawn at any time: an assignment ends
   (`endsAt`), a consent is revoked at the identity provider. Once revoked, the
   next token exchange of an app fails; tokens already issued are short-lived and
   expire within minutes.

## Mechanism — the clearing house

The clearing-house ties usage policies to data exchange:

- **Usage policies** are expressed in IDSA terms — what may a service do
  with the data, for how long, for which purpose. They live in the data-space or
  identity layer, in a policy language such as ODRL; the
  [data model](./data-model/rules-and-states.md#what-deliberately-does-not-live-in-the-model)
  records only the resource identifiers they are bound through.
- **Contracts** are issued when a farmer grants access; they reference both
  the data resource and the policy.
- **Enforcement** happens at the integration boundaries — the data
  connector refuses to deliver data to a service that does not present a
  valid contract.

## Data spaces

AgriFoodData participates in **GAIA-X** and **IDSA**-aligned data spaces, so
data exchange outside a single deployment uses existing data-space contracts
rather than ad-hoc data dumps.
