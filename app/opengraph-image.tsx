import { ImageResponse } from "next/og";

export const alt = "Mapinly – Discover events and community forums";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          backgroundColor: "#0a0a0a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#b8cd65",
              borderRadius: 8,
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 14 14"
              fill="none"
              style={{ margin: "auto" }}
            >
              <path
                fill="black"
                fillRule="evenodd"
                d="M7 0.0905762c0.55229 0 1 0.4477148 1 1.0000038v4.08776l3.4634 -2.204c0.466 -0.29651 1.0841 -0.15916 1.3806 0.30679 0.2965 0.46594 0.1591 1.08402 -0.3068 1.38053L8.86266 6.99999l3.67454 2.33833c0.4659 0.29651 0.6033 0.91458 0.3068 1.38058 -0.2965 0.4659 -0.9146 0.6033 -1.3806 0.3067L8 8.82165v4.08775c0 0.5523 -0.44771 1 -1 1 -0.55228 0 -1 -0.4477 -1 -1V8.82169L2.53664 11.0256c-0.46595 0.2966 -1.08403 0.1592 -1.38054 -0.3067 -0.29651 -0.466 -0.159157 -1.08407 0.30678 -1.38058L5.1374 6.99999 1.46288 4.66166c-0.465937 -0.29651 -0.60329 -0.91459 -0.30678 -1.38053 0.29651 -0.46595 0.91459 -0.6033 1.38054 -0.30679L6 5.1783V1.09058C6 0.538291 6.44772 0.0905762 7 0.0905762Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: 72,
              fontWeight: 600,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Mapinly
          </span>
        </div>
        <p
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Discover events and community forums in your language
        </p>
      </div>
    ),
    { ...size }
  );
}
