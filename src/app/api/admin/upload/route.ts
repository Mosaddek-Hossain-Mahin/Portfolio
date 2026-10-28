import { NextRequest, NextResponse } from "next/server";
import { denyIfNotAdmin } from "../_guard";
import { storeUpload } from "@/lib/uploads";

/**
 * POST /api/admin/upload — admin file upload.
 * Form field `kind` selects the rules (default "image"):
 *  - image: jpeg/png/webp/gif/svg, ≤ 8 MB  → uploads/images/
 *  - video: mp4/webm/mov,          ≤ 100 MB → uploads/videos/
 *  - pdf:   application/pdf only,  ≤ 10 MB  → uploads/files/ (the CV)
 * Files go to Vercel Blob when BLOB_READ_WRITE_TOKEN is set, otherwise to
 * the local public/uploads fallback (see lib/uploads).
 */
const KINDS = {
  image: {
    dir: "images" as const,
    max: 8 * 1024 * 1024,
    types: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
    error: "Only image files are allowed.",
    sizeError: "File must be under 8 MB.",
  },
  video: {
    dir: "videos" as const,
    max: 100 * 1024 * 1024,
    types: ["video/mp4", "video/webm", "video/quicktime"],
    error: "Only MP4, WebM or MOV video files are allowed.",
    sizeError: "Video must be under 100 MB.",
  },
  pdf: {
    dir: "files" as const,
    max: 10 * 1024 * 1024,
    types: ["application/pdf"],
    error: "Only a PDF file is allowed.",
    sizeError: "PDF must be under 10 MB.",
  },
};

export async function POST(req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const kindKey = String(form.get("kind") ?? "image");
  const kind = KINDS[kindKey as keyof typeof KINDS] ?? KINDS.image;

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > kind.max) {
    return NextResponse.json({ error: kind.sizeError }, { status: 400 });
  }
  if (!kind.types.includes(file.type)) {
    return NextResponse.json({ error: kind.error }, { status: 400 });
  }

  const stored = await storeUpload(file, kind.dir);
  return NextResponse.json({ ok: true, url: stored.url, name: stored.name });
}
