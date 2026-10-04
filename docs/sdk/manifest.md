---
sidebar_position: 4
---

# The Manifest

The manifest, `extension.toml`, is the **description of an app** that the
platform works from. The SDK reads it at start-up; the app registry reads it
when you upload it and, after approval, builds the OAuth client, the auth bundle
and the catalog entry from it. **No secret ever belongs in it** — keys and
secrets arrive at run time as files or environment variables.

```toml
[extension]
id = "reports"
name = "Project Reports"
description = "Reports across all projects"
version = "1.2.0"
entry = "/"
icon = "icon.svg"
min_app_version = "1.0.0"
hosts = []
audience_roles = []
client_auth = "private_key_jwt"
dev_port = 8100
display = "in_app"

[consent]
scopes = ["reports-read"]

[[services]]
name = "farm"
audience = "farm-api"
scopes = ["farm-read"]
mode = "user"

[[services]]
name = "export"
audience = "export-api"
scopes = ["export-write"]
mode = "service"
```

## `[extension]`

| Key | Required | Meaning |
|-----|:--------:|---------|
| `id` | yes | `^[a-z][a-z0-9-]{1,38}[a-z0-9]$` — a DNS label. The OAuth client is `ext-<id>`, the production host `<id>.<apps domain>`. Never changes after registration. |
| `name` | yes | Title in **English** (the contract language); translations in `name_localized`. |
| `description` | no | Short description for the catalog, English. |
| `version` | yes | Semantic version `MAJOR.MINOR.PATCH`, optional `-pre-release`. Each registration is one version; the lock file pins it. |
| `entry` | yes | A path on the extension's own origin that the host app opens: starts with one `/`; an address with a scheme, `//…` and `/\…` are rejected. For a **link**: an absolute `https` address. |
| `icon` | yes | A file in the project, relative to the manifest, served at `/_sdk/icon` (SVGs are served sandboxed: an icon cannot run script). For a **link**: optional, and an address on the same host as `entry`. |
| `min_app_version` | no | Older versions of the host app hide the extension. |
| `hosts` | no | Further hosts the web view may load (images, fonts); they also widen the default CSP for `img-src` and `font-src` (https only). Not for a link. |
| `audience_roles` | no | Only people with one of these roles see the extension in the catalog. |
| `client_auth` | no | `private_key_jwt` (default) or `client_secret`. A registry allows the latter only when its operator enabled it. Not for a link. |
| `dev_port` | no | Port for the `local` environment, 1024 – 65535 (`appext dev` serves on it; the registry registers `http://127.0.0.1:<dev_port>/auth/callback`). Not for a link. |
| `display` | no | `in_app` (default: the host app shows the extension) or `external` (the host app hands it to the system browser). |
| `kind` | no | `extension` (default) or `link`. |
| `name_localized`, `description_localized` | no | Tables `language → text`; the language code is two lower-case letters, optionally with a region (`pt-BR`). |

### `display`

`in_app` shows the extension inside the host app, with the sign-in handed over
silently. `external` makes the host app a **jump-off point**: tapping the entry
opens it in the system browser and that is all the app does. The page is then
not embedded and there is no bridge; the sign-in happens when the page is
opened, like any website's. The SDK refuses framing in that case.

## `[consent]`

`scopes` — scopes the person confirms when they first open the extension (the
default scopes of its OAuth client). These belong to the extension itself, not to
a service it calls on someone's behalf.

## `[[services]]`

One entry per service the extension calls (`ext.service("<name>")`).

| Key | Meaning |
|-----|---------|
| `name` | The name in code: `^[a-z][a-z0-9_]*$`, unique. Sets the variable `APPEXT_SERVICE_<NAME>_URL`. |
| `audience` | The identifier of the target service at the identity provider (what its tokens carry in `aud`). Must exist in the registry's service catalog. |
| `scopes` | At least one. The scopes of *this* service that the exchanged token carries. |
| `mode` | `user` — on behalf of the signed-in person (token exchange); `service` — as the extension itself (client credentials). **Required.** |

For `mode = "user"` the SDK asks for these scopes **at sign-in**, so that the
consent screen already covers every later exchange. To see which scopes a service
offers: `appext store services`.

## Links

```toml
[extension]
id = "shop"
name = "Our shop"
description = "Seed and supplies"
version = "1.0.0"
kind = "link"
entry = "https://shop.example.org/members"
icon = "https://shop.example.org/static/icon.svg"   # optional: an address on the same host as entry
```

`kind = "link"` makes the entry a **link**: an entry in the catalog that the host
app opens in the system browser — and nothing more. There is **no server of the
SDK behind it**: no OAuth client, no key, no deployment, no sign-in. The page
receives **nothing from the host app**: no token, no person; the app only opens
the address. Use a link to point people to a website or app that already exists.
`appext new <id> --template link` creates one.

A link's manifest: `entry` is an absolute `https` address (plain ASCII, a host
name, no user name or password, at most 2048 characters; `http` only for this
machine and only in a development registry); `icon` is optional and, if present,
an address on the same host; `display` is `external`; and `client_auth`,
`dev_port`, `hosts`, scopes in `[consent]` and any `[[services]]` are
**errors** — a link asks for no permissions and calls no service.

**The review is the only gate.** A link has no deployment the registry could
check; a reviewer approves *the place the link leads to*. A new version whose
`entry` stays on the same scheme, host and port needs no new review; another
host sends it back to review, as it is another link.

## The rules

`appext manifest check` applies rules 1 – 6 and 8; the registry applies the same
when you upload and adds rule 7. The cases in
`conformance/manifests/` run against **both** implementations, so the verdict is
the same everywhere.

1. `id`, `name`, `version`, `entry`, `icon` are present; `id` matches its pattern;
   `version` is semantic; `entry` is a path on the own origin.
2. Scope names match `^[a-z][a-z0-9-]*$`, and **no scope appears twice** across
   `[consent]` and all `[[services]]`.
3. Service names are code-safe and unique; `mode` is present and is `user` or `service`;
   `audience` is not empty; every service has at least one scope.
4. `audience_roles` are role names, `min_app_version` is semantic, `hosts` are host
   names, `client_auth` is one of the two, `display` is `in_app` or `external`,
   `dev_port` is 1024 – 65535.
5. `*_localized` tables map a language code to a non-empty text.
6. **Unknown keys are errors.** A typo such as `scope = [...]` would otherwise be
   accepted and grant nothing, silently.
7. *(Registry only.)* Every `audience` exists in the service catalog; every scope
   of a service belongs to that service, and every `[consent]` scope to some service
   of the catalog; a *restricted* scope is allowed but needs a second approval.
8. **A link** (`kind = "link"`): the constraints listed under [Links](#links).

`appext manifest check` lists **every** broken rule, not the first:

```text
extension.toml: INVALID
the manifest breaks 2 rule(s):
  extension.id: must match ^[a-z][a-z0-9-]{1,38}[a-z0-9]$ (a DNS label, 3-40 characters)
  services[0].mode: must be one of user, service
```

## What changes when

A new version that asks for **nothing more** — the same scopes and services, no
further `hosts`, the same `client_auth` — goes live after the deployment check,
without review. **More** sends it back to review; until a reviewer approves, the
old version stays in the catalog. At start the SDK compares the manifest with
the **lock file** of the auth bundle and refuses to run if the manifest asks for
more than was approved (`LockError`) — a forgotten review shows up before the
deployment goes live, not as a failing token exchange in production.

## See it in action

- [CLI](./cli.md) — `appext manifest check`
- [Publishing](./app-store.md) — what happens to a manifest after `register`
