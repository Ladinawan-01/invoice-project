"use client"

import { Mail, Bell, Menu, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface InvoiceHeaderProps {
  onMenuClick: () => void
}

export default function InvoiceHeader({ onMenuClick }: InvoiceHeaderProps) {
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
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
            </div>
            <div className="text-gray-500 text-xs">{user?.email || "user@example.com"}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="ml-2 text-gray-600 hover:text-gray-900"
            title="Sign out"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
