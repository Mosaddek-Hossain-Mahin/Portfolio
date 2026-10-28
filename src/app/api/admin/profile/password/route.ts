import { NextRequest, NextResponse } from "next/server";
import { denyIfNotAdmin } from "@/app/api/admin/_guard";
import { getSessionAdmin } from "@/lib/session";
import { hashPassword, verifyAdminCredentials } from "@/lib/admin-users";
import { db } from "@/lib/db";

/** POST /api/admin/profile/password — change password (needs current password). */
export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;
  const sess = await getSessionAdmin();

  let body: { currentPassword?: unknown; newPassword?: unknown; confirmPassword?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

  if (!currentPassword || !newPassword || !confirmPassword)
    return NextResponse.json({ error: "All password fields are required" }, { status: 400 });
  if (newPassword.length < 8)
    return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  if (newPassword !== confirmPassword)
    return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });

  const user = await db.adminUser.findUnique({ where: { id: sess!.userId } });
  if (!user) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

  const ok = await verifyAdminCredentials(user.email, currentPassword);
  if (!ok) return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });

  await db.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });
  return NextResponse.json({ ok: true });
}
