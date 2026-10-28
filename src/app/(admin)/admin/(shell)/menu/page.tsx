import { connection } from "next/server";
import { getSettings, parseNavItems } from "@/lib/site";
import { PageTitle } from "../_components/ui";
import { MenuManager } from "../_components/menu-editor";
import { DEFAULT_SETTINGS } from "@/lib/site-defaults";

export const instant = false;

export default async function MenuPage() {
  await connection();
  const settings = await getSettings();
  const items = parseNavItems(settings.navItems);
  const defaults = parseNavItems(DEFAULT_SETTINGS.navItems);
  return (
    <div>
      <PageTitle
        title="Navigation Menu"
        sub="Rename, reorder, show or hide the header links. Home is always the brand link (top-left)."
      />
      <MenuManager initial={items} defaults={defaults} />
    </div>
  );
}
