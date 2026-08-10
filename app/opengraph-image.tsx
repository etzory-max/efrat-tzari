import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2C3238 0%, #465B6D 100%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", color: "#AAB8A9", fontSize: 30, letterSpacing: 4 }}>
          {site.jobTitle}
        </div>
        <div style={{ display: "flex", color: "#FFFFFF", fontSize: 88, marginTop: 16 }}>
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            color: "#F5F2ED",
            fontSize: 40,
            marginTop: 8,
            textAlign: "right",
          }}
        >
          {site.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            width: 160,
            height: 6,
            background: "#AAB8A9",
            borderRadius: 3,
          }}
        />
      </div>
    ),
    size,
  );
}
