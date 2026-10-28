import { ImageResponse } from "next/og";
import { DEFAULT_SETTINGS } from "@/lib/site-defaults";

// Generated share image from the demo branding (dark hero, huge name marquee).
export const alt = "Mohammed — Designer & Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#101012",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, opacity: 0.85 }}>
          <span
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: "#455ce9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 26,
              color: "#fff",
            }}
          >
            M
          </span>
          <span>{`© Code by ${DEFAULT_SETTINGS.siteName}`}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>
            {`${DEFAULT_SETTINGS.siteName} —`}
          </div>
          <div style={{ fontSize: 40, marginTop: 24, opacity: 0.85 }}>
            {`${DEFAULT_SETTINGS.roleLine1} ${DEFAULT_SETTINGS.roleLine2}`}
          </div>
        </div>
        <div style={{ fontSize: 24, opacity: 0.7 }}>
          {`Located in ${DEFAULT_SETTINGS.locationText}`}
        </div>
      </div>
    ),
    { ...size }
  );
}
