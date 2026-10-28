// Default site settings — the approved demo's placeholder branding.
// The seed writes these once (create-only); Admin → Settings edits the
// SiteSetting rows afterwards. getSettings() merges DB rows over these.

export const DEFAULT_SETTINGS: Record<string, string> = {
  siteName: "Mohammed",
  email: "hello@mohammed.studio",
  locationText: "Dhaka, Bangladesh",
  roleLine1: "Freelance",
  roleLine2: "Designer & Developer",
  portraitUrl: "/assets/portrait.png",
  portraitAlt: "Illustrated portrait of Mohammed, designer and developer",
  greetings: "Hello\nহ্যালো\nBonjour\nHola\nCiao\nHallo\nOlá\nHej\nこんにちは",
  timezone: "Asia/Dhaka",
  timezoneLabel: "Dhaka",

  // CV / résumé file (Admin → Settings → CV / Résumé). Empty = the public
  // "Download CV" buttons are hidden everywhere (same rule as liveUrl).
  cvUrl: "",

  introBig:
    "I help brands and startups turn fuzzy ideas into sharp, memorable digital products — websites, apps and identities that feel effortless to use and impossible to ignore.",
  introSide:
    "I'm Mohammed, a freelance designer & developer based in Dhaka. For the past five years I've been designing and building for clients across three continents — always independent, always hands-on, from first sketch to final deploy.",

  aboutHeading: "Designing calm,\nuseful digital products",
  aboutLead:
    "I'm Mohammed — a designer who codes and a developer who sweats the kerning. I believe the best digital products are quiet, fast and a little bit playful.",
  aboutBody:
    "I started out designing posters and brand identities in Dhaka, fell in love with the web, and taught myself to build the things I was drawing. Five years on, I work with founders, studios and marketing teams around the world — usually as the one person who carries a project from first workshop to production deploy.\n\nMy sweet spot sits between design and engineering: design systems that developers actually enjoy using, and front-ends that feel as considered as the mockups they came from. When I'm not pushing pixels, I'm probably sketching type, riding through Dhaka traffic, or brewing coffee number three.",
  stat1Value: "5",
  stat1Label: "Years of practice",
  stat2Value: "60",
  stat2Label: "Projects shipped",
  stat3Value: "40",
  stat3Label: "Happy clients",
  stat4Value: "9",
  stat4Label: "Design awards",

  eduIntro:
    "Three chapters, one thread — a science classroom in Dhaka, a computer lab, and a design studio. This is the road that led to the work.",
  eduClosing:
    "Science taught me how things work, code taught me how to build them, design taught me how they should feel — and that's the foundation behind every project in my Work.",

  workSub:
    "A selection of projects from the last few years — client work, collaborations and a few things built purely for the joy of it.",
  gallerySub:
    "Process shots, studio moments and frames from around Dhaka — the work between the case studies. Click any image to view it full-size.",
  contactSub:
    "Have a project in mind, or just want to say hello? My inbox is always open — I usually reply within one working day.",
  availability: "Booking new projects for\nNovember 2026 onwards",
  contactLocation: "Dhaka, Bangladesh\nWorking worldwide, remotely",

  socialInstagram: "#",
  socialLinkedin: "#",
  socialDribbble: "#",
  socialGithub: "#",

  seoTitle: "Mohammed — Designer & Developer",
  seoDescription:
    "Mohammed — Freelance Designer & Developer based in Dhaka, Bangladesh. Websites, apps, brands and motion.",

  navItems: JSON.stringify([
    { label: "Work", href: "/work", visible: true },
    { label: "About", href: "/about", visible: true },
    { label: "Gallery", href: "/gallery", visible: true },
    { label: "Contact", href: "/contact", visible: true },
  ]),
};

export const ADMIN_DEFAULT = {
  name: "Mohammed",
  email: "admin@portfolio.local",
  // Seeded password is "changeme123" — change it in Admin → Profile
  // immediately after first login (see DEPLOY.md).
};
