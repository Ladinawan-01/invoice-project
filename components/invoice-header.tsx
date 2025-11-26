"use client"

import { Mail, Bell, Menu, LogOut, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface InvoiceHeaderProps {
  onMenuClick: () => void
  sidebarOpen?: boolean
}

export default function InvoiceHeader({ onMenuClick, sidebarOpen = false }: InvoiceHeaderProps) {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out")
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
      {/* Left: Menu Icon and Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={onMenuClick}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Toggle menu"
        >
          {/* Mobile: Show X when open, Menu when closed */}
          {/* Desktop: Always show Menu */}
          <span className="lg:hidden">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </span>
          <span className="hidden lg:inline-block">
            <Menu size={20} />
          </span>
        </button>
    
      </div>

      {/* Right: Icons and User */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="text-gray-600 hover:text-gray-900 hidden sm:block">
          <Mail size={20} />
        </button>
        <button className="relative text-gray-600 hover:text-gray-900">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white text-[10px] sm:text-xs font-medium">12</span>
          </span>
        </button>
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white text-[10px] sm:text-xs font-medium">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="text-xs sm:text-sm hidden md:block">
            <div className="font-medium text-gray-900">
              {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
            </div>
            <div className="text-gray-500 text-xs truncate max-w-[120px]">{user?.email || "user@example.com"}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-gray-600 hover:text-gray-900"
            title="Sign out"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
