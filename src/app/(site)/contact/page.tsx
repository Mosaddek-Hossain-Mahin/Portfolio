import type { Metadata } from "next";
import SiteEffects from "@/components/site/SiteEffects";
import ContactForm from "@/components/site/ContactForm";
import DownloadCvButton from "@/components/site/DownloadCvButton";
import { SlimFooter } from "@/components/site/Footer";
import { settingsToFooter } from "../layout";
import { getSettings, parseNavItems } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: `Contact — ${s.siteName}`,
    description: s.contactSub,
    openGraph: { title: `Contact — ${s.siteName}`, description: s.contactSub },
    twitter: { card: "summary_large_image", title: `Contact — ${s.siteName}`, description: s.contactSub },
  };
}

export default async function ContactPage() {
  const settings = await getSettings();
  const navItems = parseNavItems(settings.navItems).filter((i) => i.visible);
  const socials = [
    { label: "Instagram", href: settings.socialInstagram },
    { label: "LinkedIn", href: settings.socialLinkedin },
    { label: "Dribbble", href: settings.socialDribbble },
    { label: "GitHub", href: settings.socialGithub },
  ];
  return (
    <section className="page active" data-page="contact">
      <div className="wrap page-head">
        <h1 className="reveal">
          Let&apos;s work
          <br />
          together
        </h1>
        <p className="sub reveal d1">{settings.contactSub}</p>
        {/* Download CV — only when a CV is set in Admin → Settings. */}
        {settings.cvUrl ? (
          <div className="reveal d2" style={{ marginTop: "2rem" }}>
            <DownloadCvButton cvUrl={settings.cvUrl} />
          </div>
        ) : null}
      </div>
      <section className="wrap contact-grid" style={{ paddingBottom: "var(--sec-y)" }}>
        <ContactForm />
        <aside className="c-side reveal d1">
          <div className="blk">
            <h5>Contact Details</h5>
            <p>
              <a className="u-line" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </p>
            <p>
              {settings.contactLocation.split("\n").map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </div>
          <div className="blk">
            <h5>Socials</h5>
            <div className="socials">
              {socials.map((s) => (
                <a key={s.label} className="u-line" href={s.href} rel="noopener">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div className="blk">
            <h5>Availability</h5>
            <p>
              {settings.availability.split("\n").map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </div>
        </aside>
      </section>
      <SlimFooter settings={settingsToFooter(settings)} navItems={navItems} />
      <SiteEffects />
    </section>
  );
}
