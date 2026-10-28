/**
 * Video URL handling shared by the admin VideoField and the public player.
 * Ported from the proven StitchBD implementation.
 *
 * Stored video values stay a single plain URL (`videoUrl`) everywhere; the
 * source is detected from the URL at render/edit time:
 *  - YouTube (watch / youtu.be / shorts / embed) → iframe embed
 *  - Vimeo (vimeo.com/<id> / player.vimeo.com)   → iframe embed
 *  - anything else (uploaded file, direct MP4/WebM/MOV URL, /uploads/…)
 *    → native <video> element
 */

export type VideoKind = "file" | "youtube" | "vimeo";

export type ParsedVideo = {
  kind: VideoKind;
  /** Original URL (for files: the playable source). */
  src: string;
  /** Iframe embed URL for youtube/vimeo; null for files. */
  embedUrl: string | null;
  /** Platform video id for youtube/vimeo; null for files. */
  id: string | null;
};

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
]);

const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);

function youtubeId(u: URL): string | null {
  const host = u.hostname.toLowerCase();
  if (host === "youtu.be") {
    const id = u.pathname.split("/").filter(Boolean)[0];
    return id || null;
  }
  if (u.pathname === "/watch") return u.searchParams.get("v");
  const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{6,})/);
  if (m) return m[1];
  return null;
}

function vimeoId(u: URL): string | null {
  const parts = u.pathname.split("/").filter(Boolean);
  // player.vimeo.com/video/<id> or vimeo.com/<id> (extra path segments ignored)
  const candidate = parts[0] === "video" ? parts[1] : parts[0];
  return candidate && /^\d+$/.test(candidate) ? candidate : null;
}

/** Parse any stored video URL. Returns null for empty/blank input. */
export function parseVideoUrl(raw: string | null | undefined): ParsedVideo | null {
  const url = (raw ?? "").trim();
  if (!url) return null;

  let u: URL | null = null;
  try {
    u = new URL(url);
  } catch {
    u = null; // relative path (e.g. /uploads/videos/…) → file
  }

  if (u && (u.protocol === "http:" || u.protocol === "https:")) {
    const host = u.hostname.toLowerCase();
    if (YOUTUBE_HOSTS.has(host)) {
      const id = youtubeId(u);
      if (id) {
        return {
          kind: "youtube",
          src: url,
          embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
          id,
        };
      }
    }
    if (VIMEO_HOSTS.has(host)) {
      const id = vimeoId(u);
      if (id) {
        return {
          kind: "vimeo",
          src: url,
          embedUrl: `https://player.vimeo.com/video/${id}`,
          id,
        };
      }
    }
  }

  return { kind: "file", src: url, embedUrl: null, id: null };
}
