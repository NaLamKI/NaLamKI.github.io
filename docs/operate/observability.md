---
sidebar_position: 4
---

# Observability

## Logs

- All services emit structured JSON logs.
- Ship to your preferred aggregator (Loki, ELK, Datadog).
- Include the **commission UUID** in every log line related to a service run
  so you can reconstruct the full audit trail.

## Metrics

- Prometheus scrape endpoints exposed on `:9090/metrics`.
- Recommended dashboards:
  - **Platform health** — API latency, error rate, queue depth
  - **Service runs** — heartbeat lag, success rate, mean processing time
  - **Sensor ingest** — observations/sec, dropped messages, late observations

## Health checks

- `/health/live` — process is alive
- `/health/ready` — dependencies (DB, MQ, OIDC) are reachable

## Audit log

- The platform writes a structured audit log for every IAM and clearing-house
  event (grant, revocation, contract issuance, data delivery).
- See [Concepts · Data Sovereignty](../concepts/data-sovereignty.md).
