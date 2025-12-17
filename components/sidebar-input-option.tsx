import React, { useEffect, useRef, useState } from "react"
import {
  AlertTriangle,
  Edit,
  MoreVertical,
  TextCursorInput,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import { EditGroupDialog } from "./group/edit-group-dialog"

interface SidebarInputOptionProps {
  /** Initial value for the input */
  defaultValue?: string
  /** Label to display when not editing */
  group: Group
  /** Callback when editing is complete */
  onEditComplete?: (newValue: string) => void
  /** Callback when remove is confirmed */
  onRemove?: () => void
  /** Additional class names */
  className?: string
  /** Custom delete confirmation message */
  deleteConfirmationMessage?: string
  /** Custom delete confirmation title */
  deleteConfirmationTitle?: string
}

export function SidebarInputOption({
  defaultValue = "",
  group,
  onEditComplete,
  onRemove,
  className,
  deleteConfirmationMessage = "Are you sure you want to remove this item? This action cannot be undone.",
  deleteConfirmationTitle = "Confirm Removal",
}: SidebarInputOptionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const [isHovered, setIsHovered] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleEditClick = () => {
    setIsEditing(true)
    setValue(group.name)
  }

  const handleSave = () => {
    setIsEditing(false)
    if (onEditComplete && value.trim() !== "") {
      onEditComplete(value.trim())
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setValue(group.name)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const handleBlur = () => {
    // Small delay to allow dropdown click
    setTimeout(() => {
      handleSave()
    }, 100)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (onRemove) {
      setIsDeleting(true)
      try {
        await onRemove()
      } finally {
        setIsDeleting(false)
        setShowDeleteDialog(false)
      }
    } else {
      setShowDeleteDialog(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteDialog(false)
  }

  return (
    <>
      <div
        className={cn(
          "group relative flex items-center w-full px-3 py-2 rounded-md transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isHovered && "bg-accent",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isEditing ? (
          // Editing state
          <div className="flex items-center w-full gap-2">
            <Input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="flex-1 h-8 px-2 text-sm"
              placeholder="Enter new name"
            />
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleSave}
              >
                <span className="sr-only">Save</span>✓
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleCancel}
              >
                <span className="sr-only">Cancel</span>✕
              </Button>
            </div>
          </div>
        ) : (
          // Normal display state
          <>
            <span className="flex-1 text-sm truncate">{group.name}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={handleEditClick}>
                  <TextCursorInput className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                  <EditGroupDialog
                    group={group}
                    trigger={
                      <Button variant={"ghost"} className="w-full justify-start p-0">
                        <Edit className="mr-4 h-4 w-4" />
                        <span>Edit</span>
                      </Button>
                    }
                  />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {deleteConfirmationTitle}
            </DialogTitle>
            <DialogDescription>{deleteConfirmationMessage}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {group.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{group.name}</p>
                <p className="text-sm text-muted-foreground">
                  This item will be permanently removed
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Optional: Container component for multiple sidebar options
interface SidebarOptionsProps {
  options: Array<{
    id: string
    label: string
    onEdit?: (id: string, newLabel: string) => void
    onRemove?: (id: string) => void
    /** Custom delete confirmation message per option */
    deleteConfirmationMessage?: string
  }>
  className?: string
}

export function SidebarOptions({ options, className }: SidebarOptionsProps) {
  return (
    <div className={cn("flex flex-col gap-1 p-2", className)}>
      {options.map((option) => (
        <SidebarInputOption
          key={option.id}
          label={option.label}
          onEditComplete={(newValue) => option.onEdit?.(option.id, newValue)}
          onRemove={() => option.onRemove?.(option.id)}
          deleteConfirmationMessage={option.deleteConfirmationMessage}
        />
      ))}
    </div>
  )
}
