import { NextRequest, NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

const resolveId = (request: NextRequest, params: { id: string }) => {
  const pathId = request.nextUrl.pathname.split("/").pop()
  const rawId = params?.id ?? pathId ?? ""
  const id = rawId.trim()
  if (!id || id === "undefined") {
    throw new Error("Invoice ID is required")
  }
  return id
}

const toCamel = (record: any) => ({
  id: record.id,
  customerName: record.customer_name,
  customerEmail: record.customer_email,
  billToAddress: record.bill_to_address,
  billToCity: record.bill_to_city,
  billToState: record.bill_to_state,
  billToCountry: record.bill_to_country,
  shipToName: record.ship_to_name,
  shipToAddress: record.ship_to_address,
  shipToCity: record.ship_to_city,
  shipToState: record.ship_to_state,
  shipToCountry: record.ship_to_country,
  invoiceNumber: record.invoice_number,
  invoiceDate: record.invoice_date,
  dueDate: record.due_date,
  preventOverdueReminders: record.prevent_overdue_reminders,
  tags: record.tags ?? [],
  paymentModes: record.payment_modes ?? [],
  currency: record.currency,
  saleAgent: record.sale_agent,
  isRecurring: record.is_recurring,
  discountType: record.discount_type,
  discountValue: record.discount_value,
  adminNote: record.admin_note,
  quantityDisplay: record.quantity_display,
  adjustment: record.adjustment,
  lineItems: record.line_items ?? [],
  clientNote: record.client_note,
  terms: record.terms,
  subtotal: record.subtotal,
  discountAmount: record.discount_amount,
  taxAmount: record.tax_amount,
  total: record.total,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
})

const toDb = (body: any) => ({
  customer_name: body.customerName,
  customer_email: body.customerEmail,
  bill_to_address: body.billToAddress,
  bill_to_city: body.billToCity,
  bill_to_state: body.billToState,
  bill_to_country: body.billToCountry,
  ship_to_name: body.shipToName,
  ship_to_address: body.shipToAddress,
  ship_to_city: body.shipToCity,
  ship_to_state: body.shipToState,
  ship_to_country: body.shipToCountry,
  invoice_number: body.invoiceNumber,
  invoice_date: body.invoiceDate,
  due_date: body.dueDate,
  prevent_overdue_reminders: body.preventOverdueReminders,
  tags: body.tags ?? [],
  payment_modes: body.paymentModes ?? [],
  currency: body.currency,
  sale_agent: body.saleAgent,
  is_recurring: body.isRecurring,
  discount_type: body.discountType,
  discount_value: body.discountValue,
  admin_note: body.adminNote,
  quantity_display: body.quantityDisplay,
  adjustment: body.adjustment,
  line_items: body.lineItems ?? [],
  client_note: body.clientNote,
  terms: body.terms,
  subtotal: body.subtotal,
  discount_amount: body.discountAmount,
  tax_amount: body.taxAmount,
  total: body.total,
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = resolveId(request, params)
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(toCamel(data))
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invoice ID is required" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = resolveId(request, params)
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("invoices")
      .update(toDb(body))
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(toCamel(data))
  } catch (error: any) {
    const status = error.message === "Invoice ID is required" ? 400 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = resolveId(request, params)
    const supabase = await createClient()

    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Invoice deleted successfully" })
  } catch (error: any) {
    const status = error.message === "Invoice ID is required" ? 400 : 500
    return NextResponse.json({ error: error.message }, { status })
  }
}

