# Backend

Express + Sequelize + PostgreSQL API for the admin panel. JWT auth, role-based
access control (RBAC), and a seeded superadmin.

## Setup

```bash
cp .env.example .env   # fill in DB + JWT_SECRET + superadmin credentials
npm install
npm run db:setup       # creates the database, runs migrations, seeds superadmin
npm run dev
```

`JWT_SECRET` must be identical to the `admin-panel` app's `.env.local` — it's
the shared secret used to sign (here) and verify (there) the session token.

## API

| Method | Path                | Auth              | Description                     |
| ------ | ------------------- | ----------------- | -------------------------------- |
| GET    | `/api/health`        | none              | Liveness check                   |
| POST   | `/api/auth/login`    | none              | `{ email, password }` → `{ token, user }` |
| GET    | `/api/auth/me`       | Bearer token      | Current user                     |
| POST   | `/api/auth/logout`   | Bearer token       | No-op (stateless JWT), reserved for future token revocation |
| GET    | `/api/admin/overview`| Bearer token, superadmin/admin | User counts by role, RBAC demo |

## RBAC

Roles live on `users.role` as a Postgres enum: `superadmin`, `admin`. Guard
routes with `middlewares/authenticate.js` (verifies the JWT) followed by
`middlewares/authorize('superadmin', ...)` (checks the role). Add more roles
by extending the enum in a new migration — the middleware itself doesn't
hardcode role names.

## Structure

```
src/
  config/        Sequelize CLI config (reads .env)
  models/        Sequelize models
  migrations/    Schema changes
  middlewares/   authenticate, authorize, errorHandler
  controllers/   Route logic
  routes/        Express routers
  utils/         jwt, password hashing, bootstrapSuperadmin
```
