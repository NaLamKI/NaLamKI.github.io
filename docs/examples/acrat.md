---
sidebar_position: 3
---

# Case Study · ACRAT — Integrating local AgriTech Start-ups

## Goal

Bring local Indian AgriTech start-ups onto the platform so that their
services compose with the state-level GeoAI module and become available
to MAOs and farmers through the same dashboard.

## Stakeholders

- **BharatRohan** — drone surveys
- **Carbonmint** — carbon accounting
- **Transity** — farmer-facing mobile apps
- GIZ ACRAT programme, BMLEH-funded

## Architecture

Each start-up registers its service in the Service Registry. Inputs come
from the digital farm twin (Sentinel-2 layers, farm/field boundaries, sensor
streams); outputs land back as Layers or Activities.

## APIs used

- Service Registry — registration, commissioning, results
- Farm API — region scoping
- Spatio-Temporal API — drone and AI outputs
- Activity API — carbon and operational records

## Outcome

Three start-up services live, all available to the MAO workflow and to the
farmer-facing dashboard.
