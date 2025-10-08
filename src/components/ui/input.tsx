
import * as React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const isMobile = useIsMobile();
    
    return (
      <input
        type={type}
        className={cn(
          `flex w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
          // Critical mobile optimizations
          isMobile ? "h-12 text-[16px] min-h-[44px] px-4 py-3" : "h-10 text-sm",
          className
        )}
        // Mobile-specific attributes to prevent zoom and improve UX
        {...(isMobile && {
          autoCapitalize: type === "email" ? "none" : "sentences",
          autoCorrect: type === "email" || type === "password" ? "off" : "on",
          spellCheck: type === "email" || type === "password" ? "false" : "true",
          // Prevent zoom on iOS
          style: { fontSize: '16px' }
        })}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
