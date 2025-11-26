// Navigation configuration - easily add new pages here
import { LayoutDashboard, Building2, FileText, Package, Users, Settings } from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  badge?: string | number
}

export const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Building2,
  },
  // Add more pages here as you create them
  // {
  //   label: "Invoices",
  //   href: "/invoices",
  //   icon: FileText,
  // },
  // {
  //   label: "Products",
  //   href: "/products",
  //   icon: Package,
  // },
  // {
  //   label: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  // },
]

