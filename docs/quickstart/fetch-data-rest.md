---
sidebar_position: 4
---

# Fetch data via REST

For frontend and dashboard developers — pull farm data, observations and
layer outputs without any platform-internal SDK.

## 1. Get a token

```bash
curl -X POST \
  "${KEYCLOAK_URL}/realms/main/protocol/openid-connect/token" \
  -d "grant_type=client_credentials" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET"
```

The response carries an `access_token` — use it as a bearer token below.

## 2. List the farms you can see

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.example.com/v1/farms"
```

## 3. Pull a region's recent observations

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.example.com/v1/regions/<region-id>/sensors/observations"
```

## 4. Query sensor data directly via OGC STA

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://sta.example.com/Datastreams(1)/Observations?\$top=50&\$orderby=phenomenonTime%20desc"
```

## 5. Fetch a STAC item from the Spatio-Temporal API

```bash
ST_BASE="https://spatio-temporal.example.com"   # or http://localhost:8080 for the local stack

curl -H "Authorization: Bearer $TOKEN" \
  "$ST_BASE/api/v2/stac/collections/telangana-ndvi-2025/items"
```

Use the returned asset hrefs with any STAC-capable client
(`pystac-client`, `stac-browser`, the QGIS STAC plugin, …) — or fetch the
**TileJSON** for a Leaflet / MapLibre client:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "$ST_BASE/api/v2/collections/telangana-ndvi-2025/tiles/WebMercatorQuad/tilejson.json?layers=NDVI"
```

Use the returned asset href with any STAC-capable client (`pystac`,
`stac-browser`, QGIS STAC plugin, …).

## Next steps

- [Build · Frontend & Dashboards](../build/frontend-dashboards/overview.md) — full dashboard recipes
- [Concepts · Spatio-Temporal API](../concepts/apis/spatio-temporal-api.md)
- [API Reference](../api-reference/overview.md)
