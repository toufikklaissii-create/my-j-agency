import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[transparent] text-[#E1E0CC] border border-[rgba(225,224,204,0.15)] hover:bg-[#111] hover:border-[rgba(225,224,204,0.3)]",
        premium: "bg-[#E1E0CC] text-[#000] font-bold hover:bg-[#fff] shadow-lg transition-all duration-300",
        ghost: "hover:bg-[rgba(255,255,255,0.05)] text-[#E1E0CC]",
      },
      size: {
        default: "h-10 px-6 py-2 rounded-full",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-full px-8 text-base tracking-wide",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }