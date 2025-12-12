"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "./ui/button"

/**
 * SidebarCollapseToggle component
 */
const SidebarCollapseToggle = ({ type }: { type: "collapse" | "expand" }) => {
  /**
   * Toggle sidebar collapse state consider type prop
   */
  const toggle = () => {
    window.dispatchEvent(
      new CustomEvent("sidebar-collapse-change", {
        detail: { collapsed: type == "collapse" },
      })
    )
  }

  return (
    <Button variant="ghost" size="icon">
      {type == "collapse" ? (
        <ChevronLeft onClick={toggle} />
      ) : (
        <ChevronRight onClick={toggle} />
      )}
    </Button>
  )
}

export default SidebarCollapseToggle
