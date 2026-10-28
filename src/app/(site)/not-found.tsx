import { SlimFooter } from "@/components/site/Footer";
import { settingsToFooter } from "./layout";
import { getSettings, parseNavItems } from "@/lib/site";

/** Custom 404 in the site's own design. */
export default async function NotFound() {
  const settings = await getSettings();
  const navItems = parseNavItems(settings.navItems).filter((i) => i.visible);
  return (
    <section className="page active" data-page="notfound">
      <div className="wrap page-head">
        <p className="sec-label">404</p>
        <h1>
          This page
          <br />
          doesn&apos;t exist
        </h1>
        <p className="sub">
          The link may be old, or the page moved. Everything else is still here —
          head back to the work, or say hello.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 28 }}>
          <a className="round-btn magnetic" href="/work" data-nav="work" data-label="Work">
            <span className="mag-in">See the work</span>
          </a>
          <a className="round-btn dark-outline magnetic" href="/" data-nav="home" data-label="Home">
            <span className="mag-in">Back home</span>
          </a>
        </div>
      </div>
      <SlimFooter settings={settingsToFooter(settings)} navItems={navItems} />
    </section>
  );
}
