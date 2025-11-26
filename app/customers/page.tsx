"use client"

import { useState, useEffect } from "react"
import LayoutWrapper from "@/app/layout-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AddCustomerForm from "@/components/add-customer-form"
import { Plus, Edit, Trash2, Building2 } from "lucide-react"
import { toast } from "sonner"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface Customer {
  id: string
  company: string | null
  vatNumber: string | null
  phone: string | null
  website: string | null
  group: string | null
  currency: string | null
  defaultLanguage: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  country: string | null
  createdAt: string
}

const groupClasses: Record<string, { bg: string; text: string }> = {
  "High Budget": { bg: "bg-teal-100/80", text: "text-teal-700" },
  "Low Budget": { bg: "bg-amber-100/80", text: "text-amber-700" },
  VIP: { bg: "bg-purple-100/80", text: "text-purple-700" },
  Wholesaler: { bg: "bg-sky-100/80", text: "text-sky-700" },
}

const getGroupBadgeClasses = (group?: string | null) => {
  if (!group || !groupClasses[group]) {
    return "bg-gray-100 text-gray-600"
  }
  const styles = groupClasses[group]
  return `${styles.bg} ${styles.text}`
}

const getInitials = (company?: string | null) => {
  if (!company) return "C"
  return company.trim().charAt(0).toUpperCase()
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "—"
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers")
      if (!response.ok) throw new Error("Failed to fetch customers")
      const data: Customer[] = await response.json()
      const validCustomers = data.filter(
        (customer) => customer.id && customer.id !== "undefined" && customer.id.trim() !== ""
      )

      if (data.length !== validCustomers.length) {
        toast.warning("Some customers were skipped due to missing IDs. Please refresh if the issue persists.")
      }

      setCustomers(validCustomers)
    } catch (error: any) {
      toast.error(error.message || "Failed to load customers")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleDelete = async (id?: string) => {
    const sanitizedId =
      typeof id === "string" ? id.trim() : ""

    if (!sanitizedId || sanitizedId === "undefined") {
      toast.error("Customer ID missing. Please refresh the page and try again.")
      return
    }

    try {
      const response = await fetch(`/api/customers/${encodeURIComponent(sanitizedId)}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete customer")

      toast.success("Customer deleted successfully")
      fetchCustomers()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete customer")
    }
  }

  const handleEdit = (customer: Customer) => {
    if (!customer?.id || customer.id === "undefined") {
      toast.error("Customer ID missing. Please refresh the page and try again.")
      return
    }
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCustomer(null)
    fetchCustomers()
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCustomer(null)
  }

  if (showForm) {
    return (
      <LayoutWrapper>
        <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
          <AddCustomerForm
            customerId={editingCustomer?.id}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="container mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 size={28} />
            Customers
          </h1>
          <p className="text-gray-600 text-sm mt-1">Manage your customer database</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Plus size={18} className="mr-2" />
          Add New Customer
        </Button>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>All your customers in one place</CardDescription>
            </div>
            {!loading && customers.length > 0 && (
              <p className="text-xs text-gray-500">
                Showing <span className="font-semibold text-gray-900">{customers.length}</span> customers
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-teal-50 text-teal-500">
                <Building2 size={28} />
              </div>
              <p className="text-sm text-gray-600">No customers found. Add your first customer to get started.</p>
            </div>
          ) : (
            <>
              <div className="hidden lg:block">
                <div className="overflow-hidden rounded-2xl border border-gray-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/60">
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Customer</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Contact</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Group</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Location</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Created</TableHead>
                        <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer) => (
                        <TableRow
                          key={customer.id}
                          className="border-b border-gray-100/70 transition hover:bg-teal-50/50"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-semibold">
                                {getInitials(customer.company)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{customer.company || "Unknown Company"}</p>
                                <p className="text-xs text-gray-500">{customer.website || "No website"}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-900">{customer.phone || "No phone"}</p>
                              <p className="text-xs text-gray-500">{customer.vatNumber || "No VAT provided"}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getGroupBadgeClasses(
                                customer.group
                              )}`}
                            >
                              {customer.group || "Unassigned"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-900">{customer.city || "No city"}</p>
                              <p className="text-xs text-gray-500">{customer.country || "No country"}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-900">{formatDate(customer.createdAt)}</p>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-600 hover:text-teal-600"
                                onClick={() => handleEdit(customer)}
                              >
                                <Edit size={16} />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the customer and all related data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 text-white hover:bg-red-700"
                                      onClick={() => handleDelete(customer.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="space-y-4 lg:hidden">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-teal-700 font-semibold">
                          {getInitials(customer.company)}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-gray-900">{customer.company || "Unknown Company"}</p>
                          <p className="text-xs text-gray-500">{customer.website || "No website"}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getGroupBadgeClasses(
                          customer.group
                        )}`}
                      >
                        {customer.group || "Unassigned"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs uppercase text-gray-400">Phone</p>
                        <p className="font-medium text-gray-900">{customer.phone || "No phone"}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-400">VAT</p>
                        <p className="font-medium text-gray-900">{customer.vatNumber || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-400">Location</p>
                        <p className="font-medium text-gray-900">
                          {customer.city || "—"}, {customer.country || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-gray-400">Created</p>
                        <p className="font-medium text-gray-900">{formatDate(customer.createdAt)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 text-gray-600 hover:text-teal-600"
                        onClick={() => handleEdit(customer)}
                      >
                        <Edit size={16} className="mr-1.5" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={16} className="mr-1.5" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the customer and all related data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={() => handleDelete(customer.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      </div>
    </LayoutWrapper>
  )
}

