---
sidebar_position: 1
---

# Build Your Service

The inhaltliche Kern of the docs — organised by what you are building, not
by which subsystem you happen to touch.

## Pick your persona

- → [AI Services](./ai-services/overview.md) — bring a model to the platform as a buchbarer Dienst.
- → [Data Apps](./data-apps/overview.md) — connect an external data source (FMIS, weather, catalogue) to the platform.
- → [Sensor Integration](./sensor-integration/overview.md) — make IoT hardware speak directly to the platform.
- → [Frontend & Dashboards](./frontend-dashboards/overview.md) — build custom visualisations and consoles on top of platform data.

## Page structure

Each persona section follows the same substructure so you always know where
to look:

```
- Overview & decision tree
- Prerequisites
- Step-by-step tutorial
- Reference implementation (link to GitHub)
- Common patterns & anti-patterns
- Publishing checklist
```

## Which APIs you'll touch

| Persona | Primary APIs | Secondary APIs |
|---------|--------------|----------------|
| AI Service Developer | Service Registry · Spatio-Temporal | Farm · Sensor Things · Activity |
| Data App Developer | Farm · Activity | Spatio-Temporal · Service Registry |
| Sensor Integrator | Sensor Things | Farm |
| Frontend / Dashboard Developer | Spatio-Temporal · Farm | Activity · Sensor Things |
