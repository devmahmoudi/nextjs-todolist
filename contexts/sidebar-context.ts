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
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebar-collapsed")
      if (saved !== null) setCollapsed(saved === "true")
    } catch (e) {
      // ignore (SSR / restricted storage)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (collapsed) {
      root.classList.add("sidebar-collapsed")
    } else {
      root.classList.remove("sidebar-collapsed")
    }

    try {
      localStorage.setItem("sidebar-collapsed", collapsed ? "true" : "false")
    } catch (e) {
      // ignore
    }

    return () => {
      root.classList.remove("sidebar-collapsed")
    }
  }, [collapsed])

  const value: SidebarContextType = {
    collapsed,
    collapse: () => setCollapsed(true),
    expand: () => setCollapsed(false),
    toggle: () => setCollapsed((s) => !s),
    setCollapsed,
  }

  return React.createElement(SidebarContext.Provider, { value }, children)
}

export const useSidebar = () => {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider")
  return ctx
}

export default SidebarContext
