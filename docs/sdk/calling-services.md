---
sidebar_position: 3
---

# Calling Services

For extension developers who call services of the platform — above all the
digital farm API — and for service developers who accept calls from extensions.

An extension calls other services **on behalf of the signed-in person**, with a
token that was exchanged for exactly that service and exactly the scopes the
manifest names. The login token itself never leaves the extension's backend.

```toml
[[services]]
name = "farm"                 # ext.service("farm")
audience = "farm-api"
scopes = ["farm-read"]
mode = "user"
```

```python
@api.get("/farms")
async def farms(farm_api: ServiceClient = Depends(ext.service("farm"))):
    response = await farm_api.get("/farms")         # path below APPEXT_SERVICE_FARM_URL
    response.raise_for_status()
    return response.json()
```

`audience` and `scopes` are the platform's: they come from its **service
catalog** (`appext store services` lists them). The names `farm`, `farm-api` and
`farm-read` are placeholders here — use the ones your platform publishes for the
digital farm API.

## `ServiceClient`

`ServiceClient` is a thin HTTP client: `get`, `post`, `put`, `patch`, `delete`,
`head`, `request`. It differs from a plain client in three ways:

- The **base URL** comes from `APPEXT_SERVICE_<NAME>_URL` — the auth bundle sets
  it; on your machine `appext dev` takes it from the platform file's
  `[platform.services]` — and a request can only go *below* it. An absolute URL
  to another host is refused: this client attaches a bearer token and must not
  be a way to send one somewhere the manifest never named.
- The **token** is fetched per request from a cache or by exchange.
- After a **`401`** it retries **once** with a fresh token (a cached token can
  expire or be revoked between the cache check and the service's check). A
  second `401` is an answer.

Bodies must be re-sendable (`json=`, `data=`, `content=` as bytes or text) — a
one-shot stream could not be repeated after a `401`.

## The two modes

| Mode | Token | Use for |
|------|-------|---------|
| `user` | **Token exchange** ([RFC 8693](https://www.rfc-editor.org/rfc/rfc8693)): the session's own access token is the subject token; the request carries `audience` and `scope`; the extension authenticates as a client. The result is cached per session, audience and scope set until shortly before it expires. | Everything on behalf of a person. Needs a session. |
| `service` | **Client credentials** ([RFC 6749 §4.4](https://www.rfc-editor.org/rfc/rfc6749#section-4.4)) of the extension's service account, cached per audience. No person in the token. | Background work and exports. The target service does not see the person — pass them explicitly if it matters (`{"requested_by": user.sub}`). |

Outside a request (a background task) use `ext.service_client("export")` — for a
`user` service you must pass the session: `ext.service_client("farm", session)`.

## What the identity provider requires

These are the requirements of the provider's token exchange; the registry — or
the SDK's local development export — sets up the objects.

1. The **subject token** must be the extension's own. It is.
2. **Audiences come from scopes.** Each scope of a service carries an *audience
   mapping* for that service; without it the token names a default audience and
   the service rejects it.
3. The `scope` parameter selects **optional** scopes of the extension's client.
4. **Consent applies to exchanges.** An exchange passes only for scopes the
   person already agreed to. That is why the SDK asks for all `user` service
   scopes at sign-in: the consent screen shows exactly which data in which
   service the extension may reach, and later exchanges cannot fail for lack of
   consent.

The full list is in the [platform contract](./platform-contract.md#the-identity-provider).

## `ConsentRequired`

If an exchange is refused because a scope was never consented to — the manifest
got a new scope, or the person revoked consent in the provider's account
console — the SDK raises `appext.ConsentRequired(missing_scopes)`. In a request
the SDK turns it into

```text
HTTP 401
{"error": "consent_required", "missing_scopes": ["farm-read"], "login_url": "/auth/login?return_to=/farms&scope=farm-read"}
```

and `extFetch` follows the `login_url`: a new sign-in that asks for the missing
scopes, so the provider shows the consent screen for exactly those. If the login
token itself is refused (`invalid_token`, `invalid_grant`), the SDK refreshes the
session once and retries; if that fails too, the session counts as ended
(`401`, a new sign-in). Other failures of the exchange become
`502 {"error": "upstream_auth_failed"}` (details are logged, not shown: the
browser cannot act on them). Handle
`ConsentRequired` yourself only in background code.

## Writing a target service

A service in Python checks incoming tokens with the same library, so the rules
cannot drift apart. The exchanged token has the service's client id in `aud`, the
granted scopes in `scope` and the calling extension in `azp`.

```python
from fastapi import Depends, FastAPI
from appext.verify import Principal, TokenVerifier, current_principal, require_azp, require_scope

verifier = TokenVerifier(
    issuer="https://auth.example.org",
    audience="projects-api",                       # this service's own client id
    jwks_url="https://auth.example.org/keys",      # the issuer's jwks_uri, from its discovery document
)
app = FastAPI()
verifier.install(app)

@app.get("/v1/projects", dependencies=[Depends(require_scope("projects-read"))])
async def projects(principal: Principal = Depends(current_principal)):
    return load_projects(owner=principal.sub)

@app.delete("/v1/projects/{id}", dependencies=[Depends(require_scope("projects-write")),
                                              Depends(require_azp("ext-reports"))])
async def remove(id: str): ...                      # only this extension, only with this scope
```

**Checked:** signature (JWKS, re-fetched on an unknown `kid`), `iss`, `exp`, the
own client id in `aud`, then the scopes you require (all of them). **Answers:**
no or bad token → `401` with `WWW-Authenticate: Bearer`; a valid token without
the scope → `403 insufficient_scope`; the wrong extension →
`403 forbidden_client`; unreachable key set → `503` (the token may be fine, we
cannot tell). `Principal` carries `sub`, `azp`, `scopes` and the raw `claims`.

Pass `verifier=` to `require_scope` / `require_azp` instead of installing one on
the app if you run several verifiers. The service must be registered in the
registry's **service catalog** with its scopes, consent texts and base URLs —
that is what makes a scope something an extension can ask for.

How much a scope allows is the service's decision, and a conservative rule works
well: let the service decide from the **intersection** of what the person may do
and what the scope grants — an extension can then never do more than the person,
and never more than its scope says. Keep administrative and destructive actions
out of extension scopes altogether, and refuse extension tokens on endpoints
that concern the person's own account.
(See [Scopes, audiences & permissions](../concepts/iam/authorization.md).)

## See it in action

- [Getting started](../quickstart/getting-started.md) — a call to the digital farm API, with and without the SDK
- [API Reference · Conventions](../api-reference/conventions.md) — what to send
