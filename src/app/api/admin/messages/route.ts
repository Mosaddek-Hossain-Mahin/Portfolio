import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { denyIfNotAdmin, dbErrorResponse } from "../_guard";

/** GET /api/admin/messages — inbox list (newest first, ?status= filter). */
export async function GET(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;
  const status = req.nextUrl.searchParams.get("status");
  try {
    const rows = await db.message.findMany({
      where:
        status === "NEW" || status === "READ" || status === "ARCHIVED"
          ? { status }
          : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json(rows);
  } catch (err) {
    return dbErrorResponse(err);
  }
}
