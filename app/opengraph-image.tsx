export const runtime = "edge";
export const contentType = "image/png";
import { ImageResponse } from "next/og";
function clean(s: string | null) {
  return (s || "").replace(/[<>]/g, "").trim().slice(0, 40) || "Your Company";
}
function hex(h: string | null) {
  const x = h?.startsWith("#") ? h : `#${h || ""}`;
  return /^#[0-9a-fA-F]{6}$/.test(x) ? x.toUpperCase() : "#FFA63D";
}
export async function GET(req: Request) {
  const url = new URL(req.url);
  const brand = clean(url.searchParams?.get("brand"));
  const primary = hex(url.searchParams?.get("primary"));
  const expire = url.searchParams?.get("expire");

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: primary,
          color: "#0D0D0D",
          fontSize: 98,
          fontWeight: 800,
        }}
      >
        <div>{brand}</div>
        {expire && (
          <div
            style={{
              fontSize: 48,
              fontWeight: 600,
              marginTop: 20,
              opacity: 0.8,
            }}
          >
            Expires in {expire} days
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
