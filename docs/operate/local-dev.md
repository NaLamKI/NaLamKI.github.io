---
sidebar_position: 2
---

# Local Development Setup

Run the full AgriFoodData stack on your laptop with Docker Compose.

## What's in the stack

- API gateway
- Farm · Sensor Things · Spatio-Temporal · Activity · Service Registry services
- Keycloak (IAM)
- Postgres + PostGIS
- RabbitMQ
- MQTT broker
- MinIO (S3-compatible object store)

## Prerequisites

- Docker 20.10+ with Compose v2
- ~8 GB free RAM, 20 GB free disk

## Bring it up

```bash
git clone https://github.com/NaLamKI/agrifooddata-compose.git
cd agrifooddata-compose
docker compose up -d
```

> The compose repo will move to the `AgriFoodData` org once the
> [rebrand](../ecosystem/roadmap.md) is complete.

The first start downloads images and seeds Keycloak with a demo realm.

## Sanity check

```bash
curl http://localhost:8080/health        # gateway
curl http://localhost:8443/realms/main   # keycloak
```

## Tear down

```bash
docker compose down -v
```
