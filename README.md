# RestaurantOS — backend

Express API host deployed on Vercel:

https://restaurent-management-backend-sage.vercel.app

## Run locally

```bash
cp .env.example .env
npm install
npm start
```

## Seed

```bash
npm run seed
```

Loads `MONGODB_URI` from `.env` / `.env.local` / `../frontend/.env.local`.

## Deploy (Vercel)

`vercel.json` builds `index.js` with `@vercel/node`. Set env vars in the Vercel project:

- `MONGODB_URI`
- `CORS_ORIGIN` (your frontend origin(s), comma-separated)
- `APP_URL=https://restaurent-management-backend-sage.vercel.app`

## Note

This Express host exposes health checks (`/`, `/api/health`).

RestaurantOS app APIs (auth, orders, menu, …) are Next.js route handlers in
`../frontend/src/app/api/`. The frontend must call same-origin `/api/*`
(do **not** set `NEXT_PUBLIC_API_URL` to this Express URL unless those routes
are implemented here).
