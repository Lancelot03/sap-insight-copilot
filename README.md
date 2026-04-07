# SAP Insight Copilot — Sprint 1 Bootstrap

Production-ready monorepo bootstrap for SAP Insight Copilot with:

- SAP CAP backend
- Next.js frontend
- TypeScript
- Tailwind CSS
- SAP BTP deployment descriptor (`mta.yaml`)

## Repository Structure

```text
.
├── app/                    # Next.js (TypeScript + Tailwind)
│   ├── src/app
│   └── src/lib
├── cap/                    # SAP CAP service
│   ├── db
│   └── srv
├── mta.yaml                # SAP BTP MTA deployment descriptor
├── package.json            # Workspace and orchestration scripts
└── .env.example            # Shared local environment defaults
```

## Prerequisites

- Node.js 20+
- npm 10+

## Environment Setup

1. Copy environment templates:

```bash
cp .env.example .env
cp cap/.env.example cap/.env
cp app/.env.local.example app/.env.local
```

2. Install dependencies from repository root:

```bash
npm install
```

## Run Locally

Start CAP and Next.js together:

```bash
npm run dev
```

- CAP API: `http://localhost:4004/odata/v4/insight/`
- Frontend: `http://localhost:3000`

- Demo chat (no API required): [Open local demo](http://localhost:3000/demo)

## Useful Commands

```bash
npm run dev:cap    # CAP only
npm run dev:app    # Next.js only
npm run build      # Build CAP + Next.js
npm run start      # Start production servers
```

## CAP Endpoints

- `GET /odata/v4/insight/Insights`
- `GET /odata/v4/insight/HealthCheck`

## SAP BTP Deployment Readiness

This repo includes an `mta.yaml` with two deployable modules:

1. `sap-insight-copilot-srv` (CAP service)
2. `sap-insight-copilot-web` (Next.js app)

Build MTAR (requires Cloud MTA Build Tool):

```bash
mbt build -t .mta_archives
```

Deploy:

```bash
cf deploy .mta_archives/sap-insight-copilot_1.0.0.mtar
```

## Notes

- CAP persists data with local SQLite for development.
- Frontend calls CAP via `NEXT_PUBLIC_CAP_BASE_URL`.

## Sprint 2 (MM Module) APIs

MM OData service path: `/odata/v4/mm/`

Functions:

- `getPOCount(material)`
- `getMaterialSpend(material)`
- `getVendorSpend(vendor)`
- `getPlantPO(plant)`
- `getGeneralPO()`

Run MM unit tests:

```bash
node --test cap/tests/mm.test.js
```

## Sprint 3 (FI Module) APIs

FI OData service path: `/odata/v4/fi/`

Functions:

- `getMonthlyRevenue()`
- `getVendorDue(vendor)`
- `getCustomerDue(customer)`
- `getProfitCenterRevenue(pc)`

Run FI unit tests:

```bash
node --test cap/tests/fi.test.js
```

## Extended Project Structure

This repository now includes additional enterprise-ready scaffolding:

- `.github/workflows` (CI/Test/Deploy templates)
- `.github/ISSUE_TEMPLATE` + PR template
- `app/src/app/settings` page
- `app/src/components` wrappers (`ChatWindow`, `MessageBubble`, `KPIWidget`, `Navbar`, `Sidebar`)
- `app/src/services` (`api.ts`, `auth.ts`)
- `app/src/lib` (`constants.ts`, `helpers.ts`)
- `cap/db/sample-data.csv`
- `cap/srv/router-service.js`, `cap/srv/auth-service.js`
- `cap/tests/router.test.js`
- `middleware/role-check.ts`, `middleware/validation.ts`
- `utils/query-parser.ts`, `utils/logger.ts`, `utils/formatter.ts`
- `docs/architecture.md`, `docs/api-contracts.md`, `docs/deployment-guide.md`, `docs/roadmap.md`
- `scripts/deploy-btp.sh`, `scripts/seed-local.sh`
