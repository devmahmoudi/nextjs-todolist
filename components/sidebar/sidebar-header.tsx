import { useSidebar } from "@/contexts/sidebar-context"
import Link from "next/link"
import { LayoutDashboard } from "lucide-react"
import SidebarCollapseToggle from "../sidebar-collapse-toggle"

const SidebarHeader = () => {
  const { collapsed } = useSidebar()

  return (
    <>
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
    </>
  )
}

export default SidebarHeader
