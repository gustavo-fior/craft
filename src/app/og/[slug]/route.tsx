import { allConcepts } from "content-collections";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

export function generateStaticParams() {
  return allConcepts.map((concept) => ({ slug: concept.slug }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const concept = allConcepts.find((c) => c.slug === slug);
  const title = concept?.title ?? SITE_NAME;
  const description = concept?.description ?? "";

  const medium = await readFile(
    path.join(process.cwd(), "src/assets/Inter-Medium.otf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#fafafa",
          color: "#333333",
          fontFamily: "Inter",
        }}
      >
        <div style={{ fontSize: 28, color: "#8f8f8f" }}>{SITE_NAME}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64 }}>{title}</div>
          <div style={{ fontSize: 32, color: "#8f8f8f" }}>{description}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Inter", data: medium, weight: 500 }],
    },
  );
}
