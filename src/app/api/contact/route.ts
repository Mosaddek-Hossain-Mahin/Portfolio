import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyNewMessage } from "@/lib/notify";

/**
 * Public contact endpoint.
 * - Validates name / email / message (same rules as the demo form)
 * - Honeypot: a filled "website" field means a bot -> success response,
 *   nothing saved
 * - Simple per-IP rate limit: max 5 submissions per 10 minutes
 * - Saves a Message row (visible in Admin → Messages) and fires the
 *   optional email notifier (no-ops unless RESEND_API_KEY etc. are set)
 */

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 160);
  const org = String(body.org || "").trim().slice(0, 160);
  const subject = String(body.subject || "").trim().slice(0, 200);
  const message = String(body.message || body.body || "").trim().slice(0, 5000);
  const honeypot = String(body.website || "");

  // Honeypot tripped: pretend success, save nothing.
  if (honeypot) return NextResponse.json({ ok: true });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages in a short time — please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  if (name.length < 2) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (message.length < 4) {
    return NextResponse.json({ error: "Please write a short message." }, { status: 400 });
  }

  try {
    const saved = await db.message.create({
      data: {
        name,
        email,
        org: org || null,
        subject: subject || null,
        body: message,
        ip,
      },
    });
    // Optional email notification (no-op when unconfigured).
    void notifyNewMessage({ name, email, org: org || null, body: message });
    return NextResponse.json({ ok: true, id: saved.id });
  } catch (err) {
    console.error("Contact save failed:", err);
    return NextResponse.json(
      { error: "Could not save your message right now — please email instead." },
      { status: 500 }
    );
  }
}
