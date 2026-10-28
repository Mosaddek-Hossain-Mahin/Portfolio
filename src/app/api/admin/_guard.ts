import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";

/** Returns a 401 JSON response when the caller is not an admin, else null. */
export async function denyIfNotAdmin(): Promise<NextResponse | null> {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Map a Prisma error to a JSON response so admin forms get a clear message
 * instead of an unhandled 500 HTML page.
 * P2002 = unique constraint (e.g. duplicate slug) → 409.
 * P2025 = record not found → 404.
 */
export function dbErrorResponse(err: unknown): NextResponse {
  const code = (err as { code?: unknown } | null)?.code;
  if (code === "P2002") {
    return NextResponse.json(
      { error: "An item with the same unique value (for example, the slug) already exists." },
      { status: 409 }
    );
  }
  if (code === "P2025") {
    return NextResponse.json({ error: "That item no longer exists." }, { status: 404 });
  }
  console.error("Admin API database error:", err);
  return NextResponse.json(
    { error: "Something went wrong on the server — please try again." },
    { status: 500 }
  );
}
