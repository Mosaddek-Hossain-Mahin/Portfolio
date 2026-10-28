import { connection } from "next/server";
import { db } from "@/lib/db";
import { DEFAULT_SETTINGS } from "@/lib/site-defaults";
import { PageTitle } from "../_components/ui";
import SettingsForm from "../_components/SettingsForm";

export const instant = false;

export default async function SettingsPage() {
  await connection();
  let initial = { ...DEFAULT_SETTINGS };
  try {
    const rows = await db.siteSetting.findMany();
    for (const r of rows) initial[r.key] = r.value;
  } catch {
    /* defaults render; saving will surface any DB problem */
  }
  return (
    <div>
      <PageTitle
        title="Settings"
        sub="Site identity, page copy, socials and SEO. Changes apply to the public site immediately."
      />
      <SettingsForm initial={initial} />
    </div>
  );
}
