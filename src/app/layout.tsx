import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#023047",
};

export const metadata: Metadata = {
  title: "WorkWings — Vind Flexibele Shifts | Freelance Platform Nederland",
  description: "WorkWings verbindt freelancers met bedrijven in horeca, retail, logistiek en events. Lagere fees, in-app chat, AI matching en direct uitbetaald.",
  keywords: ["freelance", "shifts", "horeca", "ZZP", "Nederland", "flex werk", "bijbaan", "WorkWings"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WorkWings",
  },
  openGraph: {
    title: "WorkWings — Werk op jouw voorwaarden",
    description: "Vind shifts die bij jou passen. Gemiddeld €20/uur, direct betaald. In-app chat, bedrijf reviews, AI matching.",
    type: "website",
    locale: "nl_NL",
    url: "https://workwings.nl",
    siteName: "WorkWings",
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkWings — Freelance Shifts in Nederland",
    description: "Vind shifts in horeca, retail, logistiek en events. Direct betaald.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
