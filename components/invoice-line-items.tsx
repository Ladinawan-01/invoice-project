export default function InvoiceLineItems() {
  const items = [
    {
      id: 1,
      article: "Product Name",
      description: "Product Description",
      quantity: 150,
      unit: "Unit(s)",
      unitPrice: 20,
      vat: 0,
      amount: 3000,
      finalAmount: 3000,
    },
    {
      id: 2,
      article: "Product Name",
      description: "Product Description",
      quantity: 150,
      unit: "Unit(s)",
      unitPrice: 20,
      vat: 0,
      amount: 3000,
      finalAmount: 3000,
    },
    {
      id: 3,
      article: "Product Name",
      description: "Product Description",
      quantity: 150,
      unit: "Unit(s)",
      unitPrice: 20,
      vat: 0,
      amount: 3000,
      finalAmount: 3000,
    },
  ]

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
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="py-3 px-4 text-gray-600">{item.id}</td>
              <td className="py-3 px-4">
                <p className="text-gray-900 font-medium text-sm">{item.article}</p>
                <p className="text-gray-500 text-xs">{item.description}</p>
              </td>
              <td className="py-3 px-4 text-gray-600 text-sm">{item.quantity} {item.unit}</td>
              <td className="py-3 px-4 text-gray-600 text-sm">€{item.unitPrice}</td>
              <td className="py-3 px-4 text-gray-600 text-sm">{item.vat}%</td>
              <td className="py-3 px-4 text-right text-gray-600 text-sm">€{item.amount.toLocaleString()}</td>
              <td className="py-3 px-4 text-right text-gray-900 font-medium text-sm">€{item.finalAmount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
      </div>

      {/* Totals */}
      <div className="mt-6 text-sm border-t border-gray-300 pt-4 space-y-2">
        <div className="flex justify-end gap-16">
          <span className="text-gray-600">Total HT</span>
          <span className="text-gray-900 w-24 text-right">€3,000</span>
        </div>
        <div className="flex justify-end gap-16">
          <span className="text-gray-600">Total Disbursements</span>
          <span className="text-gray-900 w-24 text-right">€30</span>
        </div>
        <div className="flex justify-end gap-16">
          <span className="text-gray-600">Total VAT</span>
          <span className="text-gray-900 w-24 text-right">€0</span>
        </div>
        <div className="flex justify-end gap-16 pt-2 border-t border-gray-300 font-bold">
          <span className="text-gray-900">Total Price</span>
          <span className="text-gray-900 w-24 text-right">€3,030.00</span>
        </div>
      </div>
    </div>
  )
}
