import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/config/site";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const title = "UniClean | Boka hemstäd, flyttstäd och fönsterputs";
const description =
  "Boka hemstäd, storstäd, flyttstäd och fönsterputs hos UniClean. Se priset efter RUT och boka direkt i appen, utan offert.";
const shareImage = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "UniClean, hemstäd, flyttstäd och fönsterputs",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "/",
    siteName: site.name,
    title,
    description,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [shareImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={nunito.variable}>
      <body>
        <SkipLink />
        <Header />
        <div id="innehall" tabIndex={-1} className="outline-none">
          {children}
        </div>
        <Footer />
        <JsonLd />
      </body>
    </html>
  );
}
