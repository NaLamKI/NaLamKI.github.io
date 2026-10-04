---
sidebar_position: 3
---

# Scopes, Audiences & Permissions

Authentication says *who*. This page is about *what*: three vocabularies —
**audiences**, **scopes** and **permissions** — and how they combine so that an
app can never do more than the person it acts for.

## Audience: which service a token is for

Every **target service** — the digital farm API, a data service, an export
service — is a *resource server* with an **audience**: a string, normally its
client identifier at the identity provider (`farm-api`). It is the value a
service finds in the `aud` claim of an incoming token, and the value an app
writes when it asks for a token for that service.

- A service must **exist at the identity provider** before a token can be
  issued for it; providers refuse an unknown audience.
- A token for one audience is **worthless at another**. An API that accepts a
  token that does not name it is broken; the platform's APIs refuse it.

## Scope: what a token may be used for

A **scope** is a named permission an app asks for and a person consents to.

| Property | Rule |
|----------|------|
| **Belongs to one service** | and carries an *audience mapping*: a token issued with the scope names that service in `aud`. Without the mapping the token has a default audience, and every service rejects it. |
| **Unique across the platform** | names match `^[a-z][a-z0-9-]*$` |
| **Has a consent text** | in English, with translations, written by the service's owner and identical for every app that asks for it. A scope with no text would show its technical name — and confirming `data-write` confirms nothing. |
| **May be restricted** | an app that asks for a restricted scope needs a second approval at review |

Scopes reach an app in two ways:

| Declared as | Assigned at the client | Requested at sign-in | Used for |
|-------------|------------------------|----------------------|----------|
| the app's own scopes | **default** scopes | yes | carried by the login token; confirmed at the first sign-in |
| a service called **for the person** | **optional** scopes | yes — so consent covers later exchanges | chosen per [token exchange](./app-authentication.md#calling-the-api-token-exchange) |
| a service called **as the app** | **optional** scopes, plus a service account | no — the person is never asked | chosen per client-credentials request |

## Service catalog: what exists

The platform's **service catalog** is where services publish themselves: name,
audience, scopes with their consent texts, whether a scope is restricted, and
the base URL of the service in each environment. An app can only ask for what
is listed.

A developer lists it with the SDK's `appext store services` command, or reads it
from the platform's documentation. The catalog is also what lets the registry
verify a manifest: every audience must exist, and every scope must belong to
its service.

## Permission: what the data model lets someone do

A **permission** is how the data model itself speaks about rights:
`entity:action` — `field:read`, `task:create`, `regulatoryReport:read`. The four
actions are `read`, `create`, `update` and `delete`.

- A **`Role`** is a named set of permissions.
- An **`AccessAssignment`** gives a `User` a `Role` on one `Farm`, for a period.
- Every operation of the REST API declares the permission it needs
  (`x-agfoda-permission` in the [OpenAPI description](https://datamodel.agrifooddata.org/v1/openapi.yaml)),
  evaluated **on the farm concerned**.

Permissions are the *person's* rights, held in the data model. They are
evaluated in addition to, and never instead of, the identity provider's
policies.

## How they combine

```
   what the person may do          what the token's scopes grant
   (Role + AccessAssignment        (consented by the person,
    on the farm, plus IdP          limited by the app's manifest)
    policies)
              \                          /
               \                        /
                └──── intersection ─────┘
                           │
                           ▼
              what the app may do, right now
```

A service that follows this rule gives an app **no more than the person has**,
and **no more than the scope says**. Two consequences:

- **A broad role does not widen an app.** A farm manager's token exchanged for a
  read-only scope can only read.
- **A broad scope does not widen a person.** An adviser with read access who
  uses an app with a write scope still cannot write.

How a scope translates into permissions is the service's decision, and a
conservative translation works well. For example, a scope for reading a farm's
land and cultivation data could stand for the permissions `field:read`,
`region:read`, `cultivationPeriod:read` and `activity:read` — and for nothing
else.

Keep **administrative and destructive** actions out of app scopes altogether:
a deletion in particular is propagated to every synchronising client as an
audit-log entry, which makes it the most consequential operation a third-party
app could be given.
Refuse app tokens on endpoints that concern the person's own account.

## Where each decision is made

| Decision | Made by | Based on |
|----------|---------|----------|
| Is this person who they say? | identity provider | credentials, MFA |
| May this app ask for this scope? | registry review, then the identity provider | the approved manifest, the lock file |
| Does the person agree? | the person, at the consent screen | the scope's consent text |
| Is the token genuine and for me? | the API | signature, `iss`, `aud`, `exp`, scopes |
| May this person do this on this farm? | the API, from the data model | `Role`, `AccessAssignment`, plus provider policies |
| May this app do it? | the API | the intersection above; optionally `azp` |

## See it in action

- [Signing in apps](./app-authentication.md)
- [API Reference · Authentication](../../api-reference/iam.md#claims-an-api-reads)
- [Conventions](../../api-reference/conventions.md#permissions)
