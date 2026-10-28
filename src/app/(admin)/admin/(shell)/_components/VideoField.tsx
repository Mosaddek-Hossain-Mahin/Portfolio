"use client";

import { useRef, useState } from "react";
import { Field, inputCls } from "./ui";
import { parseVideoUrl } from "@/lib/video";
import { VideoPlayer } from "@/components/site/VideoPlayer";

/**
 * Video field with four source modes — Upload | YouTube | Vimeo | Direct
 * URL (ported from StitchBD). Writes the final URL into a hidden input
 * named `name`, so the EntityManager save handler reads it from the form
 * like the image fields. Uploads POST to /api/admin/upload?kind=video
 * (Blob in production, local /uploads fallback otherwise), with XHR
 * progress. Also used standalone in forms that read fd.get(name).
 */

type Mode = "upload" | "youtube" | "vimeo" | "url";

const MODES: { id: Mode; label: string }[] = [
  { id: "upload", label: "Upload" },
  { id: "youtube", label: "YouTube" },
  { id: "vimeo", label: "Vimeo" },
  { id: "url", label: "Direct URL" },
];

const PLACEHOLDERS: Record<Exclude<Mode, "upload">, string> = {
  youtube: "https://www.youtube.com/watch?v=…",
  vimeo: "https://vimeo.com/…",
  url: "https://…/video.mp4",
};

function initialMode(value: string): Mode {
  const p = parseVideoUrl(value);
  if (!p) return "upload";
  if (p.kind === "youtube") return "youtube";
  if (p.kind === "vimeo") return "vimeo";
  if (value.startsWith("/uploads/") || value.includes("blob.vercel-storage.com")) return "upload";
  return "url";
}

function xhrUpload(file: File, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let data: { url?: string; error?: string } = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* keep empty */
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.url) resolve(data.url);
      else reject(new Error(data.error || "Upload failed."));
    };
    xhr.onerror = () => reject(new Error("Upload failed — network error."));
    const fd = new FormData();
    fd.append("kind", "video");
    fd.append("file", file);
    xhr.send(fd);
  });
}

export default function VideoField({
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
  const [mode, setMode] = useState<Mode>(() => initialMode(defaultValue ?? ""));
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const parsed = parseVideoUrl(url);

  async function doUpload(file: File) {
    setUploading(true);
    setError("");
    setProgress(0);
    try {
      const uploaded = await xhrUpload(file, setProgress);
      setUrl(uploaded);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function clear() {
    setUrl("");
    setError("");
    setProgress(null);
  }

  const recognition = (() => {
    if (!url) return null;
    if (mode === "youtube") {
      return parsed?.kind === "youtube"
        ? { ok: true, text: "✓ YouTube video recognized — it will play in an embedded player." }
        : { ok: false, text: "This link was not recognized as a YouTube video. Paste a youtube.com or youtu.be link." };
    }
    if (mode === "vimeo") {
      return parsed?.kind === "vimeo"
        ? { ok: true, text: "✓ Vimeo video recognized — it will play in an embedded player." }
        : { ok: false, text: "This link was not recognized as a Vimeo video. Paste a vimeo.com link." };
    }
    if (mode === "url") {
      if (parsed?.kind === "file") return { ok: true, text: "✓ Direct video file — it will play in the site video player." };
      if (parsed) return { ok: true, text: "✓ This is a YouTube/Vimeo link — it will play in an embedded player." };
    }
    return null;
  })();

  const tabCls = (m: Mode) =>
    `rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition ${
      mode === m
        ? "bg-[#181c20] text-white"
        : "text-[#797f89] hover:bg-black/5 hover:text-[#161c26]"
    }`;

  const smallBtn =
    "shrink-0 rounded-lg border border-black/15 bg-[#f4f7f9] px-4 py-2.5 text-sm font-semibold text-[#161c26] hover:bg-black/5 disabled:opacity-60";

  return (
    <Field label={label} hint={hint}>
      <div className="rounded-xl border border-black/10 bg-white p-3.5">
        <div className="mb-3 flex flex-wrap gap-1 rounded-lg bg-[#f4f7f9] p-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={tabCls(m.id)}
              onClick={(e) => {
                e.preventDefault();
                setMode(m.id);
                setError("");
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "upload" ? (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={smallBtn}
                disabled={uploading}
                onClick={(e) => {
                  e.preventDefault();
                  fileRef.current?.click();
                }}
              >
                {uploading
                  ? `Uploading${progress !== null ? ` ${progress}%` : "…"}`
                  : url
                    ? "Replace video"
                    : "Upload video"}
              </button>
              {url && !uploading && (
                <button
                  type="button"
                  className={smallBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    clear();
                  }}
                >
                  Remove
                </button>
              )}
              <span className="text-[12.5px] text-[#797f89]">MP4, WebM or MOV — up to 100 MB.</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,.mov"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void doUpload(f);
              }}
            />
            {uploading && progress !== null && (
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[#455ce9] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={PLACEHOLDERS[mode]}
                className={inputCls}
              />
              {url && (
                <button
                  type="button"
                  className={smallBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    clear();
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            {recognition && (
              <p className={`mt-1.5 text-[12.5px] font-medium ${recognition.ok ? "text-green-700" : "text-amber-700"}`}>
                {recognition.text}
              </p>
            )}
          </div>
        )}

        {url && parsed && mode !== "upload" && (
          <div className="mt-3 max-w-[440px]">
            <VideoPlayer url={url} title="Video preview" />
          </div>
        )}
        {url && mode === "upload" && parsed?.kind === "file" && !uploading && (
          <div className="mt-3 max-w-[440px]">
            <video controls playsInline preload="metadata" src={parsed.src} className="w-full rounded-lg bg-black" />
          </div>
        )}
        {url && (
          <p className="mt-2 break-all text-[12px] text-[#797f89]">{url}</p>
        )}
        {error && <p className="mt-1.5 text-[12.5px] text-red-600">{error}</p>}
      </div>
      <input type="hidden" name={name} value={url} />
    </Field>
  );
}
