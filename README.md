# Portfolio — Mohammed

Fullstack portfolio (Next.js 16 + Prisma) matching the approved
`portfolio-demo` design pixel-for-pixel, with a complete admin panel.

- **Database:** Neon Postgres only (single Prisma schema,
  `DATABASE_URL`) — local and production alike. No SQLite.
- **Uploads:** Vercel Blob (`BLOB_READ_WRITE_TOKEN`).
- **Admin:** `/admin` — email + password (DB-backed). Seeded login:
  `` / `` — change it in
  Admin → Profile immediately.

Setup and deployment steps: see **DEPLOY.md**.

```powershell
npm install
# .env with DATABASE_URL (Neon pooled), BLOB_READ_WRITE_TOKEN, SESSION_SECRET
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

The seed is create-only and safe to re-run — admin edits survive it.
