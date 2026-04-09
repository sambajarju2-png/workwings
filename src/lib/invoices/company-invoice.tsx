import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 9, fontFamily: "Helvetica", color: "#023047" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 30 },
  logo: { fontSize: 18, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  logoAccent: { color: "#EF476F" },
  invoiceTitle: { fontSize: 24, fontWeight: "bold", fontFamily: "Helvetica-Bold", color: "#023047", marginBottom: 20 },
  
  addressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  addressBlock: { width: "45%" },
  addressLabel: { fontSize: 8, color: "#8BA3B5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  addressName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  addressLine: { fontSize: 9, color: "#4A6B7F", marginBottom: 1 },

  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" },
  metaBlock: {},
  metaLabel: { fontSize: 8, color: "#8BA3B5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
  metaValue: { fontSize: 10, fontFamily: "Helvetica-Bold" },

  table: { marginBottom: 20 },
  tableHeader: { flexDirection: "row", backgroundColor: "#023047", padding: 8, borderRadius: 4 },
  tableHeaderText: { color: "white", fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  tableRow: { flexDirection: "row", padding: 8, borderBottomWidth: 1, borderBottomColor: "#F0F4F8" },
  tableCell: { fontSize: 9, color: "#4A6B7F" },
  
  col1: { width: "30%" },
  col2: { width: "20%" },
  col3: { width: "10%", textAlign: "center" },
  col4: { width: "15%", textAlign: "right" },
  col5: { width: "10%", textAlign: "right" },
  col6: { width: "15%", textAlign: "right" },

  totalsBlock: { alignItems: "flex-end", marginBottom: 30 },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", width: 280, paddingVertical: 4 },
  totalLabel: { width: 160, fontSize: 9, color: "#4A6B7F" },
  totalValue: { width: 120, fontSize: 9, textAlign: "right", color: "#023047" },
  totalRowBold: { flexDirection: "row", justifyContent: "flex-end", width: 280, paddingVertical: 6, borderTopWidth: 2, borderTopColor: "#023047", marginTop: 4 },
  totalLabelBold: { width: 160, fontSize: 11, fontFamily: "Helvetica-Bold", color: "#023047" },
  totalValueBold: { width: 120, fontSize: 11, textAlign: "right", fontFamily: "Helvetica-Bold", color: "#EF476F" },

  paymentInfo: { backgroundColor: "#F7F9FC", padding: 15, borderRadius: 6, marginBottom: 20 },
  paymentLabel: { fontSize: 8, color: "#8BA3B5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, fontFamily: "Helvetica-Bold" },
  paymentRow: { flexDirection: "row", marginBottom: 3 },
  paymentKey: { width: 120, fontSize: 9, color: "#4A6B7F" },
  paymentVal: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#023047" },

  footer: { position: "absolute", bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: "#E2E8F0", paddingTop: 10, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: "#8BA3B5" },
});

interface ShiftLine {
  workerName: string;
  shiftTitle: string;
  date: string;
  hours: number;
  ratePerHour: number;
  serviceFee: number;
}

interface CompanyInvoiceProps {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyKvk?: string;
  companyContact?: string;
  shifts: ShiftLine[];
  btwPercentage?: number;
  paymentTermDays?: number;
}

export function CompanyInvoice(props: CompanyInvoiceProps) {
  const {
    invoiceNumber, invoiceDate, dueDate,
    companyName, companyAddress, companyCity, companyKvk, companyContact,
    shifts, btwPercentage = 21, paymentTermDays = 14,
  } = props;

  const subtotal = shifts.reduce((sum, s) => sum + (s.hours * s.ratePerHour) + (s.hours * s.serviceFee), 0);
  const workerCosts = shifts.reduce((sum, s) => sum + (s.hours * s.ratePerHour), 0);
  const serviceFees = shifts.reduce((sum, s) => sum + (s.hours * s.serviceFee), 0);
  const btw = subtotal * (btwPercentage / 100);
  const total = subtotal + btw;

  const fmt = (n: number) => `€ ${n.toFixed(2).replace(".", ",")}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Work<Text style={styles.logoAccent}>Wings</Text></Text>
            <Text style={{ fontSize: 7, color: "#8BA3B5", marginTop: 2 }}>Factuur voor opdrachtgever</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 8, color: "#8BA3B5" }}>Betaaltermijn</Text>
            <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>{paymentTermDays} dagen</Text>
          </View>
        </View>

        <Text style={styles.invoiceTitle}>Factuur</Text>

        {/* Addresses */}
        <View style={styles.addressRow}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>Van</Text>
            <Text style={styles.addressName}>WorkWings B.V.</Text>
            <Text style={styles.addressLine}>Rotterdam, Nederland</Text>
            <Text style={styles.addressLine}>KVK: 12345678</Text>
            <Text style={styles.addressLine}>BTW: NL123456789B01</Text>
          </View>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>Aan</Text>
            <Text style={styles.addressName}>{companyName}</Text>
            {companyContact && <Text style={styles.addressLine}>t.a.v. {companyContact}</Text>}
            <Text style={styles.addressLine}>{companyAddress}</Text>
            <Text style={styles.addressLine}>{companyCity}</Text>
            {companyKvk && <Text style={styles.addressLine}>KVK: {companyKvk}</Text>}
          </View>
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Factuurnummer</Text>
            <Text style={styles.metaValue}>{invoiceNumber}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Factuurdatum</Text>
            <Text style={styles.metaValue}>{invoiceDate}</Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Vervaldatum</Text>
            <Text style={styles.metaValue}>{dueDate}</Text>
          </View>
        </View>

        {/* Shifts table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.col1]}>Werknemer</Text>
            <Text style={[styles.tableHeaderText, styles.col2]}>Shift</Text>
            <Text style={[styles.tableHeaderText, styles.col3]}>Uren</Text>
            <Text style={[styles.tableHeaderText, styles.col4]}>Tarief</Text>
            <Text style={[styles.tableHeaderText, styles.col5]}>Fee</Text>
            <Text style={[styles.tableHeaderText, styles.col6]}>Totaal</Text>
          </View>
          {shifts.map((s, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>{s.workerName}</Text>
              <Text style={[styles.tableCell, styles.col2]}>{s.shiftTitle} ({s.date})</Text>
              <Text style={[styles.tableCell, styles.col3]}>{s.hours}</Text>
              <Text style={[styles.tableCell, styles.col4]}>{fmt(s.ratePerHour)}</Text>
              <Text style={[styles.tableCell, styles.col5]}>{fmt(s.serviceFee)}</Text>
              <Text style={[styles.tableCell, styles.col6, { fontFamily: "Helvetica-Bold", color: "#023047" }]}>
                {fmt(s.hours * (s.ratePerHour + s.serviceFee))}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Werknemerskosten</Text>
            <Text style={styles.totalValue}>{fmt(workerCosts)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>WorkWings servicefee</Text>
            <Text style={styles.totalValue}>{fmt(serviceFees)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotaal excl. BTW</Text>
            <Text style={styles.totalValue}>{fmt(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>BTW {btwPercentage}%</Text>
            <Text style={styles.totalValue}>{fmt(btw)}</Text>
          </View>
          <View style={styles.totalRowBold}>
            <Text style={styles.totalLabelBold}>Totaal te betalen</Text>
            <Text style={styles.totalValueBold}>{fmt(total)}</Text>
          </View>
        </View>

        {/* Payment info */}
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentLabel}>Betaalinformatie</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentKey}>Begunstigde</Text>
            <Text style={styles.paymentVal}>WorkWings B.V.</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentKey}>IBAN</Text>
            <Text style={styles.paymentVal}>{process.env.NEXT_PUBLIC_WORKWINGS_IBAN || "NL00 REVO 0000 0000 00"}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentKey}>Referentie</Text>
            <Text style={styles.paymentVal}>{invoiceNumber}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentKey}>Vervaldatum</Text>
            <Text style={styles.paymentVal}>{dueDate}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>WorkWings B.V. · KVK 12345678 · BTW NL123456789B01</Text>
          <Text style={styles.footerText}>workwings.nl · zakelijk@workwings.nl</Text>
        </View>
      </Page>
    </Document>
  );
}
