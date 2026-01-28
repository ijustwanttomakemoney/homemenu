# Home Menu

Notion-like, grid-first gallery of home-cooked dishes.

## Local dev

```bash
npm install
npm run dev
```

## Persistent storage (Vercel Postgres + Vercel Blob)

This app stores:
- dish metadata in **Postgres**
- photos in **Vercel Blob** (public URLs)

### 1) Add storage in Vercel
In your Vercel project dashboard:
- Storage → **Create Postgres** → connect to this project
- Storage → **Create Blob** → connect to this project

Vercel will add env vars like:
- `POSTGRES_URL` (required)
- `BLOB_READ_WRITE_TOKEN` (required)

Redeploy after adding storage.

### 2) Create table
Run this in the Postgres “Query” console in Vercel:

```sql
create table if not exists dishes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  note text,
  photo_url text not null,
  tags jsonb,
  created_at timestamptz not null default now()
);
```

## Notes
- This app is public and has no auth (by design for now).
- Delete is available on hover (desktop) and always visible on mobile.
