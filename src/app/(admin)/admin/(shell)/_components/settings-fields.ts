/**
 * Site-settings field groups for /admin/settings (server-safe, no client code).
 * Keys mirror src/lib/site-defaults.ts DEFAULT_SETTINGS.
 */

export type SettingsFieldKind = "text" | "textarea" | "image" | "url" | "cv";

export type SettingsFieldDef = {
  key: string;
  label: string;
  kind: SettingsFieldKind;
  hint?: string;
  rows?: number;
};

export type SettingsGroupDef = {
  title: string;
  sub?: string;
  fields: SettingsFieldDef[];
};

export const SETTING_GROUPS: SettingsGroupDef[] = [
  {
    title: "Identity & Hero",
    sub: "Name, role, location and the hero portrait — the first screen of the site.",
    fields: [
      { key: "siteName", label: "Your name", kind: "text", hint: "Used in the brand line, hero marquee and footer." },
      { key: "email", label: "Public email", kind: "text" },
      { key: "locationText", label: "Location", kind: "text", hint: "Shown in the hero pill as “Located in …”." },
      { key: "roleLine1", label: "Role — line 1", kind: "text", hint: "e.g. Freelance" },
      { key: "roleLine2", label: "Role — line 2", kind: "text", hint: "e.g. Designer & Developer" },
      { key: "portraitUrl", label: "Hero portrait", kind: "image", hint: "Uploads go to Vercel Blob when configured." },
      { key: "portraitAlt", label: "Portrait alt text", kind: "text" },
      {
        key: "greetings",
        label: "Preloader greetings",
        kind: "textarea",
        rows: 9,
        hint: "One greeting per line, in order. The Bangla হ্যালো stays second.",
      },
      { key: "timezone", label: "Clock timezone (IANA)", kind: "text", hint: "e.g. Asia/Dhaka" },
      { key: "timezoneLabel", label: "Clock label", kind: "text", hint: "e.g. Dhaka" },
    ],
  },
  {
    title: "Home Page Copy",
    sub: "Intro paragraph under the hero.",
    fields: [
      { key: "introBig", label: "Intro — big paragraph", kind: "textarea", rows: 4 },
      { key: "introSide", label: "Intro — side paragraph", kind: "textarea", rows: 4 },
    ],
  },
  {
    title: "About Page",
    sub: "Heading, bio, counters and the education intro/closing lines.",
    fields: [
      { key: "aboutHeading", label: "Heading", kind: "textarea", rows: 2, hint: "Use a line break for the second line." },
      { key: "aboutLead", label: "Lead paragraph", kind: "textarea", rows: 3 },
      { key: "aboutBody", label: "Body paragraphs", kind: "textarea", rows: 7, hint: "Separate paragraphs with a blank line." },
      { key: "stat1Value", label: "Counter 1 — value", kind: "text" },
      { key: "stat1Label", label: "Counter 1 — label", kind: "text" },
      { key: "stat2Value", label: "Counter 2 — value", kind: "text" },
      { key: "stat2Label", label: "Counter 2 — label", kind: "text" },
      { key: "stat3Value", label: "Counter 3 — value", kind: "text" },
      { key: "stat3Label", label: "Counter 3 — label", kind: "text" },
      { key: "stat4Value", label: "Counter 4 — value", kind: "text" },
      { key: "stat4Label", label: "Counter 4 — label", kind: "text" },
      { key: "eduIntro", label: "Education — intro line", kind: "textarea", rows: 2 },
      { key: "eduClosing", label: "Education — closing line", kind: "textarea", rows: 2 },
    ],
  },
  {
    title: "Page Copy",
    sub: "Sub-headings on Work, Gallery and Contact, plus contact details.",
    fields: [
      { key: "workSub", label: "Work page — sub-heading", kind: "textarea", rows: 2 },
      { key: "gallerySub", label: "Gallery page — sub-heading", kind: "textarea", rows: 2 },
      { key: "contactSub", label: "Contact page — sub-heading", kind: "textarea", rows: 2 },
      { key: "availability", label: "Availability note", kind: "textarea", rows: 2 },
      { key: "contactLocation", label: "Contact location block", kind: "textarea", rows: 2 },
    ],
  },
  {
    title: "Socials",
    sub: "Links in the menu, footer and contact page. Paste the full URL.",
    fields: [
      { key: "socialInstagram", label: "Instagram URL", kind: "url" },
      { key: "socialLinkedin", label: "LinkedIn URL", kind: "url" },
      { key: "socialDribbble", label: "Dribbble URL", kind: "url" },
      { key: "socialGithub", label: "GitHub URL", kind: "url" },
    ],
  },
  {
    title: "CV / Résumé",
    sub: "Your CV as a PDF. The public “Download CV” button appears on the About and Contact pages only while a CV is set.",
    fields: [
      {
        key: "cvUrl",
        label: "CV file (PDF)",
        kind: "cv",
        hint: "Upload a PDF (max 10 MB) or paste a direct URL. Uploads go to Vercel Blob when configured.",
      },
    ],
  },
  {
    title: "SEO",
    sub: "Default title and description for search engines and link previews.",
    fields: [
      { key: "seoTitle", label: "Default page title", kind: "text" },
      { key: "seoDescription", label: "Default meta description", kind: "textarea", rows: 2 },
    ],
  },
];
