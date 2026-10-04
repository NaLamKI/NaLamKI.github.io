---
sidebar_position: 2
---

# Signing in Apps

An **external app** is software built by somebody other than the platform's
operator — a reporting tool, a crop-planning module, a connector — that works
with a farmer's data. It is never trusted by default. It has to be **registered**,
it has to **identify itself**, and it can only reach what a person has
**consented** to.

All of this is built from standard OAuth 2.0 and OpenID Connect. The
[SDK](../../sdk/overview.md) implements it once, so an app developer writes none
of it; this page explains what happens so that the same can be done in any
language.

## Kinds of external apps

| Kind | What it is | Identity at the identity provider |
|------|------------|-----------------------------------|
| **Extension** | A web frontend with a backend of its own, served from one origin. Opened in the platform's app (in a web view or frame) or directly in a browser. | One **confidential client**, with a key pair (or, where the platform allows it, a secret) |
| **Link** | An entry in the platform's app catalog that the app opens in the system browser. No server of the platform behind it. | none — it asks for no permission, receives no token and nothing about the person |
| **Background work** | Part of an extension that acts as itself — an export, a synchronisation, a processing run — rather than for the signed-in person. | The extension's client acting with **client credentials** |

Apps that are not built with the SDK use the same standards. What the platform
has to know about them is the same too: a client, its redirect URIs, its public
key, the scopes it asks for.

## Registration comes first

An app does not talk to the identity provider on its own authority. The platform
sets up its client — usually through an app registry — and records what the app
is allowed to ask for:

1. The developer describes the app in a **manifest**: an identifier, a name,
   a version, the scopes the app asks for, and the services it calls. No secret
   goes in it.
2. The developer generates a **key pair** and registers the *public* half. The
   private key never leaves the developer's side.
3. A **reviewer** approves the manifest. Scopes marked *restricted* need a
   second approval by a different administrator.
4. On approval the platform provisions the identity provider: a **confidential
   client** for the app, with PKCE required, consent required, no implicit or
   password grant, token exchange enabled, the registered redirect URIs and
   back-channel logout URL, the public key — and the **scope definitions**, each
   with its consent text and its audience mapping.
5. The developer receives an **auth bundle**: the non-secret settings
   (issuer, client id, public URL, service base URLs) and a **lock file** with
   what was approved. The app refuses to start if its manifest asks for more
   than the lock file says.
6. The platform checks the running deployment and lists the app in the catalog.

Details of the developer workflow are in
[SDK · Publishing](../../sdk/app-store.md).

## The sign-in

The person signs in with the same authorization code flow as in
[Signing in people](./user-authentication.md) — with three differences: the
client is **confidential**, the code is redeemed by the app's **backend**, and
the scopes include those of the services the app will call.

```
    Browser             App backend          Identity provider     Digital farm API
       │                     │                       │                     │
①      │── open the app ────▶│                       │                     │
       │◀─ 302 to sign-in ───│                       │                     │
       │── authorize: PKCE, state, nonce, scopes ───▶│                     │
②      │◀─ sign in; consent (first time) ────────────│                     │
       │◀─ redirect to /auth/callback ───────────────│                     │
③      │── callback ────────▶│                       │                     │
       │                     │── code + assertion ──▶│                     │
       │                     │◀─ tokens ─────────────│                     │
       │◀─ cookie ───────────│                       │                     │
④      │── call /api ───────▶│                       │                     │
       │                     │── token exchange ────▶│                     │
       │                     │◀─ API token ──────────│                     │
       │                     │── GET /v1/farms + Bearer token ────────────▶│
       │                     │◀─ 200 ──────────────────────────────────────│
       │◀─ records ──────────│                       │                     │
```

### Scopes at sign-in

The authorization request asks for `openid`, then the scopes of the app
itself, then **every scope of every service the app calls on behalf of the
person**. Asking for the service scopes *up front* is deliberate: the consent
screen then shows exactly which data in which service the app may reach, and
later exchanges cannot fail for lack of consent. An app can never ask for a
scope its manifest does not declare.

### The backend-for-frontend pattern

The **browser never holds a token.** After the callback the backend keeps the
tokens, encrypted, in a server-side session, and the browser gets one cookie
with a random identifier that carries no data. The cookie is `HttpOnly`,
`Secure`, `SameSite=Lax`, has no `Domain` attribute and a `__Host-` prefix. A
cross-site script can therefore steal nothing worth having, and a stolen
session store holds no usable token.

### How a confidential client proves who it is

At the token endpoint the app authenticates on **every** request — code
redemption, refresh, exchange — with `private_key_jwt`
([RFC 7523](https://www.rfc-editor.org/rfc/rfc7523), OpenID Connect Core §9).
By default no shared secret exists; the provider holds only the public key.

```
POST {token_endpoint}
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code=…&redirect_uri=…&code_verifier=…
&client_id=<client id>
&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer
&client_assertion=<signed JWT>
```

| Assertion | Value |
|-----------|-------|
| header `alg` | `RS256` for RSA keys; `ES256`, `ES384`, `ES512` for the matching EC curves |
| `iss`, `sub` | the client id |
| `aud` | the **token endpoint URL** from discovery ([RFC 7523 §3](https://www.rfc-editor.org/rfc/rfc7523#section-3) allows it; the SDK sends it, so a platform must accept it) — not the issuer |
| `iat`, `exp` | now, and a minute from now |
| `jti` | random, unique per request; the provider should reject a replay |

A platform *may* allow a `client_secret` instead — the weaker option, shown to
the developer once and never stored by the registry.

## Calling the API: token exchange

The login token proves the person to the **app**. It is not sent to the API.
For each service the app calls, the backend exchanges it
([RFC 8693](https://www.rfc-editor.org/rfc/rfc8693)) for a token cut to
**exactly that service and exactly the scopes the manifest names**:

```
POST {token_endpoint}

grant_type=urn:ietf:params:oauth:grant-type:token-exchange
&subject_token=<the session's access token>
&subject_token_type=urn:ietf:params:oauth:token-type:access_token
&audience=<the API's audience>
&scope=<the scopes for that API, space-separated>
&client_id=<client id>&<client authentication>
```

The answer's `access_token` carries:

| Claim | Value |
|-------|-------|
| `iss` | the issuer |
| `aud` | contains the requested audience |
| `sub` | the person — the same `sub` as in the login token |
| `azp` | the **app's** client id — the API can decide per app |
| `scope` | the granted scopes, space-separated |
| `exp` | required; the token is cached until shortly before it |

The API verifies it like any other token (see
[What the API checks](./user-authentication.md#what-the-api-checks)). Because
`azp` names the app, an API can also refuse a specific app outright.

### Consent

Token exchange passes **only for scopes the person already agreed to**. If a
scope was never consented to — the app's manifest gained a scope, or the person
revoked consent in the identity provider's account console — the exchange is
refused with `access_denied`, or with `invalid_scope` mentioning consent. The
app answers its own frontend with:

```text
HTTP 401
{"error": "consent_required", "missing_scopes": ["farm-read"], "login_url": "/auth/login?return_to=/items&scope=farm-read"}
```

and the frontend starts a new sign-in that asks for exactly the missing scopes,
so the consent screen shows exactly those. If the exchange is refused because
the login token itself was rejected (`invalid_token` or `invalid_grant`), the app
refreshes the session once and retries; if that fails too, the session counts as
ended and the person signs in again. Any other failure of the exchange is a
configuration error and surfaces as `502`; the details are logged, never shown.

## Acting without a person

For background work the app acts as **itself**, with the client credentials
grant ([RFC 6749 §4.4](https://www.rfc-editor.org/rfc/rfc6749#section-4.4)):

```
grant_type=client_credentials&scope=<scopes>&client_id=<client id>&<client authentication>
```

There is no person in the token, and no `audience` parameter: the audience
comes from the scopes. If the target service needs to know who a job is for,
the app passes that explicitly, and keeps such scopes narrow.

In the data model, work that is not a person's is a **processing run**. The
app creates a `ProcessingJob`, then names it on every write with the
`Processing-Job-Id` header; the records created carry `originType: SERVICE` and
`createdByJobId`, so the service responsible is traceable. See
[Conventions](../../api-reference/conventions.md#provenance).

## In a host app

A platform may have a **host app** that shows extensions inside itself. The
person has already signed in to the host app, so the extension's sign-in should
not ask again. The extension's sign-in stays an ordinary authorization code
flow; the host app only changes **where it runs**.

In the platform's **web app** the extension sits in a frame and signs in inside
it, with the identity provider's session the browser already has — no hand-over
is needed. On a **phone or tablet** the extension runs in a web view, and the
sign-in is handed over to the system browser:

1. The host app loads the extension in a web view and marks the request, for
   example in the user agent.
2. The extension, recognising the marker, uses **the platform's app redirect
   URI** instead of its own web address for this sign-in. (It asks for
   `response_mode=query` on every sign-in; a form post could never arrive over a
   custom URI scheme.)
3. The extension redirects to the authorization endpoint. The host app
   **intercepts exactly that request** — `client_id`, `redirect_uri` and
   `response_type=code` must match the catalog entry — and runs it in the
   system's secure browser sheet, where the person's session at the identity
   provider already exists.
4. The callback URL is handed back to the web view, which loads it. The
   extension's backend redeems the code with its own client authentication.
   The person sees at most the sheet flash, and a consent screen once.

Invariants that make this safe:

| Invariant | Why it holds |
|-----------|--------------|
| No token of the host app ever reaches an extension | the web view carries no token; only the callback URL is passed through |
| Only the extension's backend can redeem the code | the client is confidential, and PKCE's verifier never leaves the backend |
| The identity provider's page never loads inside the web view | the host app blocks or hands over every request to it |
| A different person cannot be signed in by accident | the host app sets a cookie with its account's `sub`; if the ID token's `sub` differs, the extension discards the tokens and restarts with `prompt=login` |

This is why `sub` must be identical across all clients of the provider.

## Logout

- **Ending the extension's session** ends only its own session — closing one
  extension must not sign the person out of the platform.
- **Signing out of the host app** ends the person's session at the identity
  provider, which then sends a **back-channel logout**
  ([OpenID Connect Back-Channel Logout 1.0](https://openid.net/specs/openid-connect-backchannel-1_0.html))
  to every extension with a session: a `POST` with a signed `logout_token`
  to the extension's registered `/auth/backchannel-logout`. The extension
  verifies the signature, issuer, audience, `iat` and `jti`, the
  `backchannel-logout` event, and that **no `nonce`** is present (an ID token must
  not work as a logout token), and that the token carries a `sid` or a `sub`.
  It then deletes every session with that `sid` — or, for a token with only a
  `sub`, every session of that person.

## What an app must never do

- Put a secret, a private key or a token in a manifest, an image, a repository
  or a browser.
- Send the login token to an API; always exchange it for one cut to the service.
- Use a token it was handed for anything but the call it was handed for.
- Ask for scopes beyond what it needs; administrative and destructive actions do
  not belong in an app's scopes at all.

## See it in action

- [Scopes, audiences & permissions](./authorization.md)
- [Getting started](../../quickstart/getting-started.md) — register an app and make a first call
- [SDK · Sign-in & session](../../sdk/sign-in-and-session.md) — the implementation
