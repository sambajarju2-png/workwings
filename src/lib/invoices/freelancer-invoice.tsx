import React from "react";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";

// Register font (fallback to Helvetica which is built-in)
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 9, fontFamily: "Helvetica", color: "#023047" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  logo: { fontSize: 18, fontWeight: "bold", fontFamily: "Helvetica-Bold" },
  logoAccent: { color: "#EF476F" },
  invoiceTitle: { fontSize: 24, fontWeight: "bold", fontFamily: "Helvetica-Bold", color: "#023047", marginBottom: 20 },
  
  // Address blocks
  addressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  addressBlock: { width: "45%" },
  addressLabel: { fontSize: 8, color: "#8BA3B5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  addressName: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  addressLine: { fontSize: 9, color: "#4A6B7F", marginBottom: 1 },

  // Invoice meta
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" },
  metaBlock: {},
  metaLabel: { fontSize: 8, color: "#8BA3B5", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
  metaValue: { fontSize: 10, fontFamily: "Helvetica-Bold" },

  // Table
  table: { marginBottom: 20 },
  tableHeader: { flexDirection: "row", backgroundColor: "#023047", padding: 8, borderRadius: 4 },
  tableHeaderText: { color: "white", fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  tableRow: { flexDirection: "row", padding: 8, borderBottomWidth: 1, borderBottomColor: "#F0F4F8" },
  tableCell: { fontSize: 9, color: "#4A6B7F" },
  
  col1: { width: "40%" },
  col2: { width: "12%", textAlign: "center" },
  col3: { width: "12%", textAlign: "center" },
  col4: { width: "18%", textAlign: "right" },
  col5: { width: "18%", textAlign: "right" },

  // Totals
  totalsBlock: { alignItems: "flex-end", marginBottom: 30 },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", width: 250, paddingVertical: 4 },
  totalLabel: { width: 150, fontSize: 9, color: "#4A6B7F" },
  totalValue: { width: 100, fontSize: 9, textAlign: "right", color: "#023047" },
  totalRowBold: { flexDirection: "row", justifyContent: "flex-end", width: 250, paddingVertical: 6, borderTopWidth: 2, borderTopColor: "#023047", marginTop: 4 },
  totalLabelBold: { width: 150, fontSize: 11, fontFamily: "Helvetica-Bold", color: "#023047" },
  totalValueBold: { width: 100, fontSize: 11, textAlign: "right", fontFamily: "Helvetica-Bold", color: "#EF476F" },

  // Factoring section
  factoringBlock: { backgroundColor: "#F7F9FC", padding: 15, borderRadius: 6, marginBottom: 20 },
  factoringTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  factoringRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  factoringLabel: { fontSize: 8, color: "#4A6B7F" },
  factoringValue: { fontSize: 8, color: "#023047" },

  // Footer
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: "#E2E8F0", paddingTop: 10, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: "#8BA3B5" },

  // Paid badge
  paidBadge: { position: "absolute", top: 35, right: 40, backgroundColor: "#A7DADC", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  paidText: { color: "#023047", fontSize: 10, fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
});

interface FreelancerInvoiceProps {
  invoiceNumber: string;
  invoiceDate: string;
  // Worker (sender)
  workerName: string;
  workerAddress: string;
  workerCity: string;
  workerKvk?: string;
  workerBtw?: string;
  // Company (recipient)  
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyKvk?: string;
  companyContact?: string;
  // Line items
  shiftTitle: string;
  shiftDate: string;
  week: number;
  hours: number;
  ratePerHour: number;
  // Fees
  btwPercentage?: number;
  factoringPercentage?: number;
  // Status
  isPaid?: boolean;
}

export function FreelancerInvoice(props: FreelancerInvoiceProps) {
  const {
    invoiceNumber, invoiceDate,
    workerName, workerAddress, workerCity, workerKvk, workerBtw,
    companyName, companyAddress, companyCity, companyKvk, companyContact,
    shiftTitle, shiftDate, week, hours, ratePerHour,
    btwPercentage = 21, factoringPercentage,
    isPaid = false,
  } = props;

  const subtotal = hours * ratePerHour;
  const btw = subtotal * (btwPercentage / 100);
  const totalInclBtw = subtotal + btw;
  
  const factoringAmount = factoringPercentage ? subtotal * (factoringPercentage / 100) : 0;
  const factoringBtw = factoringAmount * (btwPercentage / 100);
  const factoringTotal = factoringAmount + factoringBtw;
  const finalAmount = totalInclBtw - factoringTotal;

  const fmt = (n: number) => `€ ${n.toFixed(2).replace(".", ",")}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Work<Text style={styles.logoAccent}>Wings</Text></Text>
            <Text style={{ fontSize: 7, color: "#8BA3B5", marginTop: 2 }}>Factuur uitgereikt door afnemer</Text>
          </View>
          {isPaid && (
            <View style={styles.paidBadge}>
              <Text style={styles.paidText}>Betaald</Text>
            </View>
          )}
        </View>

        {/* Invoice title */}
        <Text style={styles.invoiceTitle}>Factuur</Text>

        {/* Addresses */}
        <View style={styles.addressRow}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>Van</Text>
            <Text style={styles.addressName}>{workerName}</Text>
            <Text style={styles.addressLine}>{workerAddress}</Text>
            <Text style={styles.addressLine}>{workerCity}</Text>
            {workerBtw && <Text style={styles.addressLine}>BTW: {workerBtw}</Text>}
            {workerKvk && <Text style={styles.addressLine}>KVK: {workerKvk}</Text>}
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

        {/* Invoice meta */}
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
            <Text style={styles.metaLabel}>Week</Text>
            <Text style={styles.metaValue}>{week}</Text>
          </View>
        </View>

        {/* Line items table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.col1]}>Omschrijving</Text>
            <Text style={[styles.tableHeaderText, styles.col2]}>Datum</Text>
            <Text style={[styles.tableHeaderText, styles.col3]}>Uren</Text>
            <Text style={[styles.tableHeaderText, styles.col4]}>Tarief</Text>
            <Text style={[styles.tableHeaderText, styles.col5]}>Totaal</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col1]}>{shiftTitle}</Text>
            <Text style={[styles.tableCell, styles.col2]}>{shiftDate}</Text>
            <Text style={[styles.tableCell, styles.col3]}>{hours}</Text>
            <Text style={[styles.tableCell, styles.col4]}>{fmt(ratePerHour)}</Text>
            <Text style={[styles.tableCell, styles.col5, { fontFamily: "Helvetica-Bold", color: "#023047" }]}>{fmt(subtotal)}</Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Bedrag excl. BTW</Text>
            <Text style={styles.totalValue}>{fmt(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>BTW {btwPercentage}%</Text>
            <Text style={styles.totalValue}>{fmt(btw)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Factuurbedrag</Text>
            <Text style={styles.totalValue}>{fmt(totalInclBtw)}</Text>
          </View>

          {factoringPercentage && (
            <>
              <View style={[styles.totalRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#E2E8F0" }]}>
                <Text style={[styles.totalLabel, { fontSize: 8 }]}>Factoring ({factoringPercentage}%)</Text>
                <Text style={[styles.totalValue, { fontSize: 8, color: "#EF476F" }]}>- {fmt(factoringAmount)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { fontSize: 8 }]}>BTW factoring</Text>
                <Text style={[styles.totalValue, { fontSize: 8, color: "#EF476F" }]}>- {fmt(factoringBtw)}</Text>
              </View>
            </>
          )}

          <View style={styles.totalRowBold}>
            <Text style={styles.totalLabelBold}>Eindbedrag</Text>
            <Text style={styles.totalValueBold}>{fmt(factoringPercentage ? finalAmount : totalInclBtw)}</Text>
          </View>
        </View>

        {isPaid && (
          <View style={{ backgroundColor: "#F0FFF4", padding: 10, borderRadius: 4, borderLeftWidth: 3, borderLeftColor: "#A7DADC" }}>
            <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#023047" }}>Bedragen op deze factuur zijn reeds betaald</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>WorkWings B.V. · KVK 12345678 · BTW NL123456789B01</Text>
          <Text style={styles.footerText}>workwings.nl · info@workwings.nl</Text>
        </View>
      </Page>
    </Document>
  );
}
