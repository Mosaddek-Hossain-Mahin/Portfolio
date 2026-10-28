import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";

/** GET /api/auth/me — returns 200 when the caller holds a valid admin session. */
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, role: "ADMIN" });
}
