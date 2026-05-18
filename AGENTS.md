# AGENTS.md

## Project Overview
`awesome-overcut` is a full-stack monorepo for a hotel-management system generated with Amplication and maintained as a reference/template project.

It contains two standalone npm applications:
- **Server**: NestJS API with GraphQL, Swagger, Prisma, and PostgreSQL integration.
- **Admin**: React + React-Admin application (Vite-based) for CRUD management of core entities.

Primary business domains used consistently across backend and frontend:
- `hotel`
- `room`
- `reservation`
- `customer`

## Repository Structure

```text
awesome-overcut/
├── README.md
├── LICENSE
├── overcut-loading.gif
├── overcut-logo.png
├── migration/
│   └── migration-architecture-analysis.md
├── apps/
│   ├── hotel-management-service-server/
│   │   ├── README.md
│   │   ├── package.json
│   │   ├── prisma/schema.prisma
│   │   ├── scripts/seed.ts
│   │   └── src/
│   │       ├── app.module.ts
│   │       ├── main.ts
│   │       ├── filters/
│   │       ├── prisma/
│   │       ├── hotel/
│   │       ├── room/
│   │       ├── reservation/
│   │       └── customer/
│   └── hotel-management-service-admin/
│       ├── README.md
│       ├── package.json
│       └── src/
│           ├── App.tsx
│           ├── data-provider/
│           ├── auth-provider/
│           ├── hotel/
│           ├── room/
│           ├── reservation/
│           └── customer/
└── AGENTS.md
```

Notes:
- This repository does **not** use a root workspace package manager config for scripts; each app is managed independently.
- Operational instructions are primarily in root `README.md` and each app’s own `README.md`.

## Development Guidelines

### General
- Run commands from the specific app directory (`apps/hotel-management-service-server` or `apps/hotel-management-service-admin`).
- Keep entity naming and folder boundaries aligned across backend and frontend (`hotel`, `room`, `reservation`, `customer`).
- Prefer small, domain-scoped changes over cross-cutting edits.

### Backend (Server) Guidelines
- Use NestJS module/domain conventions already present in `src/`.
- Keep schema and generated client flow in sync:
  1. Update `prisma/schema.prisma`
  2. Run `npm run prisma:generate`
  3. Apply migration/init flow as needed (`npm run db:init` or Prisma migration commands)
- Reuse global infrastructure in `main.ts` (validation and exception handling) instead of introducing parallel mechanisms.

### Frontend (Admin) Guidelines
- Register/maintain resources centrally through `src/App.tsx`.
- Follow React-Admin CRUD file patterns within each domain folder.
- Keep API integration routed through existing `data-provider` and auth through `auth-provider`.

## Code Patterns

### Backend Patterns
- **Application composition**: domain modules aggregated in `src/app.module.ts`.
- **Bootstrap**: `src/main.ts` configures global validation and exception filter behavior.
- **API surfaces**: GraphQL endpoint and Swagger support are enabled from server bootstrap/config; REST routes are served under the global `/api` prefix.
- **Data modeling**: Prisma schema is source of truth in `prisma/schema.prisma`; seed logic in `scripts/seed.ts`.

### Frontend Patterns
- **Resource-per-entity** pattern in `src/App.tsx` with domain-specific components.
- **Domain folders** for CRUD screens under `src/hotel`, `src/room`, `src/reservation`, `src/customer`.
- **Provider-based architecture** in `src/data-provider` and `src/auth-provider`.

## Quality Standards

### Required checks before merging changes
- **Server** (`apps/hotel-management-service-server`):
  - `npm run build`
  - `npm run test`
- **Admin** (`apps/hotel-management-service-admin`):
  - `npm run type-check`
  - `npm run lint`
  - `npm run build`

### Documentation quality
- Keep paths and commands accurate to real files/scripts.
- When adding docs, prefer command examples that can be copied as-is.
- Update relevant README(s) when behavior, setup, or scripts change.

## Critical Rules
- Do not assume root-level scripts exist; use app-local `package.json` scripts.
- Do not rename core domain directories (`hotel`, `room`, `reservation`, `customer`) without coordinated full-stack updates.
- For data-model changes, treat Prisma schema updates and generated artifacts/migrations as part of one change unit.
- Keep local development defaults documented:
  - Server base URL: `http://localhost:3000`
  - GraphQL: `http://localhost:3000/graphql`
  - Swagger / REST base path: `http://localhost:3000/api`
  - Admin: `http://localhost:3001`
- Avoid introducing parallel infrastructure when existing global patterns already exist (validation, error filtering, providers).

## Common Tasks

### Install dependencies
```bash
cd apps/hotel-management-service-server && npm install
cd ../hotel-management-service-admin && npm install
```

### Run server locally
```bash
cd apps/hotel-management-service-server
npm run prisma:generate
npm run db:init
npm run start
```

### Run admin locally
```bash
cd apps/hotel-management-service-admin
npm run start
```

### Run server with Docker Compose
```bash
cd apps/hotel-management-service-server
npm run compose:up
# stop later
npm run compose:down
```

### Backend testing
```bash
cd apps/hotel-management-service-server
npm run test
```

### Frontend quality checks
```bash
cd apps/hotel-management-service-admin
npm run type-check
npm run lint
npm run build
```

## Reference Examples
- Monorepo operational guide: `README.md`
- Backend app guide: `apps/hotel-management-service-server/README.md`
- Frontend app guide: `apps/hotel-management-service-admin/README.md`
- Backend bootstrap: `apps/hotel-management-service-server/src/main.ts`
- Backend module aggregation: `apps/hotel-management-service-server/src/app.module.ts`
- Prisma data model: `apps/hotel-management-service-server/prisma/schema.prisma`
- Seed data script: `apps/hotel-management-service-server/scripts/seed.ts`
- Frontend resource registration: `apps/hotel-management-service-admin/src/App.tsx`

## Additional Resources
- Amplication docs: <https://docs.amplication.com/guides/getting-started>
- NestJS docs: <https://docs.nestjs.com>
- Prisma docs: <https://www.prisma.io/docs>
- React-Admin docs: <https://marmelab.com/react-admin/>
- Vite docs: <https://vitejs.dev/guide/>
