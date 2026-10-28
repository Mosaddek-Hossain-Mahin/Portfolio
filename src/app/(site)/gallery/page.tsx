import type { Metadata } from "next";
import SiteEffects from "@/components/site/SiteEffects";
import { GallerySection } from "@/components/site/GallerySection";
import { FullFooter } from "@/components/site/Footer";
import { settingsToFooter } from "../layout";
import { getSettings, getGallery, parseNavItems } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: `Gallery — ${s.siteName}`,
    description: s.gallerySub,
    openGraph: { title: `Gallery — ${s.siteName}`, description: s.gallerySub },
    twitter: { card: "summary_large_image", title: `Gallery — ${s.siteName}`, description: s.gallerySub },
  };
}

export default async function GalleryPage() {
  const [settings, gallery] = await Promise.all([getSettings(), getGallery()]);
  const navItems = parseNavItems(settings.navItems).filter((i) => i.visible);
  return (
    <section className="page active" data-page="gallery">
      <div className="wrap page-head">
        <h1 className="reveal">Gallery</h1>
        <p className="sub reveal d1">{settings.gallerySub}</p>
      </div>
      <section className="wrap" style={{ paddingBottom: "var(--sec-y)" }}>
        <GallerySection items={gallery} />
      </section>
      <FullFooter settings={settingsToFooter(settings)} navItems={navItems} />
      <SiteEffects />
    </section>
  );
}
