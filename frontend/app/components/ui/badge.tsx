import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/app/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-black",
        secondary:
          "bg-muted text-foreground border-border",
        destructive:
          "bg-destructive text-destructive-foreground border-black",
        outline: "bg-card text-foreground border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
