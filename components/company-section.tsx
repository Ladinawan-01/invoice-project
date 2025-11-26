export default function CompanySection() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Sisyphus</h3>
        <div className="text-sm text-gray-900 space-y-1">
          <p className="font-medium">Jean Trantien</p>
          <p>Rue Saint Soulme 20, 38390 Gendaromige, France</p>
          <p>SATT123456 | contact@sisyphus.ex</p>
          <p>SMET: 832 332 878 00934</p>
          <p>TVA: 482-488021</p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Adresse de facturation</h3>
        <div className="text-sm text-gray-900 space-y-1">
          <p className="font-medium">Willy Wonka</p>
          <p>1648 West Boulevard Avenue, Nicea, Mireh, USA</p>
          <p>ST329401011 | contact@sisyphus.ex</p>
          <p>SMET: 382 332 878 00934</p>
          <p>TVA: 482-488021</p>
        </div>
      </div>
    </div>
  )
}
