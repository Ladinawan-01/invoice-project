import { ChevronLeft, Mail, Bell, Menu } from "lucide-react"

interface InvoiceHeaderProps {
  onMenuClick: () => void
}

export default function InvoiceHeader({ onMenuClick }: InvoiceHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      {/* Left: Menu Icon and Breadcrumb */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">Invoice Details</span>
        </div>
      </div>

      {/* Right: Icons and User */}
      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-900">
          <Mail size={20} />
        </button>
        <button className="relative text-gray-600 hover:text-gray-900">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">12</span>
          </span>
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-orange-300 rounded-full"></div>
          <div className="text-sm">
            <div className="font-medium text-gray-900">Mike</div>
            <div className="text-gray-500 text-xs">732 829 320 0074</div>
          </div>
        </div>
      </div>
    </div>
  )
}
