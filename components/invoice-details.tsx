export default function InvoiceDetails() {
  return (
    <div className="grid grid-cols-2 gap-12 mb-8">
      {/* Left Column - Dates */}
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Date de facture</p>
          <p className="text-gray-900 font-medium">03/05/2020</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Date de livraison</p>
          <p className="text-gray-900 font-medium">03/05/2020</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Conditions de réglement</p>
          <p className="text-gray-900 font-medium">Sous 15 jours</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">D'heance du paiement</p>
          <p className="text-gray-900 font-medium">18/05/2020</p>
        </div>
      </div>

      {/* Right Column - Company Info */}
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">SISYPHUS</p>
          <div className="text-gray-900 font-medium">
            <p>Jean Trantien</p>
            <p className="text-sm">Rue Saint Soulme 20, 38390 Gendaromige, France</p>
            <p className="text-sm">SATT123456 | contact@sisyphus.ex</p>
            <p className="text-sm">SMET: 832 332 878 00934</p>
            <p className="text-sm">TVA: 482-488021</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Adresse de facturation</p>
          <div className="text-gray-900 font-medium">
            <p>Willy Nomika</p>
            <p className="text-sm">1648 West Boulevard Avenue, Nicea, Mireh, USA</p>
            <p className="text-sm">ST329401011 | contact@sisyphus.ex</p>
            <p className="text-sm">SMET: 382 332 878 00934</p>
            <p className="text-sm">TVA: 482-488021</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Facteur</p>
          <p className="text-gray-900 font-medium text-sm">
            This is a custom message that might be relevant to the customer. It maybe an important date or information
            for future to use up to three or four rows.
          </p>
        </div>
      </div>
    </div>
  )
}
