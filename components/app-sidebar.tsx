"use client"

import type * as React from "react"
import { Home, Users, BookOpenCheck, CalendarCheck, BookText, FileText, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const navItems = [
  {
    label: "Home",
    href: "/dashboard/admin",
    icon: Home,
  },
  {
    label: "Classes",
    icon: BookOpenCheck,
    children: [
      {
        label: "Classes & Sections",
        href: "/dashboard/admin/classesAndSections",
      },
    ],
  },
  {
    label: "Exams Details",
    href: "/dashboard/admin/add-exam",
    icon: FileText,
  },
  {
    label: "Attendance",
    href: "/dashboard/admin/mark-teacher-attendance",
    icon: CalendarCheck,
  },
  {
    label: "Teachers",
    href: "/dashboard/admin/Teachers",
    icon: Users,
  },
  {
    label: "Subjects",
    href: "/dashboard/admin/Subjects",
    icon: BookText,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar
      variant="inset"
      className="border-r-0"
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-mobile": "18rem",
        } as React.CSSProperties
      }
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-center py-2">
          <h1 className="text-lg font-bold font-montserrat tracking-wide text-sidebar-foreground">EduSaaS</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) =>
                item.children ? (
                  <Collapsible key={item.label} defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full">
                          <item.icon className="h-4 w-4" />
                          <span className="truncate">{item.label}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.href}>
                              <SidebarMenuSubButton asChild isActive={pathname === child.href}>
                                <Link href={child.href}>
                                  <span className="truncate">{child.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-2 text-center">
          <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
