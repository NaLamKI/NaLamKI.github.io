---
sidebar_position: 2
---

# Sign-in & Session

For extension developers who want to know what the SDK does about the sign-in,
and for platform operators who configure it.

The SDK implements the **backend-for-frontend** pattern: tokens exist only on
the server; the browser — or the host app's web view — holds one cookie with a
random session id. The flow is the OAuth 2.0 **authorization code flow with
PKCE** against the platform's OpenID Connect service (the *issuer*). An
extension developer implements none of it. The protocol side is explained in
[Signing in apps](../concepts/iam/app-authentication.md).

## Routes the SDK adds

| Path | What it does |
|------|--------------|
| `GET /auth/login?return_to=/path` | Starts a sign-in: creates `state`, `nonce` and a PKCE verifier, sets the transaction cookie, redirects to the issuer. Always a **top-level navigation**, never a `fetch`. Also accepts `prompt=login\|consent` and `scope=…` (only scopes the manifest declares). |
| `GET /auth/callback` | Redeems the code, validates the ID token, creates the session, redirects to `return_to`. |
| `GET`/`POST /auth/logout?return_to=/&sso=false` | Ends this extension's session. `sso=true` also ends the issuer's session. |
| `POST /auth/backchannel-logout` | The issuer tells the extension that a session ended. |
| `/_sdk/info`, `/_sdk/icon`, `/_sdk/client.js`, `/_sdk/bridge.js` | Metadata and frontend helpers. |
| `/healthz`, `/readyz` | Liveness; readiness checks the issuer's discovery document and the session store. |

`/auth` and `/_sdk` are reserved; neither your routes nor the static fallback
answer there.

## Scopes at sign-in

The authorization request asks for `openid`, every `[consent]` scope (the app's
own) and the scopes of every `mode = "user"` service. A caller of `/auth/login?scope=…` can
ask for more only from what the manifest declares — never beyond. Asking for the
service scopes *at sign-in* is what lets the consent screen cover every later
[token exchange](./calling-services.md).

## Browser mode and app mode

The same routes serve a normal browser and the host app's web view. A host app
that hands the person's sign-in over to its extensions does two things the SDK
looks for:

- it adds a marker to the user agent of its web view —
  `<Name>-App-WebView/<version>`; the SDK looks for the part `-App-WebView/`
  (`APPEXT_APP_MARKER` replaces it);
- it has a return address of its own for the sign-in, a URI such as
  `com.example.app.ext:/callback`, the same for every extension
  (`APPEXT_APP_REDIRECT_URI`).

If the marker is present **and** `APPEXT_APP_REDIRECT_URI` is set, **this
sign-in transaction** uses that redirect URI; otherwise it uses
`<APPEXT_PUBLIC_URL>/auth/callback`. Nothing else differs. The marker is not a
security feature: whoever forges it gets a redirect URI their own browser cannot
open. Where the platform has **no host app**, there is no app mode — the
extension is a website like any other.

In the host app, the web view loads the extension, the extension redirects to the
issuer, the app intercepts exactly that request and runs it in the system's auth
sheet, where the person's session already exists, and hands the callback URL
back. What the host app must do is part of the
[platform contract](./platform-contract.md#the-host-app). The extension sees an
ordinary sign-in and needs to know nothing of this — except:

- **`response_mode=query`.** `form_post` would never arrive over a custom URI
  scheme. The SDK sets it.
- **`app_sub`.** The host app sets a cookie `app_sub` with the account's `sub`
  before loading the extension. If the ID token's `sub` differs (another person
  is signed in at the system browser), the SDK throws the tokens away and
  restarts the sign-in with `prompt=login`.
- **`error=access_denied`** (consent refused *or* sheet closed) is shown as a
  page that explains both and offers to try again.

## The session

- **Cookie:** `__Host-ext_session` — `HttpOnly`, `Secure`, `SameSite=Lax`,
  `Path=/`, no `Domain`. The value is 256 bits of randomness and carries no
  data. On plain `http://127.0.0.1` or `localhost` (development) it is called
  `ext_session_<port>` without `Secure`, because `__Host-` requires `Secure`;
  the port is in the name because cookies are scoped by host, not by port.
- **Record in the store:** the issuer's session id (`sid`), `sub`, ID-token
  claims, access and refresh token, granted scopes, roles, and the cache of
  exchanged tokens. Tokens are **encrypted at rest** (AES-GCM, with a key held
  outside the store): a stolen store dump holds no usable token.
- **A new sign-in never inherits a session id** (no session fixation): the old
  record is deleted when the callback creates the new one.
- **Refresh:** the access token is renewed on the server shortly before it
  expires, **under a per-session lock**. Some identity providers rotate refresh
  tokens, and two parallel refreshes would present an already-used token and end
  the whole session; the lock plus a re-read after acquiring it makes "two
  callers, one refresh" the only outcome — also across replicas that share the
  session store.
- **End of session:** if the refresh fails with `invalid_grant`, the session is
  invalid. An API route answers `401`, a page redirects to the sign-in; in the
  host app the person notices at most the auth sheet.

## Protecting routes

```python
api = ext.router(prefix="/api")     # JSON API: no session -> 401 {"error":"unauthenticated","login_url":"/auth/login?return_to=…"}
pages = ext.pages()                 # HTML pages: no session -> 302 to /auth/login
```

An API cannot start a sign-in with `fetch`, and a redirect would lose the host
app's chance to intercept; so the API answers `401` with a `login_url`, and the
frontend helper navigates there as a whole page:

```js
import { extFetch } from "/_sdk/client.js";
const response = await extFetch("/api/items");   // 401 -> sign-in -> back to this page
```

`extFetch` is `fetch` that sends the CSRF header and `credentials: "same-origin"`,
follows a `401` whose `login_url` points into `/auth/` by navigating the
top-level window (with `return_to` set to the current page), and stops after
three such navigations within 30 seconds so a broken setup does not loop forever.

In handlers:

```python
user: User = Depends(ext.current_user)             # sub, name, email, preferred_username, roles, scopes
user: User = Depends(ext.require_role("analyst"))  # 403 unless the person has the role
```

`name` and `email` are `None` unless the granted scopes include them —
extensions get no profile by default. `user.roles` merges the platform-level roles and the
roles of the extension's own client. These are for decisions **inside the
extension**; what a person may do in a target service is decided by that
service from the exchanged token's scopes.

## `return_to`

Only a **path on the extension's own origin** is accepted: one leading `/`, no
`//`, no backslash, no control character (browsers drop tabs and newlines and
read what follows as a host), no scheme, never a path under `/auth`. Everything
else becomes `/`. The same function guards `/auth/logout`.

## Logout

- **`/auth/logout`** ends only the extension's session. The person's session at
  the issuer stays: closing one extension must not sign the person out of the
  host app.
- **`/auth/logout?sso=true`** also redirects to the issuer's end-session endpoint
  (with `id_token_hint`).
- **Host-app logout** ends the issuer's session. The issuer then sends a
  **back-channel logout** to every extension with a session: a `POST` with a
  `logout_token` to `/auth/backchannel-logout`. The SDK validates it (signature,
  `iss`, `aud`, `iat` and `jti`, an `events` object with the `backchannel-logout`
  event, **no** `nonce`, and at least one of `sid` or `sub`) and deletes **all
  sessions of that `sid`** — or, for a token with only a `sub`, all sessions of the
  person. The endpoint is exempt from
  the CSRF check because it is server to server.

## CSRF

Cookies are `SameSite=Lax`, which already keeps cross-site `POST`s from carrying
the session. The second layer is aimed at what matters with one subdomain per
extension — a *sibling* site is same-site:

- Writing requests (`POST`, `PUT`, `PATCH`, `DELETE`) under your `ext.router()`
  prefix need the header **`X-Appext-CSRF`** (any value; `extFetch` sets it). A
  cross-origin page cannot set a custom header without a CORS preflight, which
  the SDK never grants.
- If an `Origin` header is present, it must be the extension's own origin; a
  cross-site `Sec-Fetch-Site` without `Origin` is refused.
- Routes of `ext.pages()` (plain HTML forms cannot set headers): `Origin` must be
  the own origin, or absent with `Sec-Fetch-Site` saying same-origin or none.
- Refusals are `403 {"detail": {"code": "csrf_rejected", …}}`.

## Configuration

`APPEXT_ISSUER`, `APPEXT_CLIENT_ID`, `APPEXT_CLIENT_AUTH`,
`APPEXT_CLIENT_KEY_FILE`, `APPEXT_PUBLIC_URL`, `APPEXT_APP_REDIRECT_URI`
(optional), `APPEXT_APP_MARKER`, `APPEXT_SESSION_*` — the platform's values
arrive in the **auth bundle** the registry issues; see
[Publishing](./app-store.md#the-auth-bundle). The client authenticates with
`private_key_jwt` (an `RS256`, `ES256`, `ES384` or `ES512` assertion with `iss = sub = client_id`,
`aud` = the token endpoint, a `jti` and a short expiry) or, if the operator
allows it, a client secret.

## See it in action

- [Signing in apps](../concepts/iam/app-authentication.md) — the protocol behind it
- [Security](./security.md) — the whole list of protective defaults
