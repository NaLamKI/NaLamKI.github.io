---
sidebar_position: 6
---

# Open Source & Vendor-Neutral

AgriFoodData is fully open-source. There is **no proprietary core**, no
mandatory commercial licence, and no single-vendor dependency.

## Licensing

- All platform components, SDKs and starter kits are licensed under
  **Apache-2.0** (subject to final governance approval).
- The reference architecture itself is published by the ITU and the FAO and
  is freely available.

## Governance

- The architecture evolves through **public working groups** (see
  [Ecosystem · How to contribute](../ecosystem/contribute.md)).
- Breaking changes follow a documented policy
  (see [Ecosystem · Governance](../ecosystem/governance.md)).
- The platform deliberately **does not displace** existing FMIS, sensor
  stacks or AI services — it gives them a common contract.

## Why "vendor-neutral" matters

Each of the six [building blocks](./un-standard.md) can be implemented by a
different vendor, as long as the contracts at the integration boundaries are
honoured. AgriFoodData provides a complete *reference* implementation of all
six — but any one of them can be swapped out, replaced, or extended by a
third party.
