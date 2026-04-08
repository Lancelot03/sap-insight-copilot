# Architecture

UI → CAP Router → MM/FI Services → CDS OData → S/4HANA Cloud

- UI: Next.js app (`/chat`, `/dashboard`, `/settings`)
- CAP Router: `cap/srv/router-service.js`
- Domain Services: `MMService`, `FIService`, `JouleService`
- Data Contract: CDS-based OData services
- ERP Target: S/4HANA Cloud (future integration)
SAP Insight Copilot uses a CAP backend, Next.js frontend, and Joule intent routing layer.
