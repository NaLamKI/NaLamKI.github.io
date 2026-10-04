---
sidebar_position: 5
---

# The Command Line

For anyone who builds, runs or publishes an app: the commands, their options and
the files they write. `appext --help` lists the commands; `appext <command> --help`
the options. Exit code 0 means success; 1 a failure the message explains (a broken
manifest, an API error, a finding of the secret scan, a missing platform
setting); 2 a usage error.

| Command | Does |
|---------|------|
| `appext new <id> [--template spa\|htmx\|link] [--dir .] [--name "…"] [--platform NAME\|FILE]` | Creates `<dir>/<id>/` from a template. The id is checked by the manifest rule; a target that exists and is not empty is refused. The platform is written into the project as `appext.toml`, and its *starter service* fills the template. `link` creates only an `extension.toml`, a README and an `appext.toml`: no server, so no code, tests or key. |
| `appext dev [module:app] [--manifest P] [--host 127.0.0.1] [--port N] [--env-file F]… [--no-reload] [--platform NAME\|FILE]` | Runs the extension in browser mode with reload on `http://127.0.0.1:<dev_port>`. Fills in local defaults (the dev key under `.appext/`, an in-memory session store, the public URL) and what the platform file knows; lets `--env-file`s (only `APPEXT_*` lines, for example a bundle's `appext.env`) and the shell's own `APPEXT_*` variables override them; validates the result and prints what it did. Refuses a link. |
| `appext serve <module:app> [--host 0.0.0.0] [--port N] [--workers N]` | The container's entry point: the app without reload. Takes the environment as it is. |
| `appext health [--port N]` | Exit code 0 if `/healthz` answers 200 — for a container health check. |
| `appext manifest check [path] [--scan-secrets]` | The [manifest rules](./manifest.md#the-rules), every violation listed. `--scan-secrets` also scans the project for private keys and literal client secrets and never prints a value — put it in CI. |
| `appext keys generate [--out .appext] [--alg RS256\|ES256] [--force]` | A key pair for `private_key_jwt`: the private key (mode 0600) and the public JWK with its [RFC 7638](https://www.rfc-editor.org/rfc/rfc7638) thumbprint as `kid`. Never prints the private key; refuses to overwrite without `--force`. |
| `appext keys session [--out .appext/session_key] [--force]` | A random 32-byte key for encrypting sessions, mode 0600. |
| `appext store …` | The app registry: [Publishing](./app-store.md). Every command takes `--store-url`, `--issuer` and `--platform`. |

A further command exports a **local identity-provider configuration** — the
client with your public key, the scopes with their audience mappings, a stand-in
for each audience and a test user — for developing against an identity provider
on your own machine when no platform is available. It is a stand-in for the
registry on a laptop, not a production tool.

## Which platform a command talks to

`appext new`, `dev` and every `appext store …` command read the platform's
settings. There are **no built-in defaults**. Each setting is taken from,
strongest first:

1. an option (`--issuer`, `--store-url`, `--client-id`),
2. an environment variable (`APPEXT_ISSUER`, `APPEXT_STORE_URL`,
   `APPEXT_CLI_CLIENT_ID`, `APPEXT_APP_REDIRECT_URI`),
3. the **platform file**, which `--platform NAME|FILE` or `APPEXT_PLATFORM` names,
   else `appext.toml` of the project, else `~/.config/appext/platform.toml`.

A setting that is needed and found nowhere is an error that lists the three
ways. In production the platform file is **not read**: a running extension gets
the same values from its auth bundle.

```toml
# appext.toml — written by `appext new`; no secret
[platform]
name = "Example Platform"                   # shown in messages and in the bridge's "Back to …" bar
issuer = "https://auth.example.org"         # the OAuth / OpenID Connect service
store_url = "https://store.example.org/api/v1"   # the app registry; the CLI appends /store/…
cli_client_id = "appext-cli"                # optional: the command line's public client
app_redirect_uri = "com.example.app:/callback"  # optional: where the host app takes a sign-in back

[platform.services]                         # optional: base URLs of target services for development
farm-api = "http://127.0.0.1:8000/v1"

[platform.starter]                          # optional: what `appext new` puts into a fresh manifest
service = "farm"
audience = "farm-api"
scope = "farm-read"
```

## What `appext dev` sets

| Variable | Value |
|----------|-------|
| `APPEXT_ENV` | `local` |
| `APPEXT_PUBLIC_URL` | `http://<host>:<port>` |
| `APPEXT_SESSION_STORE` | `memory` |
| `APPEXT_SESSION_KEY_FILE` | `.appext/session_key` (created) |
| `APPEXT_CLIENT_KEY_FILE`, `APPEXT_CLIENT_KEY_ID` | `.appext/client_key.pem` (created) and its `kid` |

and, **only where the platform file or the environment provides them**:
`APPEXT_ISSUER`, `APPEXT_APP_REDIRECT_URI`, `APPEXT_APP_NAME` and one
`APPEXT_SERVICE_<NAME>_URL` per manifest service whose audience is listed under
`[platform.services]`. Without an issuer `appext dev` stops with
`APPEXT_ISSUER is required (APPEXT_ENV=local)`; for a service without a URL it
warns and calls to it fail.

## Files the CLI writes

| File | Mode | Content |
|------|------|---------|
| `appext.toml` | — | the platform of a new project; no secret |
| `.appext/client_key.pem` | 0600 | private client key — never commit, never bake into an image |
| `.appext/client_key.jwk.json` | — | its public half — this is what the registry gets |
| `.appext/session_key` | 0600 | session-encryption key |
| `auth-bundle/` | — | what `appext store bundle` unpacks: the settings file, the lock file, a README |
| `~/.config/appext/credentials.json` | 0600, directory 0700 | the registry sign-in per issuer, renewed with the refresh token |

## See it in action

- [Publishing](./app-store.md) — the `appext store` commands in order
- [Getting started](../quickstart/getting-started.md)
