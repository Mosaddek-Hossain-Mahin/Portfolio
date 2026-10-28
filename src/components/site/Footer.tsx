import Clock from "./Clock";
import type { NavItem } from "@/lib/site";

export type FooterSettings = {
  siteName: string;
  email: string;
  portraitUrl: string;
  timezone: string;
  timezoneLabel: string;
  socials: { label: string; href: string }[];
};

function Bottom({
  settings,
  navItems,
  padded = false,
}: {
  settings: FooterSettings;
  navItems: NavItem[];
  padded?: boolean;
}) {
  return (
    <div className="cta-bottom" style={padded ? { padding: "2.2rem 0 44px" } : undefined}>
      <div>
        <h5>Version</h5>
        <p>© 2026 {settings.siteName} — All rights reserved</p>
      </div>
      <div>
        <h5>Local time</h5>
        <Clock timezone={settings.timezone} label={settings.timezoneLabel} />
      </div>
      <div>
        <h5>Sitemap</h5>
        <div className="socials">
          <a className="u-line" href="/" data-nav="home" data-label="Home">
            Home
          </a>
          {navItems.map((i) => (
            <a
              key={i.href}
              className="u-line"
              href={i.href}
              data-nav={i.href.replace("/", "")}
              data-label={i.label}
            >
              {i.label}
            </a>
          ))}
        </div>
      </div>
      <div>
        <h5>Socials</h5>
        <div className="socials">
          {settings.socials.map((s) => (
            <a key={s.label} className="u-line" href={s.href} rel="noopener">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Big black footer CTA (demo footer for Home / Work / About / Gallery). */
export function FullFooter({
  settings,
  navItems,
}: {
  settings: FooterSettings;
  navItems: NavItem[];
}) {
  return (
    <footer className="cta">
      <div className="wrap cta-inner">
        <h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="face" src={settings.portraitUrl} alt={`Illustrated portrait of ${settings.siteName}`} />
          <span>Let&apos;s work</span>
          <span>together</span>
        </h2>
        <div className="cta-btn-row">
          <a className="round-btn magnetic" href="/contact" data-nav="contact" data-label="Contact">
            <span className="mag-in">Get in touch</span>
          </a>
        </div>
        <hr />
        <div className="cta-actions">
          <a className="pill-btn magnetic" href={`mailto:${settings.email}`}>
            <span className="mag-in">{settings.email}</span>
          </a>
          <a className="pill-btn magnetic" href="/contact" data-nav="contact" data-label="Contact">
            <span className="mag-in">Start a project</span>
          </a>
        </div>
        <Bottom settings={settings} navItems={navItems} />
      </div>
    </footer>
  );
}

/** Slim footer (demo footer for project detail + Contact pages). */
export function SlimFooter({
  settings,
  navItems,
}: {
  settings: FooterSettings;
  navItems: NavItem[];
}) {
  return (
    <footer className="cta">
      <div className="wrap">
        <Bottom settings={settings} navItems={navItems} padded />
      </div>
    </footer>
  );
}
