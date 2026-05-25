import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cara Wei Photography";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FDFAF7",
          gap: 24,
        }}
      >
        <div
          style={{
            width: 48,
            height: 1,
            backgroundColor: "#C8A97E",
          }}
        />
        <p
          style={{
            fontFamily: "serif",
            fontSize: 72,
            fontWeight: 300,
            color: "#1A1A18",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Cara Wei
        </p>
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: 14,
            fontWeight: 400,
            color: "#7A6E65",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Photography
        </p>
        <div
          style={{
            width: 48,
            height: 1,
            backgroundColor: "#C8A97E",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
