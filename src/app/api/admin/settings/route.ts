import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { DEFAULT_SETTINGS } from "@/lib/site-defaults";
import { denyIfNotAdmin, dbErrorResponse } from "../_guard";

// Only keys that exist in DEFAULT_SETTINGS may be written (allow-list).
const ALLOWED_KEYS = new Set(Object.keys(DEFAULT_SETTINGS));

/** GET /api/admin/settings — all site settings as a key→value object (defaults included). */
export async function GET() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;
  const rows = await db.siteSetting.findMany();
  const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const r of rows) settings[r.key] = r.value;
  return NextResponse.json(settings);
}

/** PUT /api/admin/settings — upsert a key→value object. Only known keys are accepted. */
export async function PUT(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const entries = Object.entries(body).filter(([key]) => ALLOWED_KEYS.has(key));
  if (entries.length === 0) {
    return NextResponse.json({ error: "No recognized settings keys." }, { status: 400 });
  }

  try {
    await Promise.all(
      entries.map(([key, value]) =>
        db.siteSetting.upsert({
          where: { key },
          update: { value: String(value ?? "") },
          create: { key, value: String(value ?? "") },
        })
      )
    );
  } catch (err) {
    return dbErrorResponse(err);
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, updated: entries.length });
}
