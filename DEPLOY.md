# Portfolio — Setup & Deployment

A Next.js 16 + Prisma portfolio with a full admin panel. The public site
matches the approved demo exactly; all content is editable in `/admin`.

**Services used (both local and production):**

- **Neon Postgres** — the only database. There is no SQLite and no local
  database option: your computer and Vercel both connect to Neon.
- **Vercel Blob** — all image uploads (portrait, project images, gallery,
  logos) are stored in Blob.

---

## 1. Local run (Windows, PowerShell)

### One-time: create the two services

1. **Neon** — go to [neon.tech](https://neon.tech), create a project, then
   copy the **pooled** connection string (Connection Details → check
   "Pooled connection"). It looks like
   `postgresql://user:pass@ep-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require`.
2. **Vercel Blob** — go to [vercel.com](https://vercel.com) → Storage →
   create a Blob store, then copy its `BLOB_READ_WRITE_TOKEN`
   (starts with `vercel_blob_rw_`).

### .env

Copy `.env.example` to `.env` and fill in:

```
DATABASE_URL="your Neon pooled connection string"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
SESSION_SECRET="any long random string"
```

### Commands (run in the project folder)

```powershell
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000 — admin at http://localhost:3000/admin

> Run the four commands directly like this. Do **not** use helper scripts —
> direct commands are the reliable path on Windows.

The seed is safe to re-run: it only creates content that is missing, so
your admin edits are never overwritten.

### First login — change the password

- Email: `admin@portfolio.local`
- Password: `changeme123`

Log in, go to **Admin → Profile**, and change the password immediately.
Set a real `SESSION_SECRET` in `.env` as well.

---

## 2. Production (Vercel)

1. Push the project to a Git repo and import it in Vercel (or run
   `vercel` in the project folder).
2. In the Vercel project → Settings → Environment Variables, add:
   - `DATABASE_URL` — the same Neon **pooled** connection string
   - `BLOB_READ_WRITE_TOKEN` — the Blob token
   - `SESSION_SECRET` — a long random string (different from local)
   - `NEXT_PUBLIC_SITE_URL` — your real domain, e.g. `https://yourname.com`
     (used for sitemap / share links)
3. Create the tables and seed **once** against production. From your
   computer, point `.env` at the production Neon string (it is the same
   database) and run:

   ```powershell
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

4. Deploy. Log in at `https://your-domain/admin` and change the default
   password right away.

---

## 3. Optional: email notifications for contact messages

Contact-form messages are **always** saved in the database and shown in
**Admin → Messages**, with or without email setup.

To also receive an email for each new message, add these to `.env`
(locally) and to Vercel's environment variables (production):

```
RESEND_API_KEY="re_..."          # from resend.com (free tier is fine)
CONTACT_NOTIFY_EMAIL="you@example.com"   # where notifications go
CONTACT_FROM_EMAIL="portfolio@your-domain.com"  # verified sender in Resend
```

Leave them unset to disable email notifications — nothing breaks.

---

## 4. New options (CV + project video)

- **Download CV** — in **Admin → Settings → CV / Résumé**, upload your CV
  as a PDF (max 10 MB, stored in Blob like other uploads) or paste a direct
  URL. The public **Download CV** button then appears on the About page
  (under the bio) and the Contact page (under the heading). Remove the CV
  in Settings and the buttons disappear — they only show while a CV is set.
  This is a settings value, so **no database migration is needed** for it.
- **Project video** — in **Admin → Projects**, each project has a
  **Project video** field (Upload | YouTube | Vimeo | Direct URL tabs;
  uploads up to 100 MB go to Blob). On the project's public page the video
  appears as its **own block under the hero image** (uploaded files play in
  a native player with the hero image as poster; YouTube/Vimeo links embed
  properly). Projects without a video show no block.
- **Database change**: the project video adds one column
  (`Project.videoUrl`). After updating to this version, run
  `npx prisma db push` once (locally and against production) — it is a
  nullable column, so existing content is untouched. The seed does not
  need to be re-run for these options.

---

## 5. Notes

- **Spam protection** is built in: a hidden honeypot field plus a per-IP
  rate limit (5 messages per 10 minutes) on the contact endpoint.
- **“Visit live site” button**: a project detail page shows it only when
  that project has a Live URL set in Admin → Projects. Seeded demo projects
  have none, so no dead links ship.
- **Uploads** go to Vercel Blob whenever `BLOB_READ_WRITE_TOKEN` is set.
- Back up the Neon database from the Neon dashboard (Point-in-time
  restore / branches) before major content edits.
