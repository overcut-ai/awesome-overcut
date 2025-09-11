# Hotel Management Service 

A full-stack, **monorepo** project that demonstrates a modern Hotel-Management Service built with [Amplication](https://amplication.com).  
It contains two ready-to-run applications:

1. **Server** – A NestJS / GraphQL API with authentication, authorization and a PostgreSQL database powered by Prisma.  
2. **Admin UI** – A React + React-Admin client that provides an out-of-the-box administrative interface for managing hotels, rooms, reservations and customers.

The repository is intended both as a reference implementation—showing how Amplication scaffolds production-grade Node.js & React apps—and as a starting point for your own hotel-management-style projects.

---

## Table of Contents

1. [Prerequisites](#prerequisites)  
2. [Installation](#installation)  
3. [Usage](#usage)  
   1. [Run with Docker Compose (recommended)](#run-with-docker-compose-recommended)  
   2. [Run apps individually](#run-apps-individually)  
4. [Project Structure](#project-structure)  
5. [Development](#development)  
   1. [Server scripts](#server-scripts)  
   2. [Admin UI scripts](#admin-ui-scripts)  
   3. [Database migrations & seeding](#database-migrations--seeding)  
6. [Testing](#testing)  
7. [Contributing](#contributing)  
8. [License](#license)  
9. [Acknowledgements](#acknowledgements)

---

## Prerequisites

* **Node.js** ≥ 16  
* **npm** ≥ 8 (bundled with Node)  
* **Docker** & **Docker Compose** – optional but strongly recommended for an easy, reproducible setup  

> The project was last generated and tested with Node 18 & Docker 24.

---

## Installation

Clone the repository and install dependencies for each application:

```bash
# clone
git clone https://github.com/overcut-ai/awesome-overcut.git
cd awesome-overcut

# install server deps
cd apps/hotel-management-service-server && npm install

# install admin deps
cd ../hotel-management-service-admin && npm install
```

> Feel free to use your favourite package manager (`yarn`, `pnpm`, …)—adjust commands accordingly.

---

## Usage

### Run with Docker Compose (recommended)

The **server** application ships with a `docker-compose.yml` that spins up the API and a PostgreSQL database—perfect for evaluation or local development:

```bash
cd apps/hotel-management-service-server

# copy env template if you wish to adjust values
cp .env .env.local   # optional

# build and start containers (API + DB + migration job)
npm run compose:up
```

Once the containers are healthy:

* GraphQL Playground – `http://localhost:3000/graphql`
* Swagger UI – `http://localhost:3000/api`
* Admin UI – `http://localhost:3001` (start separately, see below)

Stop & remove containers with:

```bash
npm run compose:down
```

### Run apps individually

If you prefer running Node processes on the host machine:

1. **Start PostgreSQL** – Use Docker or a local installation.  
2. **Configure environment** – Adjust `.env` files under each app.  
3. **Generate Prisma client**

   ```bash
   cd apps/hotel-management-service-server
   npm run prisma:generate
   ```

4. **Run migrations & seed**

   ```bash
   npm run db:init
   ```

5. **Start server**

   ```bash
   npm run start
   ```

6. **Start Admin UI** (new terminal):

   ```bash
   cd apps/hotel-management-service-admin
   npm run start
   ```

By default the Admin UI expects the server at `http://localhost:3000`.  
Change `REACT_APP_SERVER_URL` in `apps/hotel-management-service-admin/.env` if needed.

Default credentials (dev mode):

```
Username: admin
Password: admin
```

---

## Project Structure

```
awesome-overcut/
├── apps/
│   ├── hotel-management-service-admin/   # React + React-Admin client
│   └── hotel-management-service-server/  # NestJS GraphQL API + Prisma
├── LICENSE
└── README.md
```

Each application is an isolated npm project with its own `package.json`, Dockerfile and README.

---

## Development

### Server scripts

Inside `apps/hotel-management-service-server`:

| Script | Description |
| ------ | ----------- |
| `npm run start` | Start NestJS server (uses `.env` values) |
| `npm run start:watch` | Start with hot-reload |
| `npm run docker:dev` | Quickly start a PostgreSQL container for local dev |
| `npm run db:init` | Apply Prisma migrations & seed data |
| `npm run prisma:generate` | Regenerate Prisma client after schema changes |
| `npm run build` | Transpile TypeScript to JS (`dist/`) |
| `npm run test` | Run Jest unit tests |
| `npm run package:container` | Build production Docker image |

### Admin UI scripts

Inside `apps/hotel-management-service-admin`:

| Script | Description |
| ------ | ----------- |
| `npm run start` | Start Vite dev server (hot reload) |
| `npm run build` | Production build (`dist/`) |
| `npm run serve` | Locally preview the production build |
| `npm run lint` | ESLint with auto-fix |
| `npm run type-check` | TypeScript type checking (no emit) |
| `npm run package:container` | Build production Docker image |

### Database migrations & seeding

The Prisma schema is located under `apps/hotel-management-service-server/prisma/schema.prisma`.

> **Note**: Starting from the next release the `phoneNumber` field on the **Customer** model is **unique**. Attempting to insert two customers with the same phone number will result in an HTTP 409 Conflict error.
>
> Before you deploy this change to an existing database **you must clean up existing duplicates** (if any). A helper script is provided:
>
> ```bash
> cd apps/hotel-management-service-server
> npm run cleanup:duplicates   # removes duplicates, keeping the earliest record per phone number
> ```
> 
> Run the script once, verify the output, then proceed with the Prisma migration.

* Create & apply a new migration:

  ```bash
  npx prisma migrate dev --name <migration_name>
  ```

* Seed data lives in `apps/hotel-management-service-server/scripts/seed.ts`.

---

## Testing

The server uses **Jest**:

```bash
cd apps/hotel-management-service-server
npm run test
```

(There are currently no automated tests for the Admin UI.)

---

## Contributing

Pull requests are welcome! For major changes please open an issue first to discuss what you would like to change.

1. Fork the repo & create your branch (`git checkout -b feature/xyz`)  
2. Commit your changes with clear messages  
3. Ensure `npm test` (server) passes and linting is clean  
4. Open a pull request  

Please follow the existing coding style and keep the README up-to-date with your changes.

---

## License

This project is licensed under the **Apache License 2.0** – see the [LICENSE](./LICENSE) file for details.

---

## Acknowledgements

* Generated with [Amplication](https://amplication.com) – an open-source platform for building Node.js applications.  
* Built with amazing open-source software:  
  * [NestJS](https://nestjs.com) • [Prisma](https://www.prisma.io) • [React](https://react.dev) • [React-Admin](https://marmelab.com/react-admin/) • and many more.
