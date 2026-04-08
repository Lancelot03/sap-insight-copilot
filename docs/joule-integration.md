# SAP Joule Integration

Joule → BTP CAP → OData → S/4

1. Joule sends user query to CAP `JouleService`.
2. `router-service.js` maps text to backend action.
3. MM/FI handlers execute and return structured payload.
4. Response is returned to Joule/client through OData.
