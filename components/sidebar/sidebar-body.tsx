import { groups } from "@/data"
import { Button } from "@/components/ui/button"
import { SidebarInputOption } from "../sidebar-option-input"
import { CreateGroupDialog } from "../group/create-group-dialog"

const SidebarBody = () => {
  return (
    <>
      <nav className="flex-1 space-y-1 p-2">
        {groups.map((g) => (
          <SidebarInputOption
            label={g.name}
            onEditComplete={() => {}}
            onRemove={() => {}}
          />
        ))}
      </nav>

      <div className="py-3 px-2">
        <CreateGroupDialog onCreateGroup={() => {}}/>
      </div>
      
    </>
  )
}

export default SidebarBody
