import { Menu, Plus } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

import { groups } from "@/data"
import { GroupBadge } from "../group/group-badge"
import { SidebarInputOption } from "../sidebar-input-option"
import { CreateGroupDialog } from "../group/create-group-dialog"

const SidebarMobile = () => {
  return (
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

      <SheetContent side="left" className="w-72 p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center border-b px-4">
            <h2 className="text-lg font-semibold">Groups</h2>
          </div>

          {/* Body (same logic as SidebarBody, but non-collapsed) */}
          <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
            {groups.map((g) => (
              <div key={g.id} className="relative">
                {/* Badge */}
                <GroupBadge
                  group={g}
                  className="absolute left-1 top-1/2 -translate-y-1/2"
                  showLabel={false}
                  size="md"
                />

                {/* Input option */}
                <div className="pl-10">
                  <SidebarInputOption group={g} />
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t p-2">
            <CreateGroupDialog
              onCreateGroup={() => {}}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start py-5"
                >
                  <Plus />
                  <span className="pl-2">Add New Group</span>
                </Button>
              }
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SidebarMobile
