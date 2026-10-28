import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    This project sits inside a directory that has its own package-lock.json,
    so Next.js walks up and guesses that parent as the workspace root — which
    would make production builds trace files from an unrelated project.
    Pinning it here keeps the build self-contained.
  */
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
