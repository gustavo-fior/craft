import { allConcepts } from "content-collections";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [
    { slug: "index" },
    ...allConcepts.map((concept) => ({ slug: concept.slug })),
  ];
}

// Static, satori-safe renditions of the index thumbnails.
function Thumbnail({ slug }: { slug: string }) {
  const muted = "#c4c4c4";
  const border = "#e2e2e2";

  switch (slug) {
    case "letter-spacing":
      return (
        <div
          style={{
            display: "flex",
            fontSize: 110,
            fontWeight: 500,
            letterSpacing: "-0.03em",
            color: "#333",
          }}
        >
          Aa
        </div>
      );
    case "text-wrapping":
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: 300,
          }}
        >
          <div style={{ height: 14, width: "100%", borderRadius: 7, background: muted }} />
          <div style={{ height: 14, width: "66%", borderRadius: 7, background: muted }} />
          <div style={{ height: 14, width: "66%", borderRadius: 7, background: muted }} />
        </div>
      );
    case "oklch":
      return (
        <div style={{ display: "flex", gap: 14 }}>
          {/* oklch(0.72 0.14 h) precomputed to hex - satori can't parse oklch() */}
          {["#ee8b78", "#b1a141", "#43b989", "#41aee2", "#bb92ee"].map(
            (color) => (
              <div
                key={color}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: color,
                }}
              />
            ),
          )}
        </div>
      );
    case "nested-border-radius":
      return (
        <div
          style={{
            display: "flex",
            padding: 22,
            borderRadius: 46,
            border: `2px solid ${border}`,
            background: "#f1f1f1",
          }}
        >
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: 24,
              border: `2px solid ${border}`,
              background: "#ffffff",
            }}
          />
        </div>
      );
    case "icon-morph":
      return (
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: 110,
              height: 130,
              borderRadius: 22,
              border: `6px solid ${muted}`,
              background: "#ffffff",
            }}
          />
          <div
            style={{
              width: 110,
              height: 130,
              borderRadius: 22,
              border: "6px solid #333",
              background: "#ffffff",
              marginLeft: -70,
              marginTop: 28,
            }}
          />
        </div>
      );
    case "interface-sfx":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {[36, 80, 50, 110, 64, 94, 42].map((height, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height,
                borderRadius: 7,
                background: muted,
              }}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const concept = allConcepts.find((c) => c.slug === slug);
  const title = concept?.title ?? SITE_NAME;
  const description = concept?.description ?? SITE_DESCRIPTION;

  const [inter, redaction] = await Promise.all([
    readFile(path.join(process.cwd(), "src/assets/Inter-Medium.otf")),
    readFile(path.join(process.cwd(), "src/assets/Redaction35-Regular.otf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 72,
          background: "#fafafa",
          color: "#333333",
          fontFamily: "Inter",
        }}
      >
        {concept ? (
          <div
            style={{ display: "flex", fontSize: 30, fontFamily: "Redaction" }}
          >
            Craft
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Thumbnail slug={slug} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              display: "flex",
              fontSize: 52,
              fontFamily: concept ? "Inter" : "Redaction",
            }}
          >
            {concept ? title : SITE_NAME}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#8f8f8f" }}>
            {description}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: inter, weight: 500 },
        { name: "Redaction", data: redaction, weight: 400 },
      ],
    },
  );
}
