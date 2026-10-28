"use client";

import { useRef, useState } from "react";
import { Field, inputCls } from "./ui";

/** File name to show for a stored CV URL (uploaded path or pasted URL). */
function fileNameOf(url: string): string {
  if (!url) return "";
  try {
    const path = url.startsWith("http") ? new URL(url).pathname : url;
    const base = path.split("/").filter(Boolean).pop() ?? "";
    return decodeURIComponent(base) || url;
  } catch {
    return url;
  }
}

/**
 * CV / résumé field for Admin → Settings: upload a PDF (POST
 * /api/admin/upload?kind=pdf — Vercel Blob in production, local /uploads
 * fallback otherwise) OR paste a direct URL. The URL lives in a normal
 * named input (same pattern as ImageField), so the settings form's
 * FormData read (fd.get(name)) picks the live value. The public
 * "Download CV" buttons render only while this is non-empty.
 */
export default function CvField({
  name,
  label,
  defaultValue,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("kind", "pdf");
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const smallBtn =
    "shrink-0 rounded-lg border border-black/15 bg-[#f4f7f9] px-4 text-sm font-semibold text-[#161c26] hover:bg-black/5 disabled:opacity-60";

  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-2">
        <input
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Upload a PDF or paste a direct URL…"
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className={smallBtn}
        >
          {uploading ? "Uploading…" : "Upload PDF"}
        </button>
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className={smallBtn}
          >
            Remove
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={upload}
        />
      </div>
      {error && <p className="mt-1 text-[12.5px] text-red-600">{error}</p>}
      {url && (
        <p className="mt-2 text-[13px] text-[#161c26]">
          Current file:{" "}
          <a href={url} target="_blank" rel="noopener" className="font-medium text-[#455ce9] underline">
            {fileNameOf(url)}
          </a>{" "}
          <span className="text-[#797f89]">— the Download CV button is live on About + Contact.</span>
        </p>
      )}
    </Field>
  );
}
