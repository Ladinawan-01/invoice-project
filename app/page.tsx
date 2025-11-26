"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import InvoiceHeader from "@/components/invoice-header"
import InvoiceContent from "@/components/invoice-content"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // On mobile, sidebar should be closed by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    
    // Set initial state
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  } 

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className={`flex-1 overflow-y-auto bg-gray-100 h-screen transition-all duration-300 ease-in-out ${
        sidebarOpen ? "lg:ml-64 ml-0" : "ml-0"
      }`}>
        <InvoiceHeader onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
        <InvoiceContent />
      </main>
    </div>
  )
}
