# SAP Joule Integration Layer

This document describes how SAP Insight Copilot connects SAP Joule prompts to CAP services in a secure, scalable, and BTP-ready way.

## Overview

`JouleService` provides an action endpoint:

- `POST /odata/v4/joule/askJoule`

It accepts a natural language `question`, detects MM/FI intent, enforces role access, routes to CAP handlers, and returns a structured response.

## Request / Response Contract

### Request

```json
{
  "question": "How many POs for material MAT-1000?"
}
```

### Response

```json
{
  "intent": "getPOCount",
  "authorized": true,
  "payload": "{\"material\":\"MAT-1000\",\"poCount\":2}"
}
```

## Intent Routing

The Joule integration layer routes to module services:

### MM intents
- `getPOCount`
- `getMaterialSpend`
- `getVendorSpend`
- `getPlantPO`
- `getGeneralPO`

### FI intents
- `getMonthlyRevenue`
- `getVendorDue`
- `getCustomerDue`
- `getProfitCenterRevenue`

## Security Model (SAP BTP)

- Service-level protection via CAP annotation (`@requires:'authenticated-user'`).
- Runtime role enforcement per intent in `srv/joule-service.js`:
  - MM intents require `MM_VIEWER` or `MM_ADMIN`
  - FI intents require `FI_VIEWER` or `FI_ADMIN`
- Shared middleware helpers in `middleware/auth.ts` for authentication and role checks.

## Scalability Guidelines

1. Keep intent detection stateless (pure function).
2. Route by action name to avoid hard-coded endpoint sprawl.
3. Move from in-memory sample payloads to database-backed `SELECT`/`READ` as data volume grows.
4. For high throughput, place Joule action behind destination + approuter and enable horizontal scaling on CF.

## Deployability on SAP BTP

- CAP service modules are deployable through existing `mta.yaml`.
- Joule endpoint is an OData action and can be exposed via approuter destinations.
- XSUAA role collections should map to MM/FI roles used above.

## Operational Recommendations

- Add application logging (request ID, intent, execution time, status).
- Add rate limiting for Joule action endpoint.
- Add audit logging for privileged FI queries.
