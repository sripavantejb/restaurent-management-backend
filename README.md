# RestaurantOS — backend

Database seeding and server-side notes for RestaurantOS.

## API routes

HTTP APIs are Next.js route handlers in:

`../frontend/src/app/api/`

Shared server code (models, auth, db, money, rbac) lives alongside the app in:

`../frontend/src/models/` and `../frontend/src/lib/`

## Seed

```bash
npm install
npm run seed
```

Reads `../frontend/.env.local` for `MONGODB_URI`.
