import { groups } from "@/data"
import { Button } from "@/components/ui/button"
import { SidebarInputOption } from "../sidebar-option-input"

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

      <div className="p-3">
        <Button className="w-full">Add New Group</Button>
      </div>
    </>
  )
}

export default SidebarBody
