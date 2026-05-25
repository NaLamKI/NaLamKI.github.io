---
sidebar_position: 6
---

# Case Study · Soil Moisture & Irrigation Control

A live, time-series-driven application.

## Goal

Use real-time soil moisture readings to recommend or automate irrigation.

## Data flow

1. Soil-moisture probes publish observations via MQTT (OGC STA).
2. The platform stores them on the Datastream linked to a Region.
3. A decision-support service consumes the live stream and the local
   weather forecast.
4. Recommendations land as Activities (planned irrigation events).
5. A connector (optional) writes the events to the irrigation controller.

## APIs used

- Sensor Things API — observations
- Activity API — recommended events
- Service Registry — the decision-support service
- Farm API — the region the probes monitor
