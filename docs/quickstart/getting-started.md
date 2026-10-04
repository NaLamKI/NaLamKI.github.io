---
sidebar_position: 2
---

# Getting Started: Sign In and Call the Digital Farm API

This guide takes an app from nothing to **signed-in calls against the digital
farm API**: it authenticates against the platform's identity provider, receives
a token for the API, and reads and writes farm records with it.

Everything here is built on open standards — OAuth 2.0, OpenID Connect, PKCE,
token exchange, JSON Web Tokens, OpenAPI and RFC 9457 problem details — so it
works with any language and any conformant OpenID Connect library. Two routes
lead through the same steps:

| Route | Choose it when | You write |
|-------|----------------|-----------|
| **A · With the SDK** | you build a web app with a Python backend | your routes; the SDK does sign-in, session and token exchange |
| **B · Any language** | you use another language or your own OIDC library | the same requests, made by your library |

The curl examples from step 5 on assume that you hold an API token — that is
Route B. Route A makes the same calls from its backend, and each of those steps
shows the SDK form.

## Before you start

The **platform operator** gives you these. Ask for them first.

| You need | Looks like |
|----------|------------|
| the **issuer URL** of the identity provider | `https://auth.example.org` |
| the **API base URL** of the digital farm API — the exact URL, including any path prefix | `https://api.example.org/v1` |
| the address of the platform's **App Store**, to register your app (Route A; Route B if the platform registers apps through it) | `https://store.example.org/api/v1` |
| a **developer account** with the store role `store-developer`, and a reviewer with the role `store-reviewer` who will approve your app | |
| a **person with access to at least one farm** — your own account, or a test account — to sign in with | a user with an `AccessAssignment` on a test farm |
| the **scopes** that grant what you will do — at least reading farms, fields and tasks, and creating and updating tasks | `farm-read`, `farm-write` (illustrative) |

The signed-in person's **role on the farm** and your app's **scopes** both have
to allow an operation: the API grants the intersection. For the calls below that
means at least `farm:read`, `field:read`, `task:read`, `task:create` and
`task:update`; anything less answers `403`. See
[Scopes, audiences & permissions](../concepts/iam/authorization.md).

Route A also needs Python 3.12 or newer and, for the single-page template,
Node 22.

In the examples, `$ISSUER` and `$API` stand for the first two values.

## The picture

```
 You ──▶ your app ── 1 sign in ──▶ identity provider ── issues ──▶ tokens
              │                                                       │
              └─────────────── 2 call, Bearer token ──▶ digital farm API
                                                            │ verifies the token,
                                                            │ checks the person's rights on the farm
                                                            ▼
                                                      farm records (JSON)
```

## 1 · Check the platform is there

The issuer URL is the only *identity-provider* address your app has to be given.
Everything else about it is found from there
([OpenID Connect Discovery](https://openid.net/specs/openid-connect-discovery-1_0.html)):

```bash
curl -s "$ISSUER/.well-known/openid-configuration"
```

Look for `issuer`, `authorization_endpoint`, `token_endpoint` and `jwks_uri`. The
`issuer` must be exactly the URL you were given. If the call fails, nothing later
will work; ask the operator. For the rest of the guide:

```bash
DISCOVERY=$(curl -s "$ISSUER/.well-known/openid-configuration")
TOKEN_ENDPOINT=$(echo "$DISCOVERY" | jq -r .token_endpoint)       # or read it from the JSON by hand
AUTHORIZATION_ENDPOINT=$(echo "$DISCOVERY" | jq -r .authorization_endpoint)
```

You can also browse the API before you sign in: its
[OpenAPI description](https://datamodel.agrifooddata.org/v1/openapi.yaml) loads
into any OpenAPI 3.1 tool — point the tool's server at `$API`.

## 2 · Register your app

An app does not talk to the identity provider on its own authority: it is
**registered** first, so the platform knows its client, its redirect URIs, its
public key and the scopes it may ask for. See
[Signing in apps](../concepts/iam/app-authentication.md#registration-comes-first).

### Route A — with the SDK

```bash
python3 -m venv venv && . venv/bin/activate
pip install appext
appext new farms-demo --template spa --platform example   # --template htmx for server-rendered pages
cd farms-demo
```

`--platform example` names the **platform file** the operator published
(`~/.config/appext/platforms/example.toml`); without one, fill `appext.toml` in
the new project by hand:

```toml
[platform]
name = "Example Platform"
issuer = "https://auth.example.org"
store_url = "https://store.example.org/api/v1"
```

Sign in to the store and look up what you may ask for:

```bash
appext store login            # device grant: open the printed address, confirm the code
appext store services         # the audiences and scopes of the platform's service catalog
```

Now make the manifest, `extension.toml`, call the **digital farm API**. The
template starts with a *starter service* in `[[services]]`. If the platform file
names the farm API as its starter service (`[platform.starter]`), `appext new
--platform` has written the right block already. Otherwise **replace** it with
the entry for the farm API, using the audience and scopes from the catalog:

```toml
[[services]]
name = "farm"                 # the name you use in code: ext.service("farm")
audience = "farm-api"         # ← from `appext store services`
scopes = ["farm-read", "farm-write"]
mode = "user"                 # on behalf of the signed-in person
```

If you renamed the service, rename it in `app/main.py` too — the template's sample
route calls `ext.service("data")` — and in the template's test and frontend
(`/api/items`). Step 5 shows routes to put there instead.

Register and submit:

```bash
appext keys generate          # once: a key pair; the private key never leaves your machine
appext store register         # uploads the manifest and the PUBLIC key
appext store submit
appext store status           # shows where the version is: SUBMITTED → APPROVED
```

A **reviewer** approves it (a manifest with restricted scopes needs a second
approval). On approval the platform creates your app's client at the identity
provider. Once the version is `APPROVED`:

```bash
appext store bundle --env local --out auth-bundle      # issuer, client id, URLs, lock file — no secret
```

`--env local` names the environment of a developer's machine: it is the one that
registers `http://127.0.0.1:8100/auth/callback` as a redirect URI. A registry on
another host defaults to `prod`, so say it explicitly. The bundle sets
`APPEXT_SERVICE_FARM_URL`, the base URL of the farm API; the path you give
`farm_api.get(…)` is relative to it, so it must include the API's base path
(`…/v1`).

### Route B — any language

Ask the platform's registry for a client — the SDK's command line can do the
registration alone, or the platform may register apps another way — and receive
a **client id** (by convention `ext-<your app id>`). What you provide:

| You provide | Why |
|-------------|-----|
| the app's **redirect URI**, `https://<your-app>/auth/callback` (and, for local work, a loopback address) | matched **exactly** |
| the **public key** of a key pair you generated (a JWK) | the identity provider holds the public half; the private key never leaves you. This is `private_key_jwt` client authentication |
| the **scopes** you ask for and the **services** you call — their audiences and scopes are in the platform's **service catalog** | consent and audiences are set up per scope |
| a **back-channel logout** URL, `https://<your-app>/auth/backchannel-logout` | so you are told when the person signs out elsewhere (step 8) |
| a **service account**, if you use background work | the client-credentials grant needs one |

For a confidential client the platform enables **PKCE `S256`**, **required
consent** and **token exchange**, and switches off the implicit and the password
grant.

## 3 · Sign a person in

### Route A

```bash
(cd frontend && npm ci && npm run build)         # single-page template only
appext dev --env-file auth-bundle/appext.env     # http://127.0.0.1:8100
```

Open exactly `http://127.0.0.1:8100` (not `localhost`: the redirect URI was
registered for it). The app redirects to the identity provider; sign in and,
the first time, **consent** to the scopes the consent screen lists. You are
back in your app with a session cookie — the browser holds no token.

The backend the template created is already doing it:

```python
from fastapi import Depends
from appext import Extension, User

ext = Extension.from_manifest("extension.toml")
api = ext.router(prefix="/api")            # every route needs a session

@api.get("/me")
async def me(user: User = Depends(ext.current_user)):
    return {"sub": user.sub}
```

### Route B

Your OIDC library does this; here are the requests it makes. First send the
person to the **authorization endpoint** in a browser, with PKCE. Values are
percent-encoded; spaces in `scope` become `%20`:

```
GET {authorization_endpoint}
  ?response_type=code
  &client_id=<your client id>
  &redirect_uri=https%3A%2F%2F<your-app>%2Fauth%2Fcallback
  &scope=openid%20farm-read%20farm-write
  &state=<random>&nonce=<random>
  &code_challenge=<BASE64URL(SHA256(verifier))>&code_challenge_method=S256
  &response_mode=query
```

Ask for `openid` and the scopes of **every service you will call**, so the
consent screen covers them. Keep `state`, `nonce` and the PKCE verifier on the
server and bind `state` to the browser that started the sign-in, for example with
a cookie. After sign-in and consent the browser returns to your redirect URI with
`?code=…&state=…` and, if the provider implements
[RFC 9207](https://www.rfc-editor.org/rfc/rfc9207), `iss`. Check that `state` is
yours and that `iss`, if present, equals the issuer. Then redeem the code **from
your backend**, authenticating with a signed assertion
([RFC 7523](https://www.rfc-editor.org/rfc/rfc7523)):

```bash
curl -s -X POST "$TOKEN_ENDPOINT" \
  --data-urlencode grant_type=authorization_code \
  --data-urlencode code="$CODE" \
  --data-urlencode redirect_uri="https://<your-app>/auth/callback" \
  --data-urlencode code_verifier="$VERIFIER" \
  --data-urlencode client_id="$CLIENT_ID" \
  --data-urlencode client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer \
  --data-urlencode client_assertion="$ASSERTION"
```

`$ASSERTION` is a JWT you sign with your private key — `RS256` for an RSA key,
`ES256`, `ES384` or `ES512` for the matching EC key. **Make a fresh one for every
token request** (code, refresh, exchange, client credentials): it carries a
unique `jti`, and the provider may reject a replay.

```json
{
  "iss": "<your client id>",
  "sub": "<your client id>",
  "aud": "<the token endpoint URL, from discovery>",
  "iat": "<now>",
  "exp": "<now + 60 seconds>",
  "jti": "<a random, unique value>"
}
```

Any JWT library will build it. For example, in Python:

```python
import time, uuid, jwt                     # PyJWT

def assertion(client_id, token_endpoint, private_key_pem):
    now = int(time.time())
    return jwt.encode(
        {"iss": client_id, "sub": client_id, "aud": token_endpoint,
         "iat": now, "exp": now + 60, "jti": str(uuid.uuid4())},
        private_key_pem, algorithm="RS256", headers={"typ": "JWT"})
```

(Add a `kid` header only if the JWK you registered carries one.) The answer holds
an **access token**, an **ID token** and usually a **refresh token**. Validate the
ID token — signature against `jwks_uri`, `iss`, `aud` (and `azp` if `aud` lists
several), `exp`, `sub` present, and that `nonce` is the one you sent — then keep
the tokens **on the server**, in a session your browser reaches only through an
opaque cookie.

:::caution Do not send this token to the API
It proves the person to *your app*. For the digital farm API you obtain a token
cut to that service — the next step.
:::

## 4 · Get a token for the digital farm API

The access token from the sign-in is **not** the one the API accepts. The API
accepts only a token whose `aud` names the API. You obtain it by **token
exchange** ([RFC 8693](https://www.rfc-editor.org/rfc/rfc8693)): you hand over the
login token and ask for exactly one audience and the scopes you need.

### Route A

The SDK does it on every call; there is no token handling in your code. You
only use the service you declared (step 5 shows complete routes).

### Route B

```bash
curl -s -X POST "$TOKEN_ENDPOINT" \
  --data-urlencode grant_type=urn:ietf:params:oauth:grant-type:token-exchange \
  --data-urlencode subject_token="$LOGIN_ACCESS_TOKEN" \
  --data-urlencode subject_token_type=urn:ietf:params:oauth:token-type:access_token \
  --data-urlencode audience="farm-api" \
  --data-urlencode scope="farm-read farm-write" \
  --data-urlencode client_id="$CLIENT_ID" \
  --data-urlencode client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer \
  --data-urlencode client_assertion="$ASSERTION"
```

The response's `access_token` is `$API_TOKEN`, what you send to the API. It
carries your client as `azp`, the person as `sub`, the API in `aud` and the
granted scopes in `scope`. Cache it until shortly before `expires_in` runs out.

If you get `access_denied` — or `invalid_scope` mentioning *consent* — the person
has not consented to a scope: send them through the sign-in again asking for the
missing scopes (add `prompt=consent`). Plain `invalid_scope`, `invalid_client`
and `unauthorized_client` are configuration errors: do not loop and do not show a
consent screen. `invalid_token` or `invalid_grant` means the *login* token was
rejected — see step 8.

### Background work

Work that acts **as the app itself** — an export, a nightly synchronisation — uses
the client-credentials grant instead of an exchange. No person is involved:

```bash
curl -s -X POST "$TOKEN_ENDPOINT" \
  --data-urlencode grant_type=client_credentials \
  --data-urlencode scope="export-write" \
  --data-urlencode client_id="$CLIENT_ID" \
  --data-urlencode client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer \
  --data-urlencode client_assertion="$ASSERTION"
```

With the SDK this is a second `[[services]]` entry with `mode = "service"` and
**its own scopes** — a scope may appear only once in a manifest — used through
`ext.service_client("export")`. Keep such scopes narrow. Whether and how a
platform authorises an app that acts without a person is its own decision, since
the data model's rights belong to users on farms. Where it does, work that is not
a person's is a *processing run*: create a `ProcessingJob` and name it in
`Processing-Job-Id` on every write (see
[Conventions](../api-reference/conventions.md#provenance)).

## 5 · Make the first call

**Route B** — with `$API_TOKEN`:

```bash
curl -s -H "Authorization: Bearer $API_TOKEN" "$API/farms"
```

**Route A** — a route in `app/main.py`:

```python
from fastapi import Depends
from appext import ServiceClient

@api.get("/farms")
async def farms(farm_api: ServiceClient = Depends(ext.service("farm"))):
    response = await farm_api.get("/farms")          # a token cut to "farm-api" is attached
    response.raise_for_status()
    return response.json()
```

Either way the answer is a page:

```json
{
  "items": [
    {
      "id": "997142c3-14cf-5cb4-b260-048af4b57a76",
      "name": "Lindenhof",
      "organizationId": "7511ba84-72fb-5ebc-b4a2-a75a6dafe0d2",
      "timezone": "Europe/Berlin",
      "defaultCurrency": "EUR",
      "createdAt": "2025-01-15T08:00:00Z",
      "updatedAt": "2025-01-15T08:00:00Z",
      "originType": "SYSTEM"
    }
  ],
  "nextCursor": "…",
  "hasMore": false
}
```

You see the farms the signed-in person has access to — through an
`AccessAssignment` — and nothing else. Common failures:

| Answer | Meaning |
|--------|---------|
| `401` | the token is missing, expired, or not for this API (`aud`) — get a fresh one |
| `403` | the token is fine, but the person has no right for this on this farm, or your scopes do not grant it — or the person is signed in at the identity provider but has no access on this platform yet |

Now read what is on the farm. These are `curl` forms (Route B); in Route A the
same paths and query strings go to `farm_api.get(…)`:

```bash
FARM=997142c3-14cf-5cb4-b260-048af4b57a76

curl -s -H "Authorization: Bearer $API_TOKEN" "$API/fields?farmId=$FARM"
curl -s -H "Authorization: Bearer $API_TOKEN" "$API/tasks?farmId=$FARM&status=PLANNED"

# the same fields, as GeoJSON features, inside a bounding box (OGC API – Features)
curl -s -H "Authorization: Bearer $API_TOKEN" \
  "$API/features/collections/fields/items?bbox=13.40,52.51,13.41,52.53"
```

Ask for `Accept: application/ld+json` to get the same record with `@context`,
`@id` and `@type`, readable as RDF.

## 6 · Create and change a record

Records are created by the **client**, under an identifier the client generates —
a UUID in lower case. Create a task on the farm:

```bash
TASK=$(uuidgen | tr 'A-Z' 'a-z')          # a UUID in lower case — any UUID generator will do

curl -s -X PUT "$API/tasks/$TASK" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "If-None-Match: *" \
  -d '{
    "id": "'"$TASK"'",
    "name": "Fungicide treatment, north field",
    "farmId": "'"$FARM"'",
    "status": "PLANNED",
    "typeUri": "http://aims.fao.org/aos/agrovoc/c_5978",
    "priority": "NORMAL",
    "originType": "USER"
  }'
```

In Route A the same request is `farm_api.put(f"/tasks/{task_id}", json=body,
headers={"If-None-Match": "*"})` — give `json=` (not a stream), so the SDK can
repeat the request with a fresh token after a `401`.

- `201 Created`, with the record and an `ETag`. The server added `createdAt`,
  `updatedAt`, `createdByUserId` and `clientId` — from your token, not from your
  request. `originType` is the one you declared; the server checks it against the
  caller, and a person's records are `USER`.
- `id` in the body equals the id in the path.
- `If-None-Match: *` makes it **create-only**: repeat the request after a lost
  response and you get `412`, not a duplicate and not an overwrite.
- `typeUri` is a concept of the `activity-types` scheme (here: *plant protection
  application*) — see the [ontology](../concepts/ontology/using-the-ontology.md).

Change it by naming only what changes, as a JSON Merge Patch:

```bash
curl -s -X PATCH "$API/tasks/$TASK" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/merge-patch+json" \
  -d '{ "status": "ASSIGNED" }'
```

(Route A: `farm_api.patch(f"/tasks/{task_id}", json={"status": "ASSIGNED"},
headers={"Content-Type": "application/merge-patch+json"})`.)

`PLANNED → ASSIGNED` is a permitted transition. Now try to jump to `COMPLETED`
from `ASSIGNED` — the state model allows only `IN_PROGRESS`, `PLANNED` and
`CANCELLED` there — and the API refuses with a problem detail:

```json
{
  "type": "https://datamodel.agrifooddata.org/v1/problems/invalid-transition",
  "title": "The status change is not permitted",
  "status": 409
}
```

Branch on `type`, show the message to the person. See
[Errors](../api-reference/errors.md) and the
[state models](../concepts/data-model/rules-and-states.md#state-models).

## 7 · Read changes and write them back

An app that works offline — or one that simply wants to fetch only what is new —
reads changes by **cursor**:

```bash
# the first time: everything, page by page
curl -s -H "Authorization: Bearer $API_TOKEN" "$API/tasks?farmId=$FARM&limit=100"
# … follow nextCursor while hasMore is true, then STORE the last nextCursor

# later: only what changed since
curl -s -H "Authorization: Bearer $API_TOKEN" "$API/tasks?farmId=$FARM&cursor=$STORED_CURSOR"
```

Pages are in ascending `updatedAt` order. The largest `limit` is the
deployment's choice, and `cursor` and `updatedAfter` are alternatives. Withdrawn
records come back **with a terminal status**; deleted ones arrive as `DELETE`
entries of `/audit-logs` (which needs the permission `auditLog:read`). Writes made
while offline are queued and sent with `PUT` and `If-None-Match: *`, so repeating
them is harmless. The full protocol is in
[Synchronization](../api-reference/synchronization.md).

## 8 · Keep the tokens alive

Two tokens are in play, and they expire separately: the **login token** (kept in
your session) and the **API token** (cut from it by an exchange).

| When | What |
|------|------|
| the API answers `401` | the API token has expired or was revoked — repeat the exchange (step 4) |
| the exchange is refused with `invalid_token` or `invalid_grant` | the **login token** has expired: refresh it with the refresh token, then repeat the exchange once |
| the **refresh** is refused with `invalid_grant` | the person's session has ended: sign them in again |
| the exchange answers `access_denied` or a consent `invalid_scope` | start a new sign-in asking for the missing scopes |
| the person signs out | see below |

Refresh the login token shortly before it expires (the SDK does it when 30
seconds are left), and store a new refresh token if the provider rotates them:

```bash
curl -s -X POST "$TOKEN_ENDPOINT" \
  --data-urlencode grant_type=refresh_token \
  --data-urlencode refresh_token="$REFRESH_TOKEN" \
  --data-urlencode client_id="$CLIENT_ID" \
  --data-urlencode client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer \
  --data-urlencode client_assertion="$ASSERTION"
```

When the platform's app signs the person out, the identity provider posts a
signed **logout token** to your back-channel logout URL. An unverified endpoint
would let anybody end sessions, so check the token before you act on it:
signature from the provider's keys, `iss`, `aud` equal to your client id, `iat`
within a few minutes of your clock, a `jti`, the member
`http://schemas.openid.net/event/backchannel-logout` in `events`, **no** `nonce`,
and a `sid` or a `sub`. Then delete every session with that `sid` — or, for a
token with only a `sub`, every session of that person. Answer `200`.

Route A handles all of it: an expired session answers the browser with
`401 {"login_url": …}`, and the frontend helper sends the person through the
sign-in and back to the page they were on.

## Where to go next

| You want to | Read |
|-------------|------|
| understand the model you just wrote to | [Data model](../concepts/data-model/overview.md) · [Entities](../concepts/data-model/entities.md) |
| find every collection and its permission | [Resources](../api-reference/resources.md) |
| understand why the sign-in works this way | [Identity, Authentication & Access](../concepts/iam.md) |
| write a service that accepts tokens from apps | [SDK · Calling services](../sdk/calling-services.md#writing-a-target-service) |
| publish your app in the platform's catalog | [SDK · Publishing](../sdk/app-store.md) |
| test without a platform | [SDK · Testing](../sdk/testing.md) |
| classify data properly | [Ontology](../concepts/ontology/overview.md) |
