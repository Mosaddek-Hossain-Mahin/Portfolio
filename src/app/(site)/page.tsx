import type { Metadata } from "next";
import SiteEffects from "@/components/site/SiteEffects";
import TechBubbles from "@/components/site/TechBubbles";
import ProjectTile from "@/components/site/ProjectTile";
import { HomeStrip } from "@/components/site/GallerySection";
import { FullFooter } from "@/components/site/Footer";
import { settingsToFooter } from "./layout";
import {
  getSettings,
  getProjects,
  getTechnologies,
  getGallery,
  getEducation,
  getTestimonials,
  parseNavItems,
} from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: `${s.siteName} — Designer & Developer`,
    description: s.seoDescription,
    openGraph: {
      title: `${s.siteName} — Designer & Developer`,
      description: s.seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${s.siteName} — Designer & Developer`,
      description: s.seoDescription,
    },
  };
}

const SERVICES = [
  {
    no: "01",
    title: "Design",
    body: "Identity systems, websites and product interfaces with a clear point of view. I design in the browser as much as in Figma, so what you approve is what ships.",
    tags: ["Brand Identity", "Web Design", "UI / UX", "Design Systems"],
  },
  {
    no: "02",
    title: "Development",
    body: "Fast, accessible front-ends and full-stack builds with modern tooling. Clean code, honest performance budgets, and CMSs that clients actually enjoy using.",
    tags: ["Next.js", "Creative Dev", "E-Commerce", "CMS Builds"],
  },
  {
    no: "03",
    title: "Motion",
    body: "Interaction and motion that explain, delight and guide — never decoration for its own sake. From micro-interactions to full showreels and launch films.",
    tags: ["Interaction", "Animation", "Showreels", "Prototyping"],
  },
];

export default async function HomePage() {
  const [settings, projects, technologies, gallery, education, testimonials] =
    await Promise.all([
      getSettings(),
      getProjects(),
      getTechnologies(),
      getGallery(),
      getEducation(),
      getTestimonials(),
    ]);
  const navItems = parseNavItems(settings.navItems).filter((i) => i.visible);
  const featured = projects.slice(0, 4);
  const introParts = settings.introBig.split("sharp, memorable");

  return (
    <section className="page active" data-page="home">
      {/* ================= HERO ================= */}
      <div className="hero" id="hero">
        <div className="hero-portrait-wrap" id="portraitWrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero-portrait"
            id="heroPortrait"
            src={settings.portraitUrl}
            alt={settings.portraitAlt}
          />
        </div>
        <div className="pill" aria-label="Location">
          <p>
            Located in
            <br />
            {settings.locationText}
          </p>
          <span className="globe-ring" aria-hidden="true">
            <svg className="globe" viewBox="0 0 48 48" fill="none" stroke="#e8e2da" strokeWidth="1.6" aria-hidden="true">
              <circle cx="24" cy="24" r="19"></circle>
              <ellipse cx="24" cy="24" rx="9" ry="19"></ellipse>
              <ellipse cx="24" cy="24" rx="16.5" ry="19" opacity=".45"></ellipse>
              <path d="M5 24h38M8.5 14.5h31M8.5 33.5h31"></path>
            </svg>
          </span>
        </div>
        <div className="role">
          <span className="arr" aria-hidden="true">↘</span>
          <h2>
            {settings.roleLine1}
            <br />
            {settings.roleLine2}
          </h2>
        </div>
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track" id="mqTrack">
            {[0, 1].map((g) => (
              <div className="mq-group" key={g}>
                {[0, 1, 2, 3].map((i) => (
                  <span key={i}>{settings.siteName} —</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= INTRO ================= */}
      <div className="wrap sec">
        <div className="intro-grid">
          <p className="intro-big reveal">
            {introParts.length === 2 ? (
              <>
                {introParts[0]}
                <em>sharp, memorable</em>
                {introParts[1]}
              </>
            ) : (
              settings.introBig
            )}
          </p>
          <div className="intro-side reveal d1">
            <p>{settings.introSide}</p>
            <a className="round-btn magnetic" href="/about" data-nav="about" data-label="About">
              <span className="mag-in">More about me</span>
            </a>
          </div>
        </div>
      </div>

      {/* ================= MY STACK ================= */}
      <section className="tech-sec" id="techSec">
        <div className="wrap">
          <p className="sec-label light reveal">My Stack — মাই স্ট্যাক</p>
          <h2 className="tech-h reveal d1">Tools I build with</h2>
          <p className="tech-sub reveal d2">
            Twenty-one technologies across design, code and AI — the full kit behind every
            project below. Drag the cluster, or filter by category.
          </p>
        </div>
        <TechBubbles technologies={technologies} />
      </section>

      {/* ================= SELECTED WORK ================= */}
      <div className="wrap sec">
        <p className="sec-label reveal">Selected Work</p>
        <div className="work-grid" id="homeGrid">
          {featured.map((p) => (
            <ProjectTile key={p.slug} project={p} />
          ))}
        </div>
        <div className="center-row">
          <a className="round-btn dark-outline magnetic" href="/work" data-nav="work" data-label="Work">
            <span className="mag-in">All work</span>
          </a>
        </div>
      </div>

      {/* ================= WHAT I DO ================= */}
      <div className="wrap sec" style={{ paddingTop: 0 }}>
        <p className="sec-label reveal">What I Do</p>
        <div>
          {SERVICES.map((s, i) => (
            <article className={`svc-row reveal${i === 1 ? " d1" : i === 2 ? " d2" : ""}`} key={s.no}>
              <span className="num">{s.no}</span>
              <h3>{s.title}</h3>
              <div className="svc-body">
                <p>{s.body}</p>
                <ul className="tags">
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <span className="sarr" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </div>

      {/* ================= GALLERY STRIP ================= */}
      <div className="wrap" style={{ paddingBottom: "var(--sec-y)" }}>
        <p className="sec-label reveal">From the Gallery</p>
        <HomeStrip items={gallery} />
        <div className="center-row">
          <a className="round-btn dark-outline magnetic" href="/gallery" data-nav="gallery" data-label="Gallery">
            <span className="mag-in">View gallery</span>
          </a>
        </div>
      </div>

      {/* ================= EDUCATION TEASER ================= */}
      <div className="wrap" id="eduTeaserWrap" style={{ paddingBottom: "var(--sec-y)" }}>
        <p className="sec-label reveal">Education</p>
        <div id="eduTeaser">
          {education.map((e) => (
            <a className="mini-row reveal" href="/about" data-nav="about" data-label="About" key={e.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="m-thumb" src={e.image} alt={e.imageAlt} loading="lazy" />
              <span className="m-main">
                <h4>{e.title}</h4>
                <p>
                  {e.org} · {e.location}
                </p>
              </span>
              <span className="period">{e.period}</span>
            </a>
          ))}
        </div>
        <div className="center-row">
          <a className="round-btn dark-outline magnetic" href="/about" data-nav="about" data-label="About">
            <span className="mag-in">More about me</span>
          </a>
        </div>
      </div>

      {/* ================= TESTIMONIALS ================= */}
      <div className="wrap" id="testimonials" style={{ paddingBottom: "var(--sec-y)" }}>
        <p className="sec-label reveal">Testimonials</p>
        <h2 className="sec-h reveal d1">What Clients Say</h2>
        <div className="tst-grid" id="tstGrid">
          {testimonials.map((t, i) => (
            <figure className={`tst-card reveal${i === 1 ? " d1" : i === 2 ? " d2" : ""}`} key={t.id}>
              <span className="tst-mark" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <span className="tst-ava" aria-hidden="true">
                  {t.initials}
                </span>
                <span>
                  <b>{t.name}</b>
                  <span className="tst-role">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <FullFooter settings={settingsToFooter(settings)} navItems={navItems} />
      <SiteEffects />
    </section>
  );
}
