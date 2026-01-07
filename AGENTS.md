# AGENTS GUIDE

## Project Overview
- **Hotel Management Service** is an Amplication-generated monorepo featuring a NestJS GraphQL/REST API (server) and a React + React-Admin console (admin). It demonstrates Node.js 18, Prisma 5, PostgreSQL 12, GraphQL/Apollo, React 18, React-Admin 5, Vite, Docker/Docker Compose, Jest, ESLint/Prettier, and Sass.
- Intended as both a reference and a starter kit. Default admin credentials are `admin / admin` (development only).
- API endpoints are exposed via `/api` (Swagger) and `/graphql`; the admin UI consumes the same service layer via GraphQL.

## Critical Rules
1. **Never edit files inside any `base/` folder** (e.g., `apps/hotel-management-service-server/src/**/base`). Amplication regenerates these—extend classes in sibling files instead.
2. **Keep GraphQL, REST, and Admin models in sync.** Schema or Prisma changes demand updates to resolvers/controllers plus the React-Admin resource definitions.
3. **Run Prisma workflows whenever the schema changes**: `npm run prisma:generate` → `npm run db:migrate-save -- --name '<change>'` → `npm run db:migrate-up` → `npm run seed` or `npm run db:init`.
4. **Validate env alignment between apps and Docker**—`VITE_REACT_APP_SERVER_URL` must point to the server’s `PORT`/host, and DB credentials must match Postgres containers/local DB.
5. **Custom logic lives outside generated scaffolds.** Add services, resolvers, or components alongside Amplication outputs rather than modifying generated code directly.

## Repository Structure
```
awesome-overcut/
├── apps/
│   ├── hotel-management-service-server/    # NestJS API + Prisma client
│   │   ├── src/                            # Modules per entity; base/ wrappers
│   │   ├── prisma/schema.prisma            # Data model & migrations
│   │   ├── scripts/                        # Seeds + helpers
│   │   ├── Dockerfile, docker-compose*.yml # Runtime & orchestration
│   │   └── .env                            # Server defaults
│   └── hotel-management-service-admin/     # React-Admin UI (Vite)
│       ├── src/                            # Resource folders (Hotel, Room, ...)
│       ├── Dockerfile                      # Multi-stage build → Nginx
│       └── .env                            # Client defaults
├── migration/                              # Architecture & migration analysis
├── LICENSE
├── README.md                               # High-level usage guide
└── AGENTS.md                               # (this file)
```
**Naming conventions:** PascalCase for TypeScript classes/components, kebab-case directories, `.module.ts` for Nest modules, `.service.ts`/`.resolver.ts` wrappers, React-Admin resources follow `<Entity><List|Create|Edit|Show|Title>.tsx`.

## Development Workflow
1. **Prerequisites:** Node ≥16 (tested on 18), npm ≥8, Docker & Docker Compose for reproducible setups.
2. **Install dependencies:**
   ```bash
   cd apps/hotel-management-service-server && npm install
   cd ../hotel-management-service-admin && npm install
   ```
3. **Local DB (choice):** start PostgreSQL via `npm run docker:dev` inside the server app, or supply your own Postgres that honors `.env` values.
4. **Generate Prisma client:** `npm run prisma:generate` inside the server app.
5. **Apply migrations & seed:** `npm run db:init` (wraps migrate + seed). Required before first run and after schema updates.
6. **Start the API:** `npm run start` (or `start:watch` for HMR). Access at `http://localhost:3000` unless `PORT` is changed.
7. **Start the Admin UI:** in another terminal `cd apps/hotel-management-service-admin && npm run start` → served on `http://localhost:3001` by default.
8. **Testing:** execute `npm run test` under the server for Jest suites. The admin relies on `npm run lint` and `npm run type-check` for quality gates.

## Environment & Configuration
### Server (`apps/hotel-management-service-server/.env`)
| Variable | Description & When to Change |
| --- | --- |
| `PORT` | API HTTP port (default `3000`). Change when avoiding conflicts or deploying behind a proxy. |
| `DB_URL` | Full Prisma connection string (`postgres://user:pass@host:port/db`). Overrides individual DB_* vars when provided. |
| `DB_HOST` (implicit via `DB_URL`) | Use `docker-compose.dev.yml` hostnames when running Compose. |
| `DB_NAME` | Postgres database name. Keep consistent with migrations/seeding scripts. |
| `DB_USER` / `DB_PASSWORD` | Credentials for Postgres. Update both `.env` and Compose overrides together. |
| `DB_PORT` | Database port (default `5432`). |
| `BCRYPT_SALT` | Cost factor for password hashing; bump cautiously to avoid slow sign-ins. |
| `COMPOSE_PROJECT_NAME` | Namespaces Compose resources; change only when running multiple stacks simultaneously. |

### Admin (`apps/hotel-management-service-admin/.env`)
| Variable | Description & When to Change |
| --- | --- |
| `PORT` | Vite dev server port (default `3001`). Adjust if occupied. |
| `VITE_REACT_APP_SERVER_URL` | Base URL for GraphQL/REST requests. Must match the server’s public address (e.g., `http://api.internal:3000`). |

> **Default credentials:** `admin` / `admin` for local development—they are seeded via `npm run db:init` and should be replaced in production.

## Code & Quality Patterns
- **NestJS server:** Each entity module (e.g., `src/hotel/`) imports Amplication base modules (`hotel.module.base`) and exposes thin wrappers (`hotel.module.ts`, `hotel.service.ts`, `hotel.resolver.ts`, `hotel.controller.ts`). Custom logic belongs in these wrappers or additional services/providers registered via the module.
- **Prisma-first data layer:** `prisma/schema.prisma` defines models consumed by both REST and GraphQL layers. Always regenerate the Prisma client and rerun migrations after edits.
- **React-Admin UI:** Resource folders (`src/hotel/HotelList.tsx`, etc.) follow the React-Admin pattern with list/create/edit/show components plus shared pagination/fields.
- **Testing:** Server tests live under `apps/hotel-management-service-server/src/tests/` (see `health/health.service.spec.ts`). Use Jest + `jest-mock-extended` for service contracts. Admin quality relies on linting/type-check rather than runtime tests.
- **Style & lint:** ESLint + Prettier configs per app. Run `npm run lint` / `npm run format` in the admin, `npm run test` + TypeScript build in the server before submitting PRs.

## Common Tasks
### Server scripts (run inside `apps/hotel-management-service-server`)
- `npm run start` – Launch API with current `.env` values.
- `npm run start:watch` / `start:debug` – Hot-reload or debug-friendly modes.
- `npm run build` – Compile TypeScript to `dist/` for production packaging.
- `npm run test` – Execute Jest suites.
- `npm run prisma:generate` – Rebuild Prisma client after schema edits.
- `npm run db:migrate-save` – Create a new migration (defaults to dev flow).
- `npm run db:migrate-up` – Deploy migrations to the target database.
- `npm run db:clean` – Reset DB (drops and reapplies migrations).
- `npm run db:init` – One-shot migrate + seed (used for local bootstrap).
- `npm run seed` – Rerun seeding only.
- `npm run docker:dev` – Bring up the lightweight Postgres defined in `docker-compose.dev.yml`.
- `npm run compose:up` / `compose:down` – Full stack (API + Postgres + migration worker) start/stop.
- `npm run package:container` – Build the production Docker image defined in the server `Dockerfile`.

### Admin scripts (run inside `apps/hotel-management-service-admin`)
- `npm run start` – Vite dev server with fast refresh.
- `npm run build` – Production bundle (emits to `dist/`).
- `npm run serve` – Preview the production build locally.
- `npm run lint` – ESLint with auto-fix; keep React/TypeScript patterns consistent.
- `npm run type-check` – Ensure type safety with `tsc --noEmit`.
- `npm run format` – Apply Prettier formatting to `src`.
- `npm run package:container` – Build the admin Docker image (multi-stage → Nginx).

## Docker & Deployment
- **Server Docker Compose (`apps/hotel-management-service-server/docker-compose.yml`):** spins up API, Postgres, and a migration job. Use `npm run compose:up` to build/start in detached mode, then reach the API on `http://localhost:3000` and Postgres on the configured port. Tear down (and volumes) via `npm run compose:down`.
- **Postgres-only helper (`docker-compose.dev.yml`):** `npm run docker:dev` creates a quick DB container for host-based development.
- **Server Dockerfile:** Multi-stage Node build that compiles the Nest app and runs it in a slim runtime image; `npm run package:container` builds it.
- **Admin Dockerfile:** Node builder produces the Vite `dist/`, then Nginx serves static assets. Configure upstream API URLs via environment or baked-in config before packaging.
- **Deployment checklist:** ensure migrations are applied (`db:migrate-up`), environment files align with production secrets, and admin bundles point to the deployed API URL.

## Reference Examples
- `apps/hotel-management-service-admin/src/hotel/HotelList.tsx` – canonical React-Admin list implementation using shared pagination/field components.
- `apps/hotel-management-service-server/src/hotel/hotel.module.ts` plus `base/` counterparts – illustrates wrapping Amplication base logic for custom services/controllers.
- `apps/hotel-management-service-server/docker-compose.yml` – end-to-end stack definition (API + DB + migration worker).
- `apps/hotel-management-service-server/src/tests/health/health.service.spec.ts` – example Jest test using `jest-mock-extended`.
- `apps/hotel-management-service-admin/Dockerfile` – multi-stage build culminating in Nginx static hosting.
- `migration/migration-architecture-analysis.md` – detailed architectural context and migration strategy.

## Additional Resources
- [README.md](./README.md) – high-level usage, prerequisites, and onboarding instructions.
- [migration/migration-architecture-analysis.md](./migration/migration-architecture-analysis.md) – architectural decisions, risks, and migration notes.
