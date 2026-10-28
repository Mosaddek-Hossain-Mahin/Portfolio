// Public-site content getters. Each merges live database rows over the
// demo defaults, so the site renders the approved demo even before the
// seed runs, and admin edits take over as soon as rows exist.
// All getters are React-cached and never throw.

import { cache } from "react";
import { db } from "./db";
import { DEFAULT_SETTINGS } from "./site-defaults";
import {
  PROJECT_DEFAULTS,
  TECHNOLOGY_DEFAULTS,
  EDUCATION_DEFAULTS,
  EXPERIENCE_DEFAULTS,
  TESTIMONIAL_DEFAULTS,
  CERT_DEFAULTS,
  GALLERY_DEFAULTS,
} from "./demo-data";

export const getSettings = cache(async (): Promise<Record<string, string>> => {
  try {
    const rows = await db.siteSetting.findMany();
    const merged = { ...DEFAULT_SETTINGS };
    for (const r of rows) merged[r.key] = r.value;
    return merged;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
});

export type NavItem = { label: string; href: string; visible: boolean };

export function parseNavItems(raw: string | undefined | null): NavItem[] {
  const fallback: NavItem[] = [
    { label: "Work", href: "/work", visible: true },
    { label: "About", href: "/about", visible: true },
    { label: "Gallery", href: "/gallery", visible: true },
    { label: "Contact", href: "/contact", visible: true },
  ];
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return fallback;
    const items = parsed
      .filter(
        (i): i is NavItem =>
          !!i &&
          typeof i === "object" &&
          typeof (i as NavItem).label === "string" &&
          typeof (i as NavItem).href === "string" &&
          (i as NavItem).href.startsWith("/")
      )
      .map((i) => ({ label: i.label, href: i.href, visible: i.visible !== false }));
    return items.length ? items : fallback;
  } catch {
    return fallback;
  }
}

// ---- View models (shape the public components consume) ----

export type ProjectView = {
  id: string;
  slug: string;
  title: string;
  category: string;
  catLabel: string;
  year: string;
  tagline: string;
  client: string;
  role: string;
  services: string[];
  heroImage: string;
  heroAlt: string;
  thumb: string | null;
  thumbAlt: string;
  challenge: string;
  built: string;
  outcome: string;
  stats: { n: string; l: string }[];
  images: { img: string; alt: string }[];
  tech: string[];
  liveUrl: string | null;
  videoUrl: string | null;
  featured: boolean;
};

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const getProjects = cache(async (): Promise<ProjectView[]> => {
  try {
    const rows = await db.project.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) throw new Error("empty");
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      category: r.category,
      catLabel: r.catLabel,
      year: r.year,
      tagline: r.tagline,
      client: r.client,
      role: r.role,
      services: parseJson<string[]>(r.services, []),
      heroImage: r.heroImage,
      heroAlt: r.heroAlt,
      thumb: r.thumb,
      thumbAlt: r.thumbAlt,
      challenge: r.challenge,
      built: r.built,
      outcome: r.outcome,
      stats: parseJson<{ n: string; l: string }[]>(r.stats, []),
      images: parseJson<{ img: string; alt: string }[]>(r.images, []),
      tech: parseJson<string[]>(r.tech, []),
      liveUrl: r.liveUrl,
      videoUrl: r.videoUrl,
      featured: r.featured,
    }));
  } catch {
    return PROJECT_DEFAULTS.map((p) => ({ id: p.slug, ...p }));
  }
});

export type TechnologyView = {
  id: string;
  name: string;
  category: string;
  catLabel: string;
  logo: string;
  darkBubble: boolean;
};

export const getTechnologies = cache(async (): Promise<TechnologyView[]> => {
  try {
    const rows = await db.technology.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) throw new Error("empty");
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      catLabel: r.catLabel,
      logo: r.logo,
      darkBubble: r.darkBubble,
    }));
  } catch {
    return TECHNOLOGY_DEFAULTS.map((t, i) => ({ id: String(i), ...t }));
  }
});

export type EducationView = {
  id: string;
  title: string;
  org: string;
  location: string;
  period: string;
  kicker: string;
  image: string;
  imageAlt: string;
  desc: string;
};

export const getEducation = cache(async (): Promise<EducationView[]> => {
  let items: EducationView[];
  try {
    const rows = await db.educationItem.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) throw new Error("empty");
    items = rows.map((r) => ({
      id: r.id,
      title: r.title,
      org: r.org,
      location: r.location,
      period: r.period,
      kicker: r.kicker,
      image: r.image,
      imageAlt: r.imageAlt,
      desc: r.desc,
    }));
  } catch {
    items = EDUCATION_DEFAULTS.map((e, i) => ({ id: String(i), ...e }));
  }
  // The story reads chronologically (demo: EDU_STORY sorted by start year).
  return items
    .slice()
    .sort((a, b) => parseInt(a.period, 10) - parseInt(b.period, 10));
});

export type ExperienceView = {
  id: string;
  role: string;
  org: string;
  location: string;
  period: string;
  points: string[];
  tech: string[];
};

export const getExperience = cache(async (): Promise<ExperienceView[]> => {
  try {
    const rows = await db.experienceItem.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) throw new Error("empty");
    return rows.map((r) => ({
      id: r.id,
      role: r.role,
      org: r.org,
      location: r.location,
      period: r.period,
      points: parseJson<string[]>(r.points, []),
      tech: parseJson<string[]>(r.tech, []),
    }));
  } catch {
    return EXPERIENCE_DEFAULTS.map((e, i) => ({ id: String(i), ...e }));
  }
});

export type TestimonialView = {
  id: string;
  quote: string;
  name: string;
  initials: string;
  role: string;
};

export const getTestimonials = cache(async (): Promise<TestimonialView[]> => {
  try {
    const rows = await db.testimonial.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) throw new Error("empty");
    return rows.map((r) => ({
      id: r.id,
      quote: r.quote,
      name: r.name,
      initials: r.initials,
      role: r.role,
    }));
  } catch {
    return TESTIMONIAL_DEFAULTS.map((t, i) => ({ id: String(i), ...t }));
  }
});

export type CertView = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  type: "CERTIFICATION" | "AWARD";
};

export const getCertifications = cache(async (): Promise<CertView[]> => {
  try {
    const rows = await db.certification.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) throw new Error("empty");
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      issuer: r.issuer,
      year: r.year,
      type: r.type,
    }));
  } catch {
    return CERT_DEFAULTS.map((c, i) => ({ id: String(i), ...c }));
  }
});

export type GalleryView = {
  id: string;
  title: string;
  category: string;
  catLabel: string;
  image: string;
  caption: string;
  alt: string;
  ratio: string;
};

export const getGallery = cache(async (): Promise<GalleryView[]> => {
  try {
    const rows = await db.galleryItem.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) throw new Error("empty");
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      catLabel: r.catLabel,
      image: r.image,
      caption: r.caption,
      alt: r.alt,
      ratio: r.ratio,
    }));
  } catch {
    return GALLERY_DEFAULTS.map((g, i) => ({ id: String(i), ...g }));
  }
});
