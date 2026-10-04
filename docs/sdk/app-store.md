---
sidebar_position: 6
---

# Publishing

For extension developers who publish through their platform's **App Store**,
and for the reviewers and administrators who use `appext store …`.

The App Store is part of the platform: its **control plane**. It takes your
manifest, has it reviewed, sets up the app's client at the identity provider,
hands you the **auth bundle**, checks your deployment and publishes the app in
the catalog that the host app reads. **At run time it is not involved**: an
extension never calls it, and a running extension keeps working when it is down.

Which registry a command talks to is **configured, not built in**: `store_url` in
the [platform file](./cli.md#which-platform-a-command-talks-to), `--store-url` or
`APPEXT_STORE_URL`.

## Roles

Store roles are carried in the access token, separate from any roles inside the
platform's own data. A developer needs nothing but the role.

| Role | May |
|------|-----|
| `store-developer` | register apps, upload keys, submit, download bundles, verify; sees **only their own** |
| `store-reviewer` | see everything submitted; approve or reject |
| `store-admin` | everything a reviewer may, plus suspend / unsuspend, maintain the service catalog, and give the second approval for restricted scopes. An admin is not a developer: registering and submitting need `store-developer` |
| *(none)* — any signed-in person | see the catalog, add or remove apps, open them |

A token **issued to an extension** is refused everywhere in the registry
(`403 app_only`). The roles are given by the platform's operator;
`appext store login` tells you which store roles your account has.

## Lifecycle

```
DRAFT ──submit──▶ SUBMITTED ──approve──▶ APPROVED ──verify──▶ LIVE ──(a newer version goes live)──▶ SUPERSEDED
                      └──reject──▶ REJECTED
```

| Step | Who | CLI | What happens |
|------|-----|-----|--------------|
| register | developer | `appext store register` | The manifest is checked, the app created — or, if you own the id, a **new version** — in status `DRAFT`. The public key is uploaded with it. |
| key | developer | `appext store key` | Upload (or replace) the public JWK. Anything with a private member is refused, locally and by the registry. |
| submit | developer | `appext store submit` | `DRAFT → SUBMITTED`. If the app already has a live version and the new one asks for **nothing more** (no further scopes, services or hosts, the same `client_auth`), the version becomes `APPROVED` at once and only the deployment check remains. |
| approve | reviewer | `appext store approve <id>` | Records the approval. With **restricted scopes** a **second approval by a different `store-admin`** is required; then the version is `APPROVED` and the registry sets up the identity provider. |
| reject | reviewer | `appext store reject <id> --reason …` | `SUBMITTED → REJECTED`; fix, bump or re-register the same version, submit again. |
| bundle | developer | `appext store bundle --env prod` | Available from `APPROVED`. |
| verify | developer | `appext store verify --env prod` | The registry asks `<URL>/_sdk/info` and `/readyz` of your deployment: id, version and client id must match and it must be ready. `APPROVED → LIVE`; the previous live version becomes `SUPERSEDED`. |
| suspend | admin | `appext store suspend <id> --reason …` | Out of the catalog; the client at the identity provider is **disabled** (no more refresh or exchange). `unsuspend` undoes it. |

Every step and **every change at the identity provider** is written to an
append-only **event log** (time, actor, role, action, app, version, detail) that
reviewers and administrators can read.

A **link** follows the same states but skips everything that belongs to a server:
no key, no auth bundle, no secret, no deployment check — `verify` makes the
approved link live at once. A reviewer approves *the place the link leads to*.

## What approval sets up at the identity provider

*(Not for a link: it has no client.)*

The registry provisions the identity provider so that the app's sign-in and token
exchanges work:

- a **confidential client** (`ext-<id>`) with the authorization code flow and
  **PKCE `S256`**, no password or implicit flow, **consent required**, no scopes
  beyond those the manifest names, **token exchange** on;
- the **redirect URIs** of every environment plus the host app's return address,
  the post-logout URIs and the **back-channel logout** URL;
- your **public key** as the client's key (`private_key_jwt`);
- the `[consent]` scopes as default scopes and the `user`-mode service scopes as
  optional ones (service-mode scopes for client credentials, with a service
  account);
- the **scope definitions** with their consent texts and audience mappings.

Provisioning only *adds and aligns*, never replaces, and never touches anything
that would clutter the consent screen. What exactly an identity provider must end
up with is in the [platform contract](./platform-contract.md#the-identity-provider).

## The auth bundle

After a reviewer approves a version, `appext store bundle --env prod --out auth-bundle`
downloads and unpacks:

```
auth-bundle/
├── appext.env              # the environment's settings — no secret
├── extension.lock.toml     # the approved state: version, client, approved scopes
└── README.md
```

`appext.env` sets, for the app's environment: the environment name, the issuer,
the client id and authentication method, the public URL, the **base URL of every
service the manifest names** (`APPEXT_SERVICE_<NAME>_URL`) and — where the
platform has a host app — its return address and web origins. It holds **no
secret**. The bundle is mounted at run time and **never baked into the image**,
so the same image runs in every environment.

The **lock file** is more than documentation: at start the SDK compares the
manifest with `approved_scopes` and refuses to start (`LockError`) if the manifest
asks for more, if the version or the client id differs, or if the file was
generated for another environment.

### Secrets

```bash
appext keys generate --out keys             # private key (0600) + public JWK
appext keys session  --out keys/session_key
```

The private key never leaves the machine or the secret store of the deployment;
only the public JWK is uploaded. The session key is a random 32-byte key,
shared by every replica; to rotate it, put the new key on the first line and
keep the old ones below. To rotate the client key, upload the new public key and
switch the deployment's secret right after — every sign-in, refresh and
exchange authenticates with the key, so the gap is a short outage.

## Environments

An environment is a named place an extension runs (`local`, `prod`, …); the
registry knows each with a URL template for the app's origin. **One client per
app** serves all of them: its redirect URIs are the union of every environment's.
**One registry installation serves one environment.** Pass `--env` to `bundle`
and `verify`; a registry that names its environments differently needs it every
time. `local` is reserved for development: the SDK relaxes its production checks
there, so never give a real deployment that name.

## Hosting

- **One subdomain per extension** (`<id>.<apps domain>`, wildcard certificate).
  Only then are origins and cookies separate; under paths of one host an
  extension could use another's session.
- **Horizontally scalable**: sessions, the token cache and the refresh locks live
  in a shared session store.
- **TLS ends at the reverse proxy in front of the app**; set the public URL to the
  public `https` origin and name the trusted proxies.
- **One process per container**: scale by replicas.

## The service catalog

Services publish their scopes in the registry's **service catalog**: name,
consent text (English, with translations), whether the scope is **restricted**,
and the base URL per environment. An app can only ask for scopes that are
listed — `appext store services` shows what you may ask for. How services are
registered is the platform's business.

## Errors

The CLI shows errors as the API sends them — status, `code`, `message` — plus
manifest errors with their paths:

```text
error: the store answered 422 invalid_manifest: The manifest is invalid
  services[0].audience: unknown audience 'x-api'
```

| Status | Code | Meaning |
|--------|------|---------|
| 401 | — | No valid token: `appext store login`. |
| 403 | `forbidden` / `app_only` | Role missing / an extension token was used. |
| 404 | `not_found` | Unknown id (or not yours). |
| 409 | `invalid_state`, `already_exists` | Wrong step for the version's status / the id belongs to someone else. |
| 422 | `invalid_manifest` | Rules broken; `errors` lists each path. |
| 502 / 503 | `provisioning_failed` / `provisioning_unconfigured` | The identity provider could not be set up; the version stays `SUBMITTED`. |

## The commands

| Command | |
|---------|--|
| `login` | **Device authorization grant** ([RFC 8628](https://www.rfc-editor.org/rfc/rfc8628); the CLI also sends PKCE, [RFC 7636](https://www.rfc-editor.org/rfc/rfc7636)) as a public client: prints an address and a code, opens the browser, waits until you approve. Credentials are cached per issuer (mode 0600) and renewed with the refresh token. |
| `logout` | Forget the cached credentials. |
| `register [--manifest P] [--key JWK]` | Upload `extension.toml` and, for `private_key_jwt`, the public key. The manifest rules run locally first. |
| `key [id] [--key JWK]` | Upload or replace the public key. |
| `submit [id]` | Submit the newest draft. |
| `bundle [id] [--env E] [--out DIR]` | Download and unpack the auth bundle. |
| `verify [id] [--env E]` | The deployment check; exit code 0 only when the result is `LIVE`. |
| `status [id] [--all]` | One app, or all of yours. |
| `services` | The service catalog: audiences and scopes you may ask for, restricted ones marked. |
| `rotate-secret [id] --out FILE` | `client_secret` apps only: a new secret into a file, never printed. |
| `approve ID [--note]`, `reject ID --reason`, `suspend ID --reason`, `unsuspend ID --reason` | Reviewer and administrator helpers. |

In **CI**, set `APPEXT_STORE_TOKEN` to a bearer token instead of signing in; the
token needs the `store-developer` role and the registry's audience.

## Trust model

The registry is where a platform decides what an app may do. Review, the
four-eyes rule for restricted scopes and the event log are the controls; the
registry's own rights at the identity provider are what a platform has to
protect — see [Security](./security.md#what-the-platform-has-to-protect).

## See it in action

- [Getting started](../quickstart/getting-started.md) — register an app and make a first call
- [Platform contract](./platform-contract.md#the-app-store) — the API behind `appext store …`
