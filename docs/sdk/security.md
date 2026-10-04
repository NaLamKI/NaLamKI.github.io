---
sidebar_position: 8
---

# Security

For reviewers, platform operators and developers who want to know what the SDK
protects against and what remains theirs to do.

The SDK applies protective defaults that an extension does not need to switch off
in order to work.

| Risk | Measure | In the SDK |
|------|---------|------------|
| An extension uses another's session | One subdomain per extension; the cookie has the `__Host-` prefix and no `Domain` attribute | `__Host-ext_session`, `Path=/`, `HttpOnly`, `Secure`, `SameSite=Lax` |
| CSRF on `/api` | `SameSite=Lax`, a custom header on writing methods, an `Origin` check | `X-Appext-CSRF` required; `Origin` must be the own origin; pages check `Origin` / `Sec-Fetch-Site` |
| XSS in the frontend | `default-src 'self'`, no inline scripts; tokens are not in the browser anyway | the default CSP; `X-Content-Type-Options: nosniff` |
| Embedding in foreign pages | `frame-ancestors 'none'` — except for the host app's web app, named in `APPEXT_APP_ORIGINS` | in the CSP; origins are validated at start (an origin, no wildcard); `bridge.js` posts only to them, never to `*` |
| Open redirect via `return_to` | relative paths on the own origin only | one leading `/`, no `//`, backslash, control character or scheme; never into `/auth` |
| Tokens too broad for a target | token exchange per service with exactly its scopes; the login token stays in the backend | `ext.service()`, cache per session, audience and scopes |
| Leaking the session store | tokens encrypted at rest, key outside the store | AES-GCM, key file, rotation by key list |
| Secrets in the image | run-time secrets only; a scan in CI | `appext manifest check --scan-secrets`; the templates' ignore files |
| A compromised extension | limited to granted scopes and consenting people; disabling the client at the identity provider stops refresh and exchange; short access tokens | registry `suspend`; a target service can also refuse an extension by its `azp` (`require_azp`) |
| A deployment talking to the wrong platform | nothing is guessed: no built-in issuer, registry or service URL; outside `local` no platform file is read and every setting must be present | settings from the environment only |

## More of what the SDK does

- **Login CSRF:** `state` is bound to a transaction cookie and used once.
  **PKCE `S256`** on every sign-in; `nonce` in the ID token; `iss`, `aud`, `exp`
  and `sub` checked. A new sign-in never inherits a session id.
- **No token logging:** errors carry the identity provider's `error` code and
  description, never a token. Secret values are masked in any `repr`.
- **Account match:** the host app's `app_sub` cookie against the ID token's `sub`;
  a mismatch discards the tokens and restarts with `prompt=login`.
- **Refresh under a lock**; a session whose refresh fails is dead, not silently
  kept.
- **`ServiceClient` cannot be aimed elsewhere:** it only sends below the
  configured base URL and never keeps a caller-supplied `Authorization` header.
- **Back-channel logout** accepts only a logout token signed by the issuer, issued
  for this client, carrying the logout event and no `nonce`.
- **Lock file:** the SDK refuses to start when the manifest asks for more scopes
  than the review approved.
- **Icon:** served with a policy that forbids script in an SVG.
- **Static files** never leave the static directory (`..` and symlinks are
  refused).
- **Plain `http` is for this machine:** the public URL and the origins of the host
  app must use `https` unless they are loopback addresses, and so must the issuer
  outside `local`; the CLI warns before it sends a sign-in token to a registry or
  an issuer over plain `http`.
- **Platform files hold no secret** and are not read by a deployment; the CLI's
  own credentials are written with mode 0600 in a directory with mode 0700.

## What is on you

- Do not put secrets in the manifest, the platform file, the image or the
  repository. Keep `.appext/` and key files out of version control (the
  templates' ignore files do).
- Your own routes need `ext.router()` / `ext.pages()`. A route added by hand under
  `/api` is still covered by the CSRF rule, but not by the session check.
- Use `ext.require_role(...)` for decisions inside your extension; a target
  service does its own checks from the exchanged token (ideally the intersection
  of the person's rights and the scope's rights — never more than either).
- A `mode = "service"` service acts without a person: pass the person in the
  request if the target service needs to know, and keep such scopes narrow.
- A wildcard for trusted proxies believes `X-Forwarded-*` from everyone; name your
  reverse proxy.
- Treat user-supplied data as data: the templates use `textContent` and
  autoescaping; keep it that way.

## What the platform has to protect

The registry needs **broad rights at the identity provider** — to create clients
and scopes and to maintain consent texts. A compromised registry could also
change the host app's own client. Mitigations to build in:

- the **event log** of every change at the identity provider;
- **four-eyes** approval for restricted scopes;
- running the registry **apart from extensions**;
- the registry touching **only clients with its own prefix** and scopes from the
  catalog — anything else is refused;
- a refresh token on an unlocked device is a risk that the host app's lock and
  its logout mitigate.

What a platform must do on its side is listed in the
[platform contract](./platform-contract.md).

Vulnerabilities in the SDK: report them to the maintainers privately, not in a
public tracker.
