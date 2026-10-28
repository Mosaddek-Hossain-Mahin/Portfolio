import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { requireAdmin } from "@/lib/session";

/**
 * Serves files uploaded at runtime into public/uploads/.
 * `next start` snapshots public/ at server start, so files uploaded while
 * the server runs would 404 as static assets — this route streams them
 * from disk instead. CVs are admin-only; images and videos are public
 * (site content). Videos are streamed with HTTP Range support so browsers
 * can play and seek them.
 */
const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".txt": "text/plain",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov"]);

function streamResponse(
  filePath: string,
  start: number,
  end: number,
  status: number,
  headers: Record<string, string>
) {
  const nodeStream = createReadStream(filePath, { start, end });
  const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;
  return new NextResponse(webStream, { status, headers });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const segments = (await params).path ?? [];
  if (segments.length === 0 || segments.some((s) => s === ".." || s.includes("\\"))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // CVs contain personal data — only a signed-in admin may download them.
  if (segments[0] === "cvs") {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const baseDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(baseDir, ...segments);
  if (!filePath.startsWith(baseDir + path.sep)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const type = CONTENT_TYPES[ext] ?? "application/octet-stream";
  const filename = path.basename(filePath);

  // Videos: stream from disk with Range support (play + seek).
  if (VIDEO_EXTS.has(ext)) {
    let size: number;
    try {
      size = (await stat(filePath)).size;
    } catch {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const baseHeaders: Record<string, string> = {
      "Content-Type": type,
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=3600",
    };

    const range = req.headers.get("range");
    const m = range ? /^bytes=(\d*)-(\d*)$/.exec(range.trim()) : null;
    if (m && (m[1] !== "" || m[2] !== "")) {
      let start: number;
      let end: number;
      if (m[1] === "") {
        // Suffix range: last N bytes.
        const suffix = Number(m[2]);
        if (!Number.isFinite(suffix) || suffix <= 0) {
          return new NextResponse(null, {
            status: 416,
            headers: { "Content-Range": `bytes */${size}` },
          });
        }
        start = Math.max(0, size - suffix);
        end = size - 1;
      } else {
        start = Number(m[1]);
        end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
      }
      if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= size) {
        return new NextResponse(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${size}` },
        });
      }
      return streamResponse(filePath, start, end, 206, {
        ...baseHeaders,
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Content-Length": String(end - start + 1),
      });
    }

    return streamResponse(filePath, 0, size - 1, 200, {
      ...baseHeaders,
      "Content-Length": String(size),
    });
  }

  let data: Buffer;
  try {
    data = await readFile(filePath);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      "Content-Type": type,
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
