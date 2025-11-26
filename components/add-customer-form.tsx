"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Loader2, Building2, MapPin, ArrowLeft } from "lucide-react"

const customerSchema = z.object({
  // Customer Details
  company: z.string().optional(),
  vatNumber: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  group: z.enum(["High Budget", "Low Budget", "VIP", "Wholesaler"]).optional(),
  currency: z.string().optional(),
  defaultLanguage: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  
  // Billing Address
  sameAsCustomerInfo: z.boolean().default(false),
  billingStreet: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZipCode: z.string().optional(),
  billingCountry: z.string().optional(),
  
  // Shipping Address
  copyBillingAddress: z.boolean().default(false),
  shippingStreet: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingZipCode: z.string().optional(),
  shippingCountry: z.string().optional(),
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface AddCustomerFormProps {
  customerId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function AddCustomerForm({ customerId, onSuccess, onCancel }: AddCustomerFormProps) {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [activeTab, setActiveTab] = useState("customer-details")
  const isEditMode = Boolean(customerId && customerId !== "undefined")
  const effectiveCustomerId = isEditMode ? customerId : undefined

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      sameAsCustomerInfo: false,
      copyBillingAddress: false,
      currency: "EUR",
      defaultLanguage: "en",
    },
  })

  // Load customer data when editing
  useEffect(() => {
    if (effectiveCustomerId) {
      setLoadingData(true)
      fetch(`/api/customers/${effectiveCustomerId}`)
        .then((res) => res.json())
        .then((data) => {
          form.reset({
            company: data.company || "",
            vatNumber: data.vatNumber || "",
            phone: data.phone || "",
            website: data.website || "",
            group: data.group || undefined,
            currency: data.currency || "EUR",
            defaultLanguage: data.defaultLanguage || "en",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            zipCode: data.zipCode || "",
            country: data.country || "",
            sameAsCustomerInfo: data.sameAsCustomerInfo || false,
            billingStreet: data.billingStreet || "",
            billingCity: data.billingCity || "",
            billingState: data.billingState || "",
            billingZipCode: data.billingZipCode || "",
            billingCountry: data.billingCountry || "",
            copyBillingAddress: data.copyBillingAddress || false,
            shippingStreet: data.shippingStreet || "",
            shippingCity: data.shippingCity || "",
            shippingState: data.shippingState || "",
            shippingZipCode: data.shippingZipCode || "",
            shippingCountry: data.shippingCountry || "",
          })
        })
        .catch((error) => {
          toast.error("Failed to load customer data")
        })
        .finally(() => {
          setLoadingData(false)
        })
    }
  }, [effectiveCustomerId, form])

  const sameAsCustomerInfo = form.watch("sameAsCustomerInfo")
  const copyBillingAddress = form.watch("copyBillingAddress")

  // Auto-fill billing address when "Same as Customer Info" is checked
  const handleSameAsCustomerInfo = (checked: boolean) => {
    if (checked) {
      form.setValue("billingStreet", form.getValues("address"))
      form.setValue("billingCity", form.getValues("city"))
      form.setValue("billingState", form.getValues("state"))
      form.setValue("billingZipCode", form.getValues("zipCode"))
      form.setValue("billingCountry", form.getValues("country"))
    }
  }

  // Auto-fill shipping address when "Copy Billing Address" is checked
  const handleCopyBillingAddress = (checked: boolean) => {
    if (checked) {
      form.setValue("shippingStreet", form.getValues("billingStreet"))
      form.setValue("shippingCity", form.getValues("billingCity"))
      form.setValue("shippingState", form.getValues("billingState"))
      form.setValue("shippingZipCode", form.getValues("billingZipCode"))
      form.setValue("shippingCountry", form.getValues("billingCountry"))
    }
  }

  const onSubmit = async (data: CustomerFormValues) => {
    setLoading(true)
    try {
      if (!effectiveCustomerId && isEditMode) {
        throw new Error("Customer ID is missing. Please reopen the form and try again.")
      }

      const url = effectiveCustomerId ? `/api/customers/${effectiveCustomerId}` : "/api/customers"
      const method = effectiveCustomerId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save customer")
      }

      toast.success(effectiveCustomerId ? "Customer updated successfully!" : "Customer created successfully!")
      form.reset()
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <Card className="shadow-lg">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-teal-600" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-2xl">{isEditMode ? "Edit Customer" : "Add New Customer"}</CardTitle>
          <CardDescription>
            {isEditMode ? "Update customer information" : "Fill in the customer details below"}
          </CardDescription>
        </div>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="w-full md:w-auto"
            onClick={() => onCancel?.()}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to List
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer-details" className="flex items-center gap-2">
                  <Building2 size={16} />
                  Customer Details
                </TabsTrigger>
                <TabsTrigger value="billing-shipping" className="flex items-center gap-2">
                  <MapPin size={16} />
                  Billing & Shipping
                </TabsTrigger>
              </TabsList>

              {/* Customer Details Tab */}
              <TabsContent value="customer-details" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vatNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VAT Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter VAT number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="group"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Groups</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="High Budget">High Budget</SelectItem>
                            <SelectItem value="Low Budget">Low Budget</SelectItem>
                            <SelectItem value="VIP">VIP</SelectItem>
                            <SelectItem value="Wholesaler">Wholesaler</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "EUR"}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
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
                    name="defaultLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Language</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "en"}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter street address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter state" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter zip code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Billing & Shipping Tab */}
              <TabsContent value="billing-shipping" className="space-y-6 mt-6">
                {/* Billing Address */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="sameAsCustomerInfo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked)
                                handleSameAsCustomerInfo(checked as boolean)
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">Same as Customer Info</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <h3 className="text-sm font-semibold text-gray-700">Billing Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="billingStreet"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter billing street" {...field} disabled={sameAsCustomerInfo} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter billing city" {...field} disabled={sameAsCustomerInfo} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter billing state" {...field} disabled={sameAsCustomerInfo} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingZipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter billing zip code" {...field} disabled={sameAsCustomerInfo} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter billing country" {...field} disabled={sameAsCustomerInfo} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="copyBillingAddress"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked)
                                handleCopyBillingAddress(checked as boolean)
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">Copy Billing Address</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <h3 className="text-sm font-semibold text-gray-700">Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="shippingStreet"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter shipping street" {...field} disabled={copyBillingAddress} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shippingCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter shipping city" {...field} disabled={copyBillingAddress} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shippingState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter shipping state" {...field} disabled={copyBillingAddress} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shippingZipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter shipping zip code" {...field} disabled={copyBillingAddress} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shippingCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter shipping country" {...field} disabled={copyBillingAddress} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  customerId ? "Update Customer" : "Create Customer"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

