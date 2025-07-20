import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["www.fzmovies.net", "tvseries.in", "image.tmdb.org"],
  },
};

export default nextConfig;
