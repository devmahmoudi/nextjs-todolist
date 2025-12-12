"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type SidebarContextType = {
  collapsed: boolean
  collapse: () => void
  expand: () => void
  toggle: () => void
  setCollapsed: (v: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  /**
   * Collapsed state
   */
  const [collapsed, setCollapsed] = useState<boolean>(
    localStorage.getItem("sidebar-collapsed") == "true" ? true : false
  )

  /**
   * Add prepare sidebar collapse classname according current state
   */
  useEffect(() => {
    const root = document.documentElement
    if (collapsed) {
      root.classList.add("sidebar-collapsed")
    } else {
      root.classList.remove("sidebar-collapsed")
    }

    return () => {
      root.classList.remove("sidebar-collapsed")
    }
  }, [collapsed])

  /**
   * Context value
   */
  const value: SidebarContextType = {
    collapsed,
    collapse: () => {
      setCollapsed(true)

      localStorage.setItem("sidebar-collapsed", "true")
    },
    expand: () => {
      setCollapsed(false)

      localStorage.setItem("sidebar-collapsed", "false")
    },
    toggle: () => {
      localStorage.setItem("sidebar-collapsed", collapsed ? "false" : "true")

      setCollapsed((s) => !s)
    },
    setCollapsed,
  }

  return React.createElement(SidebarContext.Provider, { value }, children)
}

/**
 * Hook
 * @returns SidebarContextType
 */
export const useSidebar = () => {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider")
  return ctx
}

export default SidebarContext
