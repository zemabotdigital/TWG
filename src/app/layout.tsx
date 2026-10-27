import type { Metadata } from "next";
import { Almarai, Cinzel } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";

// Cinzel — the Roman serif of the logo wordmark, so headings and the
// mark read as one typographic family.
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
});

export const metadata: Metadata = {
  // Vercel sets VERCEL_PROJECT_PRODUCTION_URL; the fallback keeps local dev
  // and previews from emitting relative social-card URLs.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: site.locale,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Without JavaScript the reveal animation never runs, so the
            content it wraps must not stay hidden. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className={`${cinzel.variable} ${almarai.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
