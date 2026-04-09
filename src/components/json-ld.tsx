export function JsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WorkWings",
    url: "https://workwings.nl",
    logo: "https://workwings.nl/icons/icon-512.png",
    description: "Freelance shift platform voor horeca, retail, logistiek en events in Nederland.",
    foundingDate: "2026",
    address: { "@type": "PostalAddress", addressCountry: "NL" },
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WorkWings",
    url: "https://workwings.nl",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://workwings.nl/shifts?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const app = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "WorkWings",
    url: "https://workwings.nl",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "WorkWings Freelance Platform",
    provider: { "@type": "Organization", name: "WorkWings" },
    serviceType: "Freelance Shift Marketplace",
    areaServed: { "@type": "Country", name: "Netherlands" },
    description: "Verbindt freelancers met bedrijven voor flexibele shifts in horeca, retail, logistiek en events.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
    </>
  );
}
