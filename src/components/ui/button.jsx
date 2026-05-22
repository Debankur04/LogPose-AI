import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-sm hover:shadow-md",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-orange-200 bg-white hover:bg-orange-50 hover:text-orange-700 dark:border-orange-700 dark:bg-zinc-900 dark:hover:bg-orange-900/20",
    secondary: "bg-orange-100 text-orange-900 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-100 dark:hover:bg-orange-900/50",
    ghost: "hover:bg-orange-100 hover:text-orange-700 dark:hover:bg-orange-900/20 dark:hover:text-orange-400",
    link: "text-orange-600 dark:text-orange-400 underline-offset-4 hover:underline",
  }
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
