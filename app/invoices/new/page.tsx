"use client"

import LayoutWrapper from "@/app/layout-wrapper"
import InvoiceForm from "@/components/invoice-form"

export default function NewInvoicePage() {
  return (
    <LayoutWrapper>
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 pb-8">
        <div className="mb-6">
          <h1 className="mt-2 text-3xl font-bold text-gray-900">New Invoice</h1>
        </div>
        <InvoiceForm />
      </div>
    </LayoutWrapper>
  )
}

