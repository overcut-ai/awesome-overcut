# 🤖 AGENTS GUIDE

## 🧭 Project Overview
Hotel Management Service monorepo that ships a NestJS + Prisma + PostgreSQL backend (`apps/hotel-management-service-server/`) and a React-Admin frontend (`apps/hotel-management-service-admin/`). The root [`README.md`](README.md) requires Node.js ≥16, npm ≥8, and recommends Docker for local orchestration. Use this guide to keep automation consistent across both apps.

## 📦 Repository Structure
- `apps/hotel-management-service-server/` – NestJS API, Prisma schema, Docker/Nest workflows, and Jest tests.
- `apps/hotel-management-service-admin/` – React-Admin (Vite) UI with GraphQL data provider and auth provider.
- `migration/migration-architecture-analysis.md` – architectural decisions and migration notes.
- `overcut-logo.png`, `overcut-loading.gif` – shared branding assets.
- `LICENSE`, `README.md` – legal and high-level docs.

## ⚙️ Development Guidelines
- Install dependencies with `npm install` inside each app directory; the monorepo does not use a root package manager workspace.
- Keep `.env` files up to date: the server expects DB credentials, `BCRYPT_SALT`, and API port; the admin expects `PORT` and `VITE_REACT_APP_SERVER_URL` pointing at the server’s GraphQL endpoint.
- Docker Compose files interpolate environment variables from `.env`; ensure values are set before `compose:up`.
- Follow the documented scripts in each app’s `package.json` to stay aligned with CI/CD expectations.

## 🧩 Code Patterns
### Server (`apps/hotel-management-service-server/`)
- Domain modules live under `src/<entity>/` and extend Amplication-generated base classes in `src/<entity>/base/`. For example, `src/customer/customer.service.ts` extends logic from `src/customer/base/customer.service.base.ts`.
- `AppModule` wires `ConfigModule`, `PrismaModule`, `GraphQLModule` (Apollo driver), and `ServeStaticModule` to expose REST + GraphQL + static assets.
- `main.ts` sets global prefix `/api`, registers `ValidationPipe`, Swagger, optional microservices, and Prisma HTTP exception filters.
- Prisma schema at `prisma/schema.prisma`; `PrismaService` extends `PrismaClient` for dependency injection.

### Admin (`apps/hotel-management-service-admin/`)
- `src/App.tsx` bootstraps `<Admin>` with `ra-data-graphql-amplication` data provider and JWT auth provider from `src/auth-provider/ra-auth-jwt.ts`.
- Each resource (e.g., `customer`, `reservation`, `hotel`, `room`) contains `List/Create/Edit/Show/Title` components (see `src/customer/CustomerList.tsx`, `CustomerCreate.tsx`, etc.).
- Shared UI utilities like pagination reside in `src/Components/Pagination.tsx`.
- GraphQL type definitions for each entity live under `src/api/<entity>/`.

## ✅ Quality Standards
- Backend testing uses Jest; sample spec: `apps/hotel-management-service-server/src/tests/health/health.service.spec.ts`. Maintain coverage for business logic and health checks via `npm run test`.
- Frontend currently lacks automated tests; rely on `npm run lint`, `npm run type-check`, and `npm run format` before committing.
- Build artifacts must be reproducible: `npm run build` for both apps should pass before container packaging (`npm run package:container`).

## 🚨 Critical Rules
1. Always set `BCRYPT_SALT` (and DB credentials) before running `npm run seed` or starting the API.
2. Regenerate Prisma client (`npm run prisma:generate`) after any `prisma/schema.prisma` change to avoid runtime mismatches.
3. Default admin credentials `admin/admin` are for local development only—never promote to higher environments.
4. `VITE_REACT_APP_SERVER_URL` must include the server GraphQL endpoint (e.g., `http://localhost:3000/graphql`) for the data provider to function.
5. Docker Compose requires `.env` DB variables; missing values will break container startup.
6. Admin build container (Nginx) and server multi-stage Node 18.13 images depend on successful `npm run build`; do not skip build steps when packaging.

## 🛠️ Common Tasks
1. **Install dependencies**
   1. `cd apps/hotel-management-service-server && npm install`
   2. `cd apps/hotel-management-service-admin && npm install`
2. **Run the NestJS server locally**
   1. Populate `apps/hotel-management-service-server/.env`.
   2. From the server directory run `npm run prisma:generate` (after any schema updates).
   3. Start via `npm run start` or hot-reload with `npm run start:watch`.
3. **Run the React-Admin app**
   1. Ensure `apps/hotel-management-service-admin/.env` sets `VITE_REACT_APP_SERVER_URL` and `PORT` (default 3001).
   2. From the admin directory run `npm run start` (Vite dev server) or `npm run serve` after a production `npm run build`.
4. **Run Docker Compose stack**
   1. In the server directory, confirm `.env` contains DB credentials.
   2. Run `npm run compose:up`; stop with `npm run compose:down`.
5. **Regenerate Prisma client**
   1. After editing `apps/hotel-management-service-server/prisma/schema.prisma`, run `npm run prisma:generate`.
   2. For migration drafts use `npm run db:migrate-save`; apply with `npm run db:migrate-up`.
6. **Seed the database**
   1. Ensure `BCRYPT_SALT` and DB connection values exist in `.env`.
   2. Run `npm run seed` from the server directory; use `npm run db:clean` to reset.
7. **Run tests / linting**
   1. Backend: `npm run test` (optionally `npm run db:init` before integration tests) and `npm run build` for CI parity.
   2. Frontend: `npm run lint`, `npm run type-check`, and `npm run format` prior to publishing.

## 📚 Reference Examples
- **Server pattern:** `apps/hotel-management-service-server/src/customer/customer.service.ts` alongside `apps/hotel-management-service-server/src/customer/base/` demonstrates extension of Amplication base classes.
- **Admin pattern:** `apps/hotel-management-service-admin/src/customer/CustomerList.tsx`, `CustomerCreate.tsx`, `CustomerEdit.tsx`, and `CustomerShow.tsx` illustrate the consistent CRUD component structure per resource.

## 🔗 Additional Resources
- Root guide: [`README.md`](README.md)
- Server-specific docs: [`apps/hotel-management-service-server/README.md`](apps/hotel-management-service-server/README.md)
- Admin-specific docs: [`apps/hotel-management-service-admin/README.md`](apps/hotel-management-service-admin/README.md)
- Architecture notes: [`migration/migration-architecture-analysis.md`](migration/migration-architecture-analysis.md)
