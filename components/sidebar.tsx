"use client"

import { useState } from "react"
import { ChevronDown, LayoutDashboard, FileText, Package, Users, ClipboardList, Rocket, MessageSquare, Phone } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    billing: true,
    management: false,
    development: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <aside className={`bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out ${
      isOpen ? "w-64" : "w-0 overflow-hidden"
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
        {/* Dashboard */}
        <div className="flex items-center gap-2 px-0 py-1.5 text-gray-600 text-sm hover:text-gray-900 cursor-pointer select-none">
          <LayoutDashboard size={16} className="text-gray-400" />
          <span className="font-normal">Dashboard</span>
        </div>

        {/* Billing Section */}
        <div className="mt-2">
          <button
            onClick={() => toggleSection("billing")}
            className="w-full flex items-center justify-between px-0 py-1.5 hover:bg-gray-50 rounded transition select-none"
          >
            <div className="flex items-center gap-2 text-teal-500 text-sm font-medium">
              <FileText size={16} className="text-teal-500" />
              <span>Billing</span>
            </div>
            <ChevronDown
              size={14}
              className={`text-teal-400 ml-1 transition-transform duration-300 ${expandedSections.billing ? "rotate-180" : ""}`}
            />
          </button>
          {expandedSections.billing && (
            <div className="ml-6 mt-1 space-y-0.5">
              <button className="w-full bg-teal-500 text-white py-1 px-2 rounded text-sm mb-0.5 hover:bg-teal-600 transition flex items-center gap-1.5">
                
                <span>Quotes & Invoices</span>
              </button>
              <div className="pl-1 flex items-center gap-1.5 py-0.5 text-gray-500 text-sm hover:text-gray-900 cursor-pointer">
                
                <span>Products & Services</span>
              </div>
              <div className="pl-1 flex items-center gap-1.5 py-0.5 text-gray-500 text-sm hover:text-gray-900 cursor-pointer">
                 
                <span>Clients</span>
              </div>
            </div>
          )}
        </div>

        {/* Management */}
        <div className="mt-2">
          <button
            onClick={() => toggleSection("management")}
            className="w-full flex items-center justify-between px-0 py-1.5 hover:bg-gray-50 rounded transition select-none"
          >
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <ClipboardList size={16} className="text-gray-400" />
              <span>Management</span>
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-400 ml-1 transition-transform duration-300 ${expandedSections.management ? "rotate-180" : ""}`}
            />
          </button>
          {expandedSections.management && (
            <div className="ml-6 mt-1 flex items-center py-0.5 text-gray-500 text-sm hover:text-gray-900 cursor-pointer">
              <span>Settings</span>
            </div>
          )}
        </div>

        {/* Development */}
        <div className="mt-2">
          <button
            onClick={() => toggleSection("development")}
            className="w-full flex items-center justify-between px-0 py-1.5 hover:bg-gray-50 rounded transition select-none"
          >
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Rocket size={16} className="text-gray-400" />
              <span>Development</span>
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-400 ml-1 transition-transform duration-300 ${expandedSections.development ? "rotate-180" : ""}`}
            />
          </button>
          {expandedSections.development && (
            <div className="ml-6 mt-1 flex items-center py-0.5 text-gray-500 text-sm hover:text-gray-900 cursor-pointer">
              <span>Configuration</span>
            </div>
          )}
        </div>
      </nav>

      {/* Footer Links */}
      <div className="mt-auto p-3 border-t border-gray-200 space-y-0.5">
        <div className="flex items-center gap-1.5 px-0 py-1.5 text-gray-500 text-sm hover:text-gray-900 cursor-pointer select-none">
          <MessageSquare size={15} className="text-gray-400" />
          <span>My Advisor</span>
        </div>
        <div className="flex items-center gap-1.5 px-0 py-1.5 text-gray-500 text-sm hover:text-gray-900 cursor-pointer select-none">
          <Phone size={14} className="text-gray-400" />
          <span>Help Center</span>
        </div>
      </div>
    </aside>
  )
}
