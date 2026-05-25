---
sidebar_position: 4
---

# Submit Your Service

How a third-party service goes from "I built something" to "in the
catalogue, bookable by users."

## 1. Build against the contract

Use the [Build · AI Services](../build/ai-services/overview.md) guide.
Make sure you have:

- A working container image
- A complete self-description (inputs, outputs, resource needs)
- An end-to-end test run on a local stack

## 2. Apply

Open an issue in the service-submission repo (template provided). Include:

- The self-description
- The container image reference
- A link to the GitHub repository
- A short description of the service for the catalogue entry

## 3. Review

A maintainer reviews:

- Contract conformance (does the self-description validate?)
- Image sanity (does it start? does it honour the heartbeat protocol?)
- Documentation quality (would an MAO understand what this does?)

## 4. Provisioning

Once approved, the platform issues:

- A **UUID** for the service
- Dedicated **queues**
- A **JWT / certificate** for queue authentication
- A draft catalogue entry

## 5. Launch

After a green test commission, the entry flips from *draft* to *catalogued*.
The service is now visible to all users with appropriate roles.

## Status policy

- **Draft** — submitted, reviewed
- **Catalogued** — live, bookable
- **Deprecated** — still callable, no new bookings
- **Retired** — removed from catalogue
