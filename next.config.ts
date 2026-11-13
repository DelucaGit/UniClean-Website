import type { NextConfig } from "next";

// Gamla WordPress-adresser och deras mål på nya sajten.
// Listan och motiveringen finns i docs/gamla-adresser.md.
const oldAddresses: Record<string, string> = {
  "/hemstadning-info-bokning": "/#tjanster",
  "/fonsterputs-info-bokning": "/#tjanster",
  "/flyttstadning-info-bokning": "/#tjanster",
  "/bokning": "/#sa-funkar-det",
  "/kontakt": "/#kontakt",
  "/vi-aterkommer-med-offert-inom-kort": "/",
  "/author/admin": "/",
};

const nextConfig: NextConfig = {
  trailingSlash: true,
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // 90 används för skärmbilderna från appen, där text annars blir suddig.
    qualities: [75, 90],
  },
  async redirects() {
    const entries = Object.entries(oldAddresses);
    const www = [{ type: "host" as const, value: "www.uniclean.nu" }];
    return [
      // www + gammal adress: direkt till slutmålet i ett hopp.
      ...entries.map(([source, destination]) => ({
        source,
        has: www,
        destination: `https://uniclean.nu${destination}`,
        permanent: true,
      })),
      // Allt annat på www till samma sökväg utan www.
      {
        source: "/:path*",
        has: www,
        destination: "https://uniclean.nu/:path*",
        permanent: true,
      },
      ...entries.map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
