# Architecture

UI → Router → MM/FI services → CDS → OData → S/4HANA

- UI: Next.js app (`/chat`, `/dashboard`)
- Router: `cap/srv/router-service.js`
- Services: CAP MM/FI service handlers
- Data model: CDS entities and projections
- Integration target: S/4HANA / S/4HANA Cloud
