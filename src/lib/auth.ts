import { createHmac, timingSafeEqual } from "node:crypto";

// Stateless signed session tokens for admin auth.
// NOTE: this module must stay dependency-light (node:crypto only) because it is
// imported by proxy.ts (route protection). DB/bcrypt logic lives in admin-users.ts.

const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-me";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function b64urlEncode(buf: Buffer): string {
  return buf.toString("base64url");
}

export type AdminSession = { role: "ADMIN"; userId: string };

export function createSessionToken(userId: string): string {
  const payload = JSON.stringify({
    role: "ADMIN",
    uid: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  });
  const body = b64urlEncode(Buffer.from(payload));
  const sig = b64urlEncode(createHmac("sha256", SESSION_SECRET).update(body).digest());
  return `${body}.${sig}`;
}

export function verifySessionToken(token: string): AdminSession | null {
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return null;
    const expected = b64urlEncode(createHmac("sha256", SESSION_SECRET).update(body).digest());
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (payload.role !== "ADMIN" || typeof payload.uid !== "string" || !payload.uid) return null;
    return { role: "ADMIN", userId: payload.uid };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "portfolio_session";
export const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE;
