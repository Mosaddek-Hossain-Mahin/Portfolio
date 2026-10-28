import { parseVideoUrl } from "@/lib/video";

/**
 * Public video rendering (server-safe — no client JS needed), ported from
 * StitchBD. Uploaded/direct file → native <video controls preload="none">
 * with an optional poster; YouTube/Vimeo link → responsive 16:9 iframe
 * embed (youtube-nocookie / player.vimeo.com). Detection is by URL
 * (see lib/video). Renders nothing for empty/unparseable input.
 * Styling lives in demo.css (.video-frame / .video-embed).
 */
export function VideoPlayer({
  url,
  poster,
  title,
  className = "",
}: {
  url: string | null | undefined;
  poster?: string | null;
  title?: string;
  className?: string;
}) {
  const parsed = parseVideoUrl(url);
  if (!parsed) return null;

  if (parsed.kind === "file") {
    return (
      <video
        controls
        playsInline
        preload="none"
        poster={poster || undefined}
        src={parsed.src}
        className={`video-frame ${className}`.trim()}
        aria-label={title}
      />
    );
  }

  return (
    <div className={`video-embed ${className}`.trim()}>
      <iframe
        src={parsed.embedUrl ?? undefined}
        title={title || "Video"}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
