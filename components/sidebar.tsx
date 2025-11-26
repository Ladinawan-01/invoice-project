"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navigationItems } from "@/lib/navigation"

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={`bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out ${
      isOpen ? "w-64 lg:w-64" : "w-0 lg:w-0 overflow-hidden"
    }`}>
      {/* Header with Logo */}
      <div className="p-4 border-gray-200">
        <div className="flex items-center gap-2">
          {/* Inline Sisyphus logo with text */}
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" className="object-contain" xmlns="http://www.w3.org/2000/svg">
            <g>
              <rect width="40" height="40" fill="white" fillOpacity="0" />
              <path d="M10 7.5L22.5 7.5V12.5H15L10 17.5V7.5Z" fill="#34D399"/>
              <path d="M30 15L17.5 15V20H25L30 25V15Z" fill="#10B981"/>
              <path d="M10 22.5L22.5 22.5L10 35V22.5Z" fill="#34D399"/>
            </g>
          </svg>
          <span className="text-2xl font-semibold tracking-tight text-gray-900 select-none">Sisyphus</span>
        </div>
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-0 py-1.5 text-sm rounded transition-colors select-none ${
                isActive
                  ? "bg-teal-50 text-teal-600 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon size={16} className={isActive ? "text-teal-600" : "text-gray-400"} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
