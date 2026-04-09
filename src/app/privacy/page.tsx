import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-32">
        <h1 className="text-3xl font-black text-foreground mb-8">Privacybeleid</h1>
        <div className="prose prose-sm text-foreground-muted space-y-4">
          <p className="text-sm leading-relaxed">WorkWings B.V. (KVK: 12345678), gevestigd te Rotterdam, is verantwoordelijk voor de verwerking van persoonsgegevens zoals weergegeven in dit privacybeleid.</p>

          <h2 className="text-lg font-bold text-foreground mt-6">1. Persoonsgegevens die wij verwerken</h2>
          <p className="text-sm leading-relaxed">Wij verwerken persoonsgegevens doordat je gebruik maakt van ons platform en/of omdat je deze zelf aan ons verstrekt. Dit betreft: voor- en achternaam, telefoonnummer, e-mailadres, adresgegevens, IBAN, KVK-nummer, BTW-nummer, locatiegegevens (GPS check-in/out), en werkhistorie.</p>

          <h2 className="text-lg font-bold text-foreground mt-6">2. Waarom wij gegevens verwerken</h2>
          <p className="text-sm leading-relaxed">Wij verwerken jouw persoonsgegevens voor de volgende doelen: het afhandelen van betalingen, het matchen van freelancers met opdrachtgevers, het nakomen van wettelijke verplichtingen (Wet DBA, 660-urenregeling), en het verbeteren van ons platform.</p>

          <h2 className="text-lg font-bold text-foreground mt-6">3. Bewaartermijn</h2>
          <p className="text-sm leading-relaxed">Wij bewaren persoonsgegevens niet langer dan strikt noodzakelijk. Financiele gegevens worden 7 jaar bewaard conform de fiscale bewaarplicht.</p>

          <h2 className="text-lg font-bold text-foreground mt-6">4. Delen met derden</h2>
          <p className="text-sm leading-relaxed">Wij delen gegevens met: Supabase (database hosting, EU), Revolut (betalingsverwerking), en Vercel (website hosting). Alle verwerkers zijn AVG-compliant en er zijn verwerkersovereenkomsten afgesloten.</p>

          <h2 className="text-lg font-bold text-foreground mt-6">5. Jouw rechten</h2>
          <p className="text-sm leading-relaxed">Je hebt het recht op inzage, correctie, verwijdering en overdracht van je persoonsgegevens. Ook heb je het recht om bezwaar te maken tegen de verwerking. Neem contact op via privacy@workwings.nl.</p>

          <h2 className="text-lg font-bold text-foreground mt-6">6. Beveiliging</h2>
          <p className="text-sm leading-relaxed">Wij nemen passende maatregelen om misbruik, verlies en onbevoegde toegang tegen te gaan. Alle communicatie verloopt via HTTPS. Gevoelige gegevens (IBAN, BSN) worden versleuteld opgeslagen.</p>

          <h2 className="text-lg font-bold text-foreground mt-6">7. Cookies</h2>
          <p className="text-sm leading-relaxed">Wij gebruiken functionele cookies (Supabase sessie) en analytische cookies (PostHog). Zie ons <a href="/cookies" className="font-semibold" style={{ color: "#EF476F" }}>cookiebeleid</a> voor meer informatie.</p>

          <p className="text-sm text-foreground-subtle mt-8">Laatst bijgewerkt: april 2026</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
