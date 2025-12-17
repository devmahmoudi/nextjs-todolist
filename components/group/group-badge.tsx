// components/group/group-badge.tsx
import { cn } from "@/lib/utils"

interface GroupBadgeProps {
  group: Pick<Group, "name" | "color">
  className?: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg" | "full"
}

export function GroupBadge({ group, className, showLabel = true, size = "md" }: GroupBadgeProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
    full: "w-full h-full text-lg",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-lg flex items-center justify-center text-white font-medium",
          sizeClasses[size]
        )}
        style={{ backgroundColor: group.color }}
        title={group.name}
      >
        {group.name.charAt(0).toUpperCase()}
      </div>
      {showLabel && (
        <span className="font-medium">{group.name}</span>
      )}
    </div>
  )
}