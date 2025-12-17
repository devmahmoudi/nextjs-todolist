// components/group/edit-group-dialog.tsx
"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Check, Loader2, Palette, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Reuse the same color options
const COLOR_OPTIONS = [
  { value: "#3b82f6", label: "Blue" },
  { value: "#ef4444", label: "Red" },
  { value: "#10b981", label: "Green" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#8b5cf6", label: "Violet" },
  { value: "#ec4899", label: "Pink" },
  { value: "#6366f1", label: "Indigo" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#f97316", label: "Orange" },
  { value: "#84cc16", label: "Lime" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#a855f7", label: "Purple" },
]

export interface EditGroupDialogRef {
  open: (group: Group) => void
  close: () => void
  isOpen: boolean
}

interface EditGroupDialogProps {
  group?: Group
  onUpdateGroup: (
    groupId: number,
    groupData: { name: string; color: string }
  ) => Promise<Group | void>
  onDeleteGroup?: (groupId: number) => Promise<void>
  trigger?: React.ReactNode
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showDeleteButton?: boolean
}

const EditGroupDialog = forwardRef<EditGroupDialogRef, EditGroupDialogProps>(
  ({
    group: initialGroup,
    onUpdateGroup,
    onDeleteGroup,
    trigger,
    disabled,
    open: controlledOpen,
    onOpenChange,
    showDeleteButton = true,
  }, ref) => {
    const [internalOpen, setInternalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [formData, setFormData] = useState({
      name: "",
      color: COLOR_OPTIONS[0].value,
    })
    const [originalGroup, setOriginalGroup] = useState<Group | undefined>(initialGroup)
    const [errors, setErrors] = useState({
      name: "",
    })

    const open = controlledOpen !== undefined ? controlledOpen : internalOpen

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      open: (group: Group) => {
        setOriginalGroup(group)
        setFormData({
          name: group.name,
          color: group.color,
        })
        if (onOpenChange) {
          onOpenChange(true)
        } else {
          setInternalOpen(true)
        }
      },
      close: () => {
        if (onOpenChange) {
          onOpenChange(false)
        } else {
          setInternalOpen(false)
        }
      },
      isOpen: open,
    }))

    // Update form when group prop changes
    useEffect(() => {
      if (initialGroup) {
        setOriginalGroup(initialGroup)
        setFormData({
          name: initialGroup.name,
          color: initialGroup.color,
        })
      }
    }, [initialGroup])

    const handleOpenChange = (isOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(isOpen)
      } else {
        setInternalOpen(isOpen)
      }

      if (!isOpen) {
        // Reset form when closing
        if (originalGroup) {
          setFormData({
            name: originalGroup.name,
            color: originalGroup.color,
          })
        }
        setErrors({ name: "" })
        setShowDeleteDialog(false)
      }
    }

    const handleInputChange = (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))

      // Clear error when user starts typing
      if (errors.name && field === "name") {
        setErrors((prev) => ({ ...prev, name: "" }))
      }
    }

    const validateForm = () => {
      const newErrors = {
        name: "",
      }

      if (!formData.name.trim()) {
        newErrors.name = "Group name is required"
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Group name must be at least 2 characters"
      } else if (formData.name.trim().length > 50) {
        newErrors.name = "Group name must be less than 50 characters"
      }

      setErrors(newErrors)
      return !Object.values(newErrors).some((error) => error)
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm() || !originalGroup) return

      setLoading(true)
      try {
        await onUpdateGroup(originalGroup.id, {
          color: formData.color,
          name: formData.name.trim(),
        })

        toast.success("Group updated successfully")
        handleOpenChange(false)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update group"
        )
      } finally {
        setLoading(false)
      }
    }

    const handleDelete = async () => {
      if (!originalGroup || !onDeleteGroup) return

      setDeleteLoading(true)
      try {
        await onDeleteGroup(originalGroup.id)
        toast.success("Group deleted successfully")
        setShowDeleteDialog(false)
        handleOpenChange(false)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete group"
        )
      } finally {
        setDeleteLoading(false)
      }
    }

    const hasChanges = originalGroup && (
      formData.name !== originalGroup.name || 
      formData.color !== originalGroup.color
    )

    return (
      <>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            {trigger || (
              <Button
                size="icon"
                variant="ghost"
                disabled={disabled}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Group</DialogTitle>
                <DialogDescription>
                  Update group name and color. Click save when you're done.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {/* Current Group Info */}
                {originalGroup && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: originalGroup.color }}
                      >
                        {originalGroup.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{originalGroup.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Created{" "}
                          {originalGroup.created_at
                            ? new Date(originalGroup.created_at).toLocaleDateString()
                            : "recently"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Name Input */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter group name"
                      className={errors.name ? "border-destructive" : ""}
                      disabled={loading}
                      autoFocus
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.name}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      2-50 characters
                    </p>
                  </div>
                </div>

                {/* Color Selection */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Color</Label>
                  <div className="col-span-3 space-y-3">
                    <div className="grid grid-cols-6 gap-2">
                      {COLOR_OPTIONS.map((colorOption) => (
                        <button
                          key={colorOption.value}
                          type="button"
                          onClick={() =>
                            handleInputChange("color", colorOption.value)
                          }
                          className={cn(
                            "h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all",
                            formData.color === colorOption.value
                              ? "border-foreground scale-110"
                              : "border-transparent hover:scale-105"
                          )}
                          style={{ backgroundColor: colorOption.value }}
                          title={colorOption.label}
                        >
                          {formData.color === colorOption.value && (
                            <Check className="h-4 w-4 text-white drop-shadow-md" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Custom Color Picker */}
                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="custom-color" className="text-sm">
                          Custom color:
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          id="custom-color"
                          value={formData.color}
                          onChange={(e) =>
                            handleInputChange("color", e.target.value)
                          }
                          className="h-8 w-8 cursor-pointer rounded border"
                        />
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {formData.color.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Preview</Label>
                  <div className="col-span-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: formData.color }}
                        >
                          {formData.name
                            ? formData.name.charAt(0).toUpperCase()
                            : "G"}
                        </div>
                        <div>
                          <p className="font-medium">
                            {formData.name || "Group Name"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {COLOR_OPTIONS.find((c) => c.value === formData.color)
                              ?.label || "Custom color"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  {showDeleteButton && onDeleteGroup && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={loading || deleteLoading}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Group
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    disabled={loading || deleteLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || deleteLoading || !hasChanges}
                    style={{ backgroundColor: formData.color }}
                    className="hover:opacity-90 transition-opacity text-white min-w-[100px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the{" "}
                <span className="font-semibold">{originalGroup?.name}</span> group
                and remove all its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteLoading}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Group"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }
)

EditGroupDialog.displayName = "EditGroupDialog"

export { EditGroupDialog }