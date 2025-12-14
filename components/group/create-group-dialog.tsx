// components/group/create-group-dialog.tsx
"use client"

import { useState } from "react"
import { Check, Loader2, Palette, Plus } from "lucide-react"
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

// Predefined color options
const COLOR_OPTIONS = [
  { value: "#3b82f6", label: "Blue" }, // blue-500
  { value: "#ef4444", label: "Red" }, // red-500
  { value: "#10b981", label: "Green" }, // emerald-500
  { value: "#f59e0b", label: "Amber" }, // amber-500
  { value: "#8b5cf6", label: "Violet" }, // violet-500
  { value: "#ec4899", label: "Pink" }, // pink-500
  { value: "#6366f1", label: "Indigo" }, // indigo-500
  { value: "#14b8a6", label: "Teal" }, // teal-500
  { value: "#f97316", label: "Orange" }, // orange-500
  { value: "#84cc16", label: "Lime" }, // lime-500
  { value: "#06b6d4", label: "Cyan" }, // cyan-500
  { value: "#a855f7", label: "Purple" }, // purple-500
]

interface CreateGroupDialogProps {
  onCreateGroup: (
    groupData: Omit<Group, "id" | "created_at" | "updated_at">
  ) => Promise<Group | void>
  trigger?: React.ReactNode
  disabled?: boolean
}

export function CreateGroupDialog({
  onCreateGroup,
  trigger,
  disabled,
}: CreateGroupDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    color: COLOR_OPTIONS[0].value, // Default to first color
  })
  const [errors, setErrors] = useState({
    name: "",
  })

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

    if (!validateForm()) return

    setLoading(true)
    try {
      await onCreateGroup({
        color: formData.color,
        name: formData.name.trim(),
      })

      toast.success("Group created successfully")
      setFormData({
        name: "",
        color: COLOR_OPTIONS[0].value,
      })
      setOpen(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create group"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset form when closing
      setFormData({
        name: "",
        color: COLOR_OPTIONS[0].value,
      })
      setErrors({ name: "" })
    }
    setOpen(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="w-full" asChild>
        {trigger || (
          <Button disabled={disabled}>
            <Plus className="h-4 w-4 mr-2" />
            New Group
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a new group with a name and color for easy identification.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
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
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name.trim()}
              style={{ backgroundColor: formData.color }}
              className="hover:opacity-90 transition-opacity text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
