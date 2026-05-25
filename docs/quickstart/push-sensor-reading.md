---
sidebar_position: 3
---

# Push a sensor reading via MQTT

The shortest path to the IoT *"aha"* moment. We register a Thing, a Sensor,
and a Datastream, then push a single observation over MQTT.

## Prerequisites

- An MQTT client. `mosquitto_pub` works fine:

  ```bash
  brew install mosquitto         # macOS
  sudo apt install mosquitto-clients  # Debian/Ubuntu
  ```

- A service account JWT (request via the [submit-your-service](../ecosystem/submit-service.md) workflow).

## 1. Create the Thing, Sensor and Datastream (REST)

```bash
TOKEN="<your jwt>"
BASE="https://sta.example.com"

# Thing
curl -X POST "$BASE/Things" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{
    "name": "SoilBox-42",
    "Locations": [{"location": {"type":"Point","coordinates":[78.49,17.39]}}]
  }'

# Sensor + Datastream (abbreviated)
curl -X POST "$BASE/Datastreams" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d @datastream.json
```

`datastream.json`:

```json
{
  "name": "Soil moisture · 10 cm",
  "unitOfMeasurement": { "name": "Volumetric Water Content", "symbol": "m³/m³" },
  "ObservedProperty": { "name": "soil-moisture-10cm" },
  "Sensor": { "name": "TDR-100", "encodingType": "text/plain", "metadata": "tdr-100" },
  "Thing": { "@iot.id": 1 }
}
```

## 2. Push an Observation

Via REST (always works):

```bash
curl -X POST "$BASE/Observations" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{
    "result": 0.27,
    "phenomenonTime": "2026-05-25T10:00:00Z",
    "Datastream": {"@iot.id": 1}
  }'
```

Or via MQTT for live streams (the topic follows the OGC STA spec):

```bash
mosquitto_pub \
  -h <broker host> -p 8883 --capath /etc/ssl/certs \
  -u "$SERVICE_USER" -P "$SERVICE_PWD" \
  -t "v1.1/Datastreams(1)/Observations" \
  -m '{"result": 0.27, "phenomenonTime": "2026-05-25T10:00:00Z"}'
```

That's it — the observation is now in the digital farm twin, linked to the
right Datastream and (transitively) to the field on which the SoilBox sits.

## 3. Verify

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "$BASE/Datastreams(1)/Observations?\$top=5&\$orderby=phenomenonTime%20desc"
```

### Shortcut — `/composite` endpoint

If you want to skip the three separate creates above, the STA service has a
non-standard convenience endpoint that creates the Thing, Sensor,
ObservedProperty and Datastream in **one call**:

```bash
curl -X POST "$BASE/composite" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{
    "thing":            {"name": "SoilBox-42"},
    "sensor":           {"name": "TDR-100"},
    "observedProperty": {"name": "soil-moisture-10cm"},
    "datastream":       {"unit": {"name": "VWC", "symbol": "m³/m³"}}
  }'
```

## Next steps

- [Build · Sensor Integration](../build/sensor-integration/overview.md) — production-grade ingest, batching, edge deployment
- [Concepts · Sensor Things API](../concepts/apis/sensor-things-api.md) — full data model
- [Case Study · Soil Moisture & Irrigation Control](../examples/soil-moisture.md)
