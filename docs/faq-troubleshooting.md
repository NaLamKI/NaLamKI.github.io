---
sidebar_position: 10
---

# FAQ & Troubleshooting

Grouped by persona plus cross-cutting topics. Use **⌘K** in the navbar to
search the whole docs site if the answer isn't here yet.

## General

### What is AgriFoodData?
An open, vendor-neutral data platform for digital agriculture. It is the
reference implementation of the ITU/FAO reference architecture adopted by
ITU Study Group 20 in July 2024. See [Why AgriFoodData](./why/overview.md).

### What is the ITU?
The International Telecommunication Union — a UN specialised agency for
information and communication technologies. ITU Study Group 20 adopted the
ITU/FAO reference architecture this platform implements. See
[Why · The UN Standard](./why/un-standard.md).

### Is the platform free / open source?
Yes. See [Why · Open Source & Vendor-Neutral](./why/open-source.md).

---

## For AI Service Developers

### How does service registration work?
Service developers submit a self-description and an image; the platform
assigns a UUID, queues, and a JWT/certificate. The JWT/certificate must be
embedded in the service to authenticate against the queues. Today this is
handled per request by the maintainers; a self-service flow is on the
[roadmap](./ecosystem/roadmap.md). See
[Submit Your Service](./ecosystem/submit-service.md).

### What happens if my service does not present a valid JWT/certificate?
Authentication against the messaging queues fails, so the service never
receives requests. Only authorised services can interact with the platform.

### How are service requests processed?
A commission lands on the service's queue. A worker retrieves it,
acknowledges, processes it, emits **heartbeats**, and writes a final
result. See [Concepts · Service Registry](./concepts/service-registry.md).

### What is in a heartbeat signal?
- **Completion percentage**
- **Current processing step**
- **Estimated remaining time**
- **Detailed error messages** on failure

### My service receives no heartbeats. What could be wrong?
- **Authentication.** Check that the JWT/certificate is embedded and valid.
- **Queue config.** Check the service is listening to the correct queue.
- **Network.** Verify connectivity to the broker.
- **Service errors.** Inspect logs for unhandled exceptions.

### Docker build fails — not enough space.
- **Docker Desktop (macOS/Windows).** Settings → Disk image location →
  move to a drive with more space.
- **Linux.** Stop dockerd, move the Docker root to a larger volume, update
  the daemon config, restart. See the
  [Docker forums](https://forums.docker.com/t/how-do-i-change-the-docker-image-installation-directory/1169).

---

## For Sensor Integrators

### Which transport should I use?
**MQTT** for high-frequency live streams. **REST** for batch uploads and
manual edits. See [Concepts · Sensor Things API](./concepts/apis/sensor-things-api.md).

### How do I link an observation to a field?
Set the Datastream's `FeatureOfInterest` to the Region ID from the Farm
API. From then on, every observation is spatially grounded on that
region.

---

## For Data App Developers

### How do I map an external schema to the AgriFoodData data model?
Maintain an explicit translation table in the connector repo and commit it
alongside the code. Use AgroVoc URIs for crops, soil, and inputs to keep
the mapping inspectable. See [Build · Data Apps](./build/data-apps/overview.md).

---

## For Frontend Developers

### Which auth flow should the browser use?
**PKCE** with Keycloak. Use short-lived access tokens and refresh in the
background. See [API Reference · IAM](./api-reference/iam.md).

### Should I use `/collections/...` or `/api/v2/collections/...`?
**Prefer `/api/v2/*`.** The V2 surface has stable coordinate handling,
TileJSON 3.0, full CQL2, sortby/facetby and the aggregations endpoints.
The bare paths remain for older clients. See
[API Reference · Spatio-Temporal](./api-reference/spatio-temporal.md).

### How do I display NDVI on a MapLibre or Leaflet map?
Fetch the TileJSON and add it as a source:
```
GET /api/v2/collections/{id}/tiles/WebMercatorQuad/tilejson.json?layers=NDVI
```
Or use the auto-generated MapLibre style: `GET /collections/{id}/style`.

---

## Messaging & storage

### What messaging technology does the platform use?
**RabbitMQ** for service commissioning and heartbeats; **MQTT** for sensor
data ingest.

### Why messaging queues?
They enable asynchronous, resilient communication between services and the
platform — producers (the platform on behalf of users) emit messages,
consumers (service workers) process them. Queues survive worker restarts,
which is essential for long-running AI workloads.

### What about S3 storage?
S3 is the canonical store for inputs and outputs. Each service request
includes a JWT-authenticated URL to the relevant bucket; outputs are
written back to S3 and then linked into the digital farm twin as a Layer
or as Activity outputs. You can use any S3-compatible store (MinIO, AWS,
GCS via interop).

### How is data in S3 secured?
- **JWT-authenticated URLs** per request.
- **Encryption in transit** (TLS) and at rest (volume encryption).
- **Bucket policies** — least-privilege per service.

---

## Verifying my setup

### How can I verify that my service is correctly registered?
- Check the service catalogue for the right UUID and queues.
- Authenticate against the queue with your JWT.
- Look for successful-registration log lines and absence of auth errors.
