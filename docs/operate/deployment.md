---
sidebar_position: 3
---

# Deployment Patterns

Three production patterns, each appropriate to a different operational
reality.

## Cloud-native

A single Kubernetes cluster runs all components. Suitable for centralised
state-level or national deployments.

- Helm chart: `agrifooddata/agrifooddata`
- Persistence: managed Postgres + managed object store
- Ingress: gateway behind a managed load balancer

## Edge

Compute moves to the field — a gateway on the farm runs a slim agent that
buffers observations and synchronises when connectivity is available.

- Edge agent runs on Raspberry Pi 4+ / generic ARM64
- Durable local queue for sensor observations
- Forward to a regional or cloud deployment on a schedule
- See [Build · Sensor Integration](../build/sensor-integration/overview.md)

## Hybrid

The most common pattern for ACRAT-style deployments: a regional cloud
deployment handles APIs and persistence; edge gateways feed sensor data.

- Same Helm chart on the regional side
- Edge gateways treated as Sensor-Things clients
- Clearing-house contracts at the regional boundary
