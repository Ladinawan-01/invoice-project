"use client"

import { ChevronDown, Send, Clock } from "lucide-react"

type Invoice = {
  id: string
  invoiceNumber: string
  total: number
  currency: string
  dueDate: string
  createdAt: string
}

export default function InvoiceSummary({ 
  invoice, 
  formatCurrency,
  formatDate 
}: { 
  invoice: Invoice
  formatCurrency: (amount: number, currency: string) => string
  formatDate: (dateString?: string) => string
}) {
  // Calculate if invoice is late
  const isLate = () => {
    if (!invoice.dueDate) return false
    const dueDate = new Date(invoice.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today
  }

  // Mock payment history - replace with actual payment data when available
  const paymentHistory: Array<{
    type: string
    date: string
    amount: number
  }> = []

  const totalPaid = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0)
  const remainingAmount = (invoice.total || 0) - totalPaid

  return (
    <div className="space-y-4">
      {/* Status Badge */}
      {isLate() && (
        <div className="bg-orange-50 border border-orange-400 rounded-lg p-3 flex items-center justify-center">
          <Clock size={18} className="text-orange-400 mr-1.5" />
          <span className="text-orange-500 font-medium text-sm">Late</span>
        </div>
      )}

      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center">
        <p className="text-gray-800 font-medium text-sm mb-4 text-center">
          Invoice not yet sent!
        </p>
        <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium text-xs rounded py-2 flex items-center justify-center gap-1.5 transition">
          <Send size={14} className="text-white" />
          Send Invoice
        </button>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-base font-bold text-gray-900 mb-3">Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-700 font-medium text-sm">Total</span>
            <span className="text-gray-900 font-semibold text-sm">
              {formatCurrency(invoice.total || 0, invoice.currency)} Incl. VAT
            </span>
          </div>

          {/* Payment Items */}
          {paymentHistory.length > 0 ? (
            <div className="relative">
              {/* Dashed line connecting all payments */}
              <div className="absolute left-1.5 top-2 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300"></div>
              
              <div className="space-y-3">
                {paymentHistory.map((payment, index) => (
                  <div key={index} className="flex items-start gap-2 relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0 relative z-10 mt-0.5"></div>
                    <div className="flex-1 text-xs">
                      <p className="font-medium text-gray-900">{payment.type}</p>
                      <p className="text-gray-600 text-xs mt-0.5">Paid on</p>
                      <p className="text-gray-900 text-xs font-medium">
                        {formatDate(payment.date)}
                      </p>
                      <p className="text-gray-600 text-xs mt-0.5">Amount</p>
                      <p className="text-gray-900 font-semibold text-xs">
                        {formatCurrency(payment.amount, invoice.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center py-2">
              No payment history available
            </div>
          )}

          {/* Remaining Amount */}
          {remainingAmount > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium text-xs">Remaining Amount</span>
                  <span className="text-gray-900 font-semibold text-xs">
                    {formatCurrency(remainingAmount, invoice.currency)} Incl. VAT
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
