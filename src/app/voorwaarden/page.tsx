import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function VoorwaardenPage() {
  return (
    <main>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-32">
        <h1 className="text-3xl font-black text-foreground mb-8">Algemene Voorwaarden</h1>
        <div className="prose prose-sm text-foreground-muted space-y-4">
          <h2 className="text-lg font-bold text-foreground mt-6">1. Definities</h2>
          <p className="text-sm leading-relaxed">Platform: het WorkWings platform, bereikbaar via workwings.nl. Bemiddelaar: WorkWings B.V. Opdrachtgever: het bedrijf dat via het Platform freelancers inhuurt. Zzp&apos;er: de freelancer die via het Platform werkzaamheden verricht voor een Opdrachtgever.</p>

          <h2 className="text-lg font-bold text-foreground mt-6">2. Dienstverlening</h2>
          <p className="text-sm leading-relaxed">WorkWings bemiddelt tussen Zzp&apos;ers en Opdrachtgevers. WorkWings is geen partij bij de overeenkomst van opdracht die tot stand komt tussen Zzp&apos;er en Opdrachtgever. De bemiddeling is gebaseerd op de door de Belastingdienst beoordeelde modelovereenkomst (nr. 9092076897).</p>

          <h2 className="text-lg font-bold text-foreground mt-6">3. Tarieven en betaling</h2>
          <p className="text-sm leading-relaxed">WorkWings brengt een servicefee van €3,50 per gewerkt uur in rekening bij de Opdrachtgever. De Zzp&apos;er kan kiezen voor snelle betaling (5 werkdagen, €0,75/uur fee) of standaard betaling (na ontvangst van de Opdrachtgever, geen extra kosten).</p>

          <h2 className="text-lg font-bold text-foreground mt-6">4. 660-urenregeling</h2>
          <p className="text-sm leading-relaxed">Het Platform houdt automatisch bij hoeveel uur een Zzp&apos;er werkt voor dezelfde Opdrachtgever. Bij 580 uur wordt een waarschuwing gegeven. Bij 660 uur wordt verdere inzet geblokkeerd conform de Wet DBA.</p>

          <h2 className="text-lg font-bold text-foreground mt-6">5. Vervanging</h2>
          <p className="text-sm leading-relaxed">De Zzp&apos;er heeft het recht zich te laten vervangen door een derde, mits deze over de benodigde kwalificaties beschikt. Dit vervangingsrecht is een essentieel onderdeel van de overeenkomst van opdracht.</p>

          <h2 className="text-lg font-bold text-foreground mt-6">6. Aansprakelijkheid</h2>
          <p className="text-sm leading-relaxed">WorkWings is niet aansprakelijk voor schade die voortvloeit uit de werkzaamheden van de Zzp&apos;er. De Zzp&apos;er is verantwoordelijk voor een eigen bedrijfs- en beroepsaansprakelijkheidsverzekering.</p>

          <h2 className="text-lg font-bold text-foreground mt-6">7. Toepasselijk recht</h2>
          <p className="text-sm leading-relaxed">Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter te Rotterdam.</p>

          <p className="text-sm text-foreground-subtle mt-8">Laatst bijgewerkt: april 2026</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
