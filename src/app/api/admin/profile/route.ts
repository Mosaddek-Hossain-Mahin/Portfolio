import { NextRequest, NextResponse } from "next/server";
import { denyIfNotAdmin } from "@/app/api/admin/_guard";
import { getSessionAdmin } from "@/lib/session";
import { isValidEmail } from "@/lib/admin-users";
import { db } from "@/lib/db";

/** GET /api/admin/profile — current admin's profile. */
export async function GET() {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;
  const sess = await getSessionAdmin();
  const user = await db.adminUser.findUnique({
    where: { id: sess!.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  if (!user) return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  return NextResponse.json({ admin: user });
}

/** PATCH /api/admin/profile — update name and email. */
export async function PATCH(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;
  const sess = await getSessionAdmin();

  let body: { name?: unknown; email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!isValidEmail(email))
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });

  const clash = await db.adminUser.findFirst({
    where: { email, NOT: { id: sess!.userId } },
    select: { id: true },
  });
  if (clash) return NextResponse.json({ error: "That email is already in use" }, { status: 409 });

  const user = await db.adminUser.update({
    where: { id: sess!.userId },
    data: { name, email },
    select: { id: true, name: true, email: true },
  });
  return NextResponse.json({ ok: true, admin: user });
}
