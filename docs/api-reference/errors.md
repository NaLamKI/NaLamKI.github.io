---
sidebar_position: 4
---

# Errors

Every error is a **problem detail** ([RFC 9457](https://www.rfc-editor.org/rfc/rfc9457))
with the media type `application/problem+json`. The `type` is a stable address
under `https://datamodel.agrifooddata.org/v1/problems/`, so a client can branch
on it rather than on prose.

An example — the wording of `detail` and `message` is illustrative:

```http
HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{
  "type": "https://datamodel.agrifooddata.org/v1/problems/rule-violation",
  "title": "An integrity rule is violated",
  "status": 422,
  "detail": "The record violates a rule of the data model.",
  "violations": [
    {
      "rule": "V01",
      "attribute": "endsAt",
      "message": "endsAt must not be earlier than startsAt"
    }
  ]
}
```

| Member | Meaning |
|--------|---------|
| `type` | one of the problem types below, or `about:blank` |
| `title`, `status`, `detail`, `instance` | as in RFC 9457 |
| `violations` | the rules and attributes concerned: `rule` (`V01` … `V16`), `attribute`, `message` |

## Problem types

| Type | Status | Meaning | What to do |
|------|--------|---------|------------|
| [`invalid-record`](https://datamodel.agrifooddata.org/v1/problems/invalid-record.html) | `422` | The record does not conform to its schema | Fix the record; `violations` name the attributes |
| [`rule-violation`](https://datamodel.agrifooddata.org/v1/problems/rule-violation.html) | `422` | An [integrity rule](../concepts/data-model/rules-and-states.md#the-integrity-rules) (V01 – V16) or a condition of clause 8 is violated | Fix the record; `violations` name the rule |
| [`reason-required`](https://datamodel.agrifooddata.org/v1/problems/reason-required.html) | `422` | A correction of reported documentation needs a reason | Resend with `Change-Reason` |
| [`invalid-transition`](https://datamodel.agrifooddata.org/v1/problems/invalid-transition.html) | `409` | The status change is not in the [state model](../concepts/data-model/rules-and-states.md#state-models) | Choose a permitted transition |
| [`immutable-record`](https://datamodel.agrifooddata.org/v1/problems/immutable-record.html) | `409` | The record can no longer be changed — a submitted regulatory report (V15) | Create a new record that supersedes it |
| [`duplicate-key`](https://datamodel.agrifooddata.org/v1/problems/duplicate-key.html) | `409` | A [business key](../concepts/data-model/entities.md#keys-that-identify-a-record-in-the-real-world) is already taken | Use another value, or read the existing record |
| [`dependent-records`](https://datamodel.agrifooddata.org/v1/problems/dependent-records.html) | `409` | Other records depend on this one, so it cannot be deleted | Withdraw it instead, or remove the dependents first |

## Status codes

| Status | When | Notes |
|--------|------|-------|
| `400` | the request is malformed — for example a bad query parameter or bounding box | |
| `401` | not authenticated: no token, an invalid one, an expired one | a bearer-token resource server answers with `WWW-Authenticate: Bearer` ([RFC 6750](https://www.rfc-editor.org/rfc/rfc6750#section-3)); refresh the token or sign in again |
| `403` | authenticated, but not authorised **for this farm and permission** | the permission needed is `x-agfoda-permission` of the operation; see [Permissions](./conventions.md#permissions) |
| `404` | no such record | |
| `409` | `invalid-transition`, `immutable-record`, `duplicate-key`, `dependent-records` | the request conflicts with the state of the data |
| `412` | the record has changed since the version named in `If-Match`, **or** it exists although `If-None-Match: *` was sent | read the current record |
| `422` | `invalid-record`, `rule-violation`, `reason-required` | the request is well-formed but not acceptable |

Errors of the *token* — `401` and `403` — are reported in the same shape. For
a token that lacks a scope, the answer is `403`; for no token or a bad one,
`401`. The identity provider's own errors (`invalid_grant`, `access_denied`,
`consent_required` …) are not API errors; see
[Authentication](./iam.md#errors-from-the-token-endpoint).

## A habit worth having

Branch on `type`, show `detail` and `violations[].message` to the person, and
never retry a `409` or `422` unchanged — the request will fail the same way.
Retry `5xx` and network failures later, with the same body and the same
`id`: `PUT` with `If-None-Match: *` makes the retry safe.

## See it in action

- [Rules & state models](../concepts/data-model/rules-and-states.md) — the rules behind the violations
- [Synchronization](./synchronization.md#writing-changes) — what a client does with each answer
