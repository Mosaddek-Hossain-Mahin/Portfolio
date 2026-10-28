import { put } from "@vercel/blob";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Store an uploaded file.
 * - When BLOB_READ_WRITE_TOKEN is set (his local setup AND production —
 *   see DEPLOY.md): uploads to Vercel Blob and returns the public URL.
 * - Otherwise (credential-free sandbox verification only): writes under
 *   public/uploads/<dir>/ and returns the /uploads/... path, which the
 *   /uploads streaming route serves. This fallback is never part of the
 *   documented setup.
 *
 * `dir`: "images" for photos/logos, "videos" for project videos, "files"
 * for the CV PDF. NOTE: never store the CV under "cvs" — the /uploads
 * route treats that directory as admin-only, and the public Download CV
 * button must work for visitors. ("files" is served publicly.)
 */
export async function storeUpload(
  file: File,
  dir: "images" | "videos" | "files" = "images"
): Promise<{ url: string; name: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name).toLowerCase() || "";
  const key = `${dir}/${randomUUID()}${ext}`;

  if (BLOB_TOKEN) {
    const blob = await put(key, buffer, {
      access: "public",
      token: BLOB_TOKEN,
      contentType: file.type || undefined,
    });
    return { url: blob.url, name: file.name };
  }

  const outDir = path.join(process.cwd(), "public", "uploads", dir);
  await mkdir(outDir, { recursive: true });
  const filename = key.split("/")[1];
  await writeFile(path.join(outDir, filename), buffer);
  return { url: `/uploads/${dir}/${filename}`, name: file.name };
}

export function isBlobUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}
