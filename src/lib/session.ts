import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE, type AdminSession } from "./auth";
import { db } from "./db";

export async function getSessionAdmin(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdmin(): Promise<AdminSession | null> {
  const sess = await getSessionAdmin();
  return sess && sess.role === "ADMIN" ? sess : null;
}

/** The currently signed-in admin user record (null when not signed in or deleted). */
export async function getCurrentAdminUser() {
  const sess = await getSessionAdmin();
  if (!sess) return null;
  try {
    return await db.adminUser.findUnique({
      where: { id: sess.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  } catch {
    return null;
  }
}
