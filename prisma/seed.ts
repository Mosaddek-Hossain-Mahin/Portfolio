// Seed the portfolio database with the approved demo's placeholder content.
//
// CREATE-ONLY / idempotent (same rule as stitch-bd's corrected seed):
// - settings: upsert with an EMPTY update — admin edits survive re-seeds
// - admin user: created once, never overwritten
// - content collections: seeded only while their table is empty
// Safe to re-run at any time: `npm run db:seed`.
//
// Runs against Neon Postgres via DATABASE_URL (local and production alike).

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEFAULT_SETTINGS, ADMIN_DEFAULT } from "../src/lib/site-defaults.ts";
import {
  PROJECT_DEFAULTS,
  TECHNOLOGY_DEFAULTS,
  EDUCATION_DEFAULTS,
  EXPERIENCE_DEFAULTS,
  TESTIMONIAL_DEFAULTS,
  CERT_DEFAULTS,
  GALLERY_DEFAULTS,
} from "../src/lib/demo-data.ts";

const db = new PrismaClient();

async function main() {
  // ---- Admin user (create-only) ----
  const passwordHash = await bcrypt.hash("changeme123", 12);
  await db.adminUser.upsert({
    where: { email: ADMIN_DEFAULT.email },
    update: {},
    create: {
      name: ADMIN_DEFAULT.name,
      email: ADMIN_DEFAULT.email,
      passwordHash,
    },
  });
  console.log(`Admin user ready: ${ADMIN_DEFAULT.email} (default password: changeme123 — change it in Admin → Profile)`);

  // ---- Site settings (create-only: empty update) ----
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log(`Settings ready (${Object.keys(DEFAULT_SETTINGS).length} keys).`);

  // ---- Content collections (seed only when empty) ----
  if ((await db.project.count()) === 0) {
    for (const p of PROJECT_DEFAULTS) {
      await db.project.create({
        data: {
          slug: p.slug,
          title: p.title,
          category: p.category,
          catLabel: p.catLabel,
          year: p.year,
          tagline: p.tagline,
          client: p.client,
          role: p.role,
          services: JSON.stringify(p.services),
          heroImage: p.heroImage,
          heroAlt: p.heroAlt,
          thumb: p.thumb,
          thumbAlt: p.thumbAlt,
          challenge: p.challenge,
          built: p.built,
          outcome: p.outcome,
          stats: JSON.stringify(p.stats),
          images: JSON.stringify(p.images),
          tech: JSON.stringify(p.tech),
          liveUrl: p.liveUrl,
          videoUrl: p.videoUrl ?? null,
          sortOrder: p.sortOrder,
          featured: p.featured,
          visible: p.visible,
        },
      });
    }
    console.log(`Projects seeded (${PROJECT_DEFAULTS.length}).`);
  } else {
    console.log("Projects already present — skipped.");
  }

  if ((await db.technology.count()) === 0) {
    for (const t of TECHNOLOGY_DEFAULTS) {
      await db.technology.create({ data: { ...t } });
    }
    console.log(`Technologies seeded (${TECHNOLOGY_DEFAULTS.length}).`);
  } else {
    console.log("Technologies already present — skipped.");
  }

  if ((await db.educationItem.count()) === 0) {
    for (const e of EDUCATION_DEFAULTS) {
      await db.educationItem.create({ data: { ...e } });
    }
    console.log(`Education seeded (${EDUCATION_DEFAULTS.length}).`);
  } else {
    console.log("Education already present — skipped.");
  }

  if ((await db.experienceItem.count()) === 0) {
    for (const e of EXPERIENCE_DEFAULTS) {
      await db.experienceItem.create({
        data: {
          role: e.role,
          org: e.org,
          location: e.location,
          period: e.period,
          points: JSON.stringify(e.points),
          tech: JSON.stringify(e.tech),
          sortOrder: e.sortOrder,
          visible: e.visible,
        },
      });
    }
    console.log(`Experience seeded (${EXPERIENCE_DEFAULTS.length}).`);
  } else {
    console.log("Experience already present — skipped.");
  }

  if ((await db.testimonial.count()) === 0) {
    for (const t of TESTIMONIAL_DEFAULTS) {
      await db.testimonial.create({ data: { ...t } });
    }
    console.log(`Testimonials seeded (${TESTIMONIAL_DEFAULTS.length}).`);
  } else {
    console.log("Testimonials already present — skipped.");
  }

  if ((await db.certification.count()) === 0) {
    for (const c of CERT_DEFAULTS) {
      await db.certification.create({ data: { ...c } });
    }
    console.log(`Certifications seeded (${CERT_DEFAULTS.length}).`);
  } else {
    console.log("Certifications already present — skipped.");
  }

  if ((await db.galleryItem.count()) === 0) {
    for (const g of GALLERY_DEFAULTS) {
      await db.galleryItem.create({ data: { ...g } });
    }
    console.log(`Gallery seeded (${GALLERY_DEFAULTS.length}).`);
  } else {
    console.log("Gallery already present — skipped.");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
