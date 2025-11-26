export default function CompanyInfo() {
  return (
    <div className="grid grid-cols-2 gap-8 mb-8">
      {/* Company Logo & Details */}
      <div>
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Facture n° #2020-05-0001</h1>
            <p className="text-gray-600 text-sm mt-1">Payé le 27 Juin 2023</p>
          </div>
        </div>
      </div>

      {/* Invoice Status */}
      <div className="text-right">
        <div className="text-2xl font-bold text-gray-900">3 030,00 €</div>
        <div className="text-sm text-gray-600 mt-1">#2020-05-0001</div>
      </div>
    </div>
  )
}
