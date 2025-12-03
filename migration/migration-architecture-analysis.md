# Migration Architecture Analysis – Current State

## 1. Repository Overview
- **Purpose**: Amplication-generated hotel management system providing CRUD operations for hotels, rooms, reservations, and customers.
- **Structure**: Monorepo with two npm applications under `apps/`:
  - `hotel-management-service-server`: NestJS API with REST and GraphQL surfaces backed by PostgreSQL via Prisma.
  - `hotel-management-service-admin`: React + React-Admin administrative UI consuming the GraphQL API.
- **Primary Technology Stack**: Node.js 18.x (server Docker builds target `node:18.13.0` for build and runtime stages, while the admin Dockerfile produces static assets served from an `nginx:1.22-alpine` runtime image), NestJS 10, Prisma 5, PostgreSQL 12, React 18, React-Admin 5, Apollo Client.
- **Operational Modes**: Docker Compose for full stack (API + Postgres) and standalone npm scripts for local development.

## 2. Current Architecture & Runtime Context
### 2.1 Server Application (`apps/hotel-management-service-server`)
- **Entry Point**: `src/main.ts` creates a NestJS application with CORS, global `/api` prefix, validation pipe, Prisma-focused HTTP exception filter, and Swagger (OpenAPI) UI at `/api`.
- **API Surfaces**:
  - REST controllers under `/api/<resource>` generated from Amplication base classes.
  - GraphQL endpoint at `/graphql` via `@nestjs/graphql` and Apollo driver with dynamically generated schema.
- **Data Layer**: Prisma ORM (`PrismaService` extending `PrismaClient`) configured through `prisma/schema.prisma` targeting PostgreSQL (`DB_URL`).
- **Deployment Artifacts**: Dockerfile and `docker-compose.yml` orchestrating the API, migration job (runs `npm run db:init`), and PostgreSQL instance with volume persistence.
- **Configuration**: `.env` provides DB credentials, server port, bcrypt salt, etc. `ConfigModule` is global for environment lookups.
- **Generated Base Layer**: For each domain resource, Amplication scaffolds `base/*` files encompassing DTOs, services, controllers, and resolvers.
- **Microservices Hook**: `connectMicroservices.ts` exists but is currently a no-op, indicating future extensibility without actual transport configuration.

### 2.2 Admin Application (`apps/hotel-management-service-admin`)
- **Bootstrap**: Vite-based React app (`src/index.tsx`) composed around React-Admin with Apollo GraphQL data provider (`ra-data-graphql-amplication`).
- **Authentication Flow**: JWT login mutation executed via Apollo client (`src/auth-provider/ra-auth-jwt.ts`) storing bearer token in LocalStorage (`CREDENTIALS_LOCAL_STORAGE_ITEM`).
- **Data Access**: GraphQL data provider (`src/data-provider/graphqlDataProvider.ts`) builds on Apollo Client with auth link to attach bearer token.
- **Resource Modules**: React-Admin screens per entity (Hotel, Room, Reservation, Customer) providing list/create/edit/show pages auto-generated from schema.
- **Configuration**: `.env` exposes `VITE_REACT_APP_SERVER_URL` (default `http://localhost:3000`) and dev port `3001`.
- **UI Infrastructure**: Includes theming (`src/theme`), login components, and role definitions (`src/user/EnumRoles.ts` only exposes `user`).

## 3. Modules & Bounded Contexts
### 3.1 Server Modules
| Module | Responsibility | Notes |
| --- | --- | --- |
| `AppModule` | Aggregates all feature modules, config, static serving, and GraphQL configuration. | Imports ConfigModule, ServeStatic (via `ServeStaticOptionsService` which resolves `SERVE_STATIC_ROOT_PATH`, logs the resolved path, and always exposes bundled Swagger assets), GraphQL, and domain modules. |
| `HotelModule`, `RoomModule`, `ReservationModule`, `CustomerModule` | CRUD functionality and relations for respective domain entities. | REST controllers extend `*.controller.base.ts`; GraphQL resolvers extend base implementations. |
| `HealthModule` | Basic health check service and controller under `/api/_health/*`. | Used for monitoring readiness checks. |
| `PrismaModule` | Provides `PrismaService` for database access and connection lifecycle. | No explicit shutdown handling; relies on process exit. |
| `SecretsManagerModule` | Wrapper over Nest `ConfigService` for retrieving secrets via enum keys. | Currently returns environment values directly; no external secrets backend. |
| Utility Layers (`decorators`, `validators`, `filters`) | Shared decorators (e.g., `@Public`), custom validators, exception filters. | Validation leverages `class-validator`; exception mapping specialised for Prisma errors. |

### 3.2 Admin Modules / Feature Areas
| Area | Responsibility | Notes |
| --- | --- | --- |
| Authentication Provider | Implements React-Admin `AuthProvider` using GraphQL `login` mutation, manages tokens in LocalStorage. | Depends on server exposing `login` mutation returning `{ username, accessToken }`. |
| Data Provider | Apollo client configured against `/graphql`, merges auth headers. | No caching strategies beyond default in-memory cache. |
| Resource Screens (`hotel/`, `room/`, `reservation/`, `customer/`) | CRUD forms, tables, and detail pages auto-generated from schema metadata. | Expect GraphQL schema alignment with server base modules. |
| Shared UI (`Components/`, `pages/`) | Login form, layout scaffolding, theming, and constants. | Minimal customization beyond Amplication defaults. |

## 4. External Dependencies & Integrations
- **Database**: PostgreSQL 12 (Dockerised) – connection string `postgres://<user>:<pass>@<host>:5432/<db>` consumed by Prisma.
- **ORM / Schema Management**: Prisma Migrate with scripts `db:migrate-*`, seeding via `scripts/seed.ts` & `scripts/customSeed.ts`.
- **Authentication Libraries**: Server depends on `@nestjs/jwt`, `passport`, `passport-jwt`, and bcrypt but lacks committed guard/strategy implementations. Admin expects JWT-based auth.
- **GraphQL Infrastructure**: `@nestjs/graphql`, `@nestjs/apollo`, `@apollo/server` on backend; Apollo Client with `ra-data-graphql-amplication` on frontend.
- **Static Assets / UI**: Nest ServeStatic serves built assets (potentially admin build) via `ServeStaticOptionsService` (implementation limited to class skeleton).
- **Docker Tooling**: Compose orchestrates API + DB + migration; Dockerfile builds Node runtime (no multi-stage optimization currently).

## 5. Cross-Cutting Concerns (Current Implementation)
- **Authentication & Authorization**: Swagger description references JWT bearer auth, and dependencies imply Passport JWT + ACL support. However, no `auth` module/guards/strategies are present in the repo, creating a gap between intended and actual implementation. Admin relies on a `login` GraphQL mutation that the server codebase does not expose – a critical mismatch.
- **Configuration Management**: Centralised via `@nestjs/config`; SecretsManager simply fetches environment variables with enum keys (no remote secrets or rotation). `.env` files store credentials in plaintext.
- **Validation**: Global `ValidationPipe` with transformation enabled; request DTOs generated per entity. Custom validators located in `src/validators` currently only provide JSON value validation, while scalar filter helper classes live under `src/util`.
- **Error Handling**: Custom `HttpExceptionFilter` translating Prisma known error codes (P2000, P2002, P2025) to HTTP responses; applied globally in `main.ts`.
- **Logging & Monitoring**: No explicit logging configuration beyond Nest defaults. Health check module and tests provide minimal operational monitoring.
- **Messaging / Events / Caching**: No caching layers, message queues, or event buses currently configured. `connectMicroservices.ts` is empty, indicating no microservice transports.
- **Testing**: Jest configured; only health service test committed. Lack of coverage for critical modules or integration paths.

## 6. Complexity Indicators, Risks, and Migration Blockers
- **Authentication Gap**: Frontend expects JWT login, but server lacks the corresponding auth module (no guards, no `login` resolver/mutation, no user entity). This inconsistency will block any migration that assumes working auth flows.
- **Generated Code Footprint**: Heavy reliance on Amplication-generated base classes. Regeneration may overwrite custom modifications, complicating incremental migration unless a strategy for preserving overrides is defined.
- **Infrastructure Dependencies**: Tight coupling to Prisma/PostgreSQL; migration to another datastore or ORM will require reworking base services and DTOs.
- **Config & Secret Handling**: Secrets currently stored in `.env`; SecretsManager is merely pass-through. Production-grade secret management is absent and must be considered before environment migration.
- **Microservices Stub**: `connectMicroservices` suggests future plans but no implementation. Migrating to microservice architecture would require defining transports and message patterns from scratch.
- **Testing Debt**: Minimal automated test coverage increases risk during migration; refactoring could break behaviour without detection.
- **Resource Coupling**: REST and GraphQL layers share the same Prisma-backed services. Schema divergence or API contract changes must be coordinated across both surfaces and the admin client.
- **Docker Dependency**: Official workflow relies on Docker Compose. Alternative deployment targets (serverless, managed containers) will need translation of environment assumptions (shared network, persistent volume for Postgres).

---

**Summary**: The repository currently implements a monolithic NestJS + React architecture scaffolded by Amplication, with clear domain modules but notable gaps in authentication implementation and limited cross-cutting infrastructure. These factors must be reconciled before initiating any migration activities.
