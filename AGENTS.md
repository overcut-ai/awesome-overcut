# 🤖 AGENTS Guide: Hotel Management Service Monorepo

## 🚀 Project Overview
- **Purpose:** Full-stack hotel management platform generated with [Amplication](https://amplication.com), combining a NestJS GraphQL API and a React + React-Admin administrative UI.
- **Tech stack:** NestJS 10, GraphQL, Prisma 5, PostgreSQL, React 18, React-Admin 5, Vite, TypeScript, Jest, Docker & Docker Compose.
- **Monorepo model:** `apps/` houses two independent npm projects (`hotel-management-service-server` and `hotel-management-service-admin`) plus shared documentation at the root (`README.md`, `LICENSE`, brand assets) and architectural notes under `migration/`.

## 🗂️ Repository Structure
| Path | Description | Notes |
| ---- | ----------- | ----- |
| `apps/hotel-management-service-server/` | NestJS backend with Prisma, GraphQL, REST bindings, Docker tooling, and scripts for DB lifecycle. | Domain modules live under `src/<domain>/` and extend generated `base/` classes (confirmed via `src/hotel/` and `src/health/`). |
| `apps/hotel-management-service-admin/` | React + React-Admin client bootstrapped with Vite. | Resources mirror backend entities (e.g., `src/reservation/ReservationList.tsx`). |
| `migration/` | Architecture & migration analysis (`migration-architecture-analysis.md`). | Use for historical context when planning large changes. |
| `README.md` | Canonical overview: prerequisites, installation, Docker workflows, script tables, testing guidance. | Reference for quick start & common scripts. |
| `LICENSE`, `overcut-logo.png`, `overcut-loading.gif` | Licensing and branding assets. | Keep untouched unless updating branding. |

**Naming conventions & patterns**
- Backend modules follow `<entity>/<entity>.controller.ts` etc., each extending `./base/*` to separate generated logic from customizations.
- Frontend resources adhere to React-Admin naming: `<Entity>Create/Edit/List/Show.tsx` plus `<Entity>Title.ts` for reference labels.
- Environment files (`.env`) live at each app root; copy to `.env.local` for overrides.

## 🛠️ Development Workflows
### Install Dependencies
```bash
cd apps/hotel-management-service-server && npm install
cd ../hotel-management-service-admin && npm install
```

### Run Everything with Docker Compose (recommended)
```bash
cd apps/hotel-management-service-server
cp .env .env.local   # optional tweaks
npm run compose:up   # API + PostgreSQL (+ migrations)
# ... later
npm run compose:down
```
- GraphQL Playground: `http://localhost:3000/graphql`
- Swagger UI: `http://localhost:3000/api`
- Admin UI runs separately at `http://localhost:3001` once started via Vite.

### Run Apps Individually (host processes)
1. Ensure PostgreSQL is running (Docker `npm run docker:dev` or local instance).
2. Configure `.env` in each app.
3. Generate Prisma client:
   ```bash
   cd apps/hotel-management-service-server
   npm run prisma:generate
   ```
4. Initialize DB (migrate + seed):
   ```bash
   npm run db:init
   ```
5. Start backend:
   ```bash
   npm run start        # or npm run start:watch
   ```
6. Start Admin UI (new terminal):
   ```bash
   cd apps/hotel-management-service-admin
   npm run start
   ```
   - Defaults: `PORT=3001`, `REACT_APP_SERVER_URL=http://localhost:3000`
   - Dev credentials: `admin / admin`

### Database & Prisma Utilities
- Schema location: `apps/hotel-management-service-server/prisma/schema.prisma`
- Create/apply migration:
  ```bash
  npx prisma migrate dev --name <migration_name>
  ```
- Seed scripts: `apps/hotel-management-service-server/scripts/seed.ts` (invoked via `npm run db:init`).

### Packaging & Deployment Hooks
- Backend container build: `npm run package:container`
- Admin container build: `npm run package:container`
- Use `.dockerignore` and app-specific Dockerfiles for optimized images.

## 🧭 Code Patterns & Best Practices
- **Generated vs custom code:** Never edit files under `src/**/base/`; extend the corresponding classes (e.g., `HotelController` extends `HotelControllerBase`). Regenerate via Amplication/Prisma when schema changes.
- **Domain mirroring:** Backend entities (`hotel`, `room`, `reservation`, `customer`, `user`) have matching frontend resources to keep API/UI parity.
- **Environment-driven config:** All secrets live in `.env`. Documented variables (server: `BCRYPT_SALT`, `PORT`, `DB_URL`, etc.; admin: `PORT`, `REACT_APP_SERVER_URL`). Avoid hardcoding values in source.
- **Testing focus:** Server uses Jest (`npm run test`); tests/co-located specs (e.g., `src/prisma.util.spec.ts`). Keep new utilities covered the same way.
- **Styling & theming:** Admin UI centralizes theme overrides under `src/theme/` and global styles in `App.scss`/`login.scss`.
- **Infra-as-code mindset:** Prefer Docker Compose (`compose:up/down`) for reproducible local environments. Use `docker:dev` to spin up DB-only container for host-based development.

## ✅ Quality Standards & Critical Rules
1. **Respect generated boundaries:** place custom logic outside `base/` folders; re-run generators instead of manual edits.
2. **Keep `.env` files in sync with documentation:** if you add a variable, update the relevant README section.
3. **Consistency in domain modules:** maintain controller/resolver/service triplets and expose GraphQL + REST endpoints in tandem.
4. **Lint & type-check Admin UI** before commits (`npm run lint`, `npm run type-check`).
5. **Run backend tests** (`npm run test`) after modifying services, resolvers, or Prisma utilities.
6. **Idempotent DB scripts:** ensure `db:init` remains safe to re-run; update `scripts/seed.ts` carefully.
7. **Container readiness:** when touching Dockerfiles or compose files, verify `npm run package:container` or `npm run compose:up` succeeds locally.

## 🔁 Common Tasks
| Task | Commands / Notes |
| ---- | ---------------- |
| Start full stack via Docker | `cd apps/hotel-management-service-server && npm run compose:up` |
| Start only PostgreSQL | `npm run docker:dev` (server app) |
| Reset DB (migrate + seed) | `npm run db:init` |
| Generate Prisma client | `npm run prisma:generate` |
| Run backend in watch mode | `npm run start:watch` |
| Run Admin UI dev server | `cd apps/hotel-management-service-admin && npm run start` |
| Build Admin UI | `npm run build` then `npm run serve` to preview |
| Backend unit tests | `npm run test` |
| Frontend lint | `npm run lint` |
| Frontend type-check | `npm run type-check` |

## 🧩 Reference Examples
- **Simple backend module:** `apps/hotel-management-service-server/src/health/` (slim controller/service extending `base/` classes, route `_health`).
- **Full-featured backend module:** `apps/hotel-management-service-server/src/hotel/` (controller, resolver, service, module plus DTOs under `base/`).
- **Frontend resource pattern:** `apps/hotel-management-service-admin/src/reservation/ReservationList.tsx` (React-Admin `<List>` with `ReferenceField` usage) and sibling Create/Edit/Show components.
- **Configuration sample:** `apps/hotel-management-service-server/docker-compose.yml` & `.env` template (documented in README). For frontend build config see `apps/hotel-management-service-admin/vite.config.ts`.
- **Testing example:** `apps/hotel-management-service-server/src/prisma.util.spec.ts` demonstrates Jest utility coverage.

## 📚 Additional Resources
- Root [README](./README.md): authoritative overview, script matrix, Docker workflows, testing guidance.
- [Server README](./apps/hotel-management-service-server/README.md): environment variables, script breakdown, container tips.
- [Admin README](./apps/hotel-management-service-admin/README.md): env vars, npm scripts, CRA/react-admin foundations.
- [`migration/migration-architecture-analysis.md`](./migration/migration-architecture-analysis.md): architectural context, historical considerations for larger changes.
- Amplication docs: <https://docs.amplication.com/guides/getting-started> for regeneration workflows and plugin ecosystem.

> Keep this guide updated as workflows or tooling evolve so future agents inherit accurate, actionable instructions.
