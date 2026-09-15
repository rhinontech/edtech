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

### Blogs & events (CMS)

```bash
npm run migrate        # blogs/events tables + Blogs/Events sidebar items
npm run seed:content   # one-off import of the posts/events hardcoded in the uppercurve site (safe to re-run)
```

- Image uploads go to S3 under `content/`; set the `AWS_*` variables and make
  that prefix publicly readable (or put a CDN in front and set `AWS_S3_PUBLIC_URL`).
- In the admin panel's `.env.local`, set `SITE_URL` to the public UpperCurve
  site (used for "View on website" links and previewing site-relative images).

## API

| Method | Path                | Auth              | Description                     |
| ------ | ------------------- | ----------------- | -------------------------------- |
| GET    | `/api/health`        | none              | Liveness check                   |
| POST   | `/api/auth/login`    | none              | `{ email, password }` → `{ token, user }` |
| GET    | `/api/auth/me`       | Bearer token      | Current user                     |
| POST   | `/api/auth/logout`   | Bearer token       | No-op (stateless JWT), reserved for future token revocation |
| GET    | `/api/admin/overview`| Bearer token, superadmin/admin | User counts by role, RBAC demo |
| GET/POST | `/api/content/blogs` | Bearer token, `blogs` item | List (drafts included) / create |
| GET/PATCH/DELETE | `/api/content/blogs/:id` | Bearer token, `blogs` item | Read / update / delete |
| GET/POST | `/api/content/events` | Bearer token, `events` item | List / create |
| GET/PATCH/DELETE | `/api/content/events/:id` | Bearer token, `events` item | Read / update / delete |
| POST   | `/api/content/uploads` | Bearer token, `blogs` or `events` item | Multipart `image` (+ `folder`) → `{ url }` |
| GET    | `/api/public/blogs[?category=]` | none | Published posts dated today or earlier |
| GET    | `/api/public/blogs/:slug` | none | Post with `contentHtml`, `toc`, `faqs` |
| GET    | `/api/public/events[?when=upcoming\|past]` | none | Published events |
| GET    | `/api/public/events/:slug` | none | Event with `aboutHtml`, agenda, takeaways, audience |

Body copy is sanitized HTML (`utils/content.js`), so the site can render it
directly. Content routes are authorized by sidebar item
(`middlewares/requireSidebarItem.js`): a role can manage blogs or events iff
it has that item on the Roles screen; superadmin always can.

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
