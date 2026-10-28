import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { denyIfNotAdmin, dbErrorResponse } from "../../_guard";

/** GET /api/admin/messages/[id] — one message. */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    const row = await db.message.findUnique({ where: { id } });
    if (!row) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    return dbErrorResponse(err);
  }
}

/** PATCH /api/admin/messages/[id] — set status (NEW | READ | ARCHIVED). */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  let body: { status?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const status = body.status;
  if (status !== "NEW" && status !== "READ" && status !== "ARCHIVED") {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  try {
    const row = await db.message.update({ where: { id }, data: { status } });
    return NextResponse.json(row);
  } catch (err) {
    return dbErrorResponse(err);
  }
}

/** DELETE /api/admin/messages/[id] */
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    await db.message.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return dbErrorResponse(err);
  }
}
