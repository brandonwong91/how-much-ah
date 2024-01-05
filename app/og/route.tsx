import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET() {
  const image = await fetch(
    new URL("/public/og-image.png", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          background: "#f6f6f6",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          width="1280px"
          height="800px"
          src={image as unknown as string}
          alt="preview"
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
