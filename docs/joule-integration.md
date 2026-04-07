# SAP Joule Integration Layer

Joule → BTP CAP Service → OData → CDS → S/4

## Flow
1. Joule prompt enters `JouleService.askJoule`.
2. Router resolves intent (`cap/srv/router-service.js`).
3. MM/FI handlers execute role-gated business logic.
4. CAP returns OData response to Joule/client.

## Security
- `@requires:'authenticated-user'` on Joule service.
- Role checks:
  - MM: `MM_VIEWER`, `MM_ADMIN`
  - FI: `FI_VIEWER`, `FI_ADMIN`
