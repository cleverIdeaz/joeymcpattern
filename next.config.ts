import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/joeymcpattern' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/joeymcpattern/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true
};

export default nextConfig;
