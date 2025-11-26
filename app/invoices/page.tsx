"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import LayoutWrapper from "@/app/layout-wrapper"
import InvoiceContent from "@/components/invoice-content"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Invoice = {
  id: string
  invoiceNumber: string
  customerName: string
  invoiceDate: string
  dueDate: string
  total: number
  currency: string
  preventOverdueReminders: boolean
}

const formatDate = (value?: string) => {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const statusForInvoice = (invoice: Invoice) => {
  const now = new Date()
  const due = new Date(invoice.dueDate)
  if (!invoice.dueDate || Number.isNaN(due.getTime())) {
    return { label: "Draft", variant: "bg-gray-100 text-gray-600" }
  }
  if (due < now && !invoice.preventOverdueReminders) {
    return { label: "Overdue", variant: "bg-red-100 text-red-700" }
  }
  return { label: "Pending", variant: "bg-amber-100 text-amber-700" }
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/invoices")
        if (!response.ok) {
          throw new Error("Failed to load invoices")
        }
        const data = await response.json()
        setInvoices(data)
      } catch (error: any) {
        toast.error(error.message || "Unable to fetch invoices")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const totals = useMemo(
    () => ({
      count: invoices.length,
      outstanding: invoices.reduce((acc, invoice) => acc + (invoice.total ?? 0), 0),
    }),
    [invoices],
  )

  const defaultCurrency = invoices[0]?.currency || "USD"

  const handleDelete = async (id: string) => {
    const sanitizedId = typeof id === "string" ? id.trim() : ""
    if (!sanitizedId || sanitizedId === "undefined") {
      toast.error("Invoice ID missing. Please refresh and try again.")
      return
    }

    try {
      setDeletingId(sanitizedId)
      const response = await fetch(`/api/invoices/${encodeURIComponent(sanitizedId)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete invoice")
      }

      toast.success("Invoice deleted successfully")
      setInvoices((prev) => prev.filter((inv) => inv.id !== sanitizedId))
    } catch (error: any) {
      toast.error(error.message || "Failed to delete invoice")
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (invoice: Invoice) => {
    // Navigate to edit page
    window.location.href = `/invoices/${invoice.id}/edit`
  }

  const handleView = (invoice: Invoice) => {
    // Navigate to view page
    window.location.href = `/invoices/${invoice.id}`
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
               <h1 className="mt-2 text-3xl font-bold text-gray-900">Invoice List</h1>
              <p className="mt-1 text-sm text-gray-600">
                Review the invoice list, payment status, and billing details.
              </p>
            </div>
            <Button asChild className="bg-teal-600 text-white hover:bg-teal-700">
              <Link href="/invoices/new">Create Invoice</Link>
            </Button>
          </div>
       

          <Card className="mt-8 border-none shadow-lg">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Invoice List</CardTitle>
                <CardDescription>Track every invoice and its current status</CardDescription>
              </div>
              {!loading && (
                <p className="text-xs text-gray-500">
                  {totals.count} invoice{totals.count === 1 ? "" : "s"} •{" "}
                  {totals.outstanding.toLocaleString(undefined, {
                    style: "currency",
                    currency: defaultCurrency,
                  })} outstanding
                </p>
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-4 rounded-2xl border border-gray-100 p-4 lg:grid-cols-6">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-16 rounded-full justify-self-end" />
                      <Skeleton className="h-8 w-24 justify-self-end" />
                    </div>
                  ))}
                </div>
              ) : invoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
                  <p className="text-sm">No invoices yet. Create one to get started.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Invoice</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Invoice Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Total</TableHead>
                         <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => {
                        const status = statusForInvoice(invoice)
                        return (
                          <TableRow key={invoice.id} className="border-b border-gray-100">
                            <TableCell className="font-semibold text-gray-900">{invoice.invoiceNumber}</TableCell>
                            <TableCell>{invoice.customerName || "Unnamed"}</TableCell>
                            <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                            <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                            <TableCell className="font-semibold text-gray-900">
                              {invoice.total?.toLocaleString(undefined, {
                                style: "currency",
                                currency: invoice.currency || defaultCurrency,
                              })}
                            </TableCell>
                             
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleView(invoice)}
                                  className="h-8 w-8 p-0 hover:bg-teal-50 hover:text-teal-600"
                                  title="View Invoice"
                                >
                                  <Eye size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(invoice)}
                                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                                  title="Edit Invoice"
                                >
                                  <Edit size={16} />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      title="Delete Invoice"
                                      disabled={deletingId === invoice.id}
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete invoice{" "}
                                        <strong>{invoice.invoiceNumber}</strong> and all related data.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-red-600 text-white hover:bg-red-700"
                                        onClick={() => handleDelete(invoice.id)}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  )
}

