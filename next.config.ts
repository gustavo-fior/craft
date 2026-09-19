import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "**" }],
  },
};

export default withContentCollections(createNextIntlPlugin()(nextConfig));
