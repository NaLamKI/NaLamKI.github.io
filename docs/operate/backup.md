---
sidebar_position: 6
---

# Backup & Disaster Recovery

## What to back up

| Data | Cadence | Retention |
|------|---------|-----------|
| Postgres (Farm, Activity, IAM) | continuous (WAL) + nightly snapshot | 30 days hot, 1 year cold |
| Object store (rasters, AI outputs) | versioning enabled | per project policy |
| Sensor observations (time-series store) | nightly snapshot | 30 days hot, 5 years cold |
| Keycloak realm config | on change | indefinite |
| Audit log | continuous, append-only | regulatory minimum |

## Restore drill

Run a full restore-from-cold quarterly. The drill must include:

- Bring up a fresh stack against the restored data
- Verify a representative service run end-to-end
- Verify the audit log is intact

## DR scenarios

- **Single-service failure** — Kubernetes restart, automatic.
- **Regional outage** — failover to a warm standby region (if configured).
- **Data corruption** — roll back to the last clean snapshot; replay the
  audit log to identify affected commissions.
