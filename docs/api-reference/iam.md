---
sidebar_position: 8
---

# Authentication

**Standards:** OAuth 2.0 · OpenID Connect · JWT · PKCE · Token Exchange · Device Authorization Grant
**Provider:** the platform's **identity provider** — *not* the digital farm API.

The digital farm API has **no authentication endpoints of its own**. It
verifies bearer tokens issued by the platform's identity provider. To call the
API you get a token from the provider, send it as `Authorization: Bearer …`,
and refresh it when it expires.

This page is the reference for the provider's side; the *why* is in
[Identity, Authentication & Access](../concepts/iam.md), and a walk-through is in
[Getting started](../quickstart/getting-started.md).

## Discovery

One address, the **issuer URL**, is all an app needs to be given:

```bash
curl https://<issuer>/.well-known/openid-configuration
```

| Member | Needed for |
|--------|------------|
| `issuer` | must equal the issuer you configured; the `iss` of every token equals it too |
| `authorization_endpoint` | starting a sign-in |
| `token_endpoint` | every token request |
| `jwks_uri` | the public keys that verify tokens |
| `end_session_endpoint` | ending the person's session at the provider (optional) |
| `device_authorization_endpoint` | the device grant, used by command-line tools (optional) |

Endpoints are **discovered, never hard-coded**. Platforms publish the issuer URL;
a developer is given it by the platform's operator.

## Which client uses which grant

| Client | Type | Grants |
|--------|------|--------|
| First-party app (phone, web, desktop) | **public** | authorization code with PKCE; refresh token |
| External app with a backend | **confidential** | authorization code with PKCE; refresh token; **token exchange**; client credentials (background work) |
| Developer command line | public | device authorization grant ([RFC 8628](https://www.rfc-editor.org/rfc/rfc8628)) with PKCE; refresh token |
| A service that only *verifies* tokens | resource server | none — it fetches the provider's keys |

Not used: the implicit flow and the resource owner password grant.

## Token endpoint

`POST {token_endpoint}` with `Content-Type: application/x-www-form-urlencoded`.
A confidential client adds its [client authentication](../concepts/iam/app-authentication.md#how-a-confidential-client-proves-who-it-is)
(`client_assertion_type`, `client_assertion`) to every request.

### Authorization code

```
grant_type=authorization_code
&code=<code>&redirect_uri=<same as in the request>
&code_verifier=<PKCE verifier>&client_id=<client id>
```

### Refresh

```
grant_type=refresh_token&refresh_token=<token>&client_id=<client id>
```

### Token exchange — a token for one service

```
grant_type=urn:ietf:params:oauth:grant-type:token-exchange
&subject_token=<the login access token>
&subject_token_type=urn:ietf:params:oauth:token-type:access_token
&audience=<the service's audience>&scope=<its scopes, space-separated>
&client_id=<client id>
```

### Client credentials — an app as itself

```
grant_type=client_credentials&scope=<scopes>&client_id=<client id>
```

### Device authorization — for command lines

(RFC 8628; the SDK's command line adds PKCE, RFC 7636.)

```
POST {device_authorization_endpoint}
client_id=<client id>&scope=openid&code_challenge=<S256>&code_challenge_method=S256
```

followed by polling the token endpoint with
`grant_type=urn:ietf:params:oauth:grant-type:device_code&device_code=…&code_verifier=…`.

### Response

```json
{
  "access_token": "eyJ…",
  "id_token": "eyJ…",
  "refresh_token": "…",
  "expires_in": 900,
  "scope": "openid farm-read",
  "token_type": "Bearer"
}
```

`id_token` appears only for sign-ins, `refresh_token` only where the provider
issues one. Treat `expires_in` as the lifetime in seconds: **access tokens are
short-lived**, and an app renews them shortly before they expire.

## Using the token

```bash
curl -H "Authorization: Bearer ${ACCESS_TOKEN}" "https://<host>/v1/farms"
```

Send it **only** to the service it was issued for. A token for the digital
farm API is useless at another service, and the API will refuse any token that
does not name it.

## Claims an API reads

An access token is a signed JWT. A resource server verifies the signature
against the keys at `jwks_uri` and reads:

| Claim | Meaning | Checked |
|-------|---------|---------|
| `iss` | the issuer | equals the configured issuer, exactly |
| `aud` | the audiences the token is for | contains this service's own audience |
| `exp`, `iat` | validity | not expired, with a small leeway for clock drift |
| `sub` | the person — for a client-credentials token, the app's own service account | identical across all clients of the provider |
| `azp` | the client the token was issued to | optionally against a list of accepted clients |
| `scope` | the granted scopes, space-separated | contains the scope the operation needs |
| token type | optionally: an access token, not an ID token | the audience check already stops an ID token; some APIs also check the token's type |

Signing algorithms are asymmetric (`RS256`, `PS256`, `ES256` …); a verifier
accepts an **allow-list** of them and refuses `none` and the HMAC family
whatever the token's header says. The token's `kid` selects the key; an unknown `kid`
triggers one re-fetch of the key set.

### Verifying tokens in your own service

Any language can verify these claims with a JWT library. For Python, the
[SDK](../sdk/calling-services.md#writing-a-target-service) ships a verifier with
the same rules. Answers: no or bad token → `401` with
`WWW-Authenticate: Bearer`; valid token without the scope → `403`; keys
unreachable → `503` (the token may be fine; it cannot be told — an
implementation may answer `401` instead).

## Errors from the token endpoint

These are OAuth errors — defined by [RFC 6749 §5.2](https://www.rfc-editor.org/rfc/rfc6749#section-5.2),
[§4.1.2.1](https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2.1),
[RFC 8693 §2.2.2](https://www.rfc-editor.org/rfc/rfc8693#section-2.2.2) and, for
the device grant, [RFC 8628 §3.5](https://www.rfc-editor.org/rfc/rfc8628#section-3.5) —
not API problem details. Providers differ in the details; the table gives
the reading the SDK applies:

| `error` | Meaning | The client |
|---------|---------|------------|
| `invalid_grant` | the code or refresh token is spent, expired or revoked — **the person's session has ended** | sign in again |
| `invalid_client` | the client failed to authenticate — or, at some providers, the audience of an exchange does not exist (RFC 8693 names `invalid_target` for that) | check configuration |
| `unauthorized_client` | the client may not use this grant | check configuration |
| `invalid_scope` | a scope the client does not have; some providers use it, with *consent* in the description, to say that consent is missing | add the scope, or ask for consent again |
| `access_denied` | the person declined consent, or consent for an exchange is missing | ask again, with exactly the missing scopes |
| `invalid_token`, `invalid_grant` on an exchange | the login token was rejected | refresh the session once and retry; if that fails too, sign in again |
| `authorization_pending`, `slow_down`, `expired_token` | the device grant is waiting, too fast, or too late | keep polling, back off, or start over |

## Logout

| | How |
|-|-----|
| End the app's own session | discard the tokens |
| End the person's session at the provider | send the browser to `end_session_endpoint` with `id_token_hint` and a registered `post_logout_redirect_uri` |
| Be told when the person signs out elsewhere | register a back-channel logout URL; the provider posts a signed `logout_token` to it |

## Related

- [Concepts · Signing in people](../concepts/iam/user-authentication.md)
- [Concepts · Signing in apps](../concepts/iam/app-authentication.md)
- [Concepts · Scopes, audiences & permissions](../concepts/iam/authorization.md)
- [SDK · Platform contract](../sdk/platform-contract.md) — what the provider must support, item by item
