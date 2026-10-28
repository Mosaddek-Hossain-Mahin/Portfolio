import type { Metadata } from "next";
import SiteEffects from "@/components/site/SiteEffects";
import WorkGrid from "@/components/site/WorkGrid";
import { FullFooter } from "@/components/site/Footer";
import { settingsToFooter } from "../layout";
import { getSettings, getProjects, parseNavItems } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: `Work — ${s.siteName}`,
    description: s.workSub,
    openGraph: { title: `Work — ${s.siteName}`, description: s.workSub },
    twitter: { card: "summary_large_image", title: `Work — ${s.siteName}`, description: s.workSub },
  };
}

export default async function WorkPage() {
  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);
  const navItems = parseNavItems(settings.navItems).filter((i) => i.visible);
  return (
    <section className="page active" data-page="work">
      <div className="wrap page-head">
        <h1 className="reveal">Work</h1>
        <p className="sub reveal d1">{settings.workSub}</p>
      </div>
      <section className="wrap" style={{ paddingBottom: "var(--sec-y)" }}>
        <WorkGrid projects={projects} />
      </section>
      <FullFooter settings={settingsToFooter(settings)} navItems={navItems} />
      <SiteEffects />
    </section>
  );
}
