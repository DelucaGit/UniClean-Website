import type { NextConfig } from "next";
import { sectionHref } from "./src/content/sections";

// Gamla WordPress-adresser och deras mål på nya sajten.
// Listan och motiveringen finns i docs/gamla-adresser.md.
const oldAddresses: Record<string, string> = {
  "/hemstadning-info-bokning": sectionHref("tjanster"),
  "/fonsterputs-info-bokning": sectionHref("tjanster"),
  "/flyttstadning-info-bokning": sectionHref("tjanster"),
  "/bokning": sectionHref("sa-funkar-det"),
  "/kontakt": sectionHref("kontakt"),
  "/vi-aterkommer-med-offert-inom-kort": "/",
  "/author/admin": "/",
};

const isDev = process.env.NODE_ENV === "development";

// Sidorna är statiska, så inline-skripten från Next.js kan inte få en nonce.
// Utvecklingsläget behöver dessutom eval och en WebSocket för omladdning.
// #42 (mätning) och #51 (video) kan kräva fler källor.
const contentSecurityPolicy = [
  "default-src 'none'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "media-src 'self'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Utan includeSubDomains, eftersom appens subdomän sköts separat.
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  agentRules: false,
  // Döljer Next.js utvecklingsindikator (loggan nere till vänster i npm run dev).
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // 90 används för skärmbilderna från appen, där text annars blir suddig.
    qualities: [75, 90],
    // Optimerade bilder får en egen CSP. Detta är standardvärdet i Next.js plus frame-ancestors.
    contentSecurityPolicy: "script-src 'none'; frame-src 'none'; frame-ancestors 'none'; sandbox;",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
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
