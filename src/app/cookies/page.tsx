import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function CookiesPage() {
  return (
    <main>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-32">
        <h1 className="text-3xl font-black text-foreground mb-8">Cookiebeleid</h1>
        <div className="prose prose-sm text-foreground-muted space-y-4">
          <p className="text-sm leading-relaxed">WorkWings gebruikt cookies om het platform goed te laten functioneren en om ons platform te verbeteren.</p>

          <h2 className="text-lg font-bold text-foreground mt-6">Functionele cookies (noodzakelijk)</h2>
          <p className="text-sm leading-relaxed">Supabase auth sessie cookies — nodig om ingelogd te blijven. Deze kunnen niet worden uitgeschakeld.</p>

          <h2 className="text-lg font-bold text-foreground mt-6">Analytische cookies (optioneel)</h2>
          <p className="text-sm leading-relaxed">PostHog — anonieme gebruiksstatistieken om het platform te verbeteren. Je kunt deze uitschakelen via de cookie-instellingen.</p>

          <p className="text-sm text-foreground-subtle mt-8">Laatst bijgewerkt: april 2026</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
