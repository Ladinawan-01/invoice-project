"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LayoutWrapper from "@/app/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { ArrowLeft, Edit, Download, Printer, Mail } from "lucide-react"
import Link from "next/link"

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
  createdAt: string
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "—"
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
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
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-64 mb-6" />
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-96 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </LayoutWrapper>
    )
  }

  if (!invoice) {
    return null
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/invoices")}
                className="hover:bg-gray-100"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Invoices
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Invoice {invoice.invoiceNumber}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Created on {formatDate(invoice.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/invoices/${invoice.id}/edit`}>
                  <Edit size={16} className="mr-2" />
                  Edit
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Printer size={16} className="mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Mail size={16} className="mr-2" />
                Send
              </Button>
            </div>
          </div>

          {/* Invoice Content */}
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Section - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Company Info */}
                  <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500">
                      <span className="text-white text-3xl font-bold">S</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1.5">Sisyphus</p>
                      <div className="text-sm text-gray-900 space-y-0.5">
                        <p className="font-medium">Invoice System</p>
                        <p>Your Company Address</p>
                        <p>contact@example.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Invoice Number</p>
                      <p className="text-lg font-bold text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-sm font-bold text-gray-900 mt-2">Total Amount</p>
                      <p className="text-xl font-bold text-teal-600">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </p>
                    </div>
                  </div>

                  {/* Bill To / Ship To */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Bill To</p>
                      <div className="text-sm text-gray-900 space-y-1">
                        <p className="font-medium">{invoice.customerName || "—"}</p>
                        {invoice.customerEmail && <p>{invoice.customerEmail}</p>}
                        {invoice.billToAddress && <p>{invoice.billToAddress}</p>}
                        {(invoice.billToCity || invoice.billToState) && (
                          <p>
                            {invoice.billToCity}
                            {invoice.billToCity && invoice.billToState && ", "}
                            {invoice.billToState}
                          </p>
                        )}
                        {invoice.billToCountry && <p>{invoice.billToCountry}</p>}
                      </div>
                    </div>
                    {(invoice.shipToName || invoice.shipToAddress) && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Ship To</p>
                        <div className="text-sm text-gray-900 space-y-1">
                          {invoice.shipToName && <p className="font-medium">{invoice.shipToName}</p>}
                          {invoice.shipToAddress && <p>{invoice.shipToAddress}</p>}
                          {(invoice.shipToCity || invoice.shipToState) && (
                            <p>
                              {invoice.shipToCity}
                              {invoice.shipToCity && invoice.shipToState && ", "}
                              {invoice.shipToState}
                            </p>
                          )}
                          {invoice.shipToCountry && <p>{invoice.shipToCountry}</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-200">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Invoice Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(invoice.invoiceDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Due Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(invoice.dueDate)}</p>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="pb-6 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Items</p>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Description</th>
                            <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Qty</th>
                            <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Rate</th>
                            <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Tax</th>
                            <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.lineItems && invoice.lineItems.length > 0 ? (
                            invoice.lineItems.map((item, index) => (
                              <tr key={index} className="border-b border-gray-100">
                                <td className="py-3 text-sm text-gray-900">{item.description || "—"}</td>
                                <td className="py-3 text-sm text-gray-600 text-right">{item.qty || 0}</td>
                                <td className="py-3 text-sm text-gray-600 text-right">
                                  {formatCurrency(item.rate || 0, invoice.currency)}
                                </td>
                                <td className="py-3 text-sm text-gray-600 text-right">
                                  {item.tax ? `${item.tax}%` : "—"}
                                </td>
                                <td className="py-3 text-sm font-medium text-gray-900 text-right">
                                  {formatCurrency(item.amount || 0, invoice.currency)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                                No items found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Notes */}
                  {invoice.clientNote && (
                    <div className="pb-6 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Client Note</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.clientNote}</p>
                    </div>
                  )}

                  {/* Terms */}
                  {invoice.terms && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Terms & Conditions</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.terms}</p>
                    </div>
                  )}
                </div>

                {/* Right Section - Summary */}
                <div className="lg:col-span-1">
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-6">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Summary</p>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(invoice.subtotal || 0, invoice.currency)}
                          </span>
                        </div>
                        {invoice.discountAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Discount</span>
                            <span className="font-medium text-red-600">
                              -{formatCurrency(invoice.discountAmount, invoice.currency)}
                            </span>
                          </div>
                        )}
                        {invoice.taxAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(invoice.taxAmount, invoice.currency)}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-gray-300 pt-3 flex justify-between">
                          <span className="font-semibold text-gray-900">Total</span>
                          <span className="text-xl font-bold text-teal-600">
                            {formatCurrency(invoice.total, invoice.currency)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}

