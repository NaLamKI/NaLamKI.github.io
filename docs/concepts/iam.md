---
sidebar_position: 6
---

# Identity, Authentication & Access

Nothing in the platform trusts an application because of where it runs. Every
request to a digital farm API carries a **token** issued by an **identity
provider**, and the API decides — from the token and from the data model's own
roles — what the caller may do.

This follows the security provisions of the Recommendation (clause 10): the
use of an **external identity and access management system** is mandatory,
and it is spoken to through **OpenID Connect**. The APIs do not store
passwords, run log-in screens or issue tokens; they only *verify* tokens.

## The pieces

| Piece | Role |
|-------|------|
| **Person** | Farmer, employee, adviser, contractor — a `User` in the data model. Signs in at the identity provider and nowhere else. |
| **Identity provider** (the *issuer*) | An OpenID Connect / OAuth 2.0 service. Authenticates people, asks for their consent, issues tokens, signs them with keys it publishes. |
| **First-party app** | The platform's own app (phone, web, desktop). A *public client*. See [Signing in people](./iam/user-authentication.md). |
| **External app** | An app built by somebody else — a web app with a backend, or a plain link. Registered with the platform; if it has a backend, a *confidential client*. See [Signing in apps](./iam/app-authentication.md). |
| **Digital farm API** | A resource server: it verifies tokens and serves the [data model](./data-model/overview.md). Identified by an **audience**. |
| **App registry** (*App Store*) | Optional control plane: registers apps, has them reviewed, sets up their clients and scopes at the identity provider. At run time it is not involved. |

```
              ┌───────────────────────────────────────────────┐
              │               Identity provider               │
              │   OpenID Connect · OAuth 2.0 · signing keys   │
              └─────▲────────────────▲───────────────────▲────┘
       sign in,     │     sign in,   │                   │ keys,
       tokens       │     exchange   │                   │ discovery
              ┌─────┴──────┐   ┌─────┴──────┐            │
 Person ────▶ │ First-party│   │ External   │            │
              │ app        │   │ app        │            │
              └─────┬──────┘   └─────┬──────┘            │
                    │ Bearer token   │ Bearer token      │
                    ▼                ▼                   │
              ┌──────────────────────────────────────────┴────┐
              │               Digital farm API                │
              │  verifies the token, then checks the farm     │
              │  permissions (Role, AccessAssignment)         │
              └───────────────────────────────────────────────┘
```

## Standards, not products

The identity layer is built from open standards only. Any identity provider
that implements them can be used; any client library that implements them can
talk to it.

| Standard | Used for |
|----------|----------|
| [OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749) (RFC 6749) | the framework: clients, grants, scopes, tokens |
| [Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750) (RFC 6750) | `Authorization: Bearer …` on every API call |
| [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) | authenticating the person; the ID token; `private_key_jwt` client authentication |
| [OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html) | finding the endpoints and keys from the issuer URL alone |
| [PKCE](https://www.rfc-editor.org/rfc/rfc7636) (RFC 7636) | binding an authorization code to the client that asked for it — on **every** sign-in |
| [OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252) (RFC 8252) | signing in from a phone or desktop app through the system browser |
| [OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700) (RFC 9700) | exact redirect-URI matching, no implicit or password grant |
| [JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519) (RFC 7519), [JWS](https://www.rfc-editor.org/rfc/rfc7515), [JWK](https://www.rfc-editor.org/rfc/rfc7517) | the token format, its signature and the published keys |
| [JWT client authentication](https://www.rfc-editor.org/rfc/rfc7523) (RFC 7523) | how a confidential app proves who it is, without a shared secret |
| [Token Exchange](https://www.rfc-editor.org/rfc/rfc8693) (RFC 8693) | an app asks for a token cut to **one** service and its scopes |
| [Client credentials](https://www.rfc-editor.org/rfc/rfc6749#section-4.4) (RFC 6749 §4.4) | an app acting as itself, with no person |
| [Device Authorization Grant](https://www.rfc-editor.org/rfc/rfc8628) (RFC 8628), with PKCE | developers signing in from a command line |
| [Issuer Identification](https://www.rfc-editor.org/rfc/rfc9207) (RFC 9207) | the `iss` parameter on the authorization response |
| [OpenID Connect Back-Channel Logout 1.0](https://openid.net/specs/openid-connect-backchannel-1_0.html) | the identity provider tells apps that a session ended |
| [OpenID Connect RP-Initiated Logout 1.0](https://openid.net/specs/openid-connect-rpinitiated-1_0.html) | an app ends the person's session at the identity provider |
| [Problem Details](https://www.rfc-editor.org/rfc/rfc9457) (RFC 9457) | how the API reports `401`, `403` and everything else — see [Errors](../api-reference/errors.md) |

## Authentication and authorisation are separate decisions

1. **The identity provider decides who the caller is** — and what an *app* may
   ask on a person's behalf. It issues a token only for scopes the person has
   consented to.
2. **The API checks the token**: signature against the issuer's published
   keys, `iss`, `exp`, its own audience in `aud`, then the scopes the operation
   needs. See [Scopes, audiences & permissions](./iam/authorization.md).
3. **The data model decides what that person may do on which farm.**
   `Role` and `AccessAssignment` give a base layer inside the model; they are
   evaluated **in addition to, never in place of**, the identity provider's
   policies.

A rule that works well: let the service decide from the **intersection** of
what the person may do and what the token's scopes grant. An app can then never
do more than the person, and never more than its scope says.

## Roles and access in the data model

```json
// Role
{
  "id": "a67dcd3e-3a44-5196-b5b8-423fefd2f99f",
  "name": "farm manager",
  "permissions": ["farm:read", "field:read", "field:update", "task:create",
                  "task:update", "activity:create", "activity:read",
                  "regulatoryReport:read"],
  "isSystemRole": true
}

// AccessAssignment — this user holds that role on this farm, from this date
{
  "userId": "b630da76-9ec3-5faa-a1d7-e66d56bc5db4",
  "farmId": "997142c3-14cf-5cb4-b260-048af4b57a76",
  "roleId": "a67dcd3e-3a44-5196-b5b8-423fefd2f99f",
  "startsAt": "2025-01-15T00:00:00Z"
}
```

- A **permission** has the pattern `entity:action` — `field:read`,
  `task:update`, `regulatoryReport:read`. Actions are `read`, `create`,
  `update` and `delete`. Each operation of the
  [REST API](../api-reference/overview.md) names the permission it requires in
  `x-agfoda-permission`, evaluated **per farm**.
- An **`AccessAssignment`** gives a user a role on one farm, optionally for a
  limited time (`startsAt`, `endsAt`) — which is how access for advisers and
  contractors is granted and lapses. Validity periods for the same user, farm
  and role must not overlap (rule V16).
- **`User.email`** serves as the login identity and is unique within the
  deployment.
- **Finer than a farm.** `Farm.iamResourceId` registers the farm as a resource
  at the identity provider, and `Data.iamResourceId` registers an individual
  dataset as a protected resource of its own. Policies that depend on
  attributes or on the purpose of processing stay in the identity layer.

## Data sovereignty is technical

Consent is not a clause in a contract. A person sees which app asks for which
data — in the words the *service owner* wrote for each scope — before a token
exists; the token holds only what was agreed; the consent can be revoked at the
identity provider, after which the next token exchange fails. Every change to a
record is written to the append-only `AuditLog`. See
[Data Sovereignty in Practice](./data-sovereignty.md).

## What a platform has to provide

| Level | The platform provides | Result |
|-------|-----------------------|--------|
| 0 | an identity provider; the digital farm APIs | apps can sign people in and call the APIs; the operator provisions each app's client by hand |
| 1 | + an app registry | the developer workflow: register, review, provision, publish |
| 2 | + a host app | the in-app experience: apps open inside the platform's own app, with a silent hand-over of the person's sign-in |

The requirements on the identity provider, step by step, are in the
[platform contract](../sdk/platform-contract.md).

## In this section

- [Signing in people](./iam/user-authentication.md) — authorization code flow with PKCE
- [Signing in apps](./iam/app-authentication.md) — confidential clients, token exchange, client credentials
- [Scopes, audiences & permissions](./iam/authorization.md) — what a token may do

## See it in action

- [Getting started](../quickstart/getting-started.md) — sign in an app and call the digital farm API
- [API Reference · Authentication](../api-reference/iam.md) — the endpoints and claims
- [SDK](../sdk/overview.md) — everything above, implemented once
