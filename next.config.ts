import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native module; it must not be bundled by webpack.
  serverExternalPackages: ["@prisma/adapter-better-sqlite3", "better-sqlite3"],

  /*
    This project sits inside a directory that has its own package-lock.json,
    so Next.js walks up and guesses that parent as the workspace root — which
    would make production builds trace files from an unrelated project.
    Pinning it here keeps the build self-contained.
  */
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
