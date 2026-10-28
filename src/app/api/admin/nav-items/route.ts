import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSettings, parseNavItems, type NavItem } from "@/lib/site";
import { denyIfNotAdmin, dbErrorResponse } from "../_guard";

const MAX_ITEMS = 12;

/** GET /api/admin/nav-items — the current navigation menu (defaults merged). */
export async function GET() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;
  const settings = await getSettings();
  return NextResponse.json({ items: parseNavItems(settings.navItems) });
}

/**
 * PUT /api/admin/nav-items — replace the whole menu.
 * Body: { items: [{ label, href, visible }] }. Stored as JSON in the
 * `navItems` site setting; the public header reads it from settings.
 */
export async function PUT(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;
  let body: { items?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "The menu needs at least one item." },
      { status: 400 }
    );
  }
  if (body.items.length > MAX_ITEMS) {
    return NextResponse.json(
      { error: `The menu can hold at most ${MAX_ITEMS} items.` },
      { status: 400 }
    );
  }

  const items: NavItem[] = [];
  for (let i = 0; i < body.items.length; i++) {
    const entry = body.items[i] as Record<string, unknown> | null;
    const label = typeof entry?.label === "string" ? entry.label.trim() : "";
    const href = typeof entry?.href === "string" ? entry.href.trim() : "";
    if (!label) {
      return NextResponse.json(
        { error: `Item ${i + 1} needs a label.` },
        { status: 400 }
      );
    }
    if (label.length > 60) {
      return NextResponse.json(
        { error: `Item ${i + 1}'s label is too long (max 60 characters).` },
        { status: 400 }
      );
    }
    if (!href.startsWith("/") || href.length > 200 || /\s/.test(href)) {
      return NextResponse.json(
        { error: `Item ${i + 1}'s link must start with "/" (for example /product).` },
        { status: 400 }
      );
    }
    items.push({ label, href, visible: entry?.visible !== false });
  }

  try {
    await db.siteSetting.upsert({
      where: { key: "navItems" },
      update: { value: JSON.stringify(items) },
      create: { key: "navItems", value: JSON.stringify(items) },
    });
  } catch (err) {
    return dbErrorResponse(err);
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, items });
}
