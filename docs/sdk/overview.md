---
sidebar_position: 1
---

# Application SDK

The **Application SDK** (`appext`) is how an app joins a platform that follows
the reference architecture. It gives an app's backend what every external app
needs and nobody should write twice: the sign-in, a safe session, calls to the
digital farm API on behalf of the signed-in person, and the protective defaults
that keep all of it secure.

It implements, once, what the [identity pages](../concepts/iam.md) describe —
OpenID Connect with PKCE, `private_key_jwt` client authentication, token
exchange, back-channel logout — so an app developer writes none of it.

| | |
|---|---|
| **Package** | `appext`, version 0.1.0 (not yet released) — `pip install appext`, or from a checkout of the repository `pip install -e .` |
| **Language** | Python 3.12 or newer (the frontend template needs Node 22) |
| **Repository** | [github.com/NaLamKI/Application-SDK](https://github.com/NaLamKI/Application-SDK) — guides, templates, the platform contract. See the repository for the licence status. |

:::note Standards first, library second
The SDK is a Python library, but everything it does is defined by open
standards. An app in another language follows the same concepts and the
[platform contract](./platform-contract.md); the SDK's sign-in, exchange and
verification rules are written down in full so they can be implemented anywhere.
:::

## What an extension is

An **extension** is a web page with its own Python backend, run as one
container with one process. Its frontend, its API and its sign-in share **one
origin**. A platform's *host app* may open it inside a web view (on a phone), or a
frame (in the web app) — or people simply open it in a browser. The same extension, unchanged, works in
both places.

Not everything needs a server. A **link** is an entry in the platform's app
catalog that the host app opens in the system browser — a manifest with
`kind = "link"` and an address; no container, no sign-in, nothing passed on to
the page. See [Manifest](./manifest.md#links).

## What the SDK gives you

- **Sign-in** with the platform's OAuth 2.0 / OpenID Connect service
  (authorization code flow with PKCE), a **server-side session** — the browser
  holds only a cookie, never a token — and, where the platform has a host app,
  a silent hand-over of the person's sign-in. →
  [Sign-in & session](./sign-in-and-session.md)
- **Calls to other services on behalf of the person**, with a token cut to
  exactly one service and its scopes
  ([RFC 8693](https://www.rfc-editor.org/rfc/rfc8693) token exchange) — the
  digital farm API first among them. →
  [Calling services](./calling-services.md)
- **Protective defaults**: `__Host-` cookie, CSRF check, a strict content
  security policy, no embedding by foreign pages, safe redirects. →
  [Security](./security.md)
- A **command line** that scaffolds, runs, checks and publishes. →
  [CLI](./cli.md), [Publishing](./app-store.md)
- A **bridge** to the host app's chrome — title, theme, language, close. →
  [Host-app bridge](./host-app-bridge.md)
- **Test helpers** that need neither an identity provider nor the target
  services. → [Testing](./testing.md)
- A **verifier for services** that accept tokens from apps — the other side of
  token exchange. → [Calling services](./calling-services.md#writing-a-target-service)

## The picture

```
          ┌────────────┐   sign-in (system browser)      ┌───────────────────┐
          │  Host app  │────────────────────────────────▶│ Identity provider │
          │ web view / │                                 │    (the issuer)   │
          │   frame    │                                 └─────────▲─────────┘
          └─────┬──────┘                                           │ code, token exchange,
                │ HTTPS, session cookie only                       │ refresh, back-channel logout
          ┌─────▼──────────────────────────────┐                   │
          │ Extension container  (one origin)  │───────────────────┘
          │  /            frontend             │
          │  /api/*       your routes          │
          │  /auth/*      sign-in, logout      │  ← added by the SDK
          │  /_sdk/*      helpers, info, icon  │
          │  /healthz /readyz                  │
          └─────┬───────────────────────┬──────┘
                │ exchanged token       │ sessions, token cache, locks
                ▼ (per service call)    ▼
          ┌────────────┐          ┌───────────────┐
          │  Digital   │          │ Session store │  (in memory only for development)
          │  farm API  │          └───────────────┘
          └────────────┘

   Control plane, not in the picture at run time: the app registry registers the manifest, a
   reviewer approves it, the registry sets up the app's client at the identity provider and
   hands the developer the auth bundle; the host app loads its catalog from the registry.
   Without a host app the extension is a website like any other. In the host
   app's web version there is no hand-over: the extension signs in inside its frame.
```

## A platform, not a product

The SDK has **no built-in platform**. A *platform* is any system that follows
the reference architecture: it offers an OAuth 2.0 / OpenID Connect service
(the **issuer**), an **app registry** that registers, reviews and lists
extensions, and optionally a **host app** that shows them. Where the SDK has to
know about it — the issuer, the registry, the host app's return address — you
say so once, in a small *platform file* (`appext.toml`) that the platform's
operator publishes. Nothing is guessed: with no issuer configured, the SDK stops
and says how to provide one.

```toml
# appext.toml
[platform]
name = "Example Platform"
issuer = "https://auth.example.org"
store_url = "https://store.example.org/api/v1"
```

Operators who adopt the SDK for their platform provide those services and meet
the [platform contract](./platform-contract.md).

## Five minutes

You need Python 3.12 or newer and, for the single-page template, Node 22. You
also need a platform to write for — its issuer address and its app registry
address; ask the platform's operator.

```bash
python3 -m venv venv && . venv/bin/activate
pip install appext
appext new hello --template spa          # or --template htmx (server-rendered pages, no JavaScript build)
cd hello
pip install -e ".[test]"
(cd frontend && npm ci && npm run build)
pytest                                   # unit tests: no identity provider, no platform
```

Fill `hello/appext.toml` with the platform's addresses (above), then:

```bash
appext dev                               # http://127.0.0.1:8100
```

`appext dev` needs an identity provider that knows the app's client. Either the
platform's registry provisions it — `appext store login`, `register`, `submit`,
a reviewer approves — or the SDK exports a local identity-provider configuration
for development. [Getting started](../quickstart/getting-started.md) walks through it.

The whole backend of a new project:

```python
from fastapi import Depends
from appext import Extension, ServiceClient, User

ext = Extension.from_manifest("extension.toml")
api = ext.router(prefix="/api")                 # every route needs a session

@api.get("/me")
async def me(user: User = Depends(ext.current_user)):
    return {"sub": user.sub, "roles": sorted(user.roles)}

@api.get("/farms")
async def farms(farm_api: ServiceClient = Depends(ext.service("farm"))):    # token exchange
    return (await farm_api.get("/farms")).json()

app = ext.asgi(static_dir="frontend/dist")
```

`ext.service("farm")` is a service declared in the manifest — an audience, its
scopes and a mode. The request goes to that service with a token that was
exchanged for exactly that audience and those scopes; the login token never
leaves the backend.

## What is in the box

| | |
|---|---|
| `appext` library | `Extension`, `ServiceClient`, `User`, `appext.verify`, `appext.testing`; platform settings in `appext.platform` |
| `appext` CLI | `new`, `dev`, `serve`, `health`, `manifest check`, `keys`, `store …`, and an export of a local identity-provider configuration |
| Templates | `spa` (single-page frontend), `htmx` (server-rendered pages), `link` (a manifest only) |
| `examples/hello/` | a working extension, kept in the repository |
| Container base image | the image `appext new` projects build on |
| `conformance/manifests/` | manifest cases that the SDK **and** the registry must judge identically |
| Platform contract | what a platform must provide so the SDK works against it |

## Guides

| Guide | For |
|-------|-----|
| [Sign-in & session](./sign-in-and-session.md) | how the sign-in, the session, logout and CSRF work |
| [Calling services](./calling-services.md) | token exchange, consent, the two modes; writing a service that accepts app tokens |
| [Manifest](./manifest.md) | every key of `extension.toml`, links, and the rules |
| [CLI](./cli.md) | the commands, what `appext dev` sets, the files written |
| [Publishing](./app-store.md) | register → review → provision → bundle → verify → live |
| [Testing](./testing.md) | `appext.testing`: test environment, test client, service mocks, a fake identity provider |
| [Security](./security.md) | what the SDK protects against, and what stays yours |
| [Host-app bridge](./host-app-bridge.md) | talking to the platform's app from the page |
| [Platform contract](./platform-contract.md) | for platform builders and operators |

## Status

`appext` is at version 0.1.0 (not yet released); projects created with `appext new` depend on
`appext>=0.1,<1`. Vulnerabilities in the SDK are reported to the maintainers
privately, not in a public issue.
