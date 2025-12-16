import { group } from "console"
import { useSidebar } from "@/contexts/sidebar-context"
import { groups } from "@/data"

import { Button } from "@/components/ui/button"

import { CreateGroupDialog } from "../group/create-group-dialog"
import { GroupBadge } from "../group/group-badge"
import { SidebarInputOption } from "../sidebar-input-option"
import { Plus } from "lucide-react"

const SidebarBody = () => {
  const { collapsed } = useSidebar()

  return (
    <>
      <nav className="flex-1 space-y-1 p-2">
        {groups.map((g) => (
          <div key={g.id} className="relative">
            {/* Badge - Always visible */}
            <GroupBadge
              group={g}
              className={
                collapsed
                  ? "h-10 w-10 mx-auto"
                  : "absolute left-1 top-1/2 -translate-y-1/2"
              }
              showLabel={false}
              size={collapsed ? "full" : "md"}
            />

            {/* SidebarInputOption - Hidden when collapsed */}
            {!collapsed && (
              <div className="pl-10">
                <SidebarInputOption group={g} />
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="py-3 px-2">
        <CreateGroupDialog
          onCreateGroup={() => {}}
          trigger={
            <Button title={collapsed ? "Add New Group" : undefined} variant="ghost" size="sm" className="w-full justify-center py-5">
              <Plus className=""/>
              <span className={collapsed ? 'hidden' : 'pl-2'}>Add New Group</span>
            </Button>
          }
        />
      </div>
    </>
  )
}

export default SidebarBody
