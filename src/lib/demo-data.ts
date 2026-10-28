// Demo content defaults — extracted verbatim from the approved
// `portfolio-demo` artifact's data arrays. Used as (a) seed content and
// (b) fallback content when the database has no rows yet, so the site
// always renders the approved demo until the admin edits it.

export type ProjectDefault = {
  slug: string; title: string; category: string; catLabel: string; year: string;
  tagline: string; client: string; role: string; services: string[];
  heroImage: string; heroAlt: string; thumb: string | null; thumbAlt: string;
  challenge: string; built: string; outcome: string;
  stats: { n: string; l: string }[]; images: { img: string; alt: string }[];
  tech: string[]; liveUrl: string | null; videoUrl: string | null; sortOrder: number; featured: boolean; visible: boolean;
};

export const PROJECT_DEFAULTS: ProjectDefault[] = [
  {
    "slug": "nordhaus-studio",
    "title": "Nordhaus Studio",
    "category": "branding",
    "catLabel": "Brand Identity",
    "year": "2025",
    "tagline": "A new identity for a Berlin architecture studio that had outgrown its name-only logo.",
    "client": "Nordhaus Studio, Berlin",
    "role": "Brand Designer",
    "services": [
      "Brand Identity",
      "Art Direction",
      "Print Design"
    ],
    "heroImage": "/assets/project-branding.webp",
    "heroAlt": "Nordhaus architecture studio brand identity — folder, letterhead and business cards",
    "thumb": "/assets/project-branding.webp",
    "thumbAlt": "Nordhaus architecture studio brand identity — folder, letterhead and business cards",
    "challenge": "Nordhaus had fifteen years of award-winning buildings behind it, but its identity was a typed wordmark from the founding year — it said nothing about the studio's precise, material-driven way of working, and it fell apart everywhere from site hoardings to pitch decks.",
    "built": "I built the identity around the studio's drawing habits: a strict grid, one confident grotesque, and a palette pulled from concrete, steel and tracing paper. The system covers the wordmark, stationery, project folders, signage and a compact set of brand guidelines the team can actually follow — plus a one-page launch site to carry the new identity online.",
    "outcome": "The studio launched the identity alongside its new workspace and now uses the same system across print, site hoardings and competition boards — no more one-off documents drifting off-brand.",
    "stats": [
      {
        "n": "+38%",
        "l": "More project enquiries in the first quarter"
      },
      {
        "n": "24",
        "l": "Print and digital pieces in the system"
      },
      {
        "n": "6 wks",
        "l": "From first workshop to full delivery"
      }
    ],
    "images": [
      {
        "img": "/assets/gallery-studio.jpg",
        "alt": "Studio table covered with printed brand designs, samples and a laptop"
      },
      {
        "img": "/assets/edu-diploma.jpg",
        "alt": "Design studio desk with colour swatches, layout proofs and typography posters on the wall"
      }
    ],
    "tech": [
      "HTML5",
      "CSS3",
      "JavaScript"
    ],
    "liveUrl": null, "videoUrl": null,
    "sortOrder": 0,
    "featured": true,
    "visible": true
  },
  {
    "slug": "loom-and-thread",
    "title": "Loom & Thread",
    "category": "design",
    "catLabel": "Web Design · Development",
    "year": "2025",
    "tagline": "A slower, warmer storefront for a slow-fashion label selling worldwide from Dhaka.",
    "client": "Loom & Thread",
    "role": "Designer & Developer",
    "services": [
      "Web Design",
      "Development",
      "E-Commerce"
    ],
    "heroImage": "/assets/project-web.jpg",
    "heroAlt": "Loom & Thread website redesign shown on a laptop",
    "thumb": "/assets/project-web.jpg",
    "thumbAlt": "Loom & Thread website redesign shown on a laptop",
    "challenge": "The label's old shop buried its best story — hand-loomed fabric, named weavers, small batches — under a generic template. On mobile, where most of its audience shops, the product pages were slow and the sizing information was nearly impossible to find.",
    "built": "I redesigned and rebuilt the storefront around the making process: generous photography, a 'meet the weaver' note on every product, and sizing that sits one tap away instead of three pages deep. The build is a fast Next.js front end with a simple CMS the two-person team updates themselves.",
    "outcome": "The new store feels like the clothes — unhurried but precise — and the team now launches a collection in an afternoon instead of a week of wrestling with the old template.",
    "stats": [
      {
        "n": "+64%",
        "l": "Conversion rate after relaunch"
      },
      {
        "n": "1.1s",
        "l": "Median page load on mobile"
      },
      {
        "n": "2×",
        "l": "Average order value"
      }
    ],
    "images": [
      {
        "img": "/assets/gallery-sketch.jpg",
        "alt": "Hands sketching website wireframes in a notebook with sticky notes and swatches"
      },
      {
        "img": "/assets/gallery-desk.jpg",
        "alt": "Designer workspace with a laptop showing a website design, tablet and sketchbook"
      }
    ],
    "tech": [
      "Next.js",
      "Tailwind CSS",
      "JavaScript",
      "PostgreSQL",
      "Postman"
    ],
    "liveUrl": null, "videoUrl": null,
    "sortOrder": 1,
    "featured": true,
    "visible": true
  },
  {
    "slug": "pulsefit",
    "title": "PulseFit",
    "category": "development",
    "catLabel": "Mobile App · UI Design",
    "year": "2024",
    "tagline": "Workout tracking that reads at a glance, mid-set, with chalk on your hands.",
    "client": "PulseFit Health",
    "role": "Product Designer & Front-End Developer",
    "services": [
      "Mobile App",
      "UI Design",
      "Prototyping"
    ],
    "heroImage": "/assets/project-app.webp",
    "heroAlt": "PulseFit fitness app screens on two floating phones",
    "thumb": "/assets/project-app.webp",
    "thumbAlt": "PulseFit fitness app screens on two floating phones",
    "challenge": "PulseFit's first version tracked everything and surfaced nothing: users opened the app mid-workout and had to dig through four screens to log a set. Retention after the first week was under ten percent.",
    "built": "I redesigned the logging flow around a single thumb-reachable action and built the front end with the team — big type, high contrast, and a rest timer that runs the screen instead of hiding in it. Every flow was prototyped and tested with gym-goers before a line of production code was written.",
    "outcome": "Logging a set now takes two taps, and the app has picked up a steady audience of lifters who describe it — in reviews, unprompted — as 'the first tracker that gets out of the way'.",
    "stats": [
      {
        "n": "4.8★",
        "l": "Average store rating"
      },
      {
        "n": "120k",
        "l": "Downloads in the first year"
      },
      {
        "n": "31%",
        "l": "Day-30 retention, up from 9%"
      }
    ],
    "images": [
      {
        "img": "/assets/gallery-code.jpg",
        "alt": "Code editor with front-end code on a widescreen monitor in a dim studio"
      },
      {
        "img": "/assets/gallery-desk.jpg",
        "alt": "Designer workspace with a laptop showing a website design, tablet and sketchbook"
      }
    ],
    "tech": [
      "JavaScript",
      "Node.js",
      "MongoDB",
      "Postman",
      "VS Code"
    ],
    "liveUrl": null, "videoUrl": null,
    "sortOrder": 2,
    "featured": true,
    "visible": true
  },
  {
    "slug": "insightboard",
    "title": "Insightboard",
    "category": "development",
    "catLabel": "Web App · Dashboard",
    "year": "2024",
    "tagline": "Dense analytics, calmly arranged — a dashboard finance teams actually keep open.",
    "client": "Insightboard",
    "role": "Lead Product Designer",
    "services": [
      "Web App",
      "Dashboard UI",
      "Design System"
    ],
    "heroImage": "/assets/project-dashboard.jpg",
    "heroAlt": "Insightboard analytics dashboard interface on a monitor",
    "thumb": "/assets/project-dashboard.jpg",
    "thumbAlt": "Insightboard analytics dashboard interface on a monitor",
    "challenge": "Insightboard's data was powerful and its interface was punishing: eleven chart types competing on one screen, no hierarchy, and every new feature bolted on in a slightly different style. Support tickets asking 'where did that number go' were a weekly ritual.",
    "built": "I audited every screen with the support team, then rebuilt the interface on a small design system — one chart grammar, one spacing scale, three levels of emphasis. The dashboard now leads with the four numbers each role cares about and lets everything else be one deliberate click away.",
    "outcome": "The redesign shipped to all enterprise accounts without a single training session, and the design system has carried three major features since — each one designed in days, not weeks.",
    "stats": [
      {
        "n": "−42%",
        "l": "Time to find a key metric"
      },
      {
        "n": "18",
        "l": "Components in the design system"
      },
      {
        "n": "9",
        "l": "Enterprise clients onboarded"
      }
    ],
    "images": [
      {
        "img": "/assets/gallery-code.jpg",
        "alt": "Code editor with front-end code on a widescreen monitor in a dim studio"
      },
      {
        "img": "/assets/gallery-sketch.jpg",
        "alt": "Hands sketching website wireframes in a notebook with sticky notes and swatches"
      }
    ],
    "tech": [
      "Next.js",
      "JavaScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Node.js"
    ],
    "liveUrl": null, "videoUrl": null,
    "sortOrder": 3,
    "featured": true,
    "visible": true
  },
  {
    "slug": "terra-coffee",
    "title": "Terra Coffee",
    "category": "design",
    "catLabel": "E-Commerce · Web Design",
    "year": "2025",
    "tagline": "A Dhaka roastery's shop window to the world — subscriptions, stories and very fresh beans.",
    "client": "Terra Coffee Roasters",
    "role": "Designer & Developer",
    "services": [
      "E-Commerce",
      "Web Design",
      "Development"
    ],
    "heroImage": "/assets/project-coffee.webp",
    "heroAlt": "Terra Coffee online store on a laptop beside a cup and coffee beans",
    "thumb": "/assets/project-coffee.webp",
    "thumbAlt": "Terra Coffee online store on a laptop beside a cup and coffee beans",
    "challenge": "Terra sold great coffee almost entirely through its café counter. Its first online shop treated beans like stock photos — no roast dates, no brew guidance, and a checkout that lost a third of its customers before payment.",
    "built": "I designed and built a store that sells the ritual, not just the bag: roast dates on every product, brew guides matched to each coffee, and a subscription flow that takes under a minute. The checkout was cut to the essentials, and the whole shop loads fast on the connections most of its customers actually have.",
    "outcome": "Online is now Terra's second storefront: subscriptions run themselves, wholesale enquiries arrive through the site, and cafés in three countries have written in asking who built it.",
    "stats": [
      {
        "n": "+57%",
        "l": "Online sales in six months"
      },
      {
        "n": "46",
        "l": "Countries shipped to"
      },
      {
        "n": "0.9s",
        "l": "First paint on 4G"
      }
    ],
    "images": [
      {
        "img": "/assets/gallery-desk.jpg",
        "alt": "Designer workspace with a laptop showing a website design, tablet and sketchbook"
      },
      {
        "img": "/assets/gallery-studio.jpg",
        "alt": "Studio table covered with printed brand designs, samples and a laptop"
      }
    ],
    "tech": [
      "Next.js",
      "Tailwind CSS",
      "SQLite",
      "JavaScript",
      "VS Code"
    ],
    "liveUrl": null, "videoUrl": null,
    "sortOrder": 4,
    "featured": false,
    "visible": true
  },
  {
    "slug": "kinetic-type-reel",
    "title": "Kinetic Type Reel",
    "category": "motion",
    "catLabel": "Motion · Interaction",
    "year": "2023",
    "tagline": "Ninety seconds of type in motion — a self-initiated showreel about letters that refuse to sit still.",
    "client": "Self-initiated",
    "role": "Motion Designer & Developer",
    "services": [
      "Motion Design",
      "Interaction",
      "Typography"
    ],
    "heroImage": "/assets/project-motion.jpg",
    "heroAlt": "Kinetic typography artwork — oversized distorted letterforms in white on black",
    "thumb": null,
    "thumbAlt": "Kinetic typography showreel",
    "challenge": "No client, no brief — the challenge I set myself was to make typography carry a whole film: no footage, no voiceover, just letterforms, rhythm and sound design, and to hold attention for ninety seconds on type alone.",
    "built": "I built the reel as a series of coded type experiments — variable-font weight shifts, letters that collide and settle, lines that typeset themselves to the beat — then edited the strongest pieces into one continuous film with a custom score.",
    "outcome": "The reel became my most-shared piece of work: it has been featured on three design blogs, screened at a local design meetup, and it still opens most of my client conversations.",
    "stats": [
      {
        "n": "210k",
        "l": "Views across platforms"
      },
      {
        "n": "90s",
        "l": "Runtime, type only"
      },
      {
        "n": "3",
        "l": "Design blog features"
      }
    ],
    "images": [
      {
        "img": "/assets/gallery-dhaka.jpg",
        "alt": "Old Dhaka street with colourful cycle rickshaws at golden hour"
      },
      {
        "img": "/assets/gallery-code.jpg",
        "alt": "Code editor with front-end code on a widescreen monitor in a dim studio"
      }
    ],
    "tech": [
      "JavaScript",
      "CSS3",
      "HTML5",
      "VS Code"
    ],
    "liveUrl": null, "videoUrl": null,
    "sortOrder": 5,
    "featured": false,
    "visible": true
  }
];

export const WORK_CATS: [string, string][] = [
  [
    "all",
    "All"
  ],
  [
    "design",
    "Design"
  ],
  [
    "development",
    "Development"
  ],
  [
    "branding",
    "Branding"
  ],
  [
    "motion",
    "Motion"
  ]
];
export const GALLERY_CATS: [string, string][] = [
  [
    "all",
    "All"
  ],
  [
    "design",
    "Design"
  ],
  [
    "development",
    "Development"
  ],
  [
    "workspace",
    "Workspace"
  ],
  [
    "personal",
    "Personal"
  ]
];
export const TECH_CATS: [string, string][] = [
  [
    "all",
    "All"
  ],
  [
    "frontend",
    "Frontend"
  ],
  [
    "backend",
    "Backend"
  ],
  [
    "languages",
    "Languages"
  ],
  [
    "database",
    "Database"
  ],
  [
    "tools",
    "Tools & AI"
  ]
];

export type TechnologyDefault = { name: string; category: string; catLabel: string; logo: string; darkBubble: boolean; sortOrder: number; visible: boolean };
export const TECHNOLOGY_DEFAULTS: TechnologyDefault[] = [
  {
    "name": "Next.js",
    "category": "frontend",
    "catLabel": "Frontend",
    "logo": "/assets/logos/nextjs.svg",
    "darkBubble": true,
    "sortOrder": 0,
    "visible": true
  },
  {
    "name": "HTML5",
    "category": "frontend",
    "catLabel": "Frontend",
    "logo": "/assets/logos/html5.svg",
    "darkBubble": false,
    "sortOrder": 1,
    "visible": true
  },
  {
    "name": "CSS3",
    "category": "frontend",
    "catLabel": "Frontend",
    "logo": "/assets/logos/css3.svg",
    "darkBubble": false,
    "sortOrder": 2,
    "visible": true
  },
  {
    "name": "JavaScript",
    "category": "frontend",
    "catLabel": "Frontend",
    "logo": "/assets/logos/javascript.svg",
    "darkBubble": false,
    "sortOrder": 3,
    "visible": true
  },
  {
    "name": "Tailwind CSS",
    "category": "frontend",
    "catLabel": "Frontend",
    "logo": "/assets/logos/tailwindcss.svg",
    "darkBubble": false,
    "sortOrder": 4,
    "visible": true
  },
  {
    "name": "Node.js",
    "category": "backend",
    "catLabel": "Backend",
    "logo": "/assets/logos/nodejs.svg",
    "darkBubble": false,
    "sortOrder": 5,
    "visible": true
  },
  {
    "name": "NestJS",
    "category": "backend",
    "catLabel": "Backend",
    "logo": "/assets/logos/nestjs.svg",
    "darkBubble": false,
    "sortOrder": 6,
    "visible": true
  },
  {
    "name": "PHP",
    "category": "backend",
    "catLabel": "Backend",
    "logo": "/assets/logos/php.svg",
    "darkBubble": false,
    "sortOrder": 7,
    "visible": true
  },
  {
    "name": "Python",
    "category": "languages",
    "catLabel": "Languages",
    "logo": "/assets/logos/python.svg",
    "darkBubble": false,
    "sortOrder": 8,
    "visible": true
  },
  {
    "name": "C#",
    "category": "languages",
    "catLabel": "Languages",
    "logo": "/assets/logos/csharp.svg",
    "darkBubble": false,
    "sortOrder": 9,
    "visible": true
  },
  {
    "name": "C++",
    "category": "languages",
    "catLabel": "Languages",
    "logo": "/assets/logos/cplusplus.svg",
    "darkBubble": false,
    "sortOrder": 10,
    "visible": true
  },
  {
    "name": "PostgreSQL",
    "category": "database",
    "catLabel": "Database",
    "logo": "/assets/logos/postgresql.svg",
    "darkBubble": false,
    "sortOrder": 11,
    "visible": true
  },
  {
    "name": "MySQL",
    "category": "database",
    "catLabel": "Database",
    "logo": "/assets/logos/mysql.svg",
    "darkBubble": false,
    "sortOrder": 12,
    "visible": true
  },
  {
    "name": "SQLite",
    "category": "database",
    "catLabel": "Database",
    "logo": "/assets/logos/sqlite.svg",
    "darkBubble": false,
    "sortOrder": 13,
    "visible": true
  },
  {
    "name": "MongoDB",
    "category": "database",
    "catLabel": "Database",
    "logo": "/assets/logos/mongodb.svg",
    "darkBubble": false,
    "sortOrder": 14,
    "visible": true
  },
  {
    "name": "Postman",
    "category": "tools",
    "catLabel": "Tools & AI",
    "logo": "/assets/logos/postman.svg",
    "darkBubble": false,
    "sortOrder": 15,
    "visible": true
  },
  {
    "name": "VS Code",
    "category": "tools",
    "catLabel": "Tools & AI",
    "logo": "/assets/logos/vscode.svg",
    "darkBubble": false,
    "sortOrder": 16,
    "visible": true
  },
  {
    "name": "ChatGPT",
    "category": "tools",
    "catLabel": "Tools & AI",
    "logo": "/assets/logos/chatgpt.svg",
    "darkBubble": true,
    "sortOrder": 17,
    "visible": true
  },
  {
    "name": "DeepSeek",
    "category": "tools",
    "catLabel": "Tools & AI",
    "logo": "/assets/logos/deepseek.svg",
    "darkBubble": false,
    "sortOrder": 18,
    "visible": true
  },
  {
    "name": "Gemini",
    "category": "tools",
    "catLabel": "Tools & AI",
    "logo": "/assets/logos/gemini.svg",
    "darkBubble": false,
    "sortOrder": 19,
    "visible": true
  },
  {
    "name": "Claude",
    "category": "tools",
    "catLabel": "Tools & AI",
    "logo": "/assets/logos/claude.svg",
    "darkBubble": false,
    "sortOrder": 20,
    "visible": true
  }
];

export type EducationDefault = { title: string; org: string; location: string; period: string; kicker: string; image: string; imageAlt: string; desc: string; sortOrder: number; visible: boolean };
export const EDUCATION_DEFAULTS: EducationDefault[] = [
  {
    "title": "BSc in Computer Science",
    "org": "University of Dhaka",
    "location": "Dhaka, Bangladesh",
    "period": "2015 — 2019",
    "kicker": "The Foundation",
    "image": "/assets/edu-bsc.jpg",
    "imageAlt": "Students collaborating around computers in a university computer science lab",
    "desc": "Graduated with honours. Focused on human–computer interaction, web technologies and software design — the technical foundation underneath everything I design today.",
    "sortOrder": 0,
    "visible": true
  },
  {
    "title": "Professional Diploma in Visual Design",
    "org": "Creative IT Institute",
    "location": "Dhaka, Bangladesh",
    "period": "2019 — 2020",
    "kicker": "The Craft",
    "image": "/assets/edu-diploma.jpg",
    "imageAlt": "Design studio desk with colour swatches, layout proofs and typography posters on the wall",
    "desc": "An intensive studio program covering typography, layout, colour and brand systems — where my poster-design hobby turned into a profession.",
    "sortOrder": 1,
    "visible": true
  },
  {
    "title": "Higher Secondary Certificate, Science",
    "org": "Dhaka College",
    "location": "Dhaka, Bangladesh",
    "period": "2013 — 2015",
    "kicker": "The Spark",
    "image": "/assets/edu-hsc.jpg",
    "imageAlt": "Historic red-brick college building with students crossing the courtyard under banyan trees",
    "desc": "Science stream with a focus on mathematics and physics. First design experiments happened here — club posters, magazine covers and a lot of hand-drawn type.",
    "sortOrder": 2,
    "visible": true
  }
];

export type ExperienceDefault = { role: string; org: string; location: string; period: string; points: string[]; tech: string[]; sortOrder: number; visible: boolean };
export const EXPERIENCE_DEFAULTS: ExperienceDefault[] = [
  {
    "role": "Freelance Designer & Developer",
    "org": "Self-employed",
    "location": "Dhaka / Remote",
    "period": "2021 — Present",
    "points": [
      "40+ projects shipped for local and international clients — portfolios, business sites and online stores.",
      "Specialises in portfolio, business and e-commerce websites that clients can update themselves.",
      "End-to-end delivery — discovery, design, development and launch — with one point of contact throughout."
    ],
    "tech": [
      "Next.js",
      "JavaScript",
      "Tailwind CSS",
      "PostgreSQL"
    ],
    "sortOrder": 0,
    "visible": true
  },
  {
    "role": "Front-End Developer",
    "org": "Digital Studio",
    "location": "Dhaka",
    "period": "2020 — 2021",
    "points": [
      "Built marketing sites and client dashboards as part of a small, fast-moving team.",
      "Introduced a component-based workflow that made new pages quicker to build and easier to maintain.",
      "Cut page load times across the studio's live sites through image and code optimisation."
    ],
    "tech": [
      "JavaScript",
      "CSS3",
      "Node.js"
    ],
    "sortOrder": 1,
    "visible": true
  },
  {
    "role": "Junior Web Designer",
    "org": "Creative Agency",
    "location": "Dhaka",
    "period": "2019 — 2020",
    "points": [
      "Designed landing pages, campaign pages and brand assets for agency clients.",
      "First paid client work — started while completing the visual design diploma."
    ],
    "tech": [
      "HTML5",
      "CSS3"
    ],
    "sortOrder": 2,
    "visible": true
  }
];

export type TestimonialDefault = { quote: string; name: string; initials: string; role: string; sortOrder: number; visible: boolean };
export const TESTIMONIAL_DEFAULTS: TestimonialDefault[] = [
  {
    "quote": "Mohammed rebuilt our identity and launch site in six weeks, exactly when he said he would. Every file arrived organised, every deadline was met — and enquiries through the new site were up within the first quarter.",
    "name": "Jonas Weber",
    "initials": "JW",
    "role": "Founder, Nordhaus Studio — Berlin",
    "sortOrder": 0,
    "visible": true
  },
  {
    "quote": "He asked better questions than our own product team did. The redesigned app takes two taps to log a set, our day-30 retention tripled, and replies never took more than a few hours — even across time zones.",
    "name": "Sarah Lindqvist",
    "initials": "SL",
    "role": "CEO, PulseFit Health",
    "sortOrder": 1,
    "visible": true
  },
  {
    "quote": "Our online shop finally feels like our café. Subscriptions run themselves, the site loads fast even on slow connections, and every step was explained in plain language — no jargon, no surprises, no missed dates.",
    "name": "Arif Rahman",
    "initials": "AR",
    "role": "Owner, Terra Coffee Roasters",
    "sortOrder": 2,
    "visible": true
  }
];

export type CertDefault = { title: string; issuer: string; year: string; type: "CERTIFICATION" | "AWARD"; sortOrder: number; visible: boolean };
export const CERT_DEFAULTS: CertDefault[] = [
  {
    "title": "Google UX Design Professional Certificate",
    "issuer": "Google",
    "year": "2022",
    "type": "CERTIFICATION",
    "sortOrder": 0,
    "visible": true
  },
  {
    "title": "Meta Front-End Developer Professional Certificate",
    "issuer": "Meta",
    "year": "2023",
    "type": "CERTIFICATION",
    "sortOrder": 1,
    "visible": true
  },
  {
    "title": "Full-Stack Web Development",
    "issuer": "freeCodeCamp",
    "year": "2021",
    "type": "CERTIFICATION",
    "sortOrder": 2,
    "visible": true
  },
  {
    "title": "Emerging Designer of the Year",
    "issuer": "Dhaka Design Community",
    "year": "2023",
    "type": "AWARD",
    "sortOrder": 3,
    "visible": true
  }
];

export type GalleryDefault = { title: string; category: string; catLabel: string; image: string; caption: string; alt: string; ratio: string; sortOrder: number; visible: boolean };
export const GALLERY_DEFAULTS: GalleryDefault[] = [
  {
    "title": "Morning setup",
    "category": "workspace",
    "catLabel": "Workspace",
    "image": "/assets/gallery-desk.jpg",
    "caption": "Where most projects start — coffee, sketches and a clean Figma file.",
    "alt": "Designer workspace with a laptop showing a website design, tablet and sketchbook",
    "ratio": "ar-wide",
    "sortOrder": 0,
    "visible": true
  },
  {
    "title": "Wireframes first",
    "category": "design",
    "catLabel": "Design",
    "image": "/assets/gallery-sketch.jpg",
    "caption": "Every build starts on paper. Cheap to change, impossible to misread.",
    "alt": "Hands sketching website wireframes in a notebook with sticky notes and swatches",
    "ratio": "ar-tall",
    "sortOrder": 1,
    "visible": true
  },
  {
    "title": "Nordhaus identity",
    "category": "design",
    "catLabel": "Design",
    "image": "/assets/project-branding.webp",
    "caption": "Print suite for the Nordhaus architecture studio rebrand.",
    "alt": "Nordhaus architecture studio brand identity — folder, letterhead and business cards",
    "ratio": "ar-sq",
    "sortOrder": 2,
    "visible": true
  },
  {
    "title": "Late-night build",
    "category": "development",
    "catLabel": "Development",
    "image": "/assets/gallery-code.jpg",
    "caption": "Hand-coded front-ends, usually after the city goes quiet.",
    "alt": "Code editor with front-end code on a widescreen monitor in a dim studio",
    "ratio": "ar-wide",
    "sortOrder": 3,
    "visible": true
  },
  {
    "title": "PulseFit screens",
    "category": "development",
    "catLabel": "Development",
    "image": "/assets/project-app.webp",
    "caption": "Workout tracking flows for the PulseFit mobile app.",
    "alt": "PulseFit fitness app screens on two floating phones",
    "ratio": "ar-tall",
    "sortOrder": 4,
    "visible": true
  },
  {
    "title": "Proofing session",
    "category": "workspace",
    "catLabel": "Workspace",
    "image": "/assets/gallery-studio.jpg",
    "caption": "Checking brand sheets in daylight before anything goes to press.",
    "alt": "Studio table covered with printed brand designs, samples and a laptop",
    "ratio": "ar-sq",
    "sortOrder": 5,
    "visible": true
  },
  {
    "title": "Terra Coffee store",
    "category": "design",
    "catLabel": "Design",
    "image": "/assets/project-coffee.webp",
    "caption": "E-commerce design for a Dhaka roastery selling worldwide.",
    "alt": "Terra Coffee online store on a laptop beside a cup and coffee beans",
    "ratio": "ar-wide",
    "sortOrder": 6,
    "visible": true
  },
  {
    "title": "Old Dhaka, golden hour",
    "category": "personal",
    "catLabel": "Personal",
    "image": "/assets/gallery-dhaka.jpg",
    "caption": "Weekend photo walks — the city's colour palette never runs dry.",
    "alt": "Old Dhaka street with colourful cycle rickshaws at golden hour",
    "ratio": "ar-wide",
    "sortOrder": 7,
    "visible": true
  },
  {
    "title": "Insightboard",
    "category": "development",
    "catLabel": "Development",
    "image": "/assets/project-dashboard.jpg",
    "caption": "Analytics dashboard UI — dense data, calm layout.",
    "alt": "Insightboard analytics dashboard interface on a monitor",
    "ratio": "ar-sq",
    "sortOrder": 8,
    "visible": true
  },
  {
    "title": "Loom & Thread",
    "category": "design",
    "catLabel": "Design",
    "image": "/assets/project-web.jpg",
    "caption": "Storefront redesign for a slow-fashion label.",
    "alt": "Loom & Thread website redesign shown on a laptop",
    "ratio": "ar-tall",
    "sortOrder": 9,
    "visible": true
  }
];
