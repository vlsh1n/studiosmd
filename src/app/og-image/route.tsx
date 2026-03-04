import { ImageResponse } from "next/og";

export const runtime = "edge";

const width = 1200;
const height = 630;

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "radial-gradient(circle at 90% 5%, #ff7c55 0%, rgba(255,124,85,0) 34%), linear-gradient(135deg, #f2efea 0%, #ece8e2 55%, #e5dfd8 100%)",
          color: "#2b2a42",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            studiosmap
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#3d3d5c",
              opacity: 0.9,
            }}
          >
            studiosmap.co
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            maxWidth: 940,
          }}
        >
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#24243b",
            }}
          >
            Catalog de studiouri foto în Chișinău
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.3,
              color: "#474765",
              fontWeight: 500,
            }}
          >
            Alege rapid sala potrivită după preț, sector și opțiuni.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 24,
            color: "#4f4f6e",
            opacity: 0.9,
          }}
        >
          RO · RU · EN
        </div>
      </div>
    ),
    {
      width,
      height,
    }
  );
}
