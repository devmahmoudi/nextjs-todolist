import { useSidebar } from "@/contexts/sidebar-context"

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

const SidebarFooter = () => {
  const { collapsed } = useSidebar()
  return (
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
  )
}

export default SidebarFooter
