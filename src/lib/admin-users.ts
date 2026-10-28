import bcrypt from "bcryptjs";
import { db } from "./db";

// Database-backed admin credentials (AdminUser model, bcryptjs hashes — pure JS,
// safe on Windows where native bcrypt fails to build).

export type AdminPublic = { id: string; name: string; email: string };

/** Look up the admin by email and verify the password. Returns null on any failure. */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<AdminPublic | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return null;
  const user = await db.adminUser.findUnique({ where: { email: normalized } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return { id: user.id, name: user.name, email: user.email };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
