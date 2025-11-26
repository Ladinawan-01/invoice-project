"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, FileText, DollarSign, TrendingUp, Users, Package } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DashboardStats {
  totalCustomers: number
  totalInvoices: number
  totalRevenue: number
  pendingInvoices: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient()
        
        // Fetch customers count
        const { count: customersCount } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })

        // TODO: Add invoices table later
        // const { count: invoicesCount } = await supabase
        //   .from('invoices')
        //   .select('*', { count: 'exact', head: true })

        setStats({
          totalCustomers: customersCount || 0,
          totalInvoices: 0, // Will update when invoices table is added
          totalRevenue: 0, // Will update when invoices table is added
          pendingInvoices: 0, // Will update when invoices table is added
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Building2,
      color: "bg-teal-500",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Total Invoices",
      value: stats.totalInvoices,
      icon: FileText,
      color: "bg-blue-500",
      change: "+8%",
      trend: "up",
    },
    {
      title: "Total Revenue",
      value: `€${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-500",
      change: "+15%",
      trend: "up",
    },
    {
      title: "Pending Invoices",
      value: stats.pendingInvoices,
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "-5%",
      trend: "down",
    },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <Icon size={18} className="text-white" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <p className={`text-xs mt-1 flex items-center gap-1 ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      <TrendingUp size={12} className={stat.trend === "down" ? "rotate-180" : ""} />
                      {stat.change} from last month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Recent Customers
            </CardTitle>
            <CardDescription>Your latest customer additions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500 text-sm">
              <Building2 size={32} className="mx-auto mb-2 text-gray-300" />
              <p>No recent customers</p>
              <a href="/customers" className="text-teal-600 hover:text-teal-700 mt-2 inline-block">
                Add your first customer →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/customers"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="bg-teal-100 p-2 rounded-lg">
                <Building2 size={18} className="text-teal-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">Add New Customer</div>
                <div className="text-xs text-gray-500">Create a new customer profile</div>
              </div>
            </a>
            {/* Add more quick actions as you create pages */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

