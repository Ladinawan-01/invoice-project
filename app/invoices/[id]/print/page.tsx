"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import InvoiceContent from "@/components/invoice-content"

type Invoice = {
  id: string
  invoiceNumber: string
  customerName: string
  customerEmail?: string
  billToAddress?: string
  billToCity?: string
  billToState?: string
  billToCountry?: string
  shipToName?: string
  shipToAddress?: string
  shipToCity?: string
  shipToState?: string
  shipToCountry?: string
  invoiceDate: string
  dueDate: string
  currency: string
  lineItems: Array<{
    description: string
    qty: number
    rate: number
    tax: number
    amount: number
  }>
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
  clientNote?: string
  terms?: string
  termsOfPayment?: string
  createdAt: string
  // Company Information
  companyName?: string
  companyContactPerson?: string
  companyAddress?: string
  companyPhone?: string
  companyEmail?: string
  companySiret?: string
  companyVat?: string
}

export default function InvoicePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (!id) {
          toast.error("Invoice ID is missing")
          return
        }

        const response = await fetch(`/api/invoices/${id}`)
        if (!response.ok) {
          throw new Error("Failed to load invoice")
        }

        const data = await response.json()
        setInvoice(data)
      } catch (error: any) {
        toast.error(error.message || "Failed to load invoice")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [id])

  useEffect(() => {
    // Add print styles when component mounts
    const style = document.createElement('style')
    style.textContent = `
      @media print {
        @page {
          margin: 1cm;
          size: A4;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          background: white !important;
          margin: 0;
          padding: 0;
        }
        button, .no-print {
          display: none !important;
        }
        .no-print {
          display: none !important;
        }
        .col-span-1.lg\\:col-span-2 {
          width: 100% !important;
        }
        /* Remove scroll from table in print */
        .overflow-x-auto,
        [class*="overflow-x-auto"] {
          overflow-x: visible !important;
          overflow: visible !important;
        }
        table {
          width: 100% !important;
          min-width: 100% !important;
          max-width: 100% !important;
          table-layout: auto !important;
          page-break-inside: auto !important;
        }
        th, td {
          padding: 6px 3px !important;
          font-size: 9px !important;
          word-wrap: break-word !important;
          white-space: normal !important;
        }
        /* Ensure table fits on page */
        .print\\:min-w-full {
          min-width: 100% !important;
        }
        .print\\:overflow-visible {
          overflow: visible !important;
          overflow-x: visible !important;
        }
        /* Remove negative margins that cause scroll */
        [class*="-mx-"] {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        /* Make inline-block elements block for print */
        .inline-block {
          display: block !important;
          width: 100% !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="text-center">Loading invoice...</div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="text-center">Invoice not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white print:bg-white">
      <InvoiceContent invoice={invoice} />
    </div>
  )
}

