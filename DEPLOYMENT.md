# Deployment

## API

1. Provision PostgreSQL and set `DATABASE_URL` and a long random `JWT_SECRET` in the deployment environment. Set `PORT` if the host requires a specific port.
2. Install API dependencies from `api/` with `npm ci`.
3. Generate the Prisma client and apply committed migrations with `npm run prisma:generate` and `npm run prisma:deploy`.
4. Build and start with `npm run build` and `npm run start:prod`.
5. To initialize a demo database, configure `SEED_USER_PASSWORD` to a private password (at least 12 characters) and run `npm run prisma:seed` against a disposable database.

Do not expose database credentials, JWT secrets, or seed passwords in the client or commit local `.env` files.

## Client

1. Set `VITE_API_URL` to the public API origin at client build time (for example, in the hosting provider's environment configuration).
2. Install and build from `client/` with `npm ci` and `npm run build`.
3. Serve the generated `client/dist/` directory using a static host configured to fall back to `index.html` for React Router routes.

`VITE_` variables are included in browser bundles. Only configure public values such as the API base URL there; never put secrets in client environment variables.
