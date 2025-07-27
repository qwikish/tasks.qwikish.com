"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Calendar,
  Timer,
  BarChart3,
  Settings,
  FolderOpen,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Kanban Board", href: "/kanban", icon: LayoutDashboard },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Pomodoro", href: "/pomodoro", icon: Timer },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Projects", href: "/projects", icon: FolderOpen },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-gray-900 text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="font-semibold">Qwikish Tasks</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-orange-500 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white",
                    collapsed && "justify-center",
                  )}
                >
                  <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-800">
          <Button className="w-full bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      )}

      {/* Settings */}
      <div className="p-4 border-t border-gray-800">
        <Link
          to="/settings"
          className={cn(
            "flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
            collapsed && "justify-center",
          )}
        >
          <Settings className={cn("h-5 w-5", !collapsed && "mr-3")} />
          {!collapsed && "Settings"}
        </Link>
      </div>
    </div>
  )
}
