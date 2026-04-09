import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const s = StyleSheet.create({
  page: { padding: 50, fontSize: 9.5, fontFamily: "Helvetica", color: "#1a1a1a", lineHeight: 1.5 },
  header: { textAlign: "center", marginBottom: 20 },
  title: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#555", marginBottom: 2 },
  ref: { fontSize: 8, color: "#888", marginBottom: 20 },
  sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 14, marginBottom: 6 },
  bold: { fontFamily: "Helvetica-Bold" },
  p: { marginBottom: 6 },
  parties: { marginBottom: 15 },
  partyBlock: { marginBottom: 10 },
  partyName: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  partyDetail: { fontSize: 9, color: "#444" },
  articleTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 12, marginBottom: 4 },
  articleText: { marginBottom: 4 },
  marked: { backgroundColor: "#FFF3E0", padding: 2 },
  footer: { position: "absolute", bottom: 30, left: 50, right: 50, borderTopWidth: 1, borderTopColor: "#ddd", paddingTop: 8, fontSize: 7, color: "#999", textAlign: "center" },
  sigBlock: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  sigCol: { width: "45%" },
  sigLine: { borderTopWidth: 1, borderTopColor: "#333", marginTop: 40, paddingTop: 4, fontSize: 9 },
});

interface ModelovereenkomstProps {
  // Bemiddelaar (WorkWings)
  bemiddelaarNaam: string;
  bemiddelaarPlaats: string;
  bemiddelaarKvk: string;
  // ZZP'er (Worker)
  zzperNaam: string;
  zzperPlaats: string;
  zzperKvk?: string;
  zzperBtw?: string;
  // Opdrachtgever (Company)
  opdrachtgeverNaam: string;
  opdrachtgeverPlaats: string;
  opdrachtgeverKvk?: string;
  // Shift details
  omschrijving: string;
  datum: string;
  startTijd: string;
  eindTijd: string;
  tariefPerUur: number;
  locatie: string;
  // Meta
  overeenkomstNummer: string;
  overeenkomstDatum: string;
}

export function Modelovereenkomst(props: ModelovereenkomstProps) {
  const { bemiddelaarNaam, bemiddelaarPlaats, bemiddelaarKvk, zzperNaam, zzperPlaats, zzperKvk, zzperBtw, opdrachtgeverNaam, opdrachtgeverPlaats, opdrachtgeverKvk, omschrijving, datum, startTijd, eindTijd, tariefPerUur, locatie, overeenkomstNummer, overeenkomstDatum } = props;

  return (
    <Document>
      {/* DEEL A: Bemiddelingsovereenkomst */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.title}>Bemiddelingsovereenkomst (Deel A)</Text>
          <Text style={s.subtitle}>Modelovereenkomst ABU/I-ZO — Ontbreken werkgeversgezag</Text>
          <Text style={s.ref}>Beoordeling Belastingdienst nr. 9092076897 | Overeenkomst {overeenkomstNummer}</Text>
        </View>

        <Text style={s.p}>DE ONDERGETEKENDEN:</Text>

        <View style={s.parties}>
          <View style={s.partyBlock}>
            <Text style={s.partyName}>{zzperNaam}</Text>
            <Text style={s.partyDetail}>Gevestigd te {zzperPlaats}</Text>
            {zzperKvk && <Text style={s.partyDetail}>KVK: {zzperKvk}</Text>}
            {zzperBtw && <Text style={s.partyDetail}>BTW: {zzperBtw}</Text>}
            <Text style={s.partyDetail}>Hierna te noemen: &quot;Zzp&apos;er&quot;</Text>
          </View>
          <Text style={s.p}>en</Text>
          <View style={s.partyBlock}>
            <Text style={s.partyName}>{bemiddelaarNaam}</Text>
            <Text style={s.partyDetail}>Gevestigd te {bemiddelaarPlaats}</Text>
            <Text style={s.partyDetail}>KVK: {bemiddelaarKvk}</Text>
            <Text style={s.partyDetail}>Hierna te noemen: &quot;Bemiddelaar&quot;</Text>
          </View>
        </View>

        <Text style={s.p}>IN AANMERKING NEMENDE DAT:</Text>
        <Text style={s.articleText}>a) Partijen gezamenlijk een overeenkomst aan wensen te gaan, waarbij Zzp&apos;er na bemiddeling van Bemiddelaar overeenkomst(en) van opdracht aangaat met een opdrachtgever;</Text>
        <Text style={s.articleText}>b) Zzp&apos;er vrij is in het al dan niet sluiten van overeenkomsten van opdracht met andere opdrachtgevers en/of bemiddelaars;</Text>
        <Text style={s.articleText}>c) Bemiddelaar geen partij is bij de overeenkomst die tot stand komt tussen Zzp&apos;er en een opdrachtgever;</Text>
        <Text style={s.articleText}>d) Deze Bemiddelingsovereenkomst gebaseerd is op de door de Belastingdienst op 1 maart 2022 onder nummer 9092076897 beoordeelde modelovereenkomst.</Text>

        <Text style={s.sectionTitle}>KOMEN OVEREEN ALS VOLGT:</Text>

        <Text style={s.articleTitle}>Artikel 1 — Dienstverlening door Bemiddelaar</Text>
        <Text style={s.articleText}>1. Zzp&apos;er geeft opdracht aan Bemiddelaar om de navolgende diensten te verrichten:</Text>
        <Text style={s.articleText}>   a. Het bij elkaar brengen van vraag en aanbod via het WorkWings platform;</Text>
        <Text style={s.articleText}>   b. Het opstellen en beheren van de opdrachtovereenkomst tussen Zzp&apos;er en opdrachtgever;</Text>
        <Text style={s.articleText}>   c. Het opstellen en versturen van facturen aan opdrachtgever namens Zzp&apos;er;</Text>
        <Text style={s.articleText}>   d. Bemiddelaar verzorgt als dienstverlening aan Zzp&apos;er de betaling namens opdrachtgever aan Zzp&apos;er (kassiersfunctie).</Text>
        <Text style={s.articleText}>2. Bemiddelaar brengt voor deze diensten een vergoeding van €3,50 per gewerkt uur in rekening bij opdrachtgever.</Text>

        <Text style={s.articleTitle}>Artikel 7 — Duur van de Overeenkomst</Text>
        <Text style={s.articleText}>Deze overeenkomst treedt in werking op {overeenkomstDatum} en eindigt na voltooiing van de bemiddelde opdracht, tenzij eerder beëindigd conform artikel 8.</Text>

        <View style={s.sigBlock}>
          <View style={s.sigCol}><Text style={s.p}>Te {bemiddelaarPlaats}, {overeenkomstDatum}</Text><Text style={s.sigLine}>Bemiddelaar: {bemiddelaarNaam}</Text></View>
          <View style={s.sigCol}><Text style={s.p}>Te {zzperPlaats}, {overeenkomstDatum}</Text><Text style={s.sigLine}>Zzp&apos;er: {zzperNaam}</Text></View>
        </View>

        <View style={s.footer}><Text>Deze overeenkomst is gebaseerd op de door de Belastingdienst op 1 maart 2022 onder nummer 9092076897 beoordeelde overeenkomst. | WorkWings B.V.</Text></View>
      </Page>

      {/* DEEL B: Opdrachtovereenkomst */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.title}>Opdrachtovereenkomst (Deel B)</Text>
          <Text style={s.subtitle}>Overeenkomst van opdracht ex artikel 7:400 BW</Text>
          <Text style={s.ref}>Beoordeling Belastingdienst nr. 9092076897 | Overeenkomst {overeenkomstNummer}</Text>
        </View>

        <Text style={s.p}>DE ONDERGETEKENDEN:</Text>

        <View style={s.parties}>
          <View style={s.partyBlock}>
            <Text style={s.partyName}>{zzperNaam}</Text>
            <Text style={s.partyDetail}>Gevestigd te {zzperPlaats}</Text>
            {zzperKvk && <Text style={s.partyDetail}>KVK: {zzperKvk}</Text>}
            <Text style={s.partyDetail}>Hierna te noemen: &quot;Zzp&apos;er&quot;</Text>
          </View>
          <Text style={s.p}>en</Text>
          <View style={s.partyBlock}>
            <Text style={s.partyName}>{opdrachtgeverNaam}</Text>
            <Text style={s.partyDetail}>Gevestigd te {opdrachtgeverPlaats}</Text>
            {opdrachtgeverKvk && <Text style={s.partyDetail}>KVK: {opdrachtgeverKvk}</Text>}
            <Text style={s.partyDetail}>Hierna te noemen: &quot;Opdrachtgever&quot;</Text>
          </View>
        </View>

        <Text style={s.articleTitle}>Artikel 1 — Opdrachtverlening</Text>
        <Text style={s.articleText}>Opdrachtgever verleent aan Zzp&apos;er, na bemiddeling door WorkWings, opdracht om de volgende werkzaamheden te verrichten:</Text>
        <Text style={[s.articleText, s.bold]}>{omschrijving}</Text>
        <Text style={s.articleText}>Locatie: {locatie}</Text>
        <Text style={s.articleText}>Datum: {datum} | Tijd: {startTijd} — {eindTijd}</Text>

        <Text style={s.articleTitle}>Artikel 2 — Uitvoering van de Opdracht (gemarkeerd)</Text>
        <Text style={[s.articleText, s.marked]}>1. Zzp&apos;er accepteert de Opdracht en aanvaardt daarmee de volle verantwoordelijkheid voor het op juiste wijze uitvoeren van de overeengekomen werkzaamheden.</Text>
        <Text style={[s.articleText, s.marked]}>2. Zzp&apos;er deelt zijn werkzaamheden zelfstandig in. Wel vindt, voor zover dat voor de uitvoering nodig is, afstemming met Opdrachtgever plaats.</Text>
        <Text style={[s.articleText, s.marked]}>4. Zzp&apos;er is bij het uitvoeren van de werkzaamheden geheel zelfstandig. Hij/zij verricht de werkzaamheden naar eigen inzicht en zonder toezicht of leiding van Opdrachtgever.</Text>

        <Text style={s.articleTitle}>Artikel 4 — Vervanging (vervangingsrecht)</Text>
        <Text style={s.articleText}>1. Indien Zzp&apos;er voorziet dat hij de verplichtingen niet kan nakomen, stelt Zzp&apos;er Opdrachtgever hiervan onmiddellijk op de hoogte.</Text>
        <Text style={s.articleText}>2. Zzp&apos;er kan de werkzaamheden door derde(n) laten verrichten, mits deze over de benodigde kwalificaties beschikken.</Text>

        <Text style={s.articleTitle}>Artikel 6 — Vergoeding</Text>
        <Text style={s.articleText}>1. Opdrachtgever is aan Zzp&apos;er een vergoeding verschuldigd van <Text style={s.bold}>€{tariefPerUur.toFixed(2)}</Text> per uur exclusief btw.</Text>
        <Text style={s.articleText}>2. Zzp&apos;er ontvangt alleen vergoeding voor de uren waarin werkzaamheden zijn verricht.</Text>
        <Text style={s.articleText}>3. Bemiddelaar verstuurt namens Zzp&apos;er een factuur aan Opdrachtgever. Bemiddelaar vervult hierbij een kassiersfunctie.</Text>

        <Text style={s.articleTitle}>Artikel 7 — Fictieve dienstbetrekking</Text>
        <Text style={s.articleText}>Partijen kiezen ervoor om de fictieve dienstbetrekking van thuiswerkers of gelijkgestelden (art. 2b en 2c Uitvoeringsbesluit Loonbelasting 1965) buiten toepassing te laten.</Text>

        <Text style={s.articleTitle}>Artikel 14 — Rechtskeuze</Text>
        <Text style={s.articleText}>Op deze Overeenkomst is Nederlands recht van toepassing.</Text>

        <View style={s.sigBlock}>
          <View style={s.sigCol}><Text style={s.p}>Te {opdrachtgeverPlaats}, {overeenkomstDatum}</Text><Text style={s.sigLine}>Opdrachtgever: {opdrachtgeverNaam}</Text></View>
          <View style={s.sigCol}><Text style={s.p}>Te {zzperPlaats}, {overeenkomstDatum}</Text><Text style={s.sigLine}>Zzp&apos;er: {zzperNaam}</Text></View>
        </View>

        <View style={s.footer}><Text>Deze overeenkomst is gebaseerd op de door de Belastingdienst op 1 maart 2022 onder nummer 9092076897 beoordeelde overeenkomst. | WorkWings B.V.</Text></View>
      </Page>
    </Document>
  );
}
