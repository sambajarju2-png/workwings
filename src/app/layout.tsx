import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorkWings — Vind Flexibele Shifts | Freelance Platform Nederland",
  description: "WorkWings verbindt freelancers met bedrijven in horeca, retail, logistiek en events. Lagere fees, in-app chat, AI matching en direct uitbetaald.",
  keywords: ["freelance", "shifts", "horeca", "ZZP", "Nederland", "flex werk", "bijbaan"],
  openGraph: {
    title: "WorkWings — Werk op jouw voorwaarden",
    description: "Vind shifts die bij jou passen. Gemiddeld €20/uur, direct betaald.",
    type: "website",
    locale: "nl_NL",
    url: "https://workwings.nl",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
