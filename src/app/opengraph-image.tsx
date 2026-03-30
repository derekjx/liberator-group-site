import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LiberatorGroup — Empowering Freedom & Purpose";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#0D1B27",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Fire gradient bleed — top right atmosphere */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(233,41,4,0.18) 0%, rgba(253,105,16,0.08) 50%, transparent 75%)",
          }}
        />
        {/* Subtle bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(253,105,16,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Top — logo area */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Flame icon (inline SVG equivalent as absolutely-placed div shapes) */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "#0D1B27",
              border: "2px solid rgba(233,41,4,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 20,
                height: 28,
                background: "linear-gradient(180deg, #FD6910 0%, #E92904 100%)",
                borderRadius: "50% 50% 40% 40% / 60% 60% 40% 40%",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              style={{
                fontSize: 18,
                fontFamily: "sans-serif",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              LIBERATORGROUP
            </span>
          </div>
        </div>

        {/* Centre — main headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Fire accent line */}
          <div
            style={{
              width: 56,
              height: 4,
              background: "linear-gradient(90deg, #E92904, #FD6910)",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 880,
            }}
          >
            A life you don&apos;t want{" "}
            <span style={{ color: "#E92904" }}>to retire from.</span>
          </div>
          <div
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.55)",
              fontFamily: "sans-serif",
              fontWeight: 300,
              letterSpacing: "0.01em",
              lineHeight: 1.6,
              maxWidth: 720,
            }}
          >
            Books, coaching, and programmes for capable people ready to be free of
            what has been holding them back.
          </div>
        </div>

        {/* Bottom — tagline + URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontFamily: "sans-serif",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#FD6910",
            }}
          >
            EMPOWERING FREEDOM & PURPOSE
          </span>
          <span
            style={{
              fontSize: 15,
              fontFamily: "sans-serif",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.04em",
            }}
          >
            liberatorgroup.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
