import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { denyIfNotAdmin, dbErrorResponse } from "./_guard";

/**
 * Shared CRUD handlers for admin content APIs (same pattern as stitch-bd:
 * guarded, JSON errors — 409 on duplicate unique value, 404 on missing
 * record — and public-path revalidation after writes).
 */
export type CrudConfig<T> = {
  /** List all rows, ordered. */
  list: () => Promise<T[]>;
  create: (data: Record<string, unknown>) => Promise<T>;
  update: (id: string, data: Record<string, unknown>) => Promise<T>;
  remove: (id: string) => Promise<T>;
  /** Build create data from the request body, or an error message. */
  buildCreate: (body: Record<string, unknown>) => Record<string, unknown> | { error: string };
  /** Build partial update data from the request body. */
  buildUpdate: (body: Record<string, unknown>) => Record<string, unknown>;
  /** Public paths to revalidate after a write. */
  revalidate: string[];
};

export function makeCrud<T>(cfg: CrudConfig<T>) {
  const bump = () => cfg.revalidate.forEach((p) => revalidatePath(p));

  async function GET() {
    const denied = await denyIfNotAdmin();
    if (denied) return denied;
    try {
      return NextResponse.json(await cfg.list());
    } catch (err) {
      return dbErrorResponse(err);
    }
  }

  async function POST(req: NextRequest) {
    const denied = await denyIfNotAdmin();
    if (denied) return denied;
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const data = cfg.buildCreate(body);
    if ("error" in data) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }
    try {
      const row = await cfg.create(data);
      bump();
      return NextResponse.json(row, { status: 201 });
    } catch (err) {
      return dbErrorResponse(err);
    }
  }

  async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const denied = await denyIfNotAdmin();
    if (denied) return denied;
    const { id } = await ctx.params;
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    try {
      const row = await cfg.update(id, cfg.buildUpdate(body));
      bump();
      return NextResponse.json(row);
    } catch (err) {
      return dbErrorResponse(err);
    }
  }

  async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    const denied = await denyIfNotAdmin();
    if (denied) return denied;
    const { id } = await ctx.params;
    try {
      await cfg.remove(id);
      bump();
      return NextResponse.json({ ok: true });
    } catch (err) {
      return dbErrorResponse(err);
    }
  }

  return { GET, POST, PUT, DELETE };
}

/** Body helpers shared by the entity routes. */
export const str = (v: unknown, max = 400): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
export const strOr = (v: unknown, fallback: string, max = 400): string =>
  str(v, max) || fallback;
export const num = (v: unknown, fallback = 0): number =>
  typeof v === "number" && Number.isFinite(v) ? Math.trunc(v) : fallback;
export const bool = (v: unknown, fallback = false): boolean =>
  typeof v === "boolean" ? v : fallback;
/** JSON fields: accept an array/object and store its JSON string. */
export const json = (v: unknown, fallback: unknown = []): string => {
  if (typeof v === "string") {
    try {
      JSON.parse(v);
      return v;
    } catch {
      return JSON.stringify(fallback);
    }
  }
  return JSON.stringify(v ?? fallback);
};
