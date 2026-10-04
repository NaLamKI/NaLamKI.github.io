---
sidebar_position: 10
---

# Platform Contract

For **platform builders and operators** — the people who want apps written with
the SDK to run on *their* platform. The SDK is not tied to one product. A
**platform** is any system that follows the reference architecture: it offers an
OAuth 2.0 / OpenID Connect service, an App Store that registers, reviews and lists
apps, and — optionally — an app that shows them. The SDK talks to those services
through a small, fixed set of requests and expects fixed answers. This page
summarises that contract; the complete, normative text — with every request and
response shape — is in the SDK repository under
[`docs/platform-contract/`](https://github.com/NaLamKI/Application-SDK/tree/main/docs/platform-contract).

MUST, SHOULD and MAY are used as in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

## The reference architecture in one picture

```
 developer ──① CLI────▶ ┌────────────────────────┐ ──② provisions──▶ ┌────────────────────────┐
                        │ App Store              │   clients, scopes │ Identity provider      │
 host app ──④ catalog──▶│ (control plane)        │                   │ (the issuer)           │
                        └───────────┬────────────┘                   └────────▲───────────────┘
                                    │ ③ auth bundle + lock file               │ ⑤ code, refresh,
                                    ▼                                         │   exchange, logout
 host app ──④ opens────▶┌────────────────────────┐ ───────────────────────────┘
                        │ Extension container    │
                        │ (SDK)                  │
                        └───────────┬────────────┘
                                    │ ⑥ exchanged token
                                    ▼
                        ┌────────────────────────┐
                        │ Target services        │── verify with the issuer's keys (JWKS)
                        │ (digital farm APIs …)  │
                        └────────────────────────┘
```

① A developer signs in to the store with the command line, registers the app's
manifest, uploads the public key, and submits it. ② When a reviewer approves, the
store sets up the app's client, scopes and consent texts at the identity
provider. ③ The store hands the developer an **auth bundle**: the secret-free
settings and a **lock file** with the approved state. ④ The host app (optional)
lists the store's catalog and the person's installed apps and opens an extension
in a web view (on a phone), a frame (in the web app) or a browser; on a phone it
hands the sign-in to the system browser, where the person's existing session is
reused, and in a frame the extension signs in with the session the browser
already has. ⑤ The extension's backend signs in,
refreshes and logs out against the identity provider. ⑥ To call a target service
on behalf of the person it exchanges its token for one cut to that service.

**At run time the store is not involved.**

## What a platform provides

| | What | Required? |
|-|------|-----------|
| **Identity provider** | OpenID Connect discovery; authorization code flow with PKCE; `private_key_jwt` client authentication; refresh tokens; **token exchange (RFC 8693)**; back-channel logout; the **device authorization grant** for the command line | **Yes.** Nothing works without it |
| **App Store API** | register / review / provision / bundle / verify apps; the service catalog; the event log; the catalog for the host app | **Yes for publishing**; at run time not involved. Without it the operator produces bundles and lock files and configures the provider by hand |
| **Host app** | list the catalog, open apps, hand the sign-in over, offer the bridge | **Optional.** Without one, apps are websites |
| **Target services** | each registers its audience and scopes in the service catalog and verifies the exchanged tokens it receives | for every service an app calls — the digital farm API among them |

Three levels follow, and a platform can grow through them:

| Level | You provide | You get |
|-------|-------------|---------|
| 0 | identity provider; bundles and lock files made by hand | apps run; no `appext store`, no review, no catalog |
| 1 | + App Store API | the whole developer workflow: register, review, provision, bundle, verify, catalog |
| 2 | + host app | the in-app experience: silent sign-in, the app's own navigation, the bridge |

## How the SDK finds the platform

The SDK has **no built-in platform**. A developer's machine learns about yours
from a small **platform file**, `appext.toml`, which you publish — see
[CLI](./cli.md#which-platform-a-command-talks-to). In production the file is not
read: a running extension gets the same values from the auth bundle.

| Setting | Points to | Variable |
|---------|-----------|----------|
| `issuer` | the identity provider, discovered at `{issuer}/.well-known/openid-configuration` | `APPEXT_ISSUER` |
| `store_url` | the App Store API base; the CLI appends `/store/…` | `APPEXT_STORE_URL` |
| `cli_client_id` | the public client of the device grant | `APPEXT_CLI_CLIENT_ID` |
| `app_redirect_uri` | the host app's return address | `APPEXT_APP_REDIRECT_URI` |

## The identity provider

What the SDK sends to the provider and expects back, in short. Each point is an
open standard; the full request and response shapes, the claims and the
error codes the SDK interprets are in the repository's `oauth-service.md`.

| Requirement | Standard |
|-------------|----------|
| **Discovery** with `issuer`, `authorization_endpoint`, `token_endpoint`, `jwks_uri`; `iss` of every token equals the issuer, byte for byte. There is no way to configure endpoints without discovery. | [OIDC Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html) |
| **Asymmetric signing** (`RS256`, `PS256`, `ES256` families); `none` and the HMAC family are refused whatever the token header says. | [RFC 7518](https://www.rfc-editor.org/rfc/rfc7518), [RFC 8725](https://www.rfc-editor.org/rfc/rfc8725) |
| **Authorization code with PKCE `S256`** on every sign-in, `response_mode=query`; redirect URIs matched **exactly**, no wildcards. | [RFC 7636](https://www.rfc-editor.org/rfc/rfc7636), [RFC 9700](https://www.rfc-editor.org/rfc/rfc9700) |
| **Client authentication `private_key_jwt`**, assertion `aud` = the token endpoint URL; a replayed `jti` rejected. `client_secret` (in the form body) only if the platform allows it. | [RFC 7523](https://www.rfc-editor.org/rfc/rfc7523), OIDC Core §9 |
| **Tokens**: `access_token`, `id_token` (with `sub`, `aud`, `nonce`, `exp`, `iat`, **`sid`**), `expires_in`, `refresh_token`, `scope`. `sub` is **identical for every client** of the provider, the host app's included — pairwise identifiers would put every sign-in into the `prompt=login` loop. | [OIDC Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) |
| **Refresh tokens** for confidential clients; rotation is supported, not required; `invalid_grant` means *the session has ended*. | [RFC 6749 §6](https://www.rfc-editor.org/rfc/rfc6749#section-6) |
| **Token exchange** with a same-client subject token, `audience` and `scope`; the result carries `iss`, `aud`, `sub`, `azp`, `scope`, `exp`. `access_denied` **only** for missing consent. | [RFC 8693](https://www.rfc-editor.org/rfc/rfc8693) |
| **Client credentials**, with the audience taken from the scopes. | [RFC 6749 §4.4](https://www.rfc-editor.org/rfc/rfc6749#section-4.4) |
| **Consent** required for app clients; it covers later exchanges for the same scopes, and revoking it produces the consent error on the next exchange. | OIDC Core §3.1.2.4 |
| **Back-channel logout** with `sid`; RP-initiated logout honouring registered post-logout URIs. | [OIDC Back-Channel Logout 1.0](https://openid.net/specs/openid-connect-backchannel-1_0.html), [RP-Initiated Logout 1.0](https://openid.net/specs/openid-connect-rpinitiated-1_0.html) |
| **Device authorization grant** for the command line's public client, with PKCE as the SDK sends it; its tokens carry the store API's audience and the person's store roles. | [RFC 8628](https://www.rfc-editor.org/rfc/rfc8628), [RFC 7636](https://www.rfc-editor.org/rfc/rfc7636) |
| **Audiences and scopes**: every target service exists at the provider as an audience; every scope belongs to exactly one service, carries an audience mapping and has a consent text. App tokens carry nothing beyond what their scopes carry. | — |

If your provider expresses roles differently, map them to the shape the SDK
reads (`realm_access.roles`, `resource_access.<client id>.roles`) — roles are
optional for the SDK, and app tokens carry none unless you map them on purpose.

### What approval must set up

When a version is approved, the store provisions the provider. The result MUST be:
a **confidential client** `ext-<id>` with authorization code and PKCE `S256`, no
implicit or password grant, **consent required**, and no claim beyond what its
scopes carry; client authentication matching the manifest; the registered
redirect URIs, post-logout URIs and back-channel URL; **token exchange enabled**;
scope definitions with translated consent texts and audience mappings; and scope
assignments per the manifest. Provisioning MUST be **additive and idempotent**,
and a store should touch only clients and scopes it owns.

## The App Store

The store is the control plane behind `appext store …` and the host app's
catalog. It exposes two surfaces:

| Surface | Caller | Token | Needs |
|---------|--------|-------|-------|
| **Store API** (`/store/…`) | developers, reviewers, administrators — through `appext store …`, CI, or the platform's own UI | access token of the command-line client | a store role |
| **Catalog API** (`/catalog`, `/extensions`, `/extensions/{id}/installation`) | the host app, for every signed-in person | access token of the **host app** | no store role |

The store MUST verify signature, `iss`, `exp` and its own audience, MUST refuse
tokens issued to an extension client on every route (`403 app_only`), and answers
errors in one shape: `{"detail": {"code", "message", "errors"}}`. Its endpoints
cover registering a version, uploading the key, submit / approve / reject, the
auth bundle, secret rotation, the deployment check, suspension, the service
catalog and the event log. It enforces the [manifest rules](./manifest.md#the-rules)
— the SDK's conformance cases run against both — and the lifecycle in
[Publishing](./app-store.md#lifecycle).

The **auth bundle** it issues per app and environment is a ZIP of a settings file
(`appext.env`) and a lock file (`extension.lock.toml`), and holds no secret; see
[Publishing](./app-store.md#the-auth-bundle).

## The host app

A host app — on a phone, on the desktop or on the web — shows a platform's
extensions. It is optional; what it adds is the silent sign-in, the app's own
navigation around the page and the [bridge](./host-app-bridge.md). In short:

- It reads the **catalog** with its own token and drops entries it cannot use,
  individually. It opens only what stood in the last catalog it loaded.
- **Before opening an extension in a web view**, it renews its own session, adds
  the marker `<Name>-App-WebView/<version>` to the web view's user agent and sets
  the cookie `app_sub` to its account's `sub` — and if either fails, it does
  **not** open.
- It **decides every navigation**: it blocks the identity provider's pages, any
  non-`https` scheme and any host outside the entry's `hosts`; it hands over **only
  the extension's own authorize request** (the `client_id` of the entry, the
  redirect URI `<scheme>:/callback`, `response_type=code`) to the system's
  authentication session — non-ephemeral — and loads the result back into the web
  view with the parameters unchanged.
- The redirect scheme is a **private-use scheme the platform owns**, in
  reverse-domain style ([RFC 8252 §7.1](https://www.rfc-editor.org/rfc/rfc8252#section-7.1)),
  registered with the operating system, **different from the scheme of the app's
  own sign-in**, built into the app and never read from the catalog.
- On sign-out it **clears the web view's cookies**.

A host app **must never**: pass a token to a page; read, store or log the `code`;
load the identity provider in a web view; take the issuer or redirect URI from the
catalog; hand over any authorize request but the extension's own; let a page send
the web view elsewhere by itself; add data commands to the bridge; or use a
private authentication session for the hand-over.

## What breaks if you leave something out

| Leave out | Consequence |
|-----------|-------------|
| the identity provider | everything |
| the discovery document | the extension cannot find its endpoints; sign-in answers `503`, `/readyz` fails |
| PKCE `S256` | the SDK always sends it; a provider that cannot handle the parameters breaks every sign-in |
| `private_key_jwt` with the token endpoint as `aud` | every token request fails (`invalid_client`) |
| refresh tokens | the session ends when the access token expires and the person is sent through the sign-in again |
| token exchange | apps that declare a `user` service fail with `502 upstream_auth_failed` at their first call to it |
| the consent error of the exchange | a missing consent becomes a generic `502` instead of a new sign-in asking for exactly the missing scopes |
| `sid`, or back-channel logout | signing out of the host app does not end the apps' sessions; they live until their refresh token or the maximum session age ends them |
| the device grant | `appext store login` cannot work; CI may still use a token |
| the App Store API | no review, no provisioning, no bundle, no catalog; the operator writes the lock file by hand |
| the host app's marker or `app_sub` cookie | the extension picks its web redirect URI and the sign-in fails in the web view / no protection against a foreign identity |

## Is my platform conformant?

Tick every line of this smoke test before announcing the platform:

- [ ] `GET {issuer}/.well-known/openid-configuration` answers 200 with the members above.
- [ ] `appext store login` completes the device grant and prints the person's store roles.
- [ ] `appext new hello`, `appext store register` and `appext store submit` leave the version `SUBMITTED`; a reviewer approves (two people if it asks for a restricted scope) — the version is `APPROVED`, and the client, scopes and audience mappings exist at the provider.
- [ ] `appext store bundle` unpacks a bundle the SDK accepts.
- [ ] The extension, deployed with the bundle, answers `/_sdk/info` and `/readyz`; `appext store verify` makes the version `LIVE`.
- [ ] The host app's catalog lists it; opening it signs the person in without a password prompt; a call to a target service succeeds with an exchanged token whose `aud`, `azp` and `scope` are as specified.
- [ ] Signing out of the host app ends the extension's session (back-channel logout).
- [ ] Your manifest validator passes every case in `conformance/manifests/`.

## The version of the contract

This is **version 1** of the platform contract; it describes what `appext` 0.1.x
sends to a platform and expects back. Nothing on the wire carries a contract
version. Within version 1 a new release may *add* optional things — new optional
variables, optional members in JSON bodies a reader ignores, new values of `kind`
and `display` that older host apps read as `extension` and `in_app`. A change that
breaks a platform written against version 1 is a new contract version and is
announced as one.

## See it in action

- [Identity, Authentication & Access](../concepts/iam.md) — the same standards, from the developer's side
- [Security](./security.md#what-the-platform-has-to-protect)
