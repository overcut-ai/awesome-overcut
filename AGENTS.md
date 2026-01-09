# 🤖 AGENTS GUIDE FOR `awesome-overcut`

This document equips automation agents with the minimal context needed to work safely and efficiently inside the `overcut-ai/awesome-overcut` monorepo. Every statement below is grounded in repository files (see references in each section).

---

## 1. Project Overview
- **Purpose**: End-to-end hotel management system generated with Amplication, combining a NestJS API and a React-Admin dashboard (see [README.md](README.md)).
- **Apps**:
  - `apps/hotel-management-service-server` – NestJS 10 + Prisma backend exposing REST (`/api`) and GraphQL (`/graphql`) endpoints, including Docker Compose assets for PostgreSQL (see `docker-compose.yml`).
  - `apps/hotel-management-service-admin` – React 18 + React-Admin 5 UI bootstrapped with Vite, consuming the GraphQL API via Apollo client.
- **Core stack**: Node.js ≥16 (tested on 18), npm, NestJS, Prisma, PostgreSQL, React, React-Admin, Apollo Client, Docker/Compose, Jest, ESLint, Prettier, Sass (root [README.md](README.md) & [migration/migration-architecture-analysis.md](migration/migration-architecture-analysis.md)).

---

## 2. Repository Structure
```
awesome-overcut/
├── apps/
│   ├── hotel-management-service-server/   # NestJS API + Prisma (see local README)
│   └── hotel-management-service-admin/    # React-Admin UI (see local README)
├── migration/
│   └── migration-architecture-analysis.md # Deep-dive documentation
├── README.md
├── LICENSE
└── AGENTS.md (this file)
```
- **Naming conventions**: Backend feature folders (e.g., `src/hotel/`) pair custom files with generated `base/` counterparts (`HotelModule` vs `base/hotel.module.base.ts`). Frontend resources mirror domain entities (`src/customer/CustomerList.tsx`).

---

## 3. Development Guidelines
### Prerequisites & Environment
- Node.js ≥16 (repo validated on Node 18) and npm ≥8 (see [README.md](README.md)).
- Docker + Docker Compose recommended for parity with production defaults.
- Each app has its own `.env`; copy the provided templates before editing secrets:
  - Server variables such as `BCRYPT_SALT`, `DB_URL`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET_KEY`, `JWT_EXPIRATION`, `PORT`, etc. are documented in `apps/hotel-management-service-server/README.md`.
  - Admin UI uses `PORT` (defaults to 3001) and `VITE_REACT_APP_SERVER_URL`/`REACT_APP_SERVER_URL` pointing to the backend (see `apps/hotel-management-service-admin/README.md`).

### Installing Dependencies
```bash
cd apps/hotel-management-service-server && npm install
cd ../hotel-management-service-admin && npm install
```
*(Root [README.md](README.md), Installation section)*

### Running via Docker Compose (full stack)
```bash
cd apps/hotel-management-service-server
cp .env .env.local  # optional override
npm run compose:up  # starts API, migration job, PostgreSQL per docker-compose.yml
npm run compose:down
```
- Server accessible at `http://localhost:3000` (GraphQL `/graphql`, Swagger `/api`). Start the admin app separately on port `3001`.

### Running Apps Individually
1. Start PostgreSQL (Docker or local) and configure `.env` files.
2. Generate Prisma client: `npm run prisma:generate` (server).
3. Apply migrations & seed: `npm run db:init` (server).
4. Start NestJS API: `npm run start`.
5. Start Admin UI: `npm run start` from `apps/hotel-management-service-admin`.

---

## 4. Backend Patterns & Tasks (`apps/hotel-management-service-server`)
- **Module inheritance**: Custom modules import generated bases. Example: `src/hotel/hotel.module.ts` imports `HotelModuleBase`, while `hotel.service.ts` extends `HotelServiceBase` via `PrismaService`. Never modify `src/hotel/base/*`; add overrides in sibling files.
- **API surfaces**: REST controllers and GraphQL resolvers are generated per domain under each feature folder (see `src/hotel/`, `src/customer/`, etc.).
- **Prisma**: Schema lives in `prisma/schema.prisma`; seed scripts in `scripts/seed.ts`. Regenerate clients with `npm run prisma:generate` after schema changes.
- **Docker orchestration**: `docker-compose.yml` builds the API, runs `npm run db:init` via the `migrate` service, and provisions a `postgres:12` container with health checks.
- **Scripts** (see [README.md](README.md), "Server scripts"):
  - `npm run start`, `npm run start:watch`, `npm run build`, `npm run docker:dev`, `npm run compose:up`, `npm run compose:down`, `npm run db:init`, `npm run prisma:generate`, `npm run package:container`.
- **Testing**: Jest configuration lives in the server app; current coverage includes `src/prisma.util.spec.ts`. Run `npm run test` before submitting backend changes.

---

## 5. Frontend Patterns & Tasks (`apps/hotel-management-service-admin`)
- **React-Admin resources**: Each entity (e.g., `src/customer/CustomerList.tsx`) exports `List`, `Create`, `Edit`, and `Show` components wired into `App.tsx`. Follow existing file names and keep pagination via `src/Components/Pagination` when duplicating patterns.
- **Data provider**: `src/data-provider/graphqlDataProvider.ts` configures Apollo Client and `ra-data-graphql-amplication`, attaching bearer tokens from LocalStorage.
- **Auth provider**: `src/auth-provider/ra-auth-jwt.ts` issues the `login` mutation and stores `Bearer` tokens under `CREDENTIALS_LOCAL_STORAGE_ITEM`.
- **Scripts** (see root [README.md](README.md), "Admin UI scripts" & `apps/.../README.md`): `npm run start`, `npm run build`, `npm run serve`, `npm run lint`, `npm run type-check`, `npm run package:container`.
- **Theming & shared code**: Keep shared UI under `src/theme`, `src/Components`, and constants under `src/constants`. When adding routes or auth checks, reuse these utilities to maintain consistency.

---

## 6. Quality & Testing Standards
- **Backend**: Run `npm run test` and ensure Prisma migrations succeed (`npm run db:init`). Extend Jest coverage beyond `src/prisma.util.spec.ts` when touching utility layers.
- **Frontend**: Execute `npm run lint` and `npm run type-check`. No automated UI tests exist, so rely on Vite preview (`npm run serve`) for manual verification.
- **Formatting & linting**: Respect ESLint/Prettier defaults baked into each app's configuration.

---

## 7. Critical Rules & Best Practices
1. **Do not edit generated `base/` files** (e.g., `apps/hotel-management-service-server/src/hotel/base/*`). Add custom logic in the sibling non-base files to avoid regeneration conflicts.
2. **Protect secrets**: `.env` files hold plaintext credentials. Treat them as local-only and never check in production secrets. Consider integrating a vault via `SecretsManagerModule` if automating deployments.
3. **Keep REST & GraphQL in sync**: Service methods back both controllers and resolvers; update DTOs and resolvers together when changing schemas.
4. **Validate migrations**: Run `npm run prisma:generate` and `npm run db:init` after any schema change to catch runtime issues before merging.
5. **Frontend-backend contract**: Admin authentication (`login` mutation) must exist on the server before UI changes that rely on it. Coordinate schema updates with both apps.

---

## 8. Common Agent Tasks
| Task | Steps & Commands |
| --- | --- |
| Start full stack locally | `cd apps/hotel-management-service-server && npm run compose:up` → start Admin UI via `npm run start` in the admin app. |
| Apply Prisma migration | `cd apps/hotel-management-service-server`, edit `prisma/schema.prisma`, run `npx prisma migrate dev --name <migration_name>` (see [README.md](README.md)). |
| Seed database | `npm run db:init` (runs migrations + seeds from `scripts/seed.ts`). |
| Run backend unit tests | `cd apps/hotel-management-service-server && npm run test`. |
| Build admin for production | `cd apps/hotel-management-service-admin && npm run build` (artifacts in `dist/`). |
| Add a new React-Admin resource | Duplicate patterns under `apps/hotel-management-service-admin/src/<entity>/`, referencing `src/customer/CustomerList.tsx`, update `App.tsx` registrations, and ensure GraphQL schema exposes the entity. |

---

## 9. Reference Examples
- **Simple UI resource**: `apps/hotel-management-service-admin/src/customer/CustomerList.tsx` – demonstrates standard list pagination, fields, and bulk-action configuration.
- **Full NestJS feature module**: `apps/hotel-management-service-server/src/hotel/` – shows module/service/controller/resolver files extending `base/` scaffolding with Prisma injection.
- **Configuration & orchestration**: `apps/hotel-management-service-server/docker-compose.yml` – canonical example for running API + migrations + PostgreSQL.
- **Backend test**: `apps/hotel-management-service-server/src/prisma.util.spec.ts` – illustrates Jest usage for utility functions.
- **Documentation references**: `README.md`, `apps/hotel-management-service-server/README.md`, `apps/hotel-management-service-admin/README.md`, and `migration/migration-architecture-analysis.md`.

---

## 10. Additional Resources
- [Root README](README.md) – prerequisites, scripts, and Docker instructions.
- [Server README](apps/hotel-management-service-server/README.md) – environment table and script usage.
- [Admin README](apps/hotel-management-service-admin/README.md) – env vars and start/build commands.
- [Migration Architecture Analysis](migration/migration-architecture-analysis.md) – deep architectural context for both apps.

Use this guide as the first stop for automated workflows; follow linked resources for exhaustive detail.
