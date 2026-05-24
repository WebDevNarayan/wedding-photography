import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    domains: ["res.cloudinary.com"],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
