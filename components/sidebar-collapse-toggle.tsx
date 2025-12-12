"use client"

import { useSidebar } from "@/contexts/sidebar-context"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "./ui/button"

/**
 * SidebarCollapseToggle component
 */
const SidebarCollapseToggle = ({ type }: { type: "collapse" | "expand" }) => {
  /**
   * Use sidebar context
   */
  const { collapsed, collapse, expand } = useSidebar()

  /**
   * Prevent show if type is equal to current state
   */
  if ((type == "collapse" && collapsed) || (type == "expand" && !collapsed))
    return null

  return (
    <Button variant="ghost" size="icon">
      {type == "collapse" ? (
        <ChevronLeft onClick={collapse} />
      ) : (
        <ChevronRight onClick={expand} />
      )}
    </Button>
  )
}

export default SidebarCollapseToggle
