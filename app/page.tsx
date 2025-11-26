"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import InvoiceHeader from "@/components/invoice-header"
import InvoiceContent from "@/components/invoice-content"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} />
      <main className={`flex-1 overflow-y-auto bg-gray-100 h-screen transition-all duration-300 ease-in-out ${
        sidebarOpen ? "ml-64" : "ml-0"
      }`}>
        <InvoiceHeader onMenuClick={toggleSidebar} />
        <InvoiceContent />
      </main>
    </div>
  )
}
