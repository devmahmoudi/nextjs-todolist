"use client"

import { useSidebar } from "@/contexts/sidebar-context"
import MobileSidebar from "./mobile-sidebar"
import SidebarHeader from "./sidebar-header"
import SidebarFooter from "./sidebar-footer"
import SidebarBody from "./sidebar-body"

export default function Sidebar() {
  const { collapsed } = useSidebar()

  return (
    <>
      <div
        className={`hidden md:flex fixed left-0 top-[1px] bottom-0 border-r bg-background transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        } flex-col`}
      >
        <SidebarHeader/>

        <SidebarBody/>

        <SidebarFooter/>
      </div>

      <MobileSidebar />
    </>
  )
}
