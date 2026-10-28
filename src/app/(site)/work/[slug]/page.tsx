import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteEffects from "@/components/site/SiteEffects";
import { SlimFooter } from "@/components/site/Footer";
import { VideoPlayer } from "@/components/site/VideoPlayer";
import { settingsToFooter } from "../../layout";
import { getSettings, getProjects, parseNavItems } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getProjects();
  const p = projects.find((x) => x.slug === slug);
  if (!p) return { title: "Project not found" };
  return {
    title: `${p.title} — ${p.catLabel}`,
    description: p.tagline,
    openGraph: {
      title: `${p.title} — ${p.catLabel}`,
      description: p.tagline,
      images: [{ url: p.heroImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.title} — ${p.catLabel}`,
      description: p.tagline,
      images: [p.heroImage],
    },
  };
}

const STORY = [
  { title: "The challenge", key: "challenge" },
  { title: "What I built", key: "built" },
  { title: "The outcome", key: "outcome" },
] as const;

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);
  const idx = projects.findIndex((x) => x.slug === slug);
  if (idx < 0) notFound();
  const p = projects[idx];
  const next = projects[(idx + 1) % projects.length];
  const navItems = parseNavItems(settings.navItems).filter((i) => i.visible);

  return (
    <section className="page active" data-page="project">
      <div className="wrap proj-top">
        <a className="back-link" href="/work" data-nav="work" data-label="Work">
          ← All work
        </a>
        <h1 className="proj-title">{p.title}</h1>
        <p className="proj-lede">{p.tagline}</p>
        <div className="proj-meta">
          <div>
            <h5>Client</h5>
            <p>{p.client}</p>
          </div>
          <div>
            <h5>Year</h5>
            <p>{p.year}</p>
          </div>
          <div>
            <h5>Role</h5>
            <p>{p.role}</p>
          </div>
          <div>
            <h5>Services</h5>
            <p>{p.services.join(" · ")}</p>
          </div>
        </div>
        <figure className="proj-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.heroImage} alt={p.heroAlt} />
        </figure>
        {/* Project video — a separate block under the hero image, rendered
            ONLY when a video is set in Admin → Projects (videoUrl). File →
            native player with the hero image as poster; YouTube/Vimeo →
            embed. Seeded projects have none, so no block is shown. */}
        {p.videoUrl ? (
          <div className="proj-video">
            <p className="sec-label">Watch — Project video</p>
            <VideoPlayer url={p.videoUrl} poster={p.heroImage} title={`${p.title} — project video`} />
          </div>
        ) : null}
        <div className="proj-story">
          {STORY.map((s, i) => (
            <div key={s.key}>
              <section className="proj-sec">
                <h2>{s.title}</h2>
                <p>{p[s.key]}</p>
              </section>
              {i === 0 && (
                <div className="proj-stats">
                  {p.stats.map((r) => (
                    <div key={r.l}>
                      <div className="n">{r.n}</div>
                      <div className="l">{r.l}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="proj-gallery">
          {p.images.map((g) => (
            <figure key={g.img}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.img} alt={g.alt} loading="lazy" />
            </figure>
          ))}
        </div>
        <div className="proj-tech">
          <p className="sec-label">Built with</p>
          <ul className="tech-chips">
            {p.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {/* Production rule: the live-site button renders ONLY when a real
              liveUrl is set in Admin → Projects. Seeded projects have none,
              so no button (and no dead demo link) is shown. */}
          {p.liveUrl ? (
            <a
              className="pill-btn live-btn magnetic"
              href={p.liveUrl}
              target="_blank"
              rel="noopener"
            >
              <span className="mag-in">Visit live site ↗</span>
            </a>
          ) : null}
        </div>
      </div>

      <a
        className="proj-next"
        href={`/work/${next.slug}`}
        data-project={next.slug}
        data-label={next.title}
      >
        <div className="wrap">
          <p className="sec-label">Next Project</p>
          <h2>{next.title}</h2>
          <p className="np-sub">
            {next.catLabel} — {next.year}
          </p>
        </div>
      </a>
      <div className="wrap proj-cta">
        <p>
          Have a project like this?{" "}
          <a href="/contact" data-nav="contact" data-label="Contact">
            Start a conversation →
          </a>
        </p>
      </div>
      <SlimFooter settings={settingsToFooter(settings)} navItems={navItems} />
      <SiteEffects />
    </section>
  );
}
