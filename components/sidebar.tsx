// components/sidebar.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/contexts/sidebar-context"
import {
  BarChart3,
  ChevronLeft,
  FileText,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import SidebarCollapseToggle from "./sidebar-collapse-toggle"
import { SidebarInputOption } from "./sidebar-option-input"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
  const { collapsed } = useSidebar()
  const pathname = usePathname()


  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex fixed left-0 top-[1px] bottom-0 border-r bg-background transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        } flex-col`}
      >
        <div
          className={`flex h-16 items-center justify-between border-b ${
            collapsed ? "pl-5" : "px-4"
          }`}
        >
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 font-semibold ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "Acme Dashboard" : undefined}
          >
            <LayoutDashboard className="h-6 w-6" />
            <span
              className={`ml-2 overflow-hidden transition-all duration-200 ease-in-out ${
                collapsed ? "max-w-0 opacity-0" : "max-w-[12rem] opacity-100"
              }`}
              aria-hidden={collapsed}
            >
              Acme Dashboard
            </span>
          </Link>
          <SidebarCollapseToggle type="collapse" />
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {/* {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span
                  className={`overflow-hidden transition-all duration-150 ease-in-out ${
                    collapsed ? "hidden" : "max-w-[12rem] opacity-100"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })} */}
          <SidebarInputOption
            label="React Questions"
            onEditComplete={() => {}}
            onRemove={() => {}}
          />
        </nav>

        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full ${collapsed ? "px-0" : "justify-start"}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">
                      john@example.com
                    </p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={collapsed ? "start" : "end"} side="top">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-50 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-6">
              <h2 className="text-lg font-semibold">Acme Dashboard</h2>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
