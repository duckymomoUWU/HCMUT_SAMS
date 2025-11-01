import * as React from "react"
import { cn } from "../../utils/cn"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-lg border border-[#DADADA] bg-white px-4 py-2",
          "text-gray-900 font-medium",
          "ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-[#C8C8C8] placeholder:italic",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007BE5] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "h-[50px] sm:h-[55px] lg:h-[65px]",
          "text-base sm:text-lg lg:text-xl",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
