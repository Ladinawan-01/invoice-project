export default function InvoiceDetailsTable() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
        {/* Left Column - Dates */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Bill Date</p>
            <p className="text-gray-900 font-medium">03/05/2020</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Delivery Date</p>
            <p className="text-gray-900 font-medium">03/05/2020</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Terms of Payment</p>
            <p className="text-gray-900 font-medium">Within 15 days</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Payment Deadline</p>
            <p className="text-gray-900 font-medium">05/18/2020</p>
          </div>
        </div>

        {/* Right Column - Billing Address */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-4">Billing Address</p>
            <div className="text-sm text-gray-900 space-y-1">
              <p className="font-medium">Willy Wonka</p>
              <p>1445 West Norwood Avenue, Itasca Illinois, USA</p>
              <p>97223041054 | om@om.com</p>
              <p>SIRET: 362 521 879 00034</p>
              <p>VAT: 842-484021</p>
            </div>
          </div>
        </div>
      </div>

      {/* Note Section */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Note</p>
        <p className="text-sm text-gray-700">
          This is a custom message that might be relevant to the customer. It can span up to three or four rows. It can span up to three or four rows.
        </p>
      </div>
    </div>
  )
}
