# AGENTS Guide

This document provides AI contributors with the context, rules, and repeatable workflows required to work safely in `overcut-ai/awesome-overcut`.

## Project Overview

- **Monorepo layout**: The repository hosts a NestJS backend (`apps/hotel-management-service-server`) and a React + React-Admin frontend (`apps/hotel-management-service-admin`) plus architecture notes in `migration/`.
- **Backend highlights**:
  - GraphQL + REST surface driven by `AppModule` (`apps/.../src/app.module.ts`) and bootstrapped in `src/main.ts`, which applies a global `/api` prefix, validation pipe, Swagger, and the Prisma-specific `HttpExceptionFilter`.
  - Prisma/PostgreSQL stack defined under `apps/.../prisma`, orchestrated locally via `docker-compose.yml` and scripts such as `npm run db:init`.
  - Amplication-generated `base/` folders hold DTOs/controllers/services; custom logic lives in thin extension classes like `src/hotel/hotel.service.ts`.
- **Frontend highlights**:
  - A Vite-driven React-Admin console configured around Apollo Client (`src/data-provider/graphqlDataProvider.ts`) and a JWT auth provider targeting a `login` mutation (`src/auth-provider/ra-auth-jwt.ts`).
  - Resource screens (e.g., `src/hotel/HotelList.tsx`) follow React-Admin conventions with shared pagination and theming under `src/Components` and `src/theme`.
- **Supporting docs**: `migration/migration-architecture-analysis.md` summarizes the current architecture, dependencies, and gaps (e.g., the frontend expects auth flows the backend has not implemented).

## Repository Structure

| Path | Purpose | Notes |
| --- | --- | --- |
| `/` | Monorepo root | Contains `README.md`, `LICENSE`, branding assets, and this guide. |
| `apps/hotel-management-service-server/` | NestJS API + Prisma ORM | Includes Dockerfiles, compose files, `.env`, Prisma schema, scripts, and Amplication-generated source. |
| `apps/hotel-management-service-admin/` | React-Admin client | Vite-based SPA with auth/data providers, resource modules, and lint/type-check tooling. |
| `migration/migration-architecture-analysis.md` | Architecture dossier | Deep dive into modules, risks, and migration blockers; cite when describing system behavior. |

## Development Guidelines

### Backend (`apps/hotel-management-service-server`)

- **Environment**: Copy/adjust `.env` in the app root. Key vars include `PORT`, `DB_URL`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `BCRYPT_SALT`, and optional `SERVE_STATIC_ROOT_PATH` for extra assets served by `ServeStaticOptionsService`.
- **Runtime behavior**:
  - `src/main.ts` enables CORS, global validation, Prisma-aware error handling, and attaches Swagger under `/api` using metadata defined in `src/swagger.ts`.
  - GraphQL is configured via `GraphQLModule.forRootAsync` (Apollo driver) and respects `GRAPHQL_PLAYGROUND` / `GRAPHQL_INTROSPECTION` env toggles.
  - `connectMicroservices.ts` currently does nothing; do not assume message transports exist.
- **Prisma & database**:
  - Schema lives under `prisma/schema.prisma`; migrations run through npm scripts (see below).
  - Seeding logic is handled by `scripts/seed.ts` (invoked by `npm run db:init`).
- **Code organization**:
  - Never edit files in `*/base/`; extend them (e.g., `hotel.service.ts`, `hotel.controller.ts`) to preserve Amplication upgrade paths.
  - Shared utilities live under `src/util` and `src/validators`; reuse them instead of duplicating helper logic.
- **Key scripts** (from `package.json`):

  | Command | Description |
  | --- | --- |
  | `npm run start` | Launch NestJS server. |
  | `npm run start:watch` | Start with hot reload. |
  | `npm run docker:dev` | Boot Postgres via `docker-compose.dev.yml`. |
  | `npm run db:init` | Save initial migration, deploy migrations, then seed. |
  | `npm run prisma:generate` | Regenerate Prisma client after schema edits. |
  | `npm run compose:up` / `compose:down` | Full Docker Compose stack with API + migration job + Postgres. |
  | `npm run test` | Execute Jest suite (currently only health service tests). |

### Frontend (`apps/hotel-management-service-admin`)

- **Environment**: `.env` defines `PORT` (default 3001) and `VITE_REACT_APP_SERVER_URL` consumed by the Apollo client. Keep it aligned with the backend base URL.
- **Architecture**:
  - Apollo client is created in `src/data-provider/graphqlDataProvider.ts` with an auth link that injects the bearer token stored by `jwtAuthProvider`.
  - Authentication provider (`src/auth-provider/ra-auth-jwt.ts`) calls a `login` mutation and expects `{ username, accessToken }`. Because the server currently lacks this resolver, coordinate any auth-related changes explicitly.
  - Resource directories (`src/hotel`, `src/room`, etc.) contain `List`, `Create`, `Edit`, and `Show` components. Follow existing patterns when adding fields or relationships.
- **Key scripts** (from `package.json`):

  | Command | Description |
  | --- | --- |
  | `npm run start` | Run Vite dev server. |
  | `npm run build` | Create production bundle. |
  | `npm run serve` | Preview production build locally. |
  | `npm run lint` | ESLint with auto-fix over `src`. |
  | `npm run type-check` | TypeScript project check (no emit). |
  | `npm run format` | Run Prettier on `src`. |
  | `npm run package:container` | Build Docker image for static deploy. |

### Documentation & Architecture References

- Use `README.md` (root) for onboarding, per-app README files for deeper app-specific setup, and `migration/migration-architecture-analysis.md` for rationale, risks, and dependency notes.

## Code Patterns

1. **Amplication Base Layer** – Domain modules import a generated `*.module.base` and expose thin wrappers. Example: `apps/.../src/hotel/hotel.module.ts` imports `HotelModuleBase`, and `hotel.service.ts` simply extends `HotelServiceBase` with a `PrismaService` instance. When customizing behavior, override methods in the derived classes instead of editing base files.
2. **GraphQL + REST parity** – Services back both REST controllers (`*.controller.ts`) and GraphQL resolvers (`*.resolver.ts`). Ensure DTO changes remain consistent across both surfaces.
3. **Validation & Prisma error translation** – `src/main.ts` applies `ValidationPipe`, and `src/filters/HttpExceptions.filter.ts` maps Prisma error codes to meaningful HTTP responses. New Prisma interactions should reuse this error handling layer.
4. **React-Admin resource convention** – Components like `apps/.../src/hotel/HotelList.tsx` use `<List>` + `<Datagrid>` with shared pagination (`src/Components/Pagination`). Add new resources by following the same folder structure and component signatures.
5. **Apollo-based data access** – `src/data-provider/graphqlDataProvider.ts` builds a client that appends stored JWTs to every request. When adding operations, ensure they are exposed via GraphQL schema and that the auth provider stores/clears tokens consistently.
6. **Docker-first workflows** – `apps/.../docker-compose.yml` brings up server + migration job + Postgres with health checks and volume persistence. Update Compose only when backend scripts stay in sync (e.g., `npm run db:init`).

## Quality Standards & Testing

- **Backend testing**: `npm run test` executes Jest suites under `apps/hotel-management-service-server/src/tests/`. Currently only `health/health.service.spec.ts` exists; introduce or update tests for any domain logic you change.
- **Frontend quality gates**: Run `npm run lint` and `npm run type-check` before opening PRs to keep React-Admin components consistent and type-safe.
- **Schema changes**: After modifying `prisma/schema.prisma`, always run `npm run prisma:generate` and relevant migration commands, and ensure generated GraphQL schema changes are compatible with the admin client.
- **API contracts**: Swagger (`/api`) and GraphQL schema (`/graphql`) are generated at runtime. When altering DTOs or resolvers, verify both surfaces using local requests or the provided playgrounds.

## Critical Rules & Constraints

1. **Do not edit `base/` files** – Regeneration will overwrite them. Extend classes in sibling files (e.g., `hotel.service.ts`).
2. **Authentication gap awareness** – The admin app calls a `login` mutation (`src/auth-provider/ra-auth-jwt.ts`), but the server currently lacks a corresponding resolver (no `auth` module or `login` implementation exists under `apps/.../src`). Plan around this limitation or implement backend auth comprehensively.
3. **Environment hygiene** – Never commit secrets. Update `.env` templates or document required vars instead.
4. **Database safety** – Scripts such as `npm run db:init` include destructive steps (`prisma migrate reset`). Confirm the target database before executing.
5. **Consistency between REST and GraphQL** – Because services power both, schema or DTO drift will break one side. Update controllers, resolvers, and admin resources together.
6. **Docker dependencies** – Compose relies on the scripts defined in `package.json`. If you change script names, update `docker-compose.yml` and `Dockerfile` accordingly.

## Common Tasks

### Bring up the entire stack with Docker
```bash
cd apps/hotel-management-service-server
npm run compose:up     # starts API, migration job, and Postgres
# ... work ...
npm run compose:down   # stops and removes containers + volumes
```

### Run the backend locally without Docker
```bash
cd apps/hotel-management-service-server
npm install
npm run prisma:generate
npm run docker:dev     # optional Postgres container for dev
npm run db:init        # create/apply migrations + seed
npm run start          # starts NestJS on http://localhost:3000
```

### Run the admin frontend
```bash
cd apps/hotel-management-service-admin
npm install
npm run start          # Vite dev server on http://localhost:3001
```
Adjust `VITE_REACT_APP_SERVER_URL` in `.env` if the backend is not `http://localhost:3000`.

### Execute Prisma migrations manually
```bash
cd apps/hotel-management-service-server
npx prisma migrate dev --name <migration_name>
npm run db:migrate-up            # deploy migrations in non-dev envs
npm run seed                     # re-run seed script if needed
```

### Run backend tests and frontend linting
```bash
cd apps/hotel-management-service-server && npm run test
cd ../hotel-management-service-admin && npm run lint && npm run type-check
```

## Reference Examples

| File | Why it matters |
| --- | --- |
| `apps/hotel-management-service-admin/src/hotel/HotelList.tsx` | Canonical React-Admin list component using shared pagination and per-field renderers. |
| `apps/hotel-management-service-server/src/hotel/hotel.module.ts` | Shows how generated modules import `*.module.base` and expose controllers/resolvers/services. |
| `apps/hotel-management-service-server/docker-compose.yml` | Reference for the Docker-first workflow (API + migration job + Postgres with health checks). |
| `apps/hotel-management-service-server/src/tests/health/health.service.spec.ts` | Illustrates Jest + `jest-mock-extended` usage for Prisma-dependent services. |
| `migration/migration-architecture-analysis.md` | Comprehensive architectural background, dependencies, and known risks (auth gap, testing debt, etc.). |

## Additional Resources

- Root [`README.md`](./README.md) – prerequisites, installation, script tables, and usage instructions.
- Server [`README.md`](./apps/hotel-management-service-server/README.md) – environment variables, Docker workflow, and setup commands.
- Admin [`README.md`](./apps/hotel-management-service-admin/README.md) – client configuration, environment variables, and command reference.
- [`migration/migration-architecture-analysis.md`](./migration/migration-architecture-analysis.md) – architecture analysis suitable for deep dives and planning.
