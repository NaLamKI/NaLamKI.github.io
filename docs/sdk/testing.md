---
sidebar_position: 7
---

# Testing

For extension developers writing unit tests, and for anyone testing the sign-in
or a target service with the SDK's fakes.

Unit tests of an extension need neither an identity provider nor the services it
calls. `appext.testing` gives you a test environment that is the same on every
machine, a signed-in test client, mocks for the target services and — for the
SDK's own tests and for anyone who wants to test the sign-in itself — an
identity provider in a box.

```python
# tests/conftest.py — runs before the tests import app.main
from pathlib import Path
from appext.testing import configure_test_environment

configure_test_environment(Path(__file__).resolve().parent.parent / "extension.toml")
```

```python
# tests/test_api.py
from appext.testing import ExtensionTestClient, service_mocks, test_user
from app.main import app, ext


def test_farms():
    client = ExtensionTestClient(app, user=test_user(sub="u-1", roles=["analyst"]))
    with service_mocks(ext) as mocks:
        mocks.get("farm", "/farms").respond(json=[{"id": "f-1", "name": "Lindenhof"}])
        response = client.get("/api/farms")
    assert response.status_code == 200
    assert client.token_requests == [("farm", "farm-api", ("farm-read",), "user")]
    client.close()
```

## `configure_test_environment`

`app/main.py` reads its settings when it is imported, from the `APPEXT_*`
variables of the environment — and, in the `local` environment, from the
project's `appext.toml`. A test run must not depend on the machine it runs on:
a shell that exports a deployment's settings, or a platform the developer pointed
`appext.toml` at, must not change what a test does. `configure_test_environment`:

1. removes **every** `APPEXT_*` variable from the environment;
2. sets what a local run needs: `APPEXT_ENV=local`, a test issuer, a test return
   address and, for every service the manifest declares, a service URL
   (`https://<name>.test/api`) so that `service_mocks` knows where the service
   "is";
3. returns what it set.

Nothing is looked up on the network or leaves the machine. It must run
**before** the app is imported; `appext new` writes exactly that into
`tests/conftest.py`.

## `ExtensionTestClient`

A test client for an extension, signed in as the test person:

- The **session is created directly** in the extension's store — no sign-in round
  trip.
- **Writing requests carry the CSRF header and a matching `Origin`** by default.
  Pass your own `headers=` to test what happens without them
  (`403 csrf_rejected`).
- **Token exchanges are answered with a placeholder** and recorded in
  `client.token_requests` as `(service, audience, scopes, mode)` — so a test can
  assert that the extension asks for the right scopes without any identity
  provider.
- `ExtensionTestClient(app)` with no user is anonymous: use it to check the `401`
  and redirect behaviour.

`test_user(sub=…, name=…, email=…, roles=[…], client_roles=[…], scopes=[…])`
describes the person. `name=None` tests the "no profile scope" case.

## `service_mocks(ext)`

A router that resolves `(service name, path)` against the configured base URLs:
`mocks.get("farm", "/farms")`, `.post`, `.put`, `.delete`, `.route(method, …)`.
Whatever is **not** mocked fails the test instead of reaching the network.

## `FakeIdP` and `FakeClock`

`FakeIdP` is an in-process OpenID Connect provider that behaves like a real one
where it matters: strict redirect URIs, PKCE, consent bookkeeping (a refused
consent, a revoked consent), refresh-token rotation and "session not active", the
token exchange (including "scope not consented"), client credentials,
`private_key_jwt` and secret authentication, and the back-channel logout sender.
It records what the SDK sent, so a test can assert the **shape** of a token
request.

`FakeClock` is a clock you move by hand (`clock.advance(301)`): hand the same
instance to the extension and the provider to test refresh and expiry without
sleeping. `idp.mint_access_token(...)` signs a token as the provider would —
handy for testing a target service built with `appext.verify`:

```python
token = idp.mint_access_token(sub="u-1", azp="ext-demo", audience="projects-api", scope="projects-read")
response = client.get("/v1/projects", headers={"Authorization": f"Bearer {token}"})
```

## What is tested once, and what only a device proves

The sign-in flow — redirect URIs, PKCE, consent, refresh, exchange, back-channel
logout — is tested **once**, against `FakeIdP`, in the SDK's own suite, not per
extension. What you test is your extension's behaviour. What only a device
proves — a web view, the system auth sheet, a phone — cannot be covered by unit
tests at all; that belongs to the host app's own tests and to a manual run.

## In CI

```bash
pytest                                   # the project's tests, no network
appext manifest check --scan-secrets     # the manifest rules and a tripwire for committed keys
```

Put both in CI. `appext manifest check` exits `1` on a broken manifest and on any
finding of the scan; the scan never prints a secret's value.
