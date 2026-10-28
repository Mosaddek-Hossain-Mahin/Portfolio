"use client";

import EntityManager, { type EntityConfig } from "./EntityManager";

const WORK_CAT_OPTIONS = [
  { value: "design", label: "Design" },
  { value: "development", label: "Development" },
  { value: "branding", label: "Branding" },
  { value: "motion", label: "Motion" },
];

export const PROJECT_CONFIG: EntityConfig = {
  api: "/api/admin/projects",
  title: "Projects",
  sub: "Case studies shown on Home (first 4) and the Work page. The “Visit live site” button appears only when a Live URL is set.",
  singular: "project",
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "slug", label: "Slug", type: "text", hint: "URL part: /work/<slug>. Auto-made from the title when empty." },
    { key: "category", label: "Category", type: "select", options: WORK_CAT_OPTIONS },
    { key: "catLabel", label: "Category label", type: "text", hint: "e.g. Web Design · Development" },
    { key: "year", label: "Year", type: "text" },
    { key: "client", label: "Client", type: "text" },
    { key: "role", label: "Role", type: "text" },
    { key: "tagline", label: "Tagline", type: "text", full: true },
    { key: "services", label: "Services", type: "list", full: true },
    { key: "heroImage", label: "Hero image", type: "image", full: true },
    { key: "heroAlt", label: "Hero image alt", type: "text", full: true },
    { key: "thumb", label: "Card thumbnail", type: "image", full: true, hint: "Leave empty for the motion-cover treatment (showreel projects)." },
    { key: "thumbAlt", label: "Thumbnail alt", type: "text", full: true },
    { key: "challenge", label: "The challenge", type: "textarea", rows: 5, full: true },
    { key: "built", label: "What I built", type: "textarea", rows: 5, full: true },
    { key: "outcome", label: "The outcome", type: "textarea", rows: 5, full: true },
    { key: "stats", label: "Stats (3)", type: "stats", full: true },
    { key: "images", label: "Detail image pair", type: "images", full: true },
    { key: "tech", label: "Technologies used", type: "list", full: true },
    { key: "liveUrl", label: "Live URL", type: "text", full: true, hint: "Optional. The Visit-live-site button is hidden while this is empty." },
    { key: "videoUrl", label: "Project video", type: "video", full: true, hint: "Optional. Shown as its own video block under the hero image on the project page. Hidden while empty." },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "featured", label: "Featured (Home grid)", type: "checkbox" },
    { key: "visible", label: "Visible on the site", type: "checkbox" },
  ],
  label: (r) => String(r.title ?? ""),
  subLabel: (r) => `/work/${String(r.slug ?? "")} · ${String(r.catLabel ?? "")} · ${String(r.year ?? "")}`,
};

export const TECHNOLOGY_CONFIG: EntityConfig = {
  api: "/api/admin/technologies",
  title: "Technologies",
  sub: "The floating bubbles in “My Stack” on the home page.",
  singular: "technology",
  fields: [
    { key: "name", label: "Name", type: "text", required: true },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "frontend", label: "Frontend" },
        { value: "backend", label: "Backend" },
        { value: "languages", label: "Languages" },
        { value: "database", label: "Database" },
        { value: "tools", label: "Tools & AI" },
      ],
    },
    { key: "catLabel", label: "Category label", type: "text", hint: "e.g. Tools & AI" },
    { key: "logo", label: "Logo (SVG)", type: "image", full: true },
    { key: "darkBubble", label: "Dark bubble (for white logos)", type: "checkbox" },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "visible", label: "Visible on the site", type: "checkbox" },
  ],
  label: (r) => String(r.name ?? ""),
  subLabel: (r) => String(r.catLabel ?? r.category ?? ""),
};

export const EDUCATION_CONFIG: EntityConfig = {
  api: "/api/admin/education",
  title: "Education",
  sub: "The “How I Got Here” story chapters on the About page (shown in chronological order).",
  singular: "education item",
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "kicker", label: "Chapter kicker", type: "text", hint: "e.g. The Spark / The Foundation / The Craft" },
    { key: "org", label: "Institution", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "period", label: "Period", type: "text", hint: "e.g. 2015 — 2019 (the story sorts by the first year)" },
    { key: "image", label: "Photo", type: "image", full: true },
    { key: "imageAlt", label: "Photo alt text", type: "text", full: true },
    { key: "desc", label: "Story text", type: "textarea", rows: 5, full: true },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "visible", label: "Visible on the site", type: "checkbox" },
  ],
  label: (r) => String(r.title ?? ""),
  subLabel: (r) => `${String(r.org ?? "")} · ${String(r.period ?? "")}`,
};

export const EXPERIENCE_CONFIG: EntityConfig = {
  api: "/api/admin/experience",
  title: "Experience",
  sub: "Roles timeline on the About page, newest first.",
  singular: "experience item",
  fields: [
    { key: "role", label: "Role", type: "text", required: true },
    { key: "org", label: "Organization", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "period", label: "Period", type: "text", hint: "e.g. 2021 — Present" },
    { key: "points", label: "Highlights", type: "list", full: true },
    { key: "tech", label: "Technologies", type: "list", full: true },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "visible", label: "Visible on the site", type: "checkbox" },
  ],
  label: (r) => String(r.role ?? ""),
  subLabel: (r) => `${String(r.org ?? "")} · ${String(r.period ?? "")}`,
};

export const CERT_CONFIG: EntityConfig = {
  api: "/api/admin/certifications",
  title: "Certifications & Awards",
  sub: "Credential cards on the About page.",
  singular: "certification / award",
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "issuer", label: "Issuer", type: "text" },
    { key: "year", label: "Year", type: "text" },
    {
      key: "type",
      label: "Type",
      type: "select",
      options: [
        { value: "CERTIFICATION", label: "Certification (outlined tag)" },
        { value: "AWARD", label: "Award (filled tag)" },
      ],
    },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "visible", label: "Visible on the site", type: "checkbox" },
  ],
  label: (r) => String(r.title ?? ""),
  subLabel: (r) => `${String(r.issuer ?? "")} · ${String(r.year ?? "")}`,
};

export const TESTIMONIAL_CONFIG: EntityConfig = {
  api: "/api/admin/testimonials",
  title: "Testimonials",
  sub: "“What Clients Say” cards on the home page.",
  singular: "testimonial",
  fields: [
    { key: "quote", label: "Quote", type: "textarea", rows: 4, full: true, required: true },
    { key: "name", label: "Name", type: "text" },
    { key: "initials", label: "Initials (avatar)", type: "text", hint: "e.g. JW" },
    { key: "role", label: "Role line", type: "text", hint: "e.g. Founder, Nordhaus Studio — Berlin", full: true },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "visible", label: "Visible on the site", type: "checkbox" },
  ],
  label: (r) => String(r.name ?? ""),
  subLabel: (r) => String(r.role ?? ""),
};

export const GALLERY_CONFIG: EntityConfig = {
  api: "/api/admin/gallery",
  title: "Gallery",
  sub: "Photos on the Gallery page and the home-page strip (first 6).",
  singular: "gallery item",
  fields: [
    { key: "title", label: "Title", type: "text", required: true },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "design", label: "Design" },
        { value: "development", label: "Development" },
        { value: "workspace", label: "Workspace" },
        { value: "personal", label: "Personal" },
      ],
    },
    { key: "catLabel", label: "Category label", type: "text" },
    { key: "image", label: "Image", type: "image", full: true },
    { key: "caption", label: "Caption", type: "text", full: true },
    { key: "alt", label: "Alt text", type: "text", full: true },
    {
      key: "ratio",
      label: "Masonry shape",
      type: "select",
      options: [
        { value: "ar-wide", label: "Wide" },
        { value: "ar-tall", label: "Tall" },
        { value: "ar-sq", label: "Square" },
      ],
    },
    { key: "sortOrder", label: "Sort order", type: "number" },
    { key: "visible", label: "Visible on the site", type: "checkbox" },
  ],
  label: (r) => String(r.title ?? ""),
  subLabel: (r) => `${String(r.catLabel ?? "")} · ${String(r.caption ?? "")}`,
};

export { EntityManager };
