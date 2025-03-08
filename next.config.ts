import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["www.fzmovies.net", "tvseries.in", "image.tmdb.org"],
    // If you have other domains already configured, add the new one to the existing array
    // domains: ['existing-domain.com', 'www.fzmovies.net'],
  },
};

export default nextConfig;
