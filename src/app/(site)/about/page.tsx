import type { Metadata } from "next";
import SiteEffects from "@/components/site/SiteEffects";
import EduStory from "@/components/site/EduStory";
import DownloadCvButton from "@/components/site/DownloadCvButton";
import { FullFooter } from "@/components/site/Footer";
import { settingsToFooter } from "../layout";
import {
  getSettings,
  getEducation,
  getExperience,
  getCertifications,
  parseNavItems,
} from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: `About — ${s.siteName}`,
    description: s.aboutLead,
    openGraph: { title: `About — ${s.siteName}`, description: s.aboutLead },
    twitter: { card: "summary_large_image", title: `About — ${s.siteName}`, description: s.aboutLead },
  };
}

const CAPABILITIES = [
  {
    title: "Design",
    items: ["Brand identity & guidelines", "Web & product design", "Design systems", "Art direction", "Prototyping"],
  },
  {
    title: "Development",
    items: ["Next.js & React", "Creative front-end", "E-commerce builds", "CMS & dashboards", "Performance & SEO"],
  },
  {
    title: "Motion",
    items: ["Interaction design", "Scroll experiences", "Product films", "Showreels", "Micro-interactions"],
  },
];

export default async function AboutPage() {
  const [settings, education, experience, certs] = await Promise.all([
    getSettings(),
    getEducation(),
    getExperience(),
    getCertifications(),
  ]);
  const navItems = parseNavItems(settings.navItems).filter((i) => i.visible);
  const stats = [
    { n: settings.stat1Value, l: settings.stat1Label },
    { n: settings.stat2Value, l: settings.stat2Label },
    { n: settings.stat3Value, l: settings.stat3Label },
    { n: settings.stat4Value, l: settings.stat4Label },
  ];
  const aboutParas = settings.aboutBody.split("\n\n").filter(Boolean);

  return (
    <section className="page active" data-page="about">
      <div className="wrap page-head">
        <h1 className="reveal">
          {settings.aboutHeading.split("\n").map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>
      </div>

      <div className="wrap">
        <div className="about-grid">
          <div>
            <p className="lead reveal">{settings.aboutLead}</p>
            <div className="body">
              {aboutParas.map((p, i) => (
                <p className="reveal d1" key={i}>
                  {p}
                </p>
              ))}
            </div>
            {/* Download CV — only when a CV is set in Admin → Settings. */}
            {settings.cvUrl ? (
              <div className="reveal d2" style={{ marginTop: "2.4rem" }}>
                <DownloadCvButton cvUrl={settings.cvUrl} />
              </div>
            ) : null}
          </div>
          <figure className="about-photo reveal d1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.portraitUrl} alt={settings.portraitAlt} />
          </figure>
        </div>
        <div className="stats reveal">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="n">
                <span data-count={s.n}>0</span>+
              </div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap sec">
        <p className="sec-label reveal">Capabilities</p>
        <div className="cap-grid">
          {CAPABILITIES.map((c, i) => (
            <div className={`cap reveal${i === 1 ? " d1" : i === 2 ? " d2" : ""}`} key={c.title}>
              <h2>
                <span className="cn">0{i + 1}</span>
                {c.title}
              </h2>
              <ul>
                {c.items.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <section className="wrap sec" id="education" style={{ paddingTop: 0 }}>
        <p className="sec-label reveal">Education</p>
        <h2 className="edu-h reveal d1">How I Got Here</h2>
        <p className="edu-intro reveal d2">{settings.eduIntro}</p>
        <EduStory items={education} />
        <div className="edu-closing reveal">
          <p>{settings.eduClosing}</p>
          <a className="round-btn magnetic" href="/work" data-nav="work" data-label="Work">
            <span className="mag-in">See my work</span>
          </a>
        </div>
      </section>

      <section className="wrap sec" id="experience" style={{ paddingTop: 0 }}>
        <p className="sec-label reveal">Experience</p>
        <h2 className="edu-h reveal d1">Where I&apos;ve Worked</h2>
        <div className="exp-list" id="expList">
          {experience.map((e, i) => (
            <article className={`exp-item reveal${i === 1 ? " d1" : i === 2 ? " d2" : ""}`} key={e.id}>
              <p className="exp-period">{e.period}</p>
              <h3>{e.role}</h3>
              <p className="exp-org">
                {e.org} <span className="loc">· {e.location}</span>
              </p>
              <ul className="exp-points">
                {e.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <ul className="tech-chips exp-chips">
                {e.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap sec" id="certifications" style={{ paddingTop: 0 }}>
        <p className="sec-label reveal">Certifications &amp; Awards</p>
        <h2 className="edu-h reveal d1">Credentials</h2>
        <div className="cert-grid" id="certGrid">
          {certs.map((c, i) => (
            <article className={`cert-card reveal${i % 2 === 1 ? " d1" : ""}`} key={c.id}>
              <span className="cert-ico" aria-hidden="true">
                {c.type === "AWARD" ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
                    <path d="M7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4" />
                    <path d="M12 14v3M8 20h8M10 17h4l.6 3H9.4L10 17Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="14.5" r="4.5" />
                    <path d="M9.5 10.8 7 3.5M14.5 10.8 17 3.5M10 3.5h4" />
                  </svg>
                )}
              </span>
              <div className="cert-main">
                <div className="cert-top">
                  <h3>{c.title}</h3>
                  <span className={`cert-tag${c.type === "AWARD" ? " award" : ""}`}>
                    {c.type === "AWARD" ? "Award" : "Certification"}
                  </span>
                </div>
                <p className="cert-meta">
                  {c.issuer} · {c.year}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <FullFooter settings={settingsToFooter(settings)} navItems={navItems} />
      <SiteEffects />
    </section>
  );
}
