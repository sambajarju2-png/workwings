import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@supabase/supabase-js";
import React from "react";
import { FreelancerInvoice } from "@/lib/invoices/freelancer-invoice";
import { CompanyInvoice } from "@/lib/invoices/company-invoice";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "freelancer";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const supabase = createClient(url, key);

  const { data: invoice } = await supabase.from("invoices").select(`
    *, workers(first_name, last_name, iban, city, kvk_number),
    companies(name, kvk_number, contact_email, description),
    shifts(title, date, start_time, end_time, sector)
  `).eq("id", id).single();

  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const invoiceNumber = `WW-${id.slice(0, 8).toUpperCase()}`;
  const invoiceDate = new Date(invoice.created_at).toLocaleDateString("nl-NL");
  const shiftDate = new Date(invoice.shifts?.date + "T00:00:00").toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "2-digit" });
  const weekNum = Math.ceil((new Date(invoice.shifts?.date).getTime() - new Date(new Date(invoice.shifts?.date).getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let element: any;

  if (type === "company") {
    element = React.createElement(CompanyInvoice, {
      invoiceNumber, invoiceDate,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("nl-NL"),
      companyName: invoice.companies?.name || "Onbekend",
      companyAddress: "Adres", companyCity: "Stad",
      companyKvk: invoice.companies?.kvk_number,
      shifts: [{
        workerName: `${invoice.workers?.first_name} ${invoice.workers?.last_name}`,
        shiftTitle: invoice.shifts?.title || "Shift", date: shiftDate,
        hours: invoice.hours_worked || 0, ratePerHour: invoice.rate_per_hour || 0, serviceFee: 3.50,
      }],
    });
  } else {
    element = React.createElement(FreelancerInvoice, {
      invoiceNumber, invoiceDate,
      workerName: `${invoice.workers?.first_name} ${invoice.workers?.last_name}`,
      workerAddress: "Adres", workerCity: invoice.workers?.city || "Stad",
      workerKvk: invoice.workers?.kvk_number,
      companyName: invoice.companies?.name || "Onbekend",
      companyAddress: "Adres", companyCity: "Stad",
      companyKvk: invoice.companies?.kvk_number,
      shiftTitle: invoice.shifts?.title || "Shift", shiftDate, week: weekNum,
      hours: invoice.hours_worked || 0, ratePerHour: invoice.rate_per_hour || 0,
      isPaid: invoice.worker_payout_status === "paid",
    });
  }

  const pdfBuffer = await renderToBuffer(element);
  const uint8 = new Uint8Array(pdfBuffer);

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoiceNumber}-${type}.pdf"`,
    },
  });
}
