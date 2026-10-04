---
sidebar_position: 1
---

# Signing in People

A person signs in at the **identity provider**. The app they use never sees
the password; it receives **tokens**. The flow is the OAuth 2.0
**authorization code flow with PKCE**, with OpenID Connect on top — the flow
that [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700) recommends for every
client — the flow for people signing in.

This page is about the platform's **first-party apps** — the phone, web and
desktop apps people use directly. Apps built by others follow a different
path; see [Signing in apps](./app-authentication.md).

## The flow

```
     App                            Identity provider           Digital farm API
      │                                     │                           │
②     │── authorize (system browser) ──────▶│                           │
      │◀─ redirect: code, state, iss ───────│                           │
③     │── POST /token: code + verifier ────▶│                           │
      │◀─ access, ID, refresh token ────────│                           │
④     │── GET /v1/farms, Bearer ───────────────────────────────────────▶│
      │◀─ 200 + records ────────────────────────────────────────────────│
⑤     │── POST /token: refresh token ──────▶│                           │
      │◀─ new access token ─────────────────│                           │
```

### 1 · Discover the provider

Everything the app needs follows from one setting, the **issuer URL**:

```bash
curl https://<issuer>/.well-known/openid-configuration
```

The document ([OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html))
names the `authorization_endpoint`, the `token_endpoint`, the `jwks_uri` and,
if offered, the `end_session_endpoint`. Nothing is hard-coded, and nothing is
guessed.

### 2 · Start the sign-in

The app generates a fresh **PKCE** verifier and derives the challenge
(`BASE64URL(SHA256(verifier))`), then sends the person to the authorization
endpoint **in the system browser** — not in an embedded web view — as a
top-level navigation:

```
GET {authorization_endpoint}
  ?response_type=code
  &client_id=<the app's client id>
  &redirect_uri=<a registered redirect URI>
  &scope=openid <the scopes the app needs>
  &state=<random>
  &nonce=<random>
  &code_challenge=<S256 challenge>
  &code_challenge_method=S256
```

| Parameter | Why |
|-----------|-----|
| `response_type=code` | the authorization code flow; no implicit flow |
| `code_challenge`, `…_method=S256` | PKCE on **every** sign-in, so an intercepted code is worthless without the verifier |
| `state` | binds the response to the request; defeats login CSRF |
| `nonce` | binds the ID token to the request; defeats replay |
| `redirect_uri` | where the browser returns; it must **match a registered URI exactly** (a loopback address may vary its port, [RFC 8252 §7.3](https://www.rfc-editor.org/rfc/rfc8252#section-7.3)) |

The **system browser** matters: the person's existing session at the identity
provider is reused (single sign-on), the app cannot read the page, and the
operating system's own secure sheet handles the hand-back
([RFC 8252](https://www.rfc-editor.org/rfc/rfc8252)). For a native app the
redirect URI is a private-use URI scheme in reverse-domain form, or a loopback
address; for a web app, an `https` URL of the app.

### 3 · Return and redeem the code

The browser returns to the redirect URI with `code`, `state` and — where the
provider implements [RFC 9207](https://www.rfc-editor.org/rfc/rfc9207) — `iss`.
The app checks that `state` is the one it sent and that `iss` is the expected
issuer, then redeems the code:

```
POST {token_endpoint}
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=<code>
&redirect_uri=<the same redirect URI>
&code_verifier=<the verifier>
&client_id=<the app's client id>
```

A first-party app is a **public client**: it cannot keep a secret, so it
authenticates with nothing but the verifier. The answer carries:

| Token | Is | The app uses it for |
|-------|----|---------------------|
| **access token** | a signed [JWT](https://www.rfc-editor.org/rfc/rfc7519), short-lived | `Authorization: Bearer` on every API call |
| **ID token** | a signed JWT about the sign-in (`sub`, `nonce`, `iss`, `aud` …) | knowing who signed in; **never** sent to an API |
| **refresh token** | an opaque credential | getting a new access token without asking the person again |

The app validates the ID token (signature, `iss`, `aud` containing its client
id, `exp`, and `nonce` equal to the one it sent) before it trusts anything in
it.

### 4 · Call the API

```bash
curl -H "Authorization: Bearer $ACCESS_TOKEN" https://<host>/v1/farms
```

### 5 · Refresh

Access tokens live for minutes. Shortly before one expires — or when the API
answers `401` — the app refreshes:

```
POST {token_endpoint}
grant_type=refresh_token&refresh_token=<token>&client_id=<the app's client id>
```

If the answer is `invalid_grant`, the person's session at the provider has
ended and they have to sign in again. Any other failure is temporary; keep the
session and retry. If the provider rotates refresh tokens, store the new one
and never present an old one twice.

## What the API checks

The digital farm API holds no session. It verifies every token **locally**,
without calling the identity provider, using the keys the provider publishes at
its `jwks_uri`:

| Check | Requirement |
|-------|-------------|
| **Signature** | an asymmetric algorithm from an allow-list (for example `RS256`) — never `none` or the HMAC family; keys are fetched by `kid` and re-fetched once on an unknown `kid` |
| **`iss`** | equals the configured issuer, byte for byte |
| **`aud`** | contains the API's **own audience** — a token issued for another service is refused |
| **`exp`**, `iat`, `sub` | valid and present, with a small leeway (tens of seconds) for devices whose clocks drift |
| **token type** | optionally: an access token, not an ID token — an ID token names the client, not the API, in `aud`, so the audience check already stops it |
| **`azp`** | optionally: the client the token was issued to is one the API accepts (an allow-list, globally or per route) |
| **scopes** | the operation's required scope is in `scope` — or, where scopes stand for permissions, the intersection described in [Scopes, audiences & permissions](./authorization.md#how-they-combine) |

Implementations differ in how strict they are about the optional rows. Answers:
no or bad token → `401` with `WWW-Authenticate: Bearer`; a valid token that
lacks the right → `403`; a key set that cannot be fetched → `503` is the
honest answer (the token may be fine; it cannot be told), though an
implementation may answer `401`.

Because checks are local, a revoked token stays valid until it expires. That is
why access tokens are short-lived.

## From token to account

A valid token proves *who* the caller is at the identity provider. What they
may do **on which farm** is decided by the data model: the token's subject
(`sub`) is bound to a `User`, and that user's `AccessAssignment` records name
the farms and roles. See
[Identity, Authentication & Access](../iam.md#roles-and-access-in-the-data-model).

- The data model prescribes the **e-mail address** as a user's login identity;
  how a deployment binds the provider's `sub` to its `User` record is the
  deployment's decision.
- Trust an e-mail address only when the token says `email_verified: true`. It is
  the only proof that the person controls the mailbox.
- `sub` is stable for a person and **identical for every client** of the
  provider; pairwise subject identifiers would break the hand-over described in
  [Signing in apps](./app-authentication.md#in-a-host-app).

## Signing out

- **Ending the app's session** — discard the tokens locally.
- **Ending the person's session at the provider** — send the browser to the
  `end_session_endpoint` with `id_token_hint` and a registered
  `post_logout_redirect_uri`
  ([RP-Initiated Logout 1.0](https://openid.net/specs/openid-connect-rpinitiated-1_0.html)).
  Apps opened inside the platform's app are told through
  [back-channel logout](./app-authentication.md#logout).

## Apps that work offline

Farm apps often have no network. The data model is built for it — records get
client-generated UUIDs and are
[synchronised](../../api-reference/synchronization.md) by cursor — so a signed-in
app can keep working while its access token expires:

- Queue writes and send them after the next successful refresh. A write
  that is repeated after a lost response is harmless: `PUT` with
  `If-None-Match: *` creates only, and cannot overwrite anything.
- An expired refresh token or `invalid_grant` means *sign in again*; the data
  already queued on the device stays queued.

## Do not

- **Do not use the implicit flow or the resource owner password grant.** Both
  are removed from current best practice
  ([RFC 9700](https://www.rfc-editor.org/rfc/rfc9700)), and the clients the
  registry provisions for apps have them switched off.
- **Do not embed a secret in a public client.** A phone app cannot keep one.
- **Do not put tokens in URLs**, logs or analytics.
- **Do not accept a redirect URI by prefix or wildcard.** Match exactly (loopback addresses excepted for the port).
- **Do not show the provider's page in an embedded web view.**

## See it in action

- [Getting started](../../quickstart/getting-started.md) — a complete sign-in, with requests
- [API Reference · Authentication](../../api-reference/iam.md) — endpoints and claims
