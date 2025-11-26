import InvoiceDetailsTable from "./invoice-details-table"
import InvoiceLineItems from "./invoice-line-items"
import InvoiceSummary from "./invoice-summary"
import { ChevronDown } from "lucide-react"

export default function InvoiceContent() {
  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Top Header Section with Invoice Title and Action Buttons */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Facture n° #2020-05-0001</h1>
            <p className="text-gray-600 text-xs">Payé le 27 Juin 2023</p>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button className="border border-gray-300 text-gray-600 py-1.5 px-2 sm:px-3 rounded text-xs hover:bg-gray-50 flex items-center gap-1.5">
              <span className="hidden sm:inline">Plus d'options</span>
              <span className="sm:hidden">Options</span>
              <ChevronDown size={14} />
            </button>
            <button className="border-2 border-teal-500 text-teal-500 py-1.5 px-2 sm:px-3 rounded text-xs hover:bg-teal-50 whitespace-nowrap">
              <span className="hidden sm:inline">Enregistrer un paiement</span>
              <span className="sm:hidden">Paiement</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Section */}
        <div className="col-span-1 lg:col-span-2 space-y-4 sm:space-y-6 bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-4 sm:mb-6">
            {/* Logo - Geometric R */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-500"></div>
              <div className="absolute inset-0 bg-blue-500 opacity-50" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
              <span className="text-white text-3xl sm:text-4xl font-bold relative z-10">R</span>
            </div>

            {/* Sender Info */}
            <div className="flex-1 w-full">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1.5">Sisyphus</p>
              <div className="text-xs text-gray-900 space-y-0.5">
                <p className="font-medium">John Brandon</p>
                <p className="break-words">789/1 Sector-2c, 38200 Gandhinagar, France</p>
                <p className="break-all">848172194 | contact@betao.se</p>
                <p>SIRET: 362 521 879 00034</p>
                <p>VAT: 842-484021</p>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500">#2020-05-0001</p>
                <p className="text-sm sm:text-base font-bold text-gray-900">Total Amount</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">€3,030.00</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <InvoiceDetailsTable />

          {/* Line Items */}
          <InvoiceLineItems />

          {/* Terms */}
          <div className="text-xs text-gray-600 pt-3 border-t border-gray-200">
            <p className="font-medium text-gray-900 mb-0.5">Terms & Conditions</p>
            <p>Please pay within 15 days of receiving this invoice.</p>
          </div>
        </div>

        {/* Right Section - Summary */}
        <div className="col-span-1 lg:col-span-1">
          <InvoiceSummary />
        </div>
      </div>
    </div>
  )
}
