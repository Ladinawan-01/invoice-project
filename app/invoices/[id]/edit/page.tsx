"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import LayoutWrapper from "@/app/layout-wrapper"
import InvoiceForm from "@/components/invoice-form"
import { ArrowLeft } from "lucide-react"

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const invoiceId = id

  const handleSuccess = () => {
    router.push(`/invoices/${invoiceId}`)
  }

  return (
    <LayoutWrapper>
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.push(`/invoices/${invoiceId}`)}
            className="p-2 rounded hover:bg-gray-200 transition"
            style={{
              background: "none",
              border: "none",
              outline: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "8px",
            }}
          >
            <ArrowLeft size={20} className="text-gray-900" />
          </button>
          <h1 className="text-[2rem] font-bold text-gray-900" style={{marginTop: 0, letterSpacing: "-0.02em"}}>Veiw Invoice</h1>
        </div>
        <InvoiceForm invoiceId={invoiceId} onSuccess={handleSuccess} />
      </div>
    </LayoutWrapper>
  )
}
