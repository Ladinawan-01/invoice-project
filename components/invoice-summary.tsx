"use client"

import { ChevronDown, Send, Clock } from "lucide-react"

export default function InvoiceSummary() {
  return (
    <div className="space-y-4">
      {/* Top Actions - Separate White Card */}
      <div className="bg-orange-50 border border-orange-400 rounded-lg p-3 flex items-center justify-center">
        <Clock size={18} className="text-orange-400 mr-1.5" />
        <span className="text-orange-500 font-medium text-sm">En retard</span>
      </div>

      {/* Status Card - Separate White Card */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
        <p className="text-gray-800 font-medium text-sm mb-4 text-center">Facture pas encore envoyée!</p>
        <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium text-xs rounded py-2 flex items-center justify-center gap-1.5 transition">
          <Send size={14} className="text-white" />
          Envoyer la facture
        </button>
      </div>

      {/* Summary Section - Separate White Card */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-base font-bold text-gray-900 mb-3">Sommaire</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700 font-medium text-sm">Total</span>
            <span className="text-gray-900 font-semibold text-sm">3 130 € TTC</span>
          </div>

          {/* Payment Items */}
          <div className="relative">
            {/* Dashed line connecting all payments */}
            <div className="absolute left-1.5 top-2 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300"></div>
            
            <div className="space-y-3">
              {/* Payment 1 */}
              <div className="flex items-start gap-2 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0 relative z-10 mt-0.5"></div>
                <div className="flex-1 text-xs">
                  <p className="font-medium text-gray-900">Acompte N° 2020-04-0006</p>
                  <p className="text-gray-600 text-xs mt-0.5">Payé le</p>
                  <p className="text-gray-900 text-xs font-medium">24 Oct 2019</p>
                  <p className="text-gray-600 text-xs mt-0.5">Montante</p>
                  <p className="text-gray-900 font-semibold text-xs">300 €</p>
                </div>
              </div>

              {/* Payment 2 */}
              <div className="flex items-start gap-2 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0 relative z-10 mt-0.5"></div>
                <div className="flex-1 text-xs">
                  <p className="font-medium text-gray-900">Paiement partiel</p>
                  <p className="text-gray-600 text-xs mt-0.5">Payé le</p>
                  <p className="text-gray-900 text-xs font-medium">26 Oct 2019</p>
                  <p className="text-gray-600 text-xs mt-0.5">Montante</p>
                  <p className="text-gray-900 font-semibold text-xs">500 €</p>
                </div>
              </div>

              {/* Payment 3 */}
              <div className="flex items-start gap-2 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0 relative z-10 mt-0.5"></div>
                <div className="flex-1 text-xs">
                  <p className="font-medium text-gray-900">Paiement partiel</p>
                  <p className="text-gray-600 text-xs mt-0.5">Payé le</p>
                  <p className="text-gray-900 text-xs font-medium">27 Oct 2019</p>
                  <p className="text-gray-600 text-xs mt-0.5">Montante</p>
                  <p className="text-gray-900 font-semibold text-xs">2 230 €</p>
                </div>
              </div>
            </div>
          </div>

          {/* Remaining Amount */}
          <div className="pt-3 border-t border-gray-200">
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium text-xs">Montant restant</span>
                <span className="text-gray-900 font-semibold text-xs">100 € TTC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
