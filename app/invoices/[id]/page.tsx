"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LayoutWrapper from "@/app/layout-wrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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

export default function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (!id) {
          toast.error("Invoice ID is missing")
          router.push("/invoices")
          return
        }

        const response = await fetch(`/api/invoices/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Invoice not found")
            router.push("/invoices")
            return
          }
          throw new Error("Failed to load invoice")
        }

        const data = await response.json()
        setInvoice(data)
      } catch (error: any) {
        toast.error(error.message || "Failed to load invoice")
        router.push("/invoices")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoice()
  }, [id, router])

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </LayoutWrapper>
    )
  }

  if (!invoice) {
    return null
  }

  return (
    <LayoutWrapper>
      <InvoiceContent invoice={invoice} />
    </LayoutWrapper>
  )
}

