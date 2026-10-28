import "../demo.css";
import Shell from "@/components/site/Shell";
import { getSettings, parseNavItems } from "@/lib/site";

// The public site always renders live content (settings + DB content).
export const instant = false;

export function settingsToShell(s: Record<string, string>) {
  return {
    siteName: s.siteName,
    email: s.email,
    greetings: s.greetings.split("\n").map((g) => g.trim()).filter(Boolean),
    socials: [
      { label: "Instagram", href: s.socialInstagram },
      { label: "LinkedIn", href: s.socialLinkedin },
      { label: "Dribbble", href: s.socialDribbble },
      { label: "GitHub", href: s.socialGithub },
    ],
  };
}

export function settingsToFooter(s: Record<string, string>) {
  return {
    siteName: s.siteName,
    email: s.email,
    portraitUrl: s.portraitUrl,
    timezone: s.timezone,
    timezoneLabel: s.timezoneLabel,
    socials: settingsToShell(s).socials,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const navItems = parseNavItems(settings.navItems).filter((i) => i.visible);
  return <Shell settings={settingsToShell(settings)} navItems={navItems}>{children}</Shell>;
}
