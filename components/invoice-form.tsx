"use client"

import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2, Plus, Trash2 } from "lucide-react"

const lineItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  quantity: z.coerce.number().min(0.01, "Qty must be greater than 0"),
  unit: z.string().min(1),
  rate: z.coerce.number().min(0, "Rate must be positive"),
  taxRate: z.coerce.number().min(0).max(100),
  optional: z.boolean().default(false),
})

const invoiceSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email().optional(),
  billToAddress: z.string().optional(),
  billToCity: z.string().optional(),
  billToState: z.string().optional(),
  billToCountry: z.string().optional(),
  shipToName: z.string().optional(),
  shipToAddress: z.string().optional(),
  shipToCity: z.string().optional(),
  shipToState: z.string().optional(),
  shipToCountry: z.string().optional(),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  preventOverdueReminders: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  paymentModes: z.array(z.string()).default([]),
  currency: z.string().min(1, "Currency is required"),
  saleAgent: z.string().optional(),
  isRecurring: z.boolean().default(false),
  discountType: z.enum(["percent", "fixed"]),
  discountValue: z.coerce.number().min(0).default(0),
  adminNote: z.string().optional(),
  quantityDisplay: z.enum(["qty", "hours", "qty_hours"]),
  adjustment: z.coerce.number().default(0),
  lineItems: z.array(lineItemSchema).min(1, "Add at least one line item"),
  clientNote: z.string().optional(),
  terms: z.string().optional(),
})

type InvoiceFormValues = z.infer<typeof invoiceSchema>

const TAX_OPTIONS = [
  { label: "No Tax", value: 0 },
  { label: "5.00%", value: 5 },
  { label: "10.00%", value: 10 },
  { label: "18.00%", value: 18 },
]

const PAYMENT_MODES = ["Bank", "Stripe Checkout"]

interface InvoiceFormProps {
  invoiceId?: string
  onSuccess?: () => void
}

export default function InvoiceForm({ invoiceId, onSuccess }: InvoiceFormProps = {}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const isEditMode = !!invoiceId

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      billToAddress: "",
      billToCity: "",
      billToState: "",
      billToCountry: "",
      shipToName: "",
      shipToAddress: "",
      shipToCity: "",
      shipToState: "",
      shipToCountry: "",
      invoiceNumber: "INV-000020",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date().toISOString().split("T")[0],
      preventOverdueReminders: false,
      tags: [],
      paymentModes: [],
      currency: "USD",
      saleAgent: "",
      isRecurring: false,
      discountType: "percent",
      discountValue: 0,
      adminNote: "",
      quantityDisplay: "qty",
      adjustment: 0,
      lineItems: [
        {
          name: "Description",
          description: "Long description",
          quantity: 1,
          unit: "Unit",
          rate: 23,
          taxRate: 18,
          optional: false,
        },
      ],
      clientNote: "",
      terms: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  })

  const watchedLineItems = useWatch({
    control: form.control,
    name: "lineItems",
  })
  const discountType = useWatch({ control: form.control, name: "discountType" })
  const discountValue = useWatch({ control: form.control, name: "discountValue" })
  const adjustment = useWatch({ control: form.control, name: "adjustment" })

  // Load invoice data when editing
  useEffect(() => {
    if (invoiceId) {
      setLoading(true)
      fetch(`/api/invoices/${invoiceId}`)
        .then((res) => res.json())
        .then((data) => {
          // Map API response to form format
          const lineItems = (data.lineItems || []).map((item: any) => ({
            name: item.name || item.description || "",
            description: item.description || "",
            quantity: item.qty || item.quantity || 1,
            unit: item.unit || "Unit",
            rate: item.rate || 0,
            taxRate: item.tax || 0,
            optional: item.optional || false,
          }))

          form.reset({
            customerName: data.customerName || "",
            customerEmail: data.customerEmail || "",
            billToAddress: data.billToAddress || "",
            billToCity: data.billToCity || "",
            billToState: data.billToState || "",
            billToCountry: data.billToCountry || "",
            shipToName: data.shipToName || "",
            shipToAddress: data.shipToAddress || "",
            shipToCity: data.shipToCity || "",
            shipToState: data.shipToState || "",
            shipToCountry: data.shipToCountry || "",
            invoiceNumber: data.invoiceNumber || "",
            invoiceDate: data.invoiceDate ? data.invoiceDate.split("T")[0] : new Date().toISOString().split("T")[0],
            dueDate: data.dueDate ? data.dueDate.split("T")[0] : new Date().toISOString().split("T")[0],
            preventOverdueReminders: data.preventOverdueReminders || false,
            tags: data.tags || [],
            paymentModes: data.paymentModes || [],
            currency: data.currency || "USD",
            saleAgent: data.saleAgent || "",
            isRecurring: data.isRecurring || false,
            discountType: data.discountType || "percent",
            discountValue: data.discountValue || 0,
            adminNote: data.adminNote || "",
            quantityDisplay: data.quantityDisplay || "qty",
            adjustment: data.adjustment || 0,
            lineItems: lineItems.length > 0 ? lineItems : [
              {
                name: "",
                description: "",
                quantity: 1,
                unit: "Unit",
                rate: 0,
                taxRate: 0,
                optional: false,
              },
            ],
            clientNote: data.clientNote || "",
            terms: data.terms || "",
          })
        })
        .catch((error) => {
          toast.error("Failed to load invoice data")
          console.error(error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [invoiceId, form])

  const totals = useMemo(() => {
    if (!watchedLineItems || watchedLineItems.length === 0) {
      return {
        subtotal: 0,
        discountAmount: 0,
        taxAmount: 0,
        grandTotal: 0,
      }
    }

    // Calculate subtotal: sum of all line items (quantity * rate)
    const subtotal = watchedLineItems.reduce((acc, item) => {
      const qty = Number(item.quantity) || 0
      const rate = Number(item.rate) || 0
      return acc + (qty * rate)
    }, 0)

    // Calculate discount
    const discountAmount =
      discountType === "percent" 
        ? (subtotal * (Number(discountValue) || 0)) / 100 
        : Number(discountValue) || 0

    // Calculate taxable amount (after discount)
    const taxableAmount = Math.max(0, subtotal - discountAmount)

    // Calculate tax: sum of tax on each line item (applied on item subtotal before overall discount)
    // Note: Tax is calculated per item, not on the discounted total
    const taxAmount = watchedLineItems.reduce((acc, item) => {
      const qty = Number(item.quantity) || 0
      const rate = Number(item.rate) || 0
      const taxRate = Number(item.taxRate) || 0
      const itemSubtotal = qty * rate
      return acc + (itemSubtotal * taxRate) / 100
    }, 0)

    // Calculate grand total: taxable amount + tax + adjustment
    const adjustmentValue = Number(adjustment) || 0
    const grandTotal = taxableAmount + taxAmount + adjustmentValue

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
    }
  }, [watchedLineItems, discountType, discountValue, adjustment])

  const handleAddLineItem = () => {
    append({
      name: "",
      description: "",
      quantity: 1,
      unit: "Unit",
      rate: 0,
      taxRate: 0,
      optional: false,
    })
  }

  const processTags = (input: string) =>
    input
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

  const onSubmit = async (values: InvoiceFormValues) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...values,
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        taxAmount: totals.taxAmount,
        total: totals.grandTotal,
      }

      const url = isEditMode ? `/api/invoices/${invoiceId}` : "/api/invoices"
      const method = isEditMode ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Failed to ${isEditMode ? "update" : "create"} invoice`)
      }

      toast.success(`Invoice ${isEditMode ? "updated" : "created"} successfully!`)
      
      if (onSuccess) {
        onSuccess()
      } else if (isEditMode) {
        router.push(`/invoices/${invoiceId}`)
      } else {
        form.reset()
        router.push("/invoices")
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card className="shadow-xl border-none">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-teal-600" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-xl border-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-3xl">{isEditMode ? "Edit Invoice" : "Create New Invoice"}</CardTitle>
        <CardDescription>
          {isEditMode ? "Update invoice details below. Totals update automatically." : "Fill out the invoice details below. Totals update automatically."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Customer Section */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">Customer</p>
                    <CardTitle className="text-base">Bill To</CardTitle>
                    <CardDescription>Billing information</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer *</FormLabel>
                        <FormControl>
                          <Input placeholder="Select customer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="customer@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billToAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Street, number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="billToCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billToState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="billToCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Ship To</CardTitle>
                  <CardDescription>Optional shipping address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shipToName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shipToAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Street, number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="shipToCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shipToState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="shipToCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Invoice Meta */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Invoice Info</CardTitle>
                  <CardDescription>Numbering and scheduling</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="INV-000020" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="invoiceDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="preventOverdueReminders"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="space-y-1">
                          <FormLabel>Prevent overdue reminders</FormLabel>
                          <p className="text-xs text-gray-500">Stop automatic reminders for this invoice.</p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter comma-separated tags"
                            value={field.value?.join(", ")}
                            onChange={(event) => field.onChange(processTags(event.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">Payment Modes</p>
                    <div className="flex flex-wrap gap-3">
                      {PAYMENT_MODES.map((mode) => (
                        <label
                          key={mode}
                          className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700"
                        >
                          <Checkbox
                            checked={form.watch("paymentModes")?.includes(mode)}
                            onCheckedChange={(checked) => {
                              const current = form.watch("paymentModes") ?? []
                              if (checked) {
                                form.setValue("paymentModes", [...current, mode])
                              } else {
                                form.setValue(
                                  "paymentModes",
                                  current.filter((item) => item !== mode),
                                )
                              }
                            }}
                          />
                          {mode}
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Preferences</CardTitle>
                  <CardDescription>Currency, agent, recurring, and notes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="INR">INR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="saleAgent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales Agent</FormLabel>
                        <FormControl>
                          <Input placeholder="Assign agent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isRecurring"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="space-y-1">
                          <FormLabel>Recurring Invoice?</FormLabel>
                          <p className="text-xs text-gray-500">
                            Enable if this invoice should repeat automatically.
                          </p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percent">Percentage</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Value</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="adminNote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Note</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Private note" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantityDisplay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Show quantity as</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="qty">Qty</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="qty_hours">Qty / Hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Line Items */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">Items</p>
                  <h3 className="text-xl font-semibold text-gray-900">Invoice Line Items</h3>
                </div>
                <Button type="button" onClick={handleAddLineItem} className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Plus className="size-4 mr-2" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.id} className="border border-gray-100 shadow-sm">
                    <CardContent className="space-y-4 pt-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="md:flex-1">
                              <FormLabel>Item *</FormLabel>
                              <FormControl>
                                <Input placeholder="Item name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {fields.length > 1 && (
                          <Button variant="ghost" type="button" className="text-red-500" onClick={() => remove(index)}>
                            <Trash2 className="size-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Item description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Qty</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  min="0.01"
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value === "" ? "" : Number(e.target.value)
                                    field.onChange(value)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.unit`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <FormControl>
                                <Input placeholder="Unit" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.rate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rate</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  step="0.01" 
                                  min="0"
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value === "" ? "" : Number(e.target.value)
                                    field.onChange(value)
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`lineItems.${index}.taxRate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tax</FormLabel>
                              <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                value={String(field.value)}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Tax" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TAX_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={String(option.value)}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="md:col-span-2">
                          <p className="text-xs uppercase text-gray-500">Amount</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {(() => {
                              const item = watchedLineItems?.[index]
                              if (!item) return "$0.00"
                              const qty = Number(item.quantity) || 0
                              const rate = Number(item.rate) || 0
                              const amount = qty * rate
                              return amount.toLocaleString(undefined, {
                                style: "currency",
                                currency: form.watch("currency") || "USD",
                              })
                            })()}
                          </p>
                        </div>
                      </div>
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.optional`}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="text-sm font-normal text-gray-600">
                              This item is optional
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <Separator />

            {/* Totals */}
            <section className="grid gap-6 lg:grid-cols-[3fr,2fr]">
              <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Notes</CardTitle>
                  <CardDescription>Visible to the client</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="clientNote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Note</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Add a note visible to the client" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terms & Conditions</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Add terms for this invoice" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Summary</CardTitle>
                  <CardDescription>Automatic totals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center justify-between">
                    <span>Sub Total</span>
                    <span className="font-semibold text-gray-900">
                      {totals.subtotal.toLocaleString(undefined, {
                        style: "currency",
                        currency: form.watch("currency"),
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      Discount {discountType === "percent" && discountValue ? `(${discountValue}%)` : ""}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {totals.discountAmount ? "-" : ""}
                      {totals.discountAmount.toLocaleString(undefined, {
                        style: "currency",
                        currency: form.watch("currency"),
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tax</span>
                    <span className="font-semibold text-gray-900">
                      {totals.taxAmount.toLocaleString(undefined, {
                        style: "currency",
                        currency: form.watch("currency"),
                      })}
                    </span>
                  </div>
                  <FormField
                    control={form.control}
                    name="adjustment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adjustment</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="text-2xl">
                      {totals.grandTotal.toLocaleString(undefined, {
                        style: "currency",
                        currency: form.watch("currency"),
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </section>

            <div className="flex items-center justify-end gap-3">
              <Button type="reset" variant="outline" onClick={() => form.reset()}>
                Clear Form
              </Button>
              <Button type="submit" className="bg-teal-600 text-white hover:bg-teal-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Invoice"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

