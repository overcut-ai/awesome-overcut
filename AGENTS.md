# 🤖 AGENTS Guide for `awesome-overcut`

## 🧭 Project Overview
- **Purpose**: Demonstrates an Amplication-generated hotel management platform with a NestJS + Prisma API and a React-Admin UI for CRUD on hotels, rooms, reservations, and customers.
- **Repository Type**: Monorepo housing two npm applications under `apps/` plus migration documentation.
- **Key Technologies**: Node.js 18, NestJS 10, Prisma 5, PostgreSQL 12, React 18, React-Admin 5, Apollo Client, Vite 4, Docker & Docker Compose, Jest, ESLint/Prettier, Sass.
- **Interfaces**: REST (`/api/*`) and GraphQL (`/graphql`) from the server; React-Admin speaks GraphQL through Apollo with JWT auth.

## 🗂️ Repository Structure
| Path | Description |
| --- | --- |
| `apps/hotel-management-service-server/` | NestJS API with Prisma ORM, Docker assets, migrations, custom decorators/validators, and Jest tests. |
| `apps/hotel-management-service-admin/` | Vite-powered React-Admin SPA with auth provider, GraphQL data provider, and resource-specific CRUD screens. |
| `migration/` | Knowledge base (`migration-architecture-analysis.md`) capturing architectural decisions, risks, and technology stack notes. |
| Root files (`README.md`, `LICENSE`, media) | High-level overview, licensing, and branding assets used in docs/UI. |

**Naming conventions**
- NestJS modules, services, and controllers follow `*.module.ts`, `*.service.ts`, `*.controller.ts` patterns; generated base layers sit under each feature's `base/` folder.
- React components use PascalCase inside entity folders (e.g., `HotelList.tsx`), with SCSS modules for styling.
- Config and infra files (`Dockerfile`, `docker-compose.yml`, `.env`) live alongside each app.

**Common file types**: TypeScript (`.ts`, `.tsx`), Prisma schema (`.prisma`), SCSS, Markdown docs, JSON configs, and YAML for Compose.

## ⚙️ Development Guidelines
- **Runtime expectations**: Use Node.js 18 and npm ≥8. Docker 24+ is recommended for Compose workflows.
- **Server (NestJS)**
  - Global `/api` prefix and validation (`ValidationPipe`) are configured in `apps/hotel-management-service-server/src/main.ts`; maintain DTO schemas to leverage pipe transforms.
  - Prisma models live in `prisma/schema.prisma`; regenerate clients after schema edits with `npm run prisma:generate`.
  - Keep decorators/validators (`src/decorators`, `src/validators`) aligned with Swagger expectations so the generated OpenAPI stays accurate.
  - Environment variables live in `.env`; secrets like `JWT_SECRET_KEY` should be rotated before production.
- **Admin (React-Admin)**
  - Uses Apollo client auth link to append JWT headers; ensure `VITE_REACT_APP_SERVER_URL` matches the server URL (default `http://localhost:3000`).
  - Resource folders under `src/<entity>/` hold list/create/edit/show components; keep naming consistent for React-Admin to auto-wire routes.
  - Styling uses SCSS modules; theme overrides live in `src/theme/`.
- **Authentication**
  - Dev credentials default to `admin/admin` (see app READMEs).
  - The admin login flow expects a `login` GraphQL mutation that returns `{ username, accessToken }`; align backend auth implementation accordingly.
- **Database & Migrations**
  - Use Prisma migration scripts (`npm run db:init`) before starting the API.
  - Docker Compose automatically runs migrations and seeds via the `migration` service in `apps/hotel-management-service-server/docker-compose.yml`.

## 🧱 Code & Workflow Patterns
- **Server bootstrapping**: `src/main.ts` enables CORS, global prefix, `ValidationPipe`, Swagger, microservice stubs, and the Prisma-aware `HttpExceptionFilter`. Keep new modules wired through `AppModule` for inclusion in Swagger and GraphQL schema.
- **Serve static assets**: `src/serveStaticOptions.service.ts` logs and configures additional static roots via the `SERVE_STATIC_ROOT_PATH` env var while always exposing `/swagger` assets.
- **Prisma layering**: Feature modules (e.g., `apps/hotel-management-service-server/src/reservation/`) extend Amplication `base/` services and controllers. Add overrides in the derived classes to avoid modifying generated base files.
- **React-Admin resources**: `apps/hotel-management-service-admin/src/customer/` showcases the pattern of `List`, `Create`, `Edit`, and `Show` components using shared field/input helpers.
- **GraphQL login flow**: `apps/hotel-management-service-admin/src/auth-provider/ra-auth-jwt.ts` issues the `login` mutation, stores bearer tokens in `localStorage`, and injects headers via the Apollo auth link defined in `src/data-provider/graphqlDataProvider.ts`.
- **Docker workflows**: `apps/hotel-management-service-server/docker-compose.yml` orchestrates API, PostgreSQL, and migration jobs. Keep service names/default ports in sync with `.env` to avoid connection surprises.

## ✅ Quality & Testing
- **Unit tests**: Jest specs live under `apps/hotel-management-service-server/src/tests/`, e.g., `health/health.service.spec.ts` verifies Prisma readiness logic. Use `npm run test` (server) for the full suite.
- **Linting & formatting**: Admin app ships with ESLint (`npm run lint`) and TypeScript checks (`npm run type-check`). The server relies on Nest CLI/TypeScript configs; apply `npm run build` to surface type errors.
- **Validation & error handling**: The global `ValidationPipe` enforces DTO schemas, while `HttpExceptionFilter` maps Prisma errors (P2000, P2002, P2025) to meaningful HTTP codes—extend these utilities rather than bypassing them.
- **CI expectations**: Ensure Prisma migrations are up to date and Jest passes before opening PRs; lint the admin UI to maintain consistent formatting.

## 🧰 Common Tasks
**Install dependencies**
```bash
cd apps/hotel-management-service-server && npm install
cd ../hotel-management-service-admin && npm install
```

**Run the server locally (with an existing database)**
```bash
cd apps/hotel-management-service-server
npm run prisma:generate
npm run db:init
npm run start
```

**Start the Admin UI**
```bash
cd apps/hotel-management-service-admin
npm run start
```

**Full stack via Docker Compose**
```bash
cd apps/hotel-management-service-server
cp .env .env.local   # optional overrides
npm run compose:up    # starts API + Postgres + migration job
npm run compose:down  # stop & clean up
```

**Seed or re-seed the database**
```bash
cd apps/hotel-management-service-server
npm run db:init
```

**Run automated tests (server)**
```bash
cd apps/hotel-management-service-server
npm run test
```

**Build the Admin UI for production**
```bash
cd apps/hotel-management-service-admin
npm run build
npm run serve   # optional preview of dist/
```

## 📁 Reference Examples
- `apps/hotel-management-service-admin/src/customer/` – Canonical React-Admin resource folder showcasing list/create/edit/show component conventions.
- `apps/hotel-management-service-server/src/reservation/` – Example NestJS module with REST controllers, GraphQL resolvers, and service overrides extending Amplication base classes.
- `apps/hotel-management-service-server/docker-compose.yml` – Source of truth for containerized workflows (API, PostgreSQL, migration job) and default ports.
- `apps/hotel-management-service-admin/src/auth-provider/ra-auth-jwt.ts` – JWT login mutation implementation and token storage logic expected by the admin UI.

## 📚 Additional Resources
- [Root README](./README.md) – Prerequisites, installation, scripts overview.
- [Server README](./apps/hotel-management-service-server/README.md) – Environment variables, scripts, and Docker usage for the API.
- [Admin README](./apps/hotel-management-service-admin/README.md) – Configuration and scripts for the React-Admin client.
- [Migration Architecture Analysis](./migration/migration-architecture-analysis.md) – Historical architecture notes, risks, and cross-cutting concerns.
