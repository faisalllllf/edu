"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AdminProvider } from "@/app/context/AdminContext"
import Navbar from "@/app/components/Navbar"
import { Home, Users, BookOpenCheck, CalendarCheck, BookText, FileText } from "lucide-react"
import clsx from "clsx"

const navItems = [
  {
    label: "Home",
    href: "/dashboard/teacher",
    icon: Home,
  },
  {
    label: "List Students",
    href: "/dashboard/teacher/list-students",
    icon: BookOpenCheck,

  },
  {
    label: "Add Student",
    href: "/dashboard/teacher/add-student",
    icon: FileText,
  },
  {
    label: "Attendance",
    href: "/dashboard/teacher/attendance",
    icon: CalendarCheck,
  },
  {
    label: "Students Marks",
    href: "/dashboard/teacher/myStudents",
    icon: Users,
  },
]

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700 px-2">
        <h1 className="text-sm font-bold font-montserrat tracking-wide text-white truncate">EduSaaS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col mt-2 space-y-1 px-1 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick} // Close sidebar when link is clicked on mobile
            className={clsx(
              "flex items-center gap-2 px-2 py-2 rounded-md text-xs font-medium transition-all duration-150 min-w-0",
              pathname === item.href ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
            )}
            title={item.label}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {/* Multi-line text or single line */}
          
              <span className="truncate text-xs">{item.label}</span>
            
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-gray-700">
        <p className="text-xs text-gray-400 text-center truncate">Admin</p>
      </div>
    </div>
  )
}
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <AdminProvider>
      {/* Desktop Layout - Grid only on md and above */}
      <div className="hidden md:grid md:grid-cols-[9rem_1fr] min-h-screen bg-gray-50 font-montserrat">
        {/* Desktop Sidebar */}
        <aside className="flex flex-col bg-gray-900 text-white shadow-lg min-h-screen overflow-hidden">
          <SidebarContent />
        </aside>

        {/* Desktop Main Content */}
        <div className="flex flex-col min-w-0 bg-gray-100">
          <div className="sticky top-0 z-40 bg-gray-100">
            <Navbar onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
          </div>
          <main className="flex-1 overflow-y-auto p-1 bg-gray-100">{children}</main>
        </div>
      </div>

      {/* Mobile Layout - Always visible, sidebar overlays when open */}
      <div className="md:hidden flex flex-col min-h-screen bg-gray-50 font-montserrat">
        {/* Mobile Navbar - Always visible */}
        <div className="sticky top-0 z-30 bg-gray-100">
          <Navbar onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Mobile Main Content - Always visible, full width */}
        <main className="flex-1 overflow-y-auto p-1 bg-gray-100">{children}</main>

        {/* Mobile Sidebar Overlay - Only shows when open */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-64 bg-gray-900 h-full shadow-2xl animate-slideIn flex flex-col">
              <SidebarContent onLinkClick={closeSidebar} />
            </div>
            <div className="flex-1 bg-black bg-opacity-40" onClick={closeSidebar} />
          </div>
        )}
      </div>
    </AdminProvider>
  )
}
