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

RestaurantOS HTTP route handlers also live under `../frontend/src/app/api/` (Next.js). The frontend uses `NEXT_PUBLIC_API_URL` pointing at this Vercel backend.
