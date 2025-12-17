// components/ui/color-picker.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

const DEFAULT_COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899",
  "#6366f1", "#14b8a6", "#f97316", "#84cc16", "#06b6d4", "#a855f7",
]

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  className?: string
  showCustom?: boolean
}

export function ColorPicker({ value, onChange, className, showCustom = true }: ColorPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("flex items-center gap-2", className)}
        >
          <div 
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: value }}
          />
          <span className="text-muted-foreground">Pick color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-2">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onChange(color)
                  setOpen(false)
                }}
                className={cn(
                  "h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all",
                  value === color 
                    ? "border-foreground scale-110" 
                    : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: color }}
              >
                {value === color && (
                  <Check className="h-4 w-4 text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
          
          {showCustom && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="text-sm font-medium">Custom Color</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#000000"
                    className="w-full px-2 py-1 text-sm border rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}