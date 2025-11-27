type Invoice = {
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
}

export default function InvoiceLineItems({ 
  invoice, 
  formatCurrency 
}: { 
  invoice: Invoice
  formatCurrency: (amount: number, currency: string) => string
}) {
  const items = invoice.lineItems || []

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-t border-b border-gray-300 bg-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">NO.</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">ARTICLE</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">QUANTITY</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">UNIT PRICE</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">VAT</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-xs">AMOUNT</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-xs">FINAL AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => {
                  const description = item.description || "N/A"
                  const parts = description.split("\n")
                  const article = parts[0] || "N/A"
                  const desc = parts[1] || ""
                  
                  return (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900 font-medium text-sm">{article}</p>
                        {desc && <p className="text-gray-500 text-xs">{desc}</p>}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {item.qty || 0} Unit(s)
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {formatCurrency(item.rate || 0, invoice.currency)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {item.tax ? `${item.tax}%` : "0%"}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600 text-sm">
                        {formatCurrency(item.amount || 0, invoice.currency)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900 font-medium text-sm">
                        {formatCurrency(item.amount || 0, invoice.currency)}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="mt-6 text-sm border-t border-gray-300 pt-4 space-y-2">
        <div className="flex justify-end gap-16">
          <span className="text-gray-600">Total HT</span>
          <span className="text-gray-900 w-24 text-right">
            {formatCurrency(invoice.subtotal || 0, invoice.currency)}
          </span>
        </div>
        {invoice.discountAmount > 0 && (
          <div className="flex justify-end gap-16">
            <span className="text-gray-600">Total Disbursements</span>
            <span className="text-gray-900 w-24 text-right">
              {formatCurrency(invoice.discountAmount, invoice.currency)}
            </span>
          </div>
        )}
        <div className="flex justify-end gap-16">
          <span className="text-gray-600">Total VAT</span>
          <span className="text-gray-900 w-24 text-right">
            {formatCurrency(invoice.taxAmount || 0, invoice.currency)}
          </span>
        </div>
        <div className="flex justify-end gap-16 pt-2 border-t border-gray-300 font-bold">
          <span className="text-gray-900">Total Price</span>
          <span className="text-gray-900 w-24 text-right">
            {formatCurrency(invoice.total || 0, invoice.currency)}
          </span>
        </div>
      </div>
    </div>
  )
}
