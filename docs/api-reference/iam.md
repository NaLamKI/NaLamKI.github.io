---
sidebar_position: 8
---

# IAM / Auth Endpoints

**Standard:** OpenID Connect
**Provider:** **External Keycloak realm** — not on the main API.

The main API does **not** expose its own auth endpoints. It validates Bearer
tokens issued by the platform's Keycloak realm. Get a token directly from
Keycloak; use it against the main API and the OGC STA service.

## Token endpoint

```
POST {KEYCLOAK_URL}/realms/{realm}/protocol/openid-connect/token
```

### Service-to-service (client credentials)

```bash
curl -X POST \
  "${KEYCLOAK_URL}/realms/main/protocol/openid-connect/token" \
  -d "grant_type=client_credentials" \
  -d "client_id=${CLIENT_ID}" \
  -d "client_secret=${CLIENT_SECRET}"
```

### Interactive user (PKCE)

Use **PKCE** for browser clients. Tokens are short-lived; refresh in the
background using the refresh token returned alongside the access token.

## Using the token

```bash
curl -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  "https://api.example.com/v1/farms"
```

The same token works against the OGC STA service:

```bash
curl -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  "https://sta.example.com/Things"
```

## Platform-side user records

The platform stores a user record per Keycloak identity (roles,
organisations, permissions). Those records are managed via the
[Farm API · Users & Organizations](./farm.md#users--organizations)
endpoints (`/v1/users`, `/v1/organizations`).

## Related

- [Concepts · IAM](../concepts/iam.md) — roles, permissions and the audit log
- [Concepts · Data Sovereignty](../concepts/data-sovereignty.md) — clearing house
