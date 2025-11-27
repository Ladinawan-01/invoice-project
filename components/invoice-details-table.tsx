type Invoice = {
  invoiceDate: string
  dueDate: string
  customerName?: string
  customerEmail?: string
  billToAddress?: string
  billToCity?: string
  billToState?: string
  billToCountry?: string
  clientNote?: string
}

export default function InvoiceDetailsTable({ 
  invoice, 
  formatDate 
}: { 
  invoice: Invoice
  formatDate: (dateString?: string) => string
}) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
        {/* Left Column - Dates */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Bill Date</p>
            <p className="text-gray-900 font-medium">{formatDate(invoice.invoiceDate) || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Delivery Date</p>
            <p className="text-gray-900 font-medium">{formatDate(invoice.invoiceDate) || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Terms of Payment</p>
            <p className="text-gray-900 font-medium">N/A</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Payment Deadline</p>
            <p className="text-gray-900 font-medium">{formatDate(invoice.dueDate) || "N/A"}</p>
          </div>
        </div>

        {/* Right Column - Billing Address */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Billing Address</p>
            <div className="text-sm text-gray-900 space-y-1">
              <p className="font-medium">{invoice.customerName || "N/A"}</p>
              <p>{invoice.billToAddress || "N/A"}</p>
              <p>
                {[invoice.billToCity, invoice.billToState]
                  .filter(Boolean)
                  .join(", ") || "N/A"}
                {invoice.billToCountry && `, ${invoice.billToCountry}`}
              </p>
              {invoice.customerEmail && <p>{invoice.customerEmail}</p>}
              <p>SIRET: N/A</p>
              <p>VAT: N/A</p>
            </div>
          </div>
        </div>
      </div>

      {/* Note Section */}
      {invoice.clientNote && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Note</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.clientNote}</p>
        </div>
      )}
    </div>
  )
}
